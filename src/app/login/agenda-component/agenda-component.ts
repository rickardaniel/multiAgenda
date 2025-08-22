import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import CalendarComponent from '../../shared/calendar/calendar-components';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../services/api-service';
import FooterComponent from '../../shared/footer-component/footer-component';

@Component({
  selector: 'app-agenda-component',
  imports: [
    CommonModule,
    CalendarComponent,
    ReactiveFormsModule,
    FooterComponent,
  ],
  templateUrl: './agenda-component.html',
  styleUrl: './agenda-component.scss',
})
export default class AgendaComponent implements AfterViewInit {
  flagStepOne = true;
  flagStepTwo = false;
  flagStepThree = false;
  flagStepFour = false;
  flagClassOverflow = false;
  dateSelected: any;
  //Botón Activo
  colorButtonOne = false;

  horarios = [
    { id: 1, horaI: '09:00', horaF: '09:30' },
    { id: 2, horaI: '09:30', horaF: '10:00' },
    { id: 3, horaI: '10:00', horaF: '10:30' },
    { id: 4, horaI: '10:30', horaF: '11:00' },
    { id: 5, horaI: '11:00', horaF: '11:30' },
  ];

  @ViewChild('Horarios') horariosRef!: ElementRef<HTMLDivElement>;
  selectedScheduleId: number | null = null;

  selectedCountry = {
    nameES: 'Ecuador',
    nameEN: 'Ecuador',
    iso2: 'EC',
    iso3: 'ECU',
    phoneCode: '593',
    name: 'Ecuador',
    emoji: '🇪🇨',
    unicode: 'U+1F1EA U+1F1E8',
    image:
      'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EC.svg',
  };

  selectedCategory = this.selectedCountry;
  dropdownOpen = false;
  searchTerm = '';
  countries: any = [];
  countries2: any = [];
  especialidades: any = [];
  profesionales: any = [];
  profesionalesAvaible: any = [];
  flagTerms = false;

  constructor(private router: Router, private api: ApiService) { }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.getCountries();
    this.getEspecialidades();
    this.getMedicos();
  }
  goToPage() {
    this.router.navigateByUrl('');
  }

  resetAll() {
    this.flagStepOne = true;
    this.flagStepTwo = false;
    this.flagStepThree = false;
    this.flagStepFour = false;
    this.formInfoCita.reset();
    this.formInfoCita.controls['especialidad'].setValue('');
    this.formInfoCita.controls['medico'].setValue('');
    this.selectedScheduleId=null;
    this.flagClassOverflow=false;
    this.formInfoUser.reset();
    
  }
  backStepOne() {
    this.flagStepOne = true;
    this.flagStepTwo = false;
    this.flagStepThree = false;
    this.flagStepFour = false;
  }
  backStepTwo() {
    this.flagStepOne = false;
    this.flagStepTwo = true;
    this.flagStepThree = false;
    this.flagStepFour = false;

  }
  nextStepTwo() {
    this.flagStepOne = false;
    this.flagStepTwo = true;
    this.flagStepThree = false;
    this.flagStepFour = false;

  }
  nextStepThree() {
    this.flagStepOne = false;
    this.flagStepTwo = false;
    this.flagStepThree = true;
    this.flagStepFour = false;

  }
  nextStepFour() {
    this.flagStepOne = false;
    this.flagStepTwo = false;
    this.flagStepThree = false;
    this.flagStepFour = true;

  }

  detectDate(event) {
    this.dateSelected = '';
    if (event) {
      console.log('entra');
      console.log('event', event.target?.value);
      this.flagClassOverflow = true;
      this.dateSelected = event.target?.value;
      console.log('horarios', this.horariosRef);

      if (this.horariosRef) {
        this.scrollToHorarios();
      }
    }
  }

  scrollToElement($element: any): void {
    setTimeout(() => {
      $element.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Cambio: 'center' es más suave que 'end'
        inline: 'nearest',
      });
    }, 300); // Cambio: 300ms en lugar de 600ms (más rápido)
  }

  scrollToHorarios(): void {
    if (this.horariosRef) {
      this.scrollToElement(this.horariosRef.nativeElement);
    }
  }

  selectSchedule(horario: any): void {
    this.selectedScheduleId = horario.id;
    // Aquí puedes agregar tu lógica adicional

  }

  // Método helper para verificar si un horario está seleccionado
  isSelected(horarioId: number): boolean {
    return this.selectedScheduleId === horarioId;
  }

  // Método para obtener las clases del botón dinámicamente
  getButtonClasses(horarioId: number): string {
    const baseClasses =
      'cursor-pointer w-full rounded-lg py-3.5 text-xs transition-all duration-200';
    if (this.isSelected(horarioId)) {
      // Clases para botón seleccionado
      this.colorButtonOne = true;
      return `${baseClasses} bg-red-500 text-white shadow-lg`;
    } else {
      // Clases para botón no seleccionado
      return `${baseClasses} bg-transparent hover:bg-white hover:shadow-md shadow border border-gray-300`;
    }
  }



  // Form First Part Select medic and especiality

  formInfoCita = new FormGroup({
    especialidad: new FormControl('', Validators.required),
    medico: new FormControl(''),
  });
  // Form Second Part Info User

  formInfoUser = new FormGroup({
    cedula: new FormControl('', Validators.required),
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
  });

  selectCountry(country: any) {
    this.selectedCountry = country;
  }

  getFullPhoneNumber(): string {
    return this.selectedCountry.phoneCode;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.dropdownOpen = false;
    this.countries = this.countries2;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  getCountries() {
    this.api.getCountries().subscribe({
      next: (resp: any) => {
        console.log('resp', resp);
        this.countries = resp;
        this.countries2 = resp;
      },
    });
  }
  getEspecialidades() {
    this.api.getEspecialidades().subscribe({
      next: (resp: any) => {
        console.log('especialidades', resp);
        this.especialidades = resp;
      },
    });
  }
  getMedicos() {
    this.api.getMedicos().subscribe({
      next: (resp: any) => {
        console.log('resp', resp);
        this.profesionales = resp;
      },
    });
  }

  searchCountry(event) {
    console.log('event', event.target.value);
    let texto = event.target.value;
    texto = texto.toLowerCase();
    console.log('PALABRA ', texto);

    if (texto.length > 0) {
      console.log('entra');
      this.countries = this.countries2.filter((item: any) => {
        return item.name.toLowerCase().includes(texto);
      });
    } else {
      this.countries = this.countries2;
    }
  }

  selectEspecialidad(event) {
    let resul = event.target.value;
    console.log('result', resul);

    this.profesionalesAvaible = this.api.getMedicosPorEspecialidad(
      resul,
      this.profesionales
    );
    this.formInfoCita.controls['medico'].setValue('');
    console.log('medicosAvaible', this.profesionalesAvaible);
  }

  getNameEspeciality(id) {
    const especialidad = this.especialidades.find(
      (especialidad) => especialidad.id === parseInt(id)
    );
    return especialidad ? especialidad.nombre : null;
  }

  getNameProfetional(id) {
    const profesionales = this.profesionalesAvaible.find(
      (profesional) => profesional.id === parseInt(id)
    );
    return profesionales ? profesionales.nombre : null;
  }

  getSchedule(id) {
    const horarios = this.horarios.find(
      (horario) => horario.id === parseInt(id)
    );
    return horarios ? horarios.horaI + ' ' + horarios.horaF : null;
  }

  accepTerms(event) {
    console.log(event.target.value);
    if (event.target.value == '1') {
      this.flagTerms = true;
    } else {
      this.flagTerms = false;
    }
  }
}
