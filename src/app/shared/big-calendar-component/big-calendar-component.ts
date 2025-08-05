import { Component, computed, signal } from '@angular/core';
import { CalendarEvent, DAYS, EventTheme, MONTH_NAMES, THEMES } from '../../interface/calendar.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  fullDate: Date;
}
@Component({
  selector: 'app-big-calendar-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './big-calendar-component.html',
  styleUrl: './big-calendar-component.scss'
})
export class BigCalendarComponent {

  // Signals para el estado
  month = signal<number>(new Date().getMonth());
  year = signal<number>(new Date().getFullYear());
  viewMode = signal<'week' | 'month'>('month');
  selectedDate = signal<string>('');
  
  events = signal<CalendarEvent[]>([
    {
      event_date: new Date(2025, 6, 1).toDateString(), // Julio 2025
      event_title: "Consulta médica",
      event_theme: 'blue'
    },
    {
      event_date: new Date(2025, 6, 1).toDateString(),
      event_title: "Cita odontólogo",
      event_theme: 'green'
    },
    {
      event_date: new Date(2025, 6, 2).toDateString(),
      event_title: "Revisión anual",
      event_theme: 'red'
    },
    {
      event_date: new Date(2025, 6, 8).toDateString(),
      event_title: "Consulta especialista",
      event_theme: 'blue'
    },
    {
      event_date: new Date(2025, 6, 10).toDateString(),
      event_title: "Cita programada",
      event_theme: 'purple'
    }
  ]);
  
  openEventModal = signal<boolean>(false);

  // Computed signals
  currentMonthName = computed(() => MONTH_NAMES[this.month()]);
  
  calendarDays = computed(() => {
    const year = this.year();
    const month = this.month();
    
    // Primer día del mes y cuántos días en blanco necesitamos al inicio
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    // Generar 42 días (6 semanas x 7 días)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = current.getMonth() === month;
      const isToday = this.isToday(current);
      
      days.push({
        date: current.getDate(),
        isCurrentMonth,
        isToday,
        fullDate: new Date(current)
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  });

  // Constantes
  WEEKDAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  THEMES = THEMES;

  // Form
  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      event_title: ['', Validators.required],
      event_date: [''],
      event_theme: ['blue']
    });
    
    // Establecer mes actual (Julio 2025 para coincidir con la imagen)
    this.month.set(6); // Julio (0-indexed)
    this.year.set(2025);
  }

  previousMonth(): void {
    if (this.month() === 0) {
      this.month.set(11);
      this.year.update(y => y - 1);
    } else {
      this.month.update(m => m - 1);
    }
  }

  nextMonth(): void {
    if (this.month() === 11) {
      this.month.set(0);
      this.year.update(y => y + 1);
    } else {
      this.month.update(m => m + 1);
    }
  }

  setView(view: 'week' | 'month'): void {
    this.viewMode.set(view);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return today.toDateString() === date.toDateString();
  }

  getDateClasses(day: CalendarDay): string {
    let classes = '';
    
    if (day.isToday) {
      classes += 'bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center';
    } else if (!day.isCurrentMonth) {
      classes += 'text-gray-400';
    } else {
      classes += 'text-gray-900';
    }
    
    return classes;
  }

  getAppointmentsCount(day: CalendarDay): number {
    return this.events().filter(event => 
      new Date(event.event_date).toDateString() === day.fullDate.toDateString()
    ).length;
  }

  showEventModal(day: CalendarDay): void {
    const dateString = day.fullDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    this.selectedDate.set(day.fullDate.toDateString());
    
    this.eventForm.patchValue({
      event_date: dateString,
      event_title: '',
      event_theme: 'blue'
    });
    
    this.openEventModal.set(true);
  }

  closeModal(): void {
    this.openEventModal.set(false);
    this.selectedDate.set('');
    this.eventForm.reset({
      event_title: '',
      event_date: '',
      event_theme: 'blue'
    });
  }

  addEvent(): void {
    if (this.eventForm.valid && this.selectedDate()) {
      const newEvent: CalendarEvent = {
        event_date: this.selectedDate(),
        event_title: this.eventForm.value.event_title,
        event_theme: this.eventForm.value.event_theme
      };
      
      this.events.update(events => [...events, newEvent]);
      this.closeModal();
    }
  }
}
