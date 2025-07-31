import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import CalendarComponent from '../../shared/calendar/calendar-components';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-agenda-component',
  imports: [CommonModule, CalendarComponent],
  templateUrl: './agenda-component.html',
  styleUrl: './agenda-component.scss'
})
export default class AgendaComponent {
 flagStepOne=true;
 flagStepTwo=false;
 flagStepThree=false;
 flagClassOverflow=false;
 horarios =[
  {'id':1,'horaI':'09:00', 'horaF':'09:30'},
  {'id':2,'horaI':'09:30', 'horaF':'10:00'},
  {'id':3,'horaI':'10:00', 'horaF':'10:30'},
  {'id':4,'horaI':'10:30', 'horaF':'11:00'},
  {'id':5,'horaI':'11:00', 'horaF':'11:30'},
 ]
  @ViewChild('Horarios') horariosRef!: ElementRef<HTMLDivElement>;

    constructor
    (
      private router: Router
    )
    {
  
      
    }
  
    goToPage(){
      this.router.navigateByUrl('');
    }



    backStepOne(){
     this.flagStepOne=true;
      this.flagStepTwo=false;
      this.flagStepThree=false; 
    }
    backStepTwo(){
     this.flagStepOne=false;
      this.flagStepTwo=true;
      this.flagStepThree=false; 
    }
    nextStepTwo(){
     this.flagStepOne=false;
      this.flagStepTwo=true;
      this.flagStepThree=false; 
    }
    nextStepThree(){
     this.flagStepOne=false;
      this.flagStepTwo=false;
      this.flagStepThree=true; 
    }

    detectDate(event){
      console.log('event', event);
      if(event){
        console.log('entra');
        
        this.flagClassOverflow=true;

        console.log('horarios',this.horariosRef);
        
        if (this.horariosRef) {
            // Trabajar con el elemento
            this.scrollToHorarios()
        }
      }
    }

      scrollToElement($element: any): void {
    setTimeout(() => {
      $element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }, 600)
  }

   scrollToHorarios(): void {
    if (this.horariosRef) {
      this.scrollToElement(this.horariosRef.nativeElement);
    }
  }

}
