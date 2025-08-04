import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlCountries ='assets/json/countries_final.json';
  urlMedicos ='assets/json/medicos.json';
  urlEspecialidades ='assets/json/especialidad.json';

  constructor
  (
    private http: HttpClient
  )
  {
  }

  getCountries(){
   return this.http.get(this.urlCountries);  
  }

  getEspecialidades(){
   return this.http.get(this.urlEspecialidades);  
  }

  getMedicos(){
   return this.http.get(this.urlMedicos);  
  }

getMedicosPorEspecialidad(especialidadId, medicos) {
  console.log('especialidadId',especialidadId);
  console.log('medicos',medicos);
  
    return medicos.filter(medico => medico.especialidadId === parseInt(especialidadId));
    // console.log('respMedicos', resp);
    
}
  
}
