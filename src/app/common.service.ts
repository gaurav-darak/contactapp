import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private postContactAPI = 'http://localhost:3000/api/submitquery';
  constructor(private http: Http){ }

  postContactus(inputValues){
    return this.http.post(this.postContactAPI, inputValues);
  }
}
