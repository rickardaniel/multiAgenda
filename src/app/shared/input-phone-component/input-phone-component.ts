import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-input-phone-component',
  imports: [],
  templateUrl: './input-phone-component.html',
  styleUrl: './input-phone-component.scss'
})
export class InputPhoneComponent {

  @Input('tipo') tipo:any;
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

  constructor
  (
private api: ApiService
  )
  {
  }

  ngOnInit(){
  this.getCountries();

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

  selectedCategory = this.selectedCountry;
   countries: any = [];
  countries2: any = [];

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
