import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "@shared/models/user";
import { UserLogin } from '@shared/models/userLogin';
import { ApiService } from "@shared/services/api.service";
import { AppService } from "@shared/services/app.service";
import { GreencrossService } from '@shared/services/greencross.service';
import { TypedFormGroup } from "@shared/utils/typed-form-group";
import { Observable, finalize } from 'rxjs';

interface IForm extends UserLogin {
  //acceptTerms: boolean;
}

interface IOption {
  value: string | number;
  label: string;
}

interface IInput {
  label: string;
  formControlName: Extract<keyof UserLogin, string>;
  colClass?: string;
  inputClass?: string;
  type?: InputTypesEnum;
  options?: IOption[];
  showIf?: {
    control: IInput['formControlName'];
    value: IOption['value'];
  }
  icon?: string;
}

enum InputTypesEnum {
  Select,
  Text,
  TextArea
}
@Component({
  selector: 'app-adminPanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  searchText: FormControl = new FormControl();
  fullData: any[];
  data: any[] = [
    { id: 1, companyName: 'Empresa A', contactName: 'Juan', email: 'juan@empresaA.com', checked: true},
    { id: 2, companyName: 'Empresa B', contactName: 'Maria', email: 'maria@empresaB.com', checked: false },
    { id: 3, companyName: 'Empresa C', contactName: 'Pedro', email: 'pedro@empresaC.com', checked: true }
    // Aquí irían más datos si los tuvieras
  ];
  filteredData: any[];
  isResultInfoVisible = false;
  isUserInfoVisible = false;
  showResultTable =false;
  savedUser?: User;
  form: TypedFormGroup<IForm>;
  inputs: IInput[] = [
    { label: 'User', formControlName: 'username', icon: 'bi bi-person' },
    { label: 'Pass', formControlName: 'password' },
  ];
  inputTypes = InputTypesEnum;
  isLoading = false;
  constructor(private appService: AppService, private router: Router, private apiService: ApiService, private greencrossServices: GreencrossService) {
    this.form = new TypedFormGroup<IForm>({
      username: new FormControl(undefined, [Validators.required]),
      password: new FormControl(undefined, [Validators.required]),
      
    });
    this.inputs.filter(x => x.showIf).forEach(input => {
      this.form.get(input.showIf!.control)?.valueChanges.subscribe(value => {
        const control = this.form.get(input.formControlName);
        if (value === input.showIf!.value) {
          control?.addValidators(Validators.required);
        } else {
          control?.removeValidators(Validators.required);
        }
        control?.setValue(undefined);
        control?.updateValueAndValidity();
      })
    })
  }

  ngOnInit() {
    this.greencrossServices.get('getUserForm').subscribe(
      (data) => {
        console.log(data);
        this.fullData = data;
        this.createTable(data);
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
    this.searchText.valueChanges.subscribe(value => {
      this.filterData(value);
    });
  }

  createTable(data:any){
    const newDataArray: any[] = data.map((item:any) => ({
      id: item.user.id,
      companyName: item.user.companyName,
      contactName: item.user.firstName + ' ' + item.user.lastName,
      email: item.user.email, 
      checked: true
    }));
    this.data = newDataArray;
  }
  
  // handleIconClick(itemId: number) {
  //   // Aquí puedes implementar la lógica para manejar el clic en el icono
  //   console.log('Se hizo clic en el icono del elemento con ID:', itemId);
  //   if(localStorage.getItem("idTableSearch") == undefined || localStorage.getItem("idTableSearch") == ""){
  //     localStorage.setItem("idTableSearch",itemId.toString());
  //   }else{
  //     localStorage.setItem("idTableSearch",itemId.toString());
  //   }
  //   this.router.navigateByUrl('/viewTest');

  // }

  handleIconClick(itemId: string) {
    // Make the API request to your backend with the itemId as a parameter
    let user;
    user = this.fullData.filter(item => item.user.id == itemId);
    const userId = user[0].user.id || undefined;
    const formValue = user[0].user;
    ((userId && formValue.email === this.savedUser?.email
      ? this.apiService.updateUserData(userId, formValue)
      : this.apiService.saveUserData(formValue)) as Observable<any>)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(value => {
        this.appService.setUserInfo({ id: userId || value.name, ...formValue });
        this.greencrossServices.getParam("getUserTest",itemId).subscribe(
          (data) => {
            console.log(data);
            localStorage.setItem("fullTest",JSON.stringify(data.questions));
          
            // Process the response data as needed
          },
          (err) => {
            console.log(err);
            // Handle any errors if the request fails
          },
          () => {
            // Perform any cleanup or finalization tasks if needed
            this.router.navigateByUrl('/viewTest');
          }
        );
      })
    }
  
  filterData(value: string) {
    if(this.searchText.value != ''){
      this.showResultTable = true;
    }else{
      this.showResultTable = false;
    }
    this.filteredData = this.data.filter(item =>
      Object.values(item).some((val: any) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  showInput(input: IInput): boolean {
    if (!input.showIf) {
      return true;
    }
    const { control: formControlName, value } = input.showIf;
    const control = this.form.controls[formControlName];
    return control?.value === value;
  }

  getInputClass(input: IInput): string {
    const classes: string[] = [];
    if (input.inputClass) {
      classes.push(input.inputClass);
    }
    const control = this.form.controls[input.formControlName];
    if (control?.touched && control?.errors) {
      classes.push('is-invalid');
    }
    return classes.join(' ');
  }

  submit() {
    if (this.isLoading || this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }
    this.isLoading = true;
    const userId = this.savedUser?.id;
    const formValue = this.form.value;
    // ((userId && formValue.email === this.savedUser?.email
    //   ? this.apiService.updateUserData(userId, formValue)
    //   : this.apiService.saveUserData(formValue)) as Observable<any>)
    //   .pipe(finalize(() => this.isLoading = false))
    //   .subscribe(value => {
    //     this.appService.setUserInfo({ id: userId || value.name, ...formValue });
    //     this.router.navigateByUrl('/test');
    //   })
  }
  showUserInfo() {
    this.isUserInfoVisible = true;
  }
  showResults() {
    this.isResultInfoVisible = !this.isResultInfoVisible;
  }
}
