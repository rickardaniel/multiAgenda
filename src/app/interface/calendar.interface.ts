// calendar.types.ts
export interface CalendarEvent {
  event_date: string;
  event_title: string;
  event_theme: EventTheme;
  cant: number;
}

export type EventTheme = 'blue' | 'red' | 'yellow' | 'green' | 'purple';

export interface Theme {
  value: EventTheme;
  label: string;
}

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const THEMES: Theme[] = [
  { value: 'blue', label: 'Blue Theme' },
  { value: 'red', label: 'Red Theme' },
  { value: 'yellow', label: 'Yellow Theme' },
  { value: 'green', label: 'Green Theme' },
  { value: 'purple', label: 'Purple Theme' }
];