import { Component } from '@angular/core';
import { InputPhoneComponent } from "../input-phone-component/input-phone-component";
import { CommonModule } from '@angular/common';

// Enum para mejor tipado
export enum ProfileSection {
  DATOS = 'datos',
  SEGURIDAD = 'seguridad',
  PRIVACIDAD = 'privacidad',
  FAQ = 'faq'
}

@Component({
  selector: 'app-profile-component',
  imports: [InputPhoneComponent, CommonModule],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.scss'
})
export default class ProfileComponent {
  // Usar enum en lugar de boolean
  currentSection: ProfileSection = ProfileSection.DATOS;
  
  // Exponer enum al template
  ProfileSection = ProfileSection;

  /**
   * Cambia la sección activa del perfil
   * @param section - La nueva sección a mostrar
   */
  gotoSection(section: ProfileSection): void {
    console.log('Cambiando a sección:', section);
    this.currentSection = section;
  }

  /**
   * Verifica si una sección está activa
   * @param section - La sección a verificar
   * @returns true si la sección está activa
   */
  isActiveSection(section: ProfileSection): boolean {
    return this.currentSection === section;
  }

  /**
   * Obtiene las clases CSS para los botones de navegación
   * @param section - La sección del botón
   * @returns String con las clases CSS
   */
  getNavButtonClasses(section: ProfileSection): string {
    const baseClasses = 'nav-item w-full flex items-center px-3 py-2 text-sm font-medium rounded-l-lg transition-all duration-200';
    
    if (this.isActiveSection(section)) {
      return `${baseClasses} text-red-600 bg-red-50 border-r-2 border-red-600`;
    }
    
    return `${baseClasses} text-gray-600 hover:bg-gray-50`;
  }

  /**
   * Maneja el envío del formulario de datos de usuario
   * @param event - Evento del formulario
   */
  onUserDataSubmit(event: Event): void {
    event.preventDefault();
    console.log('Actualizando datos de usuario...');
    // Aquí iría la lógica para actualizar los datos
  }

  /**
   * Maneja el envío del formulario de seguridad
   * @param event - Evento del formulario
   */
  onSecuritySubmit(event: Event): void {
    event.preventDefault();
    console.log('Actualizando configuración de seguridad...');
    // Aquí iría la lógica para actualizar la seguridad
  }
}