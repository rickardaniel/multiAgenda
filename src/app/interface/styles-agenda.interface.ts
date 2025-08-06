// Interface para tipar los datos
export interface Professional {
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Appointment {
  id: number;
  professional: Professional;
  specialty: string;
  timeSlot: string;
  status: 'completada' | 'en-proceso' | 'confirmada' | 'pendiente' | 'cancelada';
  statusText: string;
}


// Interface para tipar los datos
export interface Professional {
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Appointment {
  id: number;
  professional: Professional;
  specialty: string;
  timeSlot: string;
  status: 'completada' | 'en-proceso' | 'confirmada' | 'pendiente' | 'cancelada';
  statusText: string;
}



// Función auxiliar para obtener íconos de estado
export function getStatusIcon(status: string): string {
  const icons: { [key: string]: string } = {
    'completada': '✓',
    'en-proceso': '◐',
    'confirmada': '✓',
    'pendiente': '!',
    'cancelada': '✕'
  };
  return icons[status] || '•';
}

// Clases CSS para los colores de avatar
export const avatarColors = {
  'avatar-blue': '#3b82f6',
  'avatar-purple': '#8b5cf6',
  'avatar-green': '#10b981',
  'avatar-orange': '#f97316',
  'avatar-teal': '#14b8a6',
  'avatar-pink': '#ec4899',
  'avatar-red': '#ef4444'
};
export const stateColorsStrong = {
  'blue-s': '#76A9FA',
  'purple-s': '#9061F9',
  'green-s': '#31C48D',
  'orange-s': '#FF9000',
  'teal-s': '#14b8a6',
  'yellow-s': '#FACA15',
  'red-s': '#E02424'
};
export const stateColorsNormal = {
  'blue-n': '#cffafe',
  'purple-n': '#EDEBFE',
  'green-n': '#E5FFE9',
  'orange-n': '#FFF5E5',
  'teal-n': '#14b8a6',
  'yellow-n': '#FDFDEA',
  'red-n': '#FDF2F2'
};