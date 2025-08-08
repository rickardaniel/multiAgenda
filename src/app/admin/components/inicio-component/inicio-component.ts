import { Component } from '@angular/core';
import CalendarComponetn from '../../../shared/calendar/calendar-components';
import { BigCalendarComponent } from '../../../shared/big-calendar-component/big-calendar-component';
import { ApiService } from '../../../services/api-service';
import { stateColorsNormal, stateColorsStrong } from '../../../interface/styles-agenda.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-component',
  imports: [CommonModule, CalendarComponetn, BigCalendarComponent],
  templateUrl: './inicio-component.html',
  styleUrl: './inicio-component.scss'
})

export default class InicioComponent {
  
 dateSelected: any;
 citasByDay:any=[];
 colorStateLetter = stateColorsStrong;
 colorStateBg = stateColorsNormal;
 constructor
 (
  private api: ApiService
 )
 {
  console.log('colors',this.colorStateBg);
  console.log('colors',this.colorStateLetter);
  
 }
  detectDate(event: any) {
    // El event ya es la fecha directamente, no es un evento del DOM
    if (event) {
      // console.log('Fecha recibida:', event);
      this.dateSelected = event.target?.value;
      // this.getCitas(this.citasByDay)
    }
  }

  getCitas(event){
    console.log('llega');
    
    this.citasByDay=event;
    console.log('PADRE',this.citasByDay);   
  }

  nameAvatar(name){
    return this.api.getInitials(name)
  }

  getStatusColors(status: any) {
  const colorMap = {
    'completada': { bg: stateColorsNormal['green-n'], text: stateColorsStrong['green-s'] },
    'en-proceso': { bg: stateColorsNormal['purple-n'], text: stateColorsStrong['purple-s'] },
    'confirmada': { bg: stateColorsNormal['blue-n'], text: stateColorsStrong['blue-s'] },
    'pendiente': { bg: stateColorsNormal['yellow-n'], text: stateColorsStrong['yellow-s'] },
    'cancelada': { bg: stateColorsNormal['red-n'], text: stateColorsStrong['red-s'] },
    'sin-confirmar': { bg: stateColorsNormal['orange-n'], text: stateColorsStrong['orange-s'] }
  };
  
  return colorMap[status] || { bg: '#f3f4f6', text: '#374151' };
}

getStatusClass(status:string):string{
  return this.api.getStatusClass(status);
}

 getRandomColor(letter) {
    return this.api.getDualColorObject(letter);
  }


// getStatusClass(status: string): string {
//   const statusClasses: { [key: string]: string } = {
//     'completada': 'bg-green-50 text-green-600',
//     'en-proceso': 'bg-purple-100 text-purple-800', 
//     'confirmada': 'bg-cyan-100 text-blue-600',
//     'pendiente': 'bg-yellow-50 text-yellow-500',
//     'sin-confirmar': 'bg-orange-100 text-orange-600',
//     'cancelada': 'bg-red-50 text-red-600'
//   };
//   return statusClasses[status] || 'bg-gray-100 text-gray-800';
// }



}