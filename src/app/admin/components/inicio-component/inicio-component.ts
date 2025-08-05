import { Component } from '@angular/core';
import CalendarComponetn from '../../../shared/calendar/calendar-components';
import { BigCalendarComponent } from '../../../shared/big-calendar-component/big-calendar-component';

@Component({
  selector: 'app-inicio-component',
  imports: [CalendarComponetn, BigCalendarComponent],
  templateUrl: './inicio-component.html',
  styleUrl: './inicio-component.scss'
})
export default class InicioComponent {

}
