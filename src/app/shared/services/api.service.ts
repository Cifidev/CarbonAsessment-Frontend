import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  filter,
  forkJoin,
  Observable,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { Category } from '../models/category';
import { TestAnswers } from '../models/test-answers';
import { Resource } from '@shared/models/resource';
import { Result } from '@shared/models/result';
import { environment } from '../../../environments/environment';
import { User } from '@shared/models/user';
import { FirebaseResponse } from '@shared/models/firebase-response';
import { AppService } from '@shared/services/app.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private testData$?: Observable<Category[]>;
  firebaseUrl = environment.firebase.databaseUrl;

  constructor(private http: HttpClient, private appService: AppService) {}

  getTestData(): Observable<Category[]> {
    if (!this.testData$) {
      this.testData$ = this.http
        .get<Category[]>('assets/data/test-data.json')
        .pipe(shareReplay());
    }
    return this.testData$;
  }

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>('assets/data/resources.json');
  }

  getResults(): Observable<Result[]> {
    return this.http.get<Result[]>('assets/data/results.json');
  }

  saveUserData(user: User): Observable<FirebaseResponse> {
    return this.http.post<FirebaseResponse>(
      this.firebaseUrl + 'users.json',
      user
    );
  }

  updateUserData(userId: string, user: User): Observable<Partial<User>> {
    return this.http.put<Partial<User>>(
      this.firebaseUrl + `users/${userId}.json`,
      user
    );
  }
  getAnswers(
    { answers }: TestAnswers,
    userIdInfo: string
  ): Observable<FirebaseResponse> {
    return forkJoin([
      // Combine multiple Observables into a single Observable
      this.appService.userInfo$.pipe(filter(Boolean), take(1)),
      // Retrieve user information from the app service

      this.getTestData(),
      // Retrieve test data from the server
    ]).pipe(
      switchMap(([{ id: userIdInfo, ...user }, categories]) =>
        // Map and switch to another Observable, using the combined results
        this.http.put<FirebaseResponse>(
          this.firebaseUrl + `users/${userIdInfo}.json`,
          // Make an HTTP PUT request to update user data in Firebase
          {
            ...user,
            // Spread user information
            time: new Date().toString(),
            // Add current timestamp to indicate the time of submission
            answers: categories.map((category, ci) => ({
              // Map through categories to structure the answers
              category: category.title,
              // Include the category title
              questions: category.questions.map((question, qi) => ({
                // Map through questions within each category
                ...question,
                // Spread question information
                ...answers[ci][qi],
                // Include the answers for each question
              })),
            })),
            // Map through questions and include answers for each category
          }
        )
      )
    );
  }
  submitAnswers({ answers }: TestAnswers): Observable<FirebaseResponse> {
    // Function to submit test answers to the server
    console.log('HELLOOO  ');
    // Log a message indicating that the function has been called

    return forkJoin([
      // Combine multiple Observables into a single Observable
      this.appService.userInfo$.pipe(filter(Boolean), take(1)),
      // Retrieve user information from the app service

      this.getTestData(),
      // Retrieve test data from the server
    ]).pipe(
      switchMap(([{ id: userId, ...user }, categories]) =>
        // Map and switch to another Observable, using the combined results
        this.http.put<FirebaseResponse>(
          this.firebaseUrl + `users/${userId}.json`,
          // Make an HTTP PUT request to update user data in Firebase
          {
            ...user,
            // Spread user information
            time: new Date().toString(),
            // Add current timestamp to indicate the time of submission
            answers: categories.map((category, ci) => ({
              // Map through categories to structure the answers
              category: category.title,
              // Include the category title
              questions: category.questions.map((question, qi) => ({
                // Map through questions within each category
                ...question,
                // Spread question information
                ...answers[ci][qi],
                // Include the answers for each question
              })),
            })),
            // Map through questions and include answers for each category
          }
        )
      )
    );
    // End of switchMap operator
  }
  // End of function
}
