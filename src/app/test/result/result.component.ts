import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})


export class ResultComponent implements OnInit {
  read: boolean = false; // Define read as a property of the class

  constructor() {
  }

  ngOnInit() {
    if (localStorage.getItem('fullTest') != undefined) {
      this.read = true;
    } else {
      this.read = false;
    }
  }
}
