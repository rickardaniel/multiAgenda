// // calendar.types.ts
// export interface CalendarEvent {
//   event_date: string;
//   event_title: string;
//   event_theme: EventTheme;
//   cant: number;
// }

// export type EventTheme = 'blue' | 'red' | 'yellow' | 'green' | 'purple';

// export interface Theme {
//   value: EventTheme;
//   label: string;
// }

// export const MONTH_NAMES = [
//   'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
//   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
// ];

// export const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// export const THEMES: Theme[] = [
//   { value: 'blue', label: 'Blue Theme' },
//   { value: 'red', label: 'Red Theme' },
//   { value: 'yellow', label: 'Yellow Theme' },
//   { value: 'green', label: 'Green Theme' },
//   { value: 'purple', label: 'Purple Theme' }
// ];

// calendar.interface.ts - Interfaces actualizadas

export interface CalendarEspecialista {
  event_date: string;
  event_title: string;
  event_theme: string;
  especialistas:string[];
  cant: number;
}

export interface CalendarEvent {
  event_date: string;
  event_title: string;
  event_theme: string;
  event_time?: string; // Nuevo campo para la hora (formato "HH:mm")
  duration?: number;   // Nuevo campo para duración en minutos
  cant: number;
  iniciales: string;
  nombre: string;
  cita: string;
}

export interface EventTheme {
  value: string;
  label: string;
  color: string;
}

export const THEMES: EventTheme[] = [
  { value: 'red', label: 'Consulta Médica', color: 'red' },
  { value: 'blue', label: 'Nutrición', color: 'blue' },
  { value: 'green', label: 'Terapia Física', color: 'green' },
  { value: 'yellow', label: 'Odontología', color: 'yellow' },
  { value: 'purple', label: 'Psicología', color: 'purple' },
  { value: 'cyan', label: 'Especialista', color: 'cyan' },
];

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DAYS = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 
  'Jueves', 'Viernes', 'Sábado'
];

// Nuevas interfaces para la vista de semana
export interface WeekDay {
  date: number;
  day: string;
  fullDate: Date;
  isToday: boolean;
}

export interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
}

export interface CalendarEventWithTime extends CalendarEvent {
  event_time: string;
  duration: number;
}