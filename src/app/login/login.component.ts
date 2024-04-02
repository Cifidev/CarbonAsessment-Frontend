import { Component, OnInit } from '@angular/core';
import { TypedFormGroup } from "@shared/utils/typed-form-group";
import { FormControl, Validators } from "@angular/forms";
import { User } from "@shared/models/user";
import { AppService } from "@shared/services/app.service";
import { Router } from "@angular/router";
import { finalize, Observable, take } from "rxjs";
import { ApiService } from "@shared/services/api.service";
import { UserLogin } from '@shared/models/userLogin';
import { GreencrossService } from '@shared/services/greencross.service';
import { TranslateService } from '@ngx-translate/core';

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
  tipe?:string;
}

enum InputTypesEnum {
  Select,
  Text,
  TextArea, 
  Password
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isUserInfoVisible = false;
  savedUser?: User;
  form: TypedFormGroup<IForm>;
  inputTypes = InputTypesEnum;
  inputs: IInput[];
  
  isLoading = false;
  constructor(translate: TranslateService, private appService: AppService, private router: Router, private apiService: ApiService, private greencrossServices: GreencrossService) {
    this.inputs = [
      { label: translate.instant('LOGIN.USER'), formControlName: 'username', icon: 'bi bi-person', tipe: 'text'},
      { label: translate.instant('LOGIN.PASS'), formControlName: 'pass', icon: 'bi bi-lock', tipe: 'password'},
    ];
    this.form = new TypedFormGroup<IForm>({
      username: new FormControl(undefined, [Validators.required]),
      pass: new FormControl(undefined, [Validators.required]),
      
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

  ngOnInit(): void {
    this.appService.userInfo$.pipe(take(1)).subscribe(value => {
      this.savedUser = value;
      //this.form.patchValue(value || {});
    });
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

   this.greencrossServices.post('loginUser', this.form.value).subscribe(
    (data) => {
      console.log(data);
    },
    (err) => {
      console.log(err);
    },
    () => {}
  ); 
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
}
