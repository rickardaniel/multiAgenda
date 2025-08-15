import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import randomColor from 'randomcolor';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  urlCountries = 'assets/json/countries_final.json';
  urlMedicos = 'assets/json/medicos.json';
  urlEspecialidades = 'assets/json/especialidad.json';
  urlAgendamientos = 'assets/json/agendamientos.json';
  urlCitas = 'assets/json/citas.json';
  urlClientes = 'assets/json/clientes.json';
  urlCitasServicios= 'assets/json/citas_servicio.json';

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

  getCitas() {
    return this.http.get(this.urlCitas);
  }

  getClientes() {
    return this.http.get(this.urlClientes);
  }

  getCitasPorServicio(){
    return this.http.get(this.urlCitasServicios);

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

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      completada: 'bg-green-50 text-green-600',
      'en-proceso': 'bg-purple-100 text-purple-800',
      confirmada: 'bg-cyan-100 text-blue-600',
      pendiente: 'bg-yellow-50 text-yellow-500',
      'sin-confirmar': 'bg-orange-100 text-orange-600',
      cancelada: 'bg-red-50 text-red-600',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  // generateUserColor(userName: string): string {
  //   // Generar color basado en el hash del nombre para consistencia
  //   const seed = userName.split('').reduce((acc, char) => 
  //     char.charCodeAt(0) + ((acc << 5) - acc), 0);
    
  //   return randomColor({
  //     seed: seed,
  //     luminosity: 'bright',
  //     format: 'hex'
  //   });
  // }

  getDualColors(text: string): { [key: string]: string } {
    const seed = this.hashCode(text);
    
    // Generar color base (original)
    const originalColor = randomColor({
      seed: seed,
      luminosity: 'dark', // Color más oscuro para el texto
      format: 'hex'
    });

    // Generar color suave para el fondo
    const backgroundColor = randomColor({
      seed: seed,
      luminosity: 'light', // Color más claro para el fondo
      format: 'hex'
    });

    return {
      'background-color': backgroundColor,
      'color': originalColor,
      'border': `2px solid ${originalColor}15` // Borde sutil opcional
    };
  }
    private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

   private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

    private lightenColor(color: string, percent: number): string {
    const rgb = this.hexToRgb(color);
    
    // Mezclar con blanco
    const r = Math.round(rgb.r + (255 - rgb.r) * (percent / 100));
    const g = Math.round(rgb.g + (255 - rgb.g) * (percent / 100));
    const b = Math.round(rgb.b + (255 - rgb.b) * (percent / 100));
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  getDualColorObject(text: string): { backgroundColor: string; color: string, border:string } {
  const seed = this.hashCode(text);
  const lightenPercent = 90;
  const lightenPercent2 = 20;
  const lightenPercent3 = 85;
  // const opacity =  0.08;
  // const rgb = this.hexToRgb(textColor);
  const textColor = randomColor({ seed: seed, luminosity: 'dark' });
  const bgColor = randomColor({ seed: seed, luminosity: 'light' });
  const border = randomColor({ seed: seed, luminosity: 'light' });
 const lightenedBg = this.lightenColor(textColor, lightenPercent);
 const lightenedFont = this.lightenColor(textColor, lightenPercent2);
 const lightenedBorder = this.lightenColor(textColor, lightenPercent3);
  return { backgroundColor: lightenedBg, color: lightenedFont, border: lightenedBorder };
}


}
