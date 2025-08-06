import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { log } from 'console';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  urlCountries = 'assets/json/countries_final.json';
  urlMedicos = 'assets/json/medicos.json';
  urlEspecialidades = 'assets/json/especialidad.json';
  urlAgendamientos = 'assets/json/agendamientos.json';

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get(this.urlCountries);
  }

  getEspecialidades() {
    return this.http.get(this.urlEspecialidades);
  }

  getMedicos() {
    return this.http.get(this.urlMedicos);
  }

  getMedicosPorEspecialidad(especialidadId, medicos) {
    return medicos.filter(
      (medico) => medico.especialidadId === parseInt(especialidadId)
    );
  }

  getAgendamientos() {
    return this.http.get(this.urlAgendamientos);
  }

  // utils

  getInitials(fullName) {
    // Dividir el nombre completo en un array de palabras
    const names = fullName.trim().split(' ');

    // Obtener la inicial del primer nombre
    const firstInitial = names[0].charAt(0);

    // Obtener la inicial del primer apellido (primera palabra después del/los nombre/s)
    // Asumimos que el último o penúltimo elemento es el apellido
    const lastNameInitial =
      names[names.length - (names.length > 2 ? 2 : 1)].charAt(0);
    // console.log('AQUI', fullName);
    // console.log('firstInitial', firstInitial);
    // console.log('lastNameInitial', lastNameInitial);

    // Retornar las iniciales en mayúsculas
    return (firstInitial + lastNameInitial).toUpperCase();
  }
}
