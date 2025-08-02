import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlCountries ='assets/json/countries_final.json';

  constructor
  (
    private http: HttpClient
  )
  {
  }

  getCountries(){
   return this.http.get(this.urlCountries);  
  }
  
}
