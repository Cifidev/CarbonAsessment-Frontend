import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { User } from "@shared/models/user";
import { TestAnswers } from "@shared/models/test-answers";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private userInfo = new BehaviorSubject<User | undefined>(undefined);
  userInfo$ = this.userInfo.asObservable();
  private answers = new BehaviorSubject<TestAnswers | undefined>(undefined);
  answers$ = this.answers.asObservable();

  constructor() {
    const user = localStorage.getItem('GreenCross_user');
    if (user) {
      this.userInfo.next(JSON.parse(user));
    }
    const answers = localStorage.getItem('GreenCross_answers');
    if (answers) {
      this.answers.next(JSON.parse(answers));
    }
  }

  setUserInfo(user: User): void {
    localStorage.setItem('GreenCross_user', JSON.stringify(user));
    this.userInfo.next(user);
  }

  setAnswers(answers: TestAnswers): void {
    localStorage.setItem('GreenCross_answers', JSON.stringify(answers));
    this.answers.next(answers);
  }
}
