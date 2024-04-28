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
  value: any;
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
  disclaimer?: string;
}

enum InputTypesEnum {
  Select,
  Text,
  TextArea
}
var industryOptions: any = [];

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
  disclaimerPage = false;
  sectorOptions: { [key: string]: string } = {
    'USER.ENERGY': 'ENERGY',
    'USER.ARCHITECT': 'ARCHITECT',
    'USER.WASTE': 'WASTE',
    'USER.WATER': 'WATER',
    'USER.TRANSPORT': 'TRANSPORT',
    'USER.LANDSCAPE': 'LANDSCAPE',
    'USER.INFORMATION': 'INFORMATION'
  };

  energyOptions: { [key: string]: string } = {
    'USER.GEOTHERMAL': 'Geothermal',
    'USER.HYDROELECTRIC': 'Hydroelectric',
    'USER.HYDROGEN': 'Hydrogen',
    'USER.NUCLEAR': 'Nuclear',
    'USER.COAL': 'Coal',
    'USER.NATURALGAS': 'Natural Gas',
    'USER.OILREFINERY': 'Oil/Refinery',
    'USER.WIND': 'Wind',
    'USER.SOLAR': 'Solar',
    'USER.BIOMASS': 'Biomass'
  }
  architectOptions: { [key: string]: string } = {
    'USER.HOUSING': 'Housing',
    'USER.OFFICE': 'Office',
    'USER.COMMERCE': 'Commerce/shop',
    'USER.INDUSTRY': 'Industry',
    'USER.EQUIPMENT': 'Equipment',
    'USER.PUBLICSERVICES': 'Public Services'
  }
  wasteOptions: { [key: string]: string } = {
    'USER.SOLIDWASTE': 'Solid Waste',
    'USER.RECYCLING': 'Recycling',
    'USER.HAZARDOUSWASTE': 'Hazardous Waste',
    'USER.COLLECTION': 'Collection',
    'USER.TRANSFER': 'Transfer'
  }
  waterOptions: { [key: string]: string } = {
    'USER.POTABLEWATER': 'Potable Water distribution',
    'USER.CAPTURESTORAGE': 'Capture/Storage',
    'USER.WATERREUSE': 'Water Reuse',
    'USER.STORMWATER': 'Storm Water',
    'USER.MANAGEMENT': 'Management',
    'USER.FLOODCONTROL': 'Flood Control'
  }
  transportOptions: { [key: string]: string } = {
    'USER.AIRPORTS': 'Airports',
    'USER.ROADS': 'Roads',
    'USER.HIGHWAYS': 'Highways',
    'USER.BIKES': 'Bikes',
    'USER.PEDESTRIANS': 'Pedestrians',
    'USER.RAILWAYS': 'Railways',
    'USER.PUBLICTRANSPORT': 'Public Transport',
    'USER.PORTS': 'Ports'
  }
  landscapeOptions: { [key: string]: string } = {
    'USER.WATERWAYS': 'Waterways',
    'USER.PUBLICREALM': 'Public Realm',
    'USER.PARKS': 'Parks',
    'USER.ECOSYSTEM': 'Ecosystem Services',
    'USER.NATURALINFRASTRUCTURE': 'Natural Infrastructure'
  }
  informationOptions: { [key: string]: string } = {
    'USER.TELECOMMUNICATIONS': 'Telecommunications',
    'USER.INTERNET': 'Internet',
    'USER.PHONES': 'Phones',
    'USER.DATACENTERS': 'Data Centers',
    'USER.SENSORS': 'Sensors'
  }


  constructor(private translate: TranslateService, private appService: AppService, private router: Router, private apiService: ApiService) {
  this.setInputsArray();
    this.form = new TypedFormGroup<IForm>({
      firstName: new FormControl(undefined, [Validators.required]),
      lastName: new FormControl(undefined, [Validators.required]),
      email: new FormControl(undefined, [Validators.required]),
      title: new FormControl(undefined, [Validators.required]),
      otherTitle: new FormControl(),
      companyName: new FormControl(undefined, [Validators.required]),
      country: new FormControl(undefined, [Validators.required]),
      state: new FormControl(undefined, [Validators.required]),
      industry: new FormControl(undefined, [Validators.required]),
      sector: new FormControl(undefined, [Validators.required]),
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

  setInputsArray(){
    this.inputs = [
      { label: this.translate.instant('USER.FIRSTNAME'), formControlName: 'firstName', colClass: 'col-md-6' },
      { label: this.translate.instant('USER.LASTNAME'), formControlName: 'lastName', colClass: 'col-md-6', inputClass: 'border-start-md-0' },
      { label: this.translate.instant('USER.WORKEMAIL'), formControlName: 'email' },
      {
        label: this.translate.instant('USER.TITLE2'), formControlName: 'title', type: InputTypesEnum.Select, options: [
          this.translate.instant('USER.MANAGER_MKT'), this.translate.instant('USER.OFFICER_SUSTAIN'), this.translate.instant('USER.DIRECTOR_PR'), this.translate.instant('USER.MANAGER_CSR'), this.translate.instant('USER.MANAGER_EC'), this.translate.instant('USER.MANAGER_SC'), this.translate.instant('USER.DIRECTOR_SD'), this.translate.instant('USER.SPECIALIST_ECS'), this.translate.instant('USER.ANALYST_SUSTAIN'), this.translate.instant('USER.DIRECTOR_CR'),
        ].map(x => ({
          label: x,
          value: x
        }))
      },
      { label: this.translate.instant('USER.YOUR'), formControlName: 'otherTitle', showIf: { control: 'title', value: 'Other' } },
      { label: this.translate.instant('USER.COMPANY'), formControlName: 'companyName' },
      {
        label: this.translate.instant('USER.SECTOR'), formControlName: 'sector', type: InputTypesEnum.Select, options: Object.entries(this.sectorOptions).map(([label, value]) => ({
          label: this.translate.instant(label),
          value: value
        }))
      },
      {
        label: this.translate.instant('USER.INDUSTRY'), disclaimer:this.translate.instant('USER.INDUSTRYCHECK') ,formControlName: 'industry', type: InputTypesEnum.Select, options: Object.entries(industryOptions).map(([label, value]) => ({
          label: this.translate.instant(label),
          value: value
        }))
      },
      {
        label: this.translate.instant('USER.COUNTRY'), formControlName: 'country', type: InputTypesEnum.Select, options: [
          'Afghanistan',
          'Algeria',
          'Angola',
          'Argentina',
          'Australia',
          'Bangladesh',
          'Belarus',
          'Botswana',
          'Brazil',
          'Burkina Faso',
          'Canada',
          'Central African Republic',
          'Chad',
          'China',
          'Colombia',
          'Democratic Republic of the Congo',
          'Egypt',
          'Ecuador',
          'Ethiopia',
          'Finland',
          'France',
          'Gabon',
          'Germany',
          'Ghana',
          'Greenland',
          'Guinea',
          'Guyana',
          'India',
          'Indonesia',
          'Iran',
          'Iraq',
          'Italy',
          'Ivory Coast',
          'Japan',
          'Kazakhstan',
          'Kenya',
          'Kyrgyzstan',
          'Laos',
          'Libya',
          'Madagascar',
          'Malawi',
          'Malaysia',
          'Mali',
          'Mauritania',
          'Mexico',
          'Mongolia',
          'Morocco',
          'Mozambique',
          'Myanmar',
          'Namibia',
          'Nepal',
          'Niger',
          'Nigeria',
          'North Korea',
          'Norway',
          'Pakistan',
          'Papua New Guinea',
          'Paraguay',
          'Peru',
          'Philippines',
          'Poland',
          'Republic of the Congo',
          'Romania',
          'Russia',
          'Saudi Arabia',
          'Senegal',
          'Somalia',
          'South Africa',
          'South Sudan',
          'Spain',
          'Sudan',
          'Suriname',
          'Sweden',
          'Syria',
          'Tajikistan',
          'Tanzania',
          'Thailand',
          'Tunisia',
          'Turkey',
          'Turkmenistan',
          'Uganda',
          'Ukraine',
          'United Kingdom',
          'United States',
          'Uruguay',
          'Uzbekistan',
          'Venezuela',
          'Western Sahara',
          'Yemen',
          'Zambia',
          'Zimbabwe'
        ].map(x => ({
          label: x,
          value: x
        }))
      },
      { label: this.translate.instant('USER.STATE'), formControlName: 'state' },
      { label: this.translate.instant('USER.YOURI'), formControlName: 'otherIndustry', showIf: { control: 'industry', value: 'Other' } },
      {
        label: this.translate.instant('USER.COMPANYSIZE'), formControlName: 'companySize', type: InputTypesEnum.Select, options: [
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

  updateIndustryOptions() {
    const selectedSector = this.form.get('sector')?.value;
    switch (selectedSector) {
      case 'ENERGY':
        industryOptions = this.energyOptions;
        break;
      case 'ARCHITECT':
        industryOptions = this.architectOptions;

        break;
      case 'WASTE':
        industryOptions = this.wasteOptions;

        break;
      case 'WATER':
        industryOptions = this.waterOptions;

        break;
      case 'TRANSPORT':
        industryOptions = this.transportOptions;

        break;
      case 'LANDSCAPE':
        industryOptions = this.landscapeOptions;

        break;
      case 'INFORMATION':
        industryOptions = this.informationOptions;

        break;
      // Add cases for other sectors as needed
      default:
        // Default options when no sector is selected or for other sectors
        industryOptions.splice(0); // Clear existing options
        industryOptions = [
        ];
        break;
    }
    this.setInputsArray();
    console.log("SECTOR", this.sectorOptions);
    console.log("INDUSTRY", industryOptions);
  }

  disclaimer() {
    if (this.isLoading || this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }
    this.disclaimerPage = true;
      
  }

  submit() {
    if (this.isLoading || this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }    
    this.disclaimerPage = false;
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
