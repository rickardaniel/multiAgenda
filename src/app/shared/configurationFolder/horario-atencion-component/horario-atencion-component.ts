import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

interface TimeSlot {
  start: string;
  end: string;
}

interface ScheduleData {
  [key: string]: TimeSlot[];
}

interface DayConfig {
  name: string;
  key: string;
  enabled: boolean;
}

@Component({
  selector: 'app-horario-atencion-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './horario-atencion-component.html',
  styleUrl: './horario-atencion-component.scss'
})
export class HorarioAtencionComponent {
  scheduleForm!: FormGroup;
  scheduleResult: string | null = null;

  days: DayConfig[] = [
    { name: 'Lunes', key: 'lunes', enabled: false },
    { name: 'Martes', key: 'martes', enabled: false },
    { name: 'Miércoles', key: 'miercoles', enabled: false },
    { name: 'Jueves', key: 'jueves', enabled: false },
    { name: 'Viernes', key: 'viernes', enabled: false },
    { name: 'Sábado', key: 'sabado', enabled: false },
    { name: 'Domingo', key: 'domingo', enabled: false }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
  }

  private initializeForm(): void {
    const formConfig: any = {};

    // Crear controles para cada día
    this.days.forEach(day => {
      formConfig[day.key + 'Enabled'] = [false];
      formConfig[day.key + 'Slots'] = this.fb.array([]);
    });

    this.scheduleForm = this.fb.group(formConfig);
  }

  private setupFormSubscriptions(): void {
    // Suscribirse a cambios en los checkboxes
    this.days.forEach(day => {
      const enabledControl = this.scheduleForm.get(day.key + 'Enabled');
      enabledControl?.valueChanges.subscribe(enabled => {
        if (enabled) {
          // Si se habilita el día y no tiene franjas, agregar una por defecto
          const slotsArray = this.getDaySlots(day.key);
          if (slotsArray.length === 0) {
            this.addTimeSlot(day.key, '08:00', '17:00');
          }
        } else {
          // Si se deshabilita el día, limpiar las franjas
          this.clearDaySlots(day.key);
        }
      });
    });

    // Suscribirse a cambios en las franjas horarias para actualizar el estado
    this.days.forEach(day => {
      const slotsArray = this.getDaySlots(day.key);
      slotsArray.valueChanges.subscribe(() => {
        // Trigger change detection para actualizar el estado del día
      });
    });
  }

  getDaySlots(dayKey: string): FormArray {
    return this.scheduleForm.get(dayKey + 'Slots') as FormArray;
  }

  isDayEnabled(dayKey: string): boolean {
    return this.scheduleForm.get(dayKey + 'Enabled')?.value || false;
  }

  addTimeSlot(dayKey: string, startTime: string = '08:00', endTime: string = '17:00'): void {
    const slotsArray = this.getDaySlots(dayKey);
    const timeSlotGroup = this.fb.group({
      start: [startTime],
      end: [endTime]
    });
    slotsArray.push(timeSlotGroup);
  }

  removeTimeSlot(dayKey: string, index: number): void {
    const slotsArray = this.getDaySlots(dayKey);
    slotsArray.removeAt(index);

    // Si no quedan franjas, deshabilitar el día
    if (slotsArray.length === 0) {
      this.scheduleForm.get(dayKey + 'Enabled')?.setValue(false);
    }
  }

  private clearDaySlots(dayKey: string): void {
    const slotsArray = this.getDaySlots(dayKey);
    while (slotsArray.length !== 0) {
      slotsArray.removeAt(0);
    }
  }

  getDayStatus(dayKey: string): string {
    if (!this.isDayEnabled(dayKey)) {
      return 'Día no disponible';
    }

    const slotsArray = this.getDaySlots(dayKey);
    if (slotsArray.length === 0) {
      return 'Configurar horarios';
    }

    const timeStrings: string[] = [];
    slotsArray.controls.forEach(control => {
      const start = control.get('start')?.value;
      const end = control.get('end')?.value;
      if (start && end) {
        timeStrings.push(`${start} - ${end}`);
      }
    });

    return timeStrings.length > 0 ? timeStrings.join(', ') : 'Configurar horarios';
  }

  getScheduleData(): void {
    const schedule: ScheduleData = {};

    this.days.forEach(day => {
      if (this.isDayEnabled(day.key)) {
        const slotsArray = this.getDaySlots(day.key);
        const slots: TimeSlot[] = [];

        slotsArray.controls.forEach(control => {
          const start = control.get('start')?.value;
          const end = control.get('end')?.value;
          if (start && end) {
            slots.push({ start, end });
          }
        });

        if (slots.length > 0) {
          schedule[day.key] = slots;
        }
      }
    });

    this.scheduleResult = JSON.stringify(schedule, null, 2);
    console.log('Horario configurado:', schedule);
  }

  // Métodos para optimización del trackBy
  trackByDay(index: number, day: DayConfig): string {
    return day.key;
  }

  trackBySlot(index: number, slot: any): number {
    return index;
  }
}
