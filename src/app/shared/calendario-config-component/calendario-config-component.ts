import {
  Component,
  computed,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  CalendarEvent,
  DAYS,
  EventTheme,
  MONTH_NAMES,
  THEMES,
} from '../../interface/calendar.interface';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api-service';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  fullDate: Date;
}

@Component({
  selector: 'app-calendario-config-component',
 imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './calendario-config-component.html',
  styleUrl: './calendario-config-component.scss'
})
export class CalendarioConfigComponent  implements OnChanges {
  @Input('dateSelected') dateSelected: any;
    @Output() sendCitas = new EventEmitter<any>();

  // Signals para el estado
  month = signal<number>(new Date().getMonth());
  year = signal<number>(new Date().getFullYear());
  viewMode = signal<'week' | 'month'>('month');
  selectedDate = signal<string>('');
  selectedCalendarDate = signal<Date | null>(null); // Nueva signal para el día seleccionado

events = signal<CalendarEvent[]>([
    {
      event_date: new Date(2025, 7, 1).toDateString(), // Agosto 2025
      event_title: 'Consulta médica',
      event_theme: 'blue',
       cant:3
    },
    {
      event_date: new Date(2025, 7, 2).toDateString(),
      event_title: 'Cita odontólogo',
      event_theme: 'green',
       cant:5
    },
    {
      event_date: new Date(2025, 6, 2).toDateString(),
      event_title: 'Revisión anual',
      event_theme: 'red',
       cant:4
    },
    {
      event_date: new Date(2025, 7, 5).toDateString(),
      event_title: 'Consulta especialista',
      event_theme: 'blue',
       cant:1
    },
    {
      event_date: new Date(2025, 7, 7).toDateString(),
      event_title: 'Cita programada',
      event_theme: 'purple',
      cant:6
    },
  ]);


  openEventModal = signal<boolean>(false);

  // Computed signals
  currentMonthName = computed(() => MONTH_NAMES[this.month()]);

  calendarDays = computed(() => {
    const year = this.year();
    const month = this.month();
    
    console.log('month original:', this.month()); 
    console.log('month ajustado:', month);

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Calcular inicio para semana que empieza en LUNES
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

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
        fullDate: new Date(current),
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  });
  
  // Constantes
  WEEKDAYS = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  THEMES = THEMES;

  // Form
  eventForm: FormGroup;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  currentDay = new Date().getDate();

  constructor
  (
    private fb: FormBuilder,
    private api: ApiService,

  ) 
  {
    this.eventForm = this.fb.group({
      event_title: ['', Validators.required],
      event_date: [''],
      event_theme: ['blue'],
    });

    // Establecer mes actual
    this.month.set(this.currentMonth);
    this.year.set(this.currentYear);
  }

  ngOnInit() {
    console.log('dateSelected', this.dateSelected);
    if (this.dateSelected) {
      this.navigateToDate(this.dateSelected);
    } else {
      // Si no hay fecha seleccionada, usar el día actual
      this.selectedCalendarDate.set(new Date());
      console.log('es fecha', this.dateSelected);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('cambios', changes);
    
    if (changes['dateSelected'] && changes['dateSelected'].currentValue) {
      const selectedDate = changes['dateSelected'].currentValue;
      console.log('cambio fecha', selectedDate);
      this.dateSelected = selectedDate;
      
      // Navegar al mes/año de la fecha seleccionada
      this.navigateToDate(selectedDate);
      
      console.log('PRUEBA', this.dateSelected);
    }
  }

  /**
   * Navega el calendario al mes/año de la fecha seleccionada
   */
  private navigateToDate(date: any): void {
    let targetDate: Date;
    
    // Convertir la fecha a objeto Date según el tipo que recibamos
    if (date instanceof Date) {
      targetDate = date;
    } else if (typeof date === 'string') {
      targetDate = new Date(date);
    } else {
      console.warn('Formato de fecha no reconocido:', date);
      return;
    }
    
    // Verificar que la fecha sea válida
    if (isNaN(targetDate.getTime())) {
      console.warn('Fecha inválida:', date);
      return;
    }
    
    console.log('Navegando a:', targetDate);
    
    // Actualizar mes, año y fecha seleccionada
    this.month.set(targetDate.getMonth());
    this.year.set(targetDate.getFullYear());
    this.selectedCalendarDate.set(targetDate);
  }

  /**
   * Verifica si un día es el día seleccionado desde el calendario pequeño
   */
  isSelectedDay(day: CalendarDay): boolean {
    const selectedDate = this.selectedCalendarDate();
    if (!selectedDate) return false;
    
    return selectedDate.toDateString() === day.fullDate.toDateString();
  }

  previousMonth(): void {
    if (this.month() === 0) {
      this.month.set(11);
      this.year.update((y) => y - 1);
    } else {
      this.month.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.month() === 11) {
      this.month.set(0);
      this.year.update((y) => y + 1);
    } else {
      this.month.update((m) => m + 1);
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
      classes +=
        'bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center';
    } else if (this.isSelectedDay(day)) {
      // Estilo para el día seleccionado desde el calendario pequeño
      classes += 
        'bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center border-2 border-blue-400';
    } else if (!day.isCurrentMonth) {
      classes += 'text-gray-400';
    } else {
      classes += 'text-gray-900';
    }

    return classes;
  }

   getAppointmentsCount(day: CalendarDay): number {
    return this.events()
      .filter((event) => 
        new Date(event.event_date).toDateString() === day.fullDate.toDateString()
      )
      .reduce((total, event) => total + (event.cant || 0), 0);
  }


  showEventModal(day: CalendarDay): void {
    const dateString = day.fullDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.selectedDate.set(day.fullDate.toDateString());

    this.eventForm.patchValue({
      event_date: dateString,
      event_title: '',
      event_theme: 'blue',
    });

    this.openEventModal.set(true);
  }

  closeModal(): void {
    this.openEventModal.set(false);
    this.selectedDate.set('');
    this.eventForm.reset({
      event_title: '',
      event_date: '',
      event_theme: 'blue',
    });
  }

    addEvent(): void {
    if (this.eventForm.valid && this.selectedDate()) {
      const newEvent: CalendarEvent = {
        event_date: this.selectedDate(),
        event_title: this.eventForm.value.event_title,
        event_theme: this.eventForm.value.event_theme,
        cant:1
      };

      this.events.update((events) => [...events, newEvent]);
      this.closeModal();
    }
  }


  // ------------------------------------------------------------
  //  VER ORDENES POR DIA
  seeAllOrders( numOrder){
    console.log('entra',numOrder);
    
    // this.flagSeeOrders=true;
    this.api.getAgendamientos().subscribe({
      next:(resp:any)=>{
        console.log('agenda', resp);
        let arr=[];
        for (let i = 0; i < numOrder; i++) {
           arr.push(resp[i]);

        }
        console.log('resultado', arr);
        
        this.sendCitas.emit(arr);
        
      }
    })

  }

}
