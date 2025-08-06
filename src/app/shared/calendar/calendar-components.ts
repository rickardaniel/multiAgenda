import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es.js'; // Importa el idioma español
import { Instance } from 'flatpickr/dist/types/instance';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-components.html',
  styleUrl: './calendar-components.scss',
  providers: [],
})
export default class CalendarComponetn
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @ViewChild('calendarContainer', { static: true })
  calendarContainer!: ElementRef;
  @ViewChild('dateInput') dateInput!: ElementRef;
  @Input() dateFormat = 'Y-m-d';
  @Input() enableTime = false;
  @Input() minDate?: string;
  @Input() maxDate?: string;
  @Input() mode: 'single' | 'multiple' | 'range' = 'single';
  @Input() defaultDate?: string | Date | Date[];

  @Output() dateChange = new EventEmitter<string | Date | Date[]>();
  @Output() dateSelect = new EventEmitter<string | Date | Date[]>();
  today= new Date();
  // private flatpickrInstance: any;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  private flatpickrInstance!: Instance;
  selectedDate: string = '';

  ngOnInit() {
    this.initializeFlatpickr();
    //  this.initFlatpickr();
     this.dateSelect.emit(this.today);
  }

  ngAfterViewInit() {
    // Aquí inicializas Flatpickr
    this.initializeFlatpickr();
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }

  initFlatpickr() {
    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      dateFormat: 'm-d-Y',
      mode: this.mode,
      locale: Spanish,
      onChange: (selectedDates, dateStr) => {
        this.selectedDate = dateStr;
        console.log('Fecha seleccionada:', dateStr);
      },
    });
  }

  private initializeFlatpickr() {
    const options: any = {
      inline: true, // Esto hace que aparezca sin input
      // dateFormat: this.dateFormat,
      dateFormat: 'm-d-Y',
      mode: this.mode,
      locale: Spanish,
      defaultDate: this.today,
      // minDate: 'today',

      onChange: (selectedDates: Date[], dateStr: string) => {
        let value: string | Date | Date[] = dateStr;

        if (this.mode === 'multiple' || this.mode === 'range') {
          value = selectedDates;
        } else if (selectedDates.length > 0) {
          value = selectedDates[0];
        }

        this.onChange(value);
        this.dateChange.emit(value);
        this.dateSelect.emit(value);
        
      },
    };

    // Añadir opciones condicionales
    // if (this.enableTime) {
    //   options.enableTime = true;
    //   options.time_24hr = true;
    // }

    // if (this.minDate) {
    //   options.minDate = this.minDate;
    // }

    // if (this.maxDate) {
    //   options.maxDate = this.maxDate;
    // }

    // if (this.defaultDate) {
    //   options.defaultDate = this.defaultDate;
    // }

    this.flatpickrInstance = flatpickr(
      this.calendarContainer.nativeElement,
      options
    );
     this.dateSelect.emit(this.today);
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (this.flatpickrInstance && value) {
      this.flatpickrInstance.setDate(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Para calendario inline, podrías ocultar/mostrar el componente
    if (this.calendarContainer) {
      this.calendarContainer.nativeElement.style.pointerEvents = isDisabled
        ? 'none'
        : 'auto';
      this.calendarContainer.nativeElement.style.opacity = isDisabled
        ? '0.5'
        : '1';
    }
  }

  // Métodos públicos
  clear(): void {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.clear();
    }
  }

  setDate(date: string | Date | Date[]): void {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.setDate(date);
    }
  }

  getSelectedDates(): Date[] {
    return this.flatpickrInstance ? this.flatpickrInstance.selectedDates : [];
  }

  jumpToDate(date: string | Date): void {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.jumpToDate(date);
    }
  }

  selectDay(event) {
    console.log('event', event);

    this.dateSelect.emit(event);
  }
}
