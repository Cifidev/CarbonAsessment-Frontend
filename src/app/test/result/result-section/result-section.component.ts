import { Component, OnInit } from '@angular/core';
import { ApiService } from "@shared/services/api.service";
import { Category } from "@shared/models/category";
import Chart, { ChartItem } from "chart.js/auto";
import { QuestionTypeEnum } from "@shared/enums/question-type.enum";
import { AppService } from "@shared/services/app.service";
import { filter, forkJoin, take } from "rxjs";
import { TestAnswers } from "@shared/models/test-answers";
import { Result } from "@shared/models/result";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf'; 
import { GreencrossService } from '@shared/services/greencross.service';
interface ExtendedCategory extends Category {
  score: number;
}

@Component({
  selector: 'app-result-section',
  templateUrl: './result-section.component.html',
  styleUrls: ['./result-section.component.scss']
})
export class ResultSectionComponent implements OnInit {
  
  userInfo:any = "";
  total = 0;
  score = 0;
  result?: Result;
  private categoriesScores: number[] = [];
  read: boolean;
  checked:boolean;
  categoryResults: {
    name: string; // Assuming each category has a 'name' field
    score: number;
  }[];

  constructor(private apiService: ApiService, private appService: AppService,private greencrossServices: GreencrossService) {
    const user = localStorage.getItem('GreenCross_user');
    if (user) {
      this.userInfo = (JSON.parse(user));
    }
  }
  
  private static getScoreColor(score: number): string {
    if (score >= 100) {
      return '#22AF49';
    }
    if (score >= 60) {
      return '#A8BF19';
    }
    if (score >= 40) {
      return '#FFF500';
    }
    if (score >= 20) {
      return '#FF9D47';
    }
    return '#FF4740'
  }

  ngOnInit(): void {
    if (localStorage.getItem('fullTest') != undefined) {
      this.read = true;
    } else {
      this.read = false;
    }
    if (localStorage.getItem('checked') != undefined) {
      let checked: string = '';
      const checkedTest = localStorage.getItem('checked');
      if (typeof checkedTest === 'string') {
        checked = JSON.parse(checkedTest);
      }
      if(checked){
        this.checked =true;
      }else{
        this.checked =false;
      }
      
    } else {
      this.checked = false;
    }
    forkJoin([
      this.apiService.getTestData(),
      this.appService.answers$.pipe(filter(Boolean), take(1))
    ]).subscribe(([categories, answers]) => this.calculateResult(categories, answers))
  }
  clickChecked(){
    let userId: string = '';
    const storedIdTest = localStorage.getItem('idTest');
    if (typeof storedIdTest === 'string') {
      userId = JSON.parse(storedIdTest);
    }
    if (userId !== '') {
      const payload = { userId: userId};
      this.greencrossServices.post('updateReview', payload).subscribe(
        (data) => {
          console.log(data);
          localStorage.setItem('checked', JSON.stringify(true));
          this.checked=true;
        },
        (err) => {
          console.log(err);
        },
        () => {}
      ); 
    } else {
      // Manejar el caso cuando 'idTest' no está presente en localStorage
    }
    
  }
  clickPrint() {
    const data = document.getElementById('contentToConvert');
    if (!data) {
      console.error('Element not found.');
      return;
    }
    html2canvas(data).then((canvas) => {
      // Generar una imagen desde el canvas
      const imgWidth = 150;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');

      // Crear un objeto PDF
      const pdf = new jsPDF('p', 'mm', 'a4'); // Tamaño de página A4
      const position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('screen.pdf'); // Guardar el PDF
    });
  }

  private calculateResult(categories: Category[], testAnswers: TestAnswers): void {
    console.log("Calculating result");

    // Calculate the maximum possible score per category
    const categoryMaxScores = categories.map(category => category.questions.length * 5); // Each "Yes" worth 5 points

    const totalMaxScore = categoryMaxScores.reduce((total, maxScore) => total + maxScore, 0);

    // Calculate scores for each category and pair them with category names
    const categoryResults = testAnswers.answers.map((categoryAnswers, ci) => {
        let categoryScore = 0;
        categoryAnswers.forEach((answer, i) => {
            const question = categories[ci].questions[i];
            if (question && question.questionType === 3) { // Assuming '3' indicates a 'Yes/No' type question
                const boolValue = answer.Bool == 1;
                categoryScore += boolValue ? 5 : 0;
            }
        });
        // Normalize the score to a percentage of the max possible score for this category
        const scorePercentage = Math.round((categoryScore / categoryMaxScores[ci]) * 100);
        return {
            name: categories[ci].title, // Assuming each category has a 'name' field
            score: scorePercentage
        };
    });

    this.categoryResults = categoryResults; // This will be used in the HTML for displaying results

    // Calculate the total score as a weighted average of the individual category percentages
    const totalScore = categoryResults.reduce((acc, result, index) => acc + result.score * (categoryMaxScores[index] / totalMaxScore), 0);

    this.score = Math.round(totalScore);

    this.getResultObject();
    this.buildChart(categoryResults);
}

  // private calculateResult(categories: Category[], testAnswers: TestAnswers): void {
  //   console.log("Calculating result");
  
  //   // First, calculate the total number of points possible per category and in total.
  //   const categoryMaxScores = categories.map(category =>
  //     category.questions.length * 5 // Assuming each "Yes" is worth 5 points.
  //   );
  
  //   const totalMaxScore = categoryMaxScores.reduce((total, maxScore) => total + maxScore, 0);
  
  //   // Then, calculate the scores for each category.
  //   const categoriesScores = testAnswers.answers.map((categoryAnswers, ci) => {
  //     let categoryScore = 0;
  //     categoryAnswers.forEach((answer, i) => {
  //       const question = categories[ci].questions[i];
  //       if (question && question.questionType === 3) {
  //         const boolValue = answer.Bool == 1;
  //         categoryScore += boolValue ? 5 : 0; // Add score for each "Yes"
  //       }
  //     });
  //     // Normalize the score to be a percentage of the maximum possible score for the category.
  //     return Math.round((categoryScore / categoryMaxScores[ci]) * 100);
  //   });
  
  //   this.categoriesScores = categoriesScores;
  
  //   // Calculate the total score as a percentage of the total maximum score.
  //   const totalScore = categoriesScores.reduce((acc, categoryScore, index) => acc + categoryScore * (categoryMaxScores[index] / totalMaxScore), 0);
  
  //   this.score = Math.round(totalScore);
  
  //   // Other function calls remain as they were.
  //   this.getResultObject();
  //   this.buildChart(categories.map((category, i) => ({ ...category, score: categoriesScores[i] })));
  // }
  

  private buildChart(categories: any[]): void {
    const ctx = document.getElementById('myChart') as ChartItem;
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: categories.map(x => x.name),
        datasets: [{
          data: categories.map(x => x.score/10),
          fill: true,
          backgroundColor: 'rgba(208, 215, 221, 0.5)',
          borderColor: 'rgb(208, 215, 221)',
          borderWidth: 2,
          pointRadius: 5,
          pointBorderWidth: 0,
          pointBackgroundColor: categories.map(x => ResultSectionComponent.getScoreColor(x.score)),
          pointHoverBackgroundColor: '#fff',
        }]
      },
      options: {
        elements: {
          line: {
            borderWidth: 3
          }
        },
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              color: 'black',
              font: {
                size: 8
              },
            },
            grid: {
              color: 'black',
            },
            angleLines: {
              color: 'black',
            },
            pointLabels: {
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          }
        }
      },
    });
  }

  private getResultObject() {
    this.apiService.getResults().subscribe(results => {
      const minResultCategoryIdx = this.categoriesScores.indexOf(Math.min(...this.categoriesScores));
      this.result = results[minResultCategoryIdx];
    })
  }
}
