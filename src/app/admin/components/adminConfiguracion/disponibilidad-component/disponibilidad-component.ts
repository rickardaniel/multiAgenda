import { Component } from '@angular/core';
import { CalendarioConfigComponent } from '../../../../shared/calendario-config-component/calendario-config-component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../services/api-service';

@Component({
  selector: 'app-disponibilidad-component',
  imports: [CalendarioConfigComponent, CommonModule],
  templateUrl: './disponibilidad-component.html',
  styleUrl: './disponibilidad-component.scss',
})
export default class DisponibilidadComponent {
  flagHorarios = false;
expandedServices = new Set<string>();

  servicios = [
    {
      titulo: 'Consulta médica general',
      horarios: [
        { inicio: '8:00', fin: '08:30' },
        { inicio: '08:40', fin: '09:10' },
        { inicio: '09:20', fin: '09:50' },
        { inicio: '10:00', fin: '10:30' },
        { inicio: '10:40', fin: '11:10' },
        { inicio: '11:20', fin: '11:50' },
        { inicio: '12:00', fin: '12:30' },
        { inicio: '12:40', fin: '13:10' },
        { inicio: '14:00', fin: '14:30' },
        { inicio: '14:40', fin: '15:10' },
        { inicio: '15:20', fin: '15:50' },
        { inicio: '16:00', fin: '16:30' },
        { inicio: '16:40', fin: '17:10' },
        { inicio: '17:20', fin: '17:50' }
      ]
    },
    {
      titulo: 'Electrocardiograma (ECG)',
      horarios: [
        { inicio: '9:00', fin: '09:30' },
        { inicio: '10:00', fin: '10:30' },
        { inicio: '11:00', fin: '11:30' },
        { inicio: '14:00', fin: '14:30' },
        { inicio: '15:00', fin: '15:30' },
        { inicio: '16:00', fin: '16:30' }
      ]
    }
  ];

  toggleServicio(servicioTitulo: string): void {
    if (this.expandedServices.has(servicioTitulo)) {
      this.expandedServices.delete(servicioTitulo);
    } else {
      this.expandedServices.add(servicioTitulo);
    }
  }

  isExpanded(servicioTitulo: string): boolean {
    return this.expandedServices.has(servicioTitulo);
  }
  constructor
  (
    private api: ApiService
  )
  {

  }

  getHorarios(event) {
    console.log('llega', event);
    
    if (event) {
      this.flagHorarios = true;
    }
  }

    getRandomColor(letter) {
    return this.api.getDualColorObject(letter);
  }
}
