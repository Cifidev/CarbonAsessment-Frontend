import { Component, OnInit } from '@angular/core';
import { TypedFormGroup } from "@shared/utils/typed-form-group";
import { FormControl, Validators } from "@angular/forms";
import { User } from "@shared/models/user";
import { AppService } from "@shared/services/app.service";
import { Router } from "@angular/router";
import { finalize, Observable, take } from "rxjs";
import { ApiService } from "@shared/services/api.service";
import { TranslateService } from '@ngx-translate/core';

interface IForm extends User {
  acceptTerms: boolean;
}

interface IOption {
  value: string | number;
  label: string;
}

interface IInput {
  label: string;
  formControlName: Extract<keyof User, string>;
  colClass?: string;
  inputClass?: string;
  type?: InputTypesEnum;
  options?: IOption[];
  showIf?: {
    control: IInput['formControlName'];
    value: IOption['value'];
  }
}

enum InputTypesEnum {
  Select,
  Text,
  TextArea
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  savedUser?: User;
  form: TypedFormGroup<IForm>;
  inputs: IInput[];
  inputTypes = InputTypesEnum;
  isLoading = false;

  constructor(translate: TranslateService, private appService: AppService, private router: Router, private apiService: ApiService) {
    this.inputs = [
      { label: translate.instant('USER.FIRSTNAME'), formControlName: 'firstName', colClass: 'col-md-6' },
      { label: translate.instant('USER.LASTNAME'), formControlName: 'lastName', colClass: 'col-md-6', inputClass: 'border-start-md-0' },
      { label: translate.instant('USER.WORKEMAIL'), formControlName: 'email' },
      {
        label: translate.instant('USER.TITLE2'), formControlName: 'title', type: InputTypesEnum.Select, options: [
          translate.instant('USER.MANAGER_MKT'), translate.instant('USER.OFFICER_SUSTAIN'), translate.instant('USER.DIRECTOR_PR'), translate.instant('USER.MANAGER_CSR'), translate.instant('USER.MANAGER_EC'), translate.instant('USER.MANAGER_SC'), translate.instant('USER.DIRECTOR_SD'), translate.instant('USER.SPECIALIST_ECS'), translate.instant('USER.ANALYST_SUSTAIN'), translate.instant('USER.DIRECTOR_CR'),
        ].map(x => ({
          label: x,
          value: x
        }))
      },
      { label: translate.instant('USER.YOUR'), formControlName: 'otherTitle', showIf: { control: 'title', value: 'Other' } },
      { label: translate.instant('USER.COMPANY'), formControlName: 'companyName' },
      {
        label: translate.instant('USER.INDUSTRY'), formControlName: 'industry', type: InputTypesEnum.Select, options: [
          translate.instant('USER.ENTER'),
          translate.instant('USER.CONSULTING'),
          translate.instant('USER.TECH'),
          translate.instant('USER.HEALTH'),
          translate.instant('USER.FINANCE'),
          translate.instant('USER.MANUFACTURING'),
          translate.instant('USER.PUBLIC'),
          translate.instant('USER.RETAIL'),
          translate.instant('USER.TRANSPORT'),
          translate.instant('USER.OTHER')
        ].map(x => ({
          label: x,
          value: x
        }))
      },
      { label: translate.instant('USER.YOURI'), formControlName: 'otherIndustry', showIf: { control: 'industry', value: 'Other' } },
      {
        label: translate.instant('USER.COMPANYSIZE'), formControlName: 'companySize', type: InputTypesEnum.Select, options: [
          '1-49',
          '50-249',
          '250-499',
          '500-999',
          '1000-4999',
          '5000-9999',
          '10000+',
        ].map(x => ({
          label: x,
          value: x
        }))
      },
    ];
    this.form = new TypedFormGroup<IForm>({
      firstName: new FormControl(undefined, [Validators.required]),
      lastName: new FormControl(undefined, [Validators.required]),
      email: new FormControl(undefined, [Validators.required]),
      title: new FormControl(undefined, [Validators.required]),
      otherTitle: new FormControl(),
      companyName: new FormControl(undefined, [Validators.required]),
      industry: new FormControl(undefined, [Validators.required]),
      otherIndustry: new FormControl(),
      companySize: new FormControl(undefined, [Validators.required]),
      acceptTerms: new FormControl(false, [Validators.requiredTrue])
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
      this.form.patchValue(value || {});
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
    ((userId && formValue.email === this.savedUser?.email
      ? this.apiService.updateUserData(userId, formValue)
      : this.apiService.saveUserData(formValue)) as Observable<any>)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(value => {
        this.appService.setUserInfo({ id: userId || value.name, ...formValue });
        this.router.navigateByUrl('/test');
        localStorage.removeItem('fullTest');
      })
  }
}
