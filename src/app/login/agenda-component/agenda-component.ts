import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import CalendarComponent from '../../shared/calendar/calendar-components';
import { CommonModule } from '@angular/common';
import { CombinedCountry, } from '../../services/scroll-service';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api-service';
interface FooterLink {
  text: string;
  url: string;
}
@Component({
  selector: 'app-agenda-component',
  imports: [CommonModule, CalendarComponent, FormsModule],
  templateUrl: './agenda-component.html',
  styleUrl: './agenda-component.scss'
})
export default class AgendaComponent {
  currentYear = new Date().getFullYear();
  appVersion = '0.0.43';
  flagStepOne = true;
  flagStepTwo = false;
  flagStepThree = false;
  flagClassOverflow = false;

  //Botón Activo
  colorButtonOne = false;

  horarios = [
    { 'id': 1, 'horaI': '09:00', 'horaF': '09:30' },
    { 'id': 2, 'horaI': '09:30', 'horaF': '10:00' },
    { 'id': 3, 'horaI': '10:00', 'horaF': '10:30' },
    { 'id': 4, 'horaI': '10:30', 'horaF': '11:00' },
    { 'id': 5, 'horaI': '11:00', 'horaF': '11:30' },
  ]

  // Enlaces del footer
  footerLinks: FooterLink[] = [
    { text: 'Políticas de Privacidad', url: '#' },
    { text: 'Términos y Condiciones', url: '#' },
    { text: 'Sobre Nosotros', url: '#' },
    { text: 'Contacto', url: '#' }
  ];
  @ViewChild('Horarios') horariosRef!: ElementRef<HTMLDivElement>;
  selectedScheduleId: number | null = null;

  selectedCountry = {
    "nameES": "Ecuador",
    "nameEN": "Ecuador",
    "iso2": "EC",
    "iso3": "ECU",
    "phoneCode": "593",
    "name": "Ecuador",
    "emoji": "🇪🇨",
    "unicode": "U+1F1EA U+1F1E8",
    "image": "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EC.svg"
  };






  selectedCategory = this.selectedCountry;
  dropdownOpen = false;
  searchTerm = '';



  // countries:any=[];

  countries: any = [];
  countries2: any = [];

  constructor
    (
      private router: Router,
      private api: ApiService,

    ) {

  }

  ngOnInit() {
    this.getCountries();
  }
  goToPage() {
    this.router.navigateByUrl('');
  }



  backStepOne() {
    this.flagStepOne = true;
    this.flagStepTwo = false;
    this.flagStepThree = false;
  }
  backStepTwo() {
    this.flagStepOne = false;
    this.flagStepTwo = true;
    this.flagStepThree = false;
  }
  nextStepTwo() {
    this.flagStepOne = false;
    this.flagStepTwo = true;
    this.flagStepThree = false;
  }
  nextStepThree() {
    this.flagStepOne = false;
    this.flagStepTwo = false;
    this.flagStepThree = true;
  }

  detectDate(event) {
    console.log('event', event);
    if (event) {
      console.log('entra');

      this.flagClassOverflow = true;

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
        block: 'center',           // Cambio: 'center' es más suave que 'end'
        inline: 'nearest'
      });
    }, 300);  // Cambio: 300ms en lugar de 600ms (más rápido)
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
    const baseClasses = 'cursor-pointer w-full rounded-lg py-3.5 text-xs transition-all duration-200';
    if (this.isSelected(horarioId)) {
      // Clases para botón seleccionado
      this.colorButtonOne = true;
      return `${baseClasses} bg-red-500 text-white shadow-lg`;
    } else {
      // Clases para botón no seleccionado
      return `${baseClasses} bg-transparent hover:bg-white hover:shadow-md shadow border border-gray-300`;
    }
  }

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

  search() {
    console.log('Buscando:', this.searchTerm, 'en:', this.selectedCategory);
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

      }
    })
  }

  searchCountry(event) {
    console.log('event', event.target.value);
    let texto = event.target.value;
    texto = texto.toLowerCase();
    console.log('PALABRA ', texto);

    if (texto.length > 0) {
      console.log('entra');
      this.countries = this.countries2.filter((item: any) => {
        return (item.name.toLowerCase())
          .includes(texto)
      })

    } else {
      this.countries = this.countries2;
    }

  }



}
