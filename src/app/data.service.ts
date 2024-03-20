import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  sendDataToBackend(data: any): Observable<any> {
    const url = 'http://localhost:3000/endpoint'; // Replace with your endpoint URL
    return this.http.post<any>(url, data);
  }
}
