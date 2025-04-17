import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  filter,
  forkJoin,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  from,
} from 'rxjs';
import { Category } from '../models/category';
import { TestAnswers } from '../models/test-answers';
import { Resource } from '@shared/models/resource';
import { Result } from '@shared/models/result';
import { environment } from '../../../environments/environment';
import { User } from '@shared/models/user';
import { FirebaseResponse } from '@shared/models/firebase-response';
import { AppService } from '@shared/services/app.service';
import { DataService } from '../../data.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private testData$?: Observable<Category[]> | undefined;
  private supabase: SupabaseClient;

  constructor(
    private datePipe: DatePipe,
    private appService: AppService,
    private dataService: DataService
  ) {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key
    );
  }

  sendData(): void {
    const data = {
      param1: 'value1',
      param2: 'value98'
    };

    from(this.supabase.from('your_table').insert(data))
      .subscribe(response => {
        if (response.error) {
          console.error('Error:', response.error);
        } else {
          console.log('Data saved to Supabase:', response.data);
        }
      });
  }

  getTestData(): Observable<Category[]> {
    if (!this.testData$) {
      this.testData$ = from(this.supabase
        .from('test_data')
        .select('*')
        .then(({ data, error }) => {
          if (error) throw error;

          return JSON.parse(data[0].questions) as Category[];
        }))
        .pipe(shareReplay());
    }
    return this.testData$;
  }

  getfullTestData(): Observable<Category[]> {
    if (!this.testData$) {
      const fulltestString = localStorage.getItem("fullTest");
      const fulltest = fulltestString ? JSON.parse(fulltestString) : null;
      if (fulltest) {
        this.testData$ = of(fulltest);
      } else {
        this.testData$ = of([]);
      }
    }
    return this.testData$;
  }

  getResources(): Observable<Resource[]> {
    return from(this.supabase
      .from('resources')
      .select('*')
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Resource[];
      }));
  }

  getResults(): Observable<Result[]> {
    return from(this.supabase
      .from('results')
      .select('*')
      .then(({ data, error }) => {
        if (error) throw error;
        return data as Result[];
      }));
  }

  saveUserData(user: User): Observable<any> {
    return from(this.supabase
      .from('users')
      .insert(user)
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      }));
  }

  updateUserData(userId: string, user: User): Observable<any> {
    return from(this.supabase
      .from('users')
      .update(user)
      .eq('id', userId)
      .then(({ data, error }) => {
        if (error) throw error;
        return data;
      }));
  }

  getAnswers(
    { answers }: TestAnswers,
    userIdInfo: string
  ): Observable<any> {
    return forkJoin([
      this.appService.userInfo$.pipe(filter(Boolean), take(1)),
      this.getTestData(),
    ]).pipe(
      switchMap(([{ id: userIdInfo, ...user }, categories]) => {
        const updatedUser = {
          ...user,
          time: new Date().toString(),
          answers: categories.map((category, ci) => ({
            category: category.title,
            questions: category.questions.map((question, qi) => ({
              ...question,
              ...answers[ci][qi],
            })),
          })),
        };
        
        return from(this.supabase
          .from('users')
          .update(updatedUser)
          .eq('id', userIdInfo)
          .then(({ data, error }) => {
            if (error) throw error;
            return data;
          }));
      })
    );
  }

  submitAnswers({ answers }: TestAnswers): Observable<any> {
    return forkJoin([
      this.appService.userInfo$.pipe(filter(Boolean), take(1)),
      this.getTestData(),
    ]).pipe(
      switchMap(([{ id: userId, ...user }, categories]) => {
        const updatedUser = {
          ...user,
          time: new Date().toString(),
          answers: categories.map((category, ci) => ({
            category: category.title,
            questions: category.questions.map((question, qi) => ({
              ...question,
              ...answers[ci][qi],
            })),
          })),
        };
        
        return from(this.supabase
          .from('users')
          .update(updatedUser)
          .eq('id', userId)
          .then(({ data, error }) => {
            if (error) throw error;
            return data;
          }));
      })
    );
  }
}