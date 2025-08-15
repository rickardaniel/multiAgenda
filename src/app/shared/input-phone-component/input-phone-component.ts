import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-phone-component',
  imports: [ReactiveFormsModule],
  templateUrl: './input-phone-component.html',
  styleUrl: './input-phone-component.scss',
})
export class InputPhoneComponent implements OnChanges  {
  @Input('tipo') tipo: any;
  @Input('phone') phone: any;

  dropdownOpen = false;

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
  countries: any = [];
  countries2: any = [];

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('detect changes', changes);
    this.formPhone.setValue({
      phone: changes['phone'].currentValue
    })

    console.log('form', this.formPhone.value);
    
    
  }

  ngOnInit() {
    this.getCountries();
    console.log('phone', this.phone);
    
  }

  formPhone = new FormGroup({
    phone: new FormControl(''),
  });

  getCountries() {
    this.api.getCountries().subscribe({
      next: (resp: any) => {
        console.log('resp', resp);
        this.countries = resp;
        this.countries2 = resp;
      },
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
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

  selectCategory(category: any) {
    this.selectedCategory = category;
    this.dropdownOpen = false;
    this.countries = this.countries2;
  }
}
