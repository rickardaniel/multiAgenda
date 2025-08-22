// big-calendar-component.ts - Código actualizado

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

interface WeekDay {
  date: number;
  day: string;
  fullDate: Date;
  isToday: boolean;
}

interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
}

// Extender la interfaz CalendarEvent para incluir hora
interface CalendarEventWithTime extends CalendarEvent {
  event_time?: string; // Formato "HH:mm"
  duration?: number; // Duración en minutos
}

@Component({
  selector: 'app-big-calendar-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './big-calendar-component.html',
  styleUrl: './big-calendar-component.scss',
})
export class BigCalendarComponent implements OnChanges {
  @Input('dateSelected') dateSelected: any;
  @Output() sendCitas = new EventEmitter<any>();

  // Signals para el estado
  month = signal<number>(new Date().getMonth());
  year = signal<number>(new Date().getFullYear());
  viewMode = signal<'week' | 'month'>('month');
  selectedDate = signal<string>('');
  selectedCalendarDate = signal<Date | null>(null);
  currentWeekStart = signal<Date>(this.getWeekStart(new Date()));

  // Horarios de trabajo (puedes ajustar según tus necesidades)
  WORK_HOURS: TimeSlot[] = [
    { time: '7:00', hour: 7, minute: 0 },
    { time: '7:30', hour: 7, minute: 30 },
    { time: '8:00', hour: 8, minute: 0 },
    { time: '8:30', hour: 8, minute: 30 },
    { time: '9:00', hour: 9, minute: 0 },
    { time: '9:30', hour: 9, minute: 30 },
    { time: '10:00', hour: 10, minute: 0 },
    { time: '10:30', hour: 10, minute: 30 },
  ];

  events = signal<CalendarEventWithTime[]>([
    {
      event_date: new Date(2025, 7, 7).toDateString(), // Jueves
      event_title: 'Andrea Almeida - Consulta médica general',
      event_theme: 'red',
      event_time: '7:00',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 8).toDateString(), // Viernes
      event_title: 'Mariana Chávez - Nutrición',
      event_theme: 'blue',
      event_time: '7:00',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 9).toDateString(), // Sábado
      event_title: 'Julia Narváez - Consulta médica general',
      event_theme: 'red',
      event_time: '7:00',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 10).toDateString(), // Domingo
      event_title: 'Alejandro Torres - Terapia física',
      event_theme: 'green',
      event_time: '7:00',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 11).toDateString(), // Lunes
      event_title: 'Karen Delgado - Terapia física',
      event_theme: 'yellow',
      event_time: '7:00',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 7).toDateString(),
      event_title: 'Luis Espinoza - Terapia física',
      event_theme: 'green',
      event_time: '7:30',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 8).toDateString(),
      event_title: 'Javier Paredes - Psicología',
      event_theme: 'purple',
      event_time: '7:30',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 10).toDateString(),
      event_title: 'Ana Lucía Pérez - Psicología',
      event_theme: 'purple',
      event_time: '7:30',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 11).toDateString(),
      event_title: 'Jorge Macías - Nutrición',
      event_theme: 'blue',
      event_time: '7:30',
      duration: 30,
      cant: 1,
    },
    // Agregar más eventos de ejemplo...
    {
      event_date: new Date(2025, 7, 8).toDateString(),
      event_title: 'Sofía Mejía - Consulta médica general',
      event_theme: 'red',
      event_time: '8:30',
      duration: 30,
      cant: 1,
    },
    {
      event_date: new Date(2025, 7, 9).toDateString(),
      event_title: 'Tomás Cedeño - Odontología general',
      event_theme: 'green',
      event_time: '8:30',
      duration: 30,
      cant: 1,
    },
  ]);

  openEventModal = signal<boolean>(false);

  // Computed signals existentes
  currentMonthName = computed(() => MONTH_NAMES[this.month()]);

  // Nuevo computed para los días de la semana
  weekDays = computed(() => {
    const startDate = new Date(this.currentWeekStart());
    const days: WeekDay[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      days.push({
        date: currentDate.getDate(),
        day: this.WEEKDAYS[i],
        fullDate: new Date(currentDate),
        isToday: this.isToday(currentDate),
      });
    }

    return days;
  });

  // Computed para obtener el rango de fechas de la semana actual
  weekRange = computed(() => {
    const days = this.weekDays();
    const start = days[0]?.fullDate;
    const end = days[6]?.fullDate;

    if (!start || !end) return '';

    const startFormatted = start.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
    });
    const endFormatted = end.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return `${startFormatted} - ${endFormatted}`;
  });

  calendarDays = computed(() => {
    const year = this.year();
    const month = this.month();

    console.log('month original:', this.month());
    console.log('month ajustado:', month);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    const days: CalendarDay[] = [];
    const current = new Date(startDate);

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
  isDropdownOpen: boolean = true; // Estado inicial del dropdown

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.eventForm = this.fb.group({
      event_title: ['', Validators.required],
      event_date: [''],
      event_time: ['7:00'], // Agregar campo de hora
      event_theme: ['blue'],
    });

    this.month.set(this.currentMonth);
    this.year.set(this.currentYear);
  }

  ngOnInit() {
    this.toggleDropdown();
    console.log('dateSelected', this.dateSelected);
    if (this.dateSelected) {
      this.navigateToDate(this.dateSelected);
    } else {
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
      this.navigateToDate(selectedDate);
      console.log('PRUEBA', this.dateSelected);
    }
  }

  // Métodos para la vista de semana
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
    return new Date(d.setDate(diff));
  }

  previousWeek(): void {
    const current = new Date(this.currentWeekStart());
    current.setDate(current.getDate() - 7);
    this.currentWeekStart.set(current);
  }

  nextWeek(): void {
    const current = new Date(this.currentWeekStart());
    current.setDate(current.getDate() + 7);
    this.currentWeekStart.set(current);
  }

  // Obtener eventos para una fecha y hora específica
  getEventsForTimeSlot(
    date: Date,
    timeSlot: TimeSlot
  ): CalendarEventWithTime[] {
    return this.events().filter((event) => {
      const eventDate = new Date(event.event_date);
      const sameDate = eventDate.toDateString() === date.toDateString();
      const sameTime = event.event_time === timeSlot.time;
      return sameDate && sameTime;
    });
  }

  // Obtener clase CSS para el tema del evento
  getEventThemeClass(theme: string): string {
    const themeClasses = {
      red: 'bg-red-100 border-l-4 border-red-500 text-red-800',
      blue: 'bg-blue-100 border-l-4 border-blue-500 text-blue-800',
      green: 'bg-green-100 border-l-4 border-green-500 text-green-800',
      yellow: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800',
      purple: 'bg-purple-100 border-l-4 border-purple-500 text-purple-800',
      cyan: 'bg-cyan-100 border-l-4 border-cyan-500 text-cyan-800',
    };
    return themeClasses[theme] || themeClasses['blue'];
  }

  // Métodos existentes actualizados
  private navigateToDate(date: any): void {
    let targetDate: Date;

    if (date instanceof Date) {
      targetDate = date;
    } else if (typeof date === 'string') {
      targetDate = new Date(date);
    } else {
      console.warn('Formato de fecha no reconocido:', date);
      return;
    }

    if (isNaN(targetDate.getTime())) {
      console.warn('Fecha inválida:', date);
      return;
    }

    console.log('Navegando a:', targetDate);

    this.month.set(targetDate.getMonth());
    this.year.set(targetDate.getFullYear());
    this.selectedCalendarDate.set(targetDate);

    // También actualizar la semana si está en vista de semana
    if (this.viewMode() === 'week') {
      this.currentWeekStart.set(this.getWeekStart(targetDate));
    }
  }

  isSelectedDay(day: CalendarDay): boolean {
    const selectedDate = this.selectedCalendarDate();
    if (!selectedDate) return false;

    return selectedDate.toDateString() === day.fullDate.toDateString();
  }

  previousMonth(): void {
    if (this.viewMode() === 'week') {
      this.previousWeek();
    } else {
      if (this.month() === 0) {
        this.month.set(11);
        this.year.update((y) => y - 1);
      } else {
        this.month.update((m) => m - 1);
      }
    }
  }

  nextMonth(): void {
    if (this.viewMode() === 'week') {
      this.nextWeek();
    } else {
      if (this.month() === 11) {
        this.month.set(0);
        this.year.update((y) => y + 1);
      } else {
        this.month.update((m) => m + 1);
      }
    }
  }

  setView(view: 'week' | 'month'): void {
    this.viewMode.set(view);

    // Si cambia a vista de semana, inicializar la semana actual
    if (view === 'week') {
      const currentDate = this.selectedCalendarDate() || new Date();
      this.currentWeekStart.set(this.getWeekStart(currentDate));
    }
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
      .filter(
        (event) =>
          new Date(event.event_date).toDateString() ===
          day.fullDate.toDateString()
      )
      .reduce((total, event) => total + (event.cant || 0), 0);
  }

  showEventModal(day: CalendarDay, timeSlot?: TimeSlot): void {
    const dateString = day.fullDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    this.selectedDate.set(day.fullDate.toDateString());

    this.eventForm.patchValue({
      event_date: dateString,
      event_time: timeSlot?.time || '7:00',
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
      event_time: '7:00',
      event_theme: 'blue',
    });
  }

  addEvent(): void {
    if (this.eventForm.valid && this.selectedDate()) {
      const newEvent: CalendarEventWithTime = {
        event_date: this.selectedDate(),
        event_title: this.eventForm.value.event_title,
        event_theme: this.eventForm.value.event_theme,
        event_time: this.eventForm.value.event_time,
        duration: 30,
        cant: 1,
      };

      this.events.update((events) => [...events, newEvent]);
      this.closeModal();
    }
  }

  seeAllOrders(numOrder: number) {
    console.log('entra', numOrder);

    this.api.getAgendamientos().subscribe({
      next: (resp: any) => {
        console.log('agenda', resp);
        let arr = [];
        for (let i = 0; i < numOrder; i++) {
          arr.push(resp[i]);
        }
        console.log('resultado', arr);
        this.sendCitas.emit(arr);
      },
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
