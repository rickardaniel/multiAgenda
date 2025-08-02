import { Injectable,  } from '@angular/core';
export interface CombinedCountry {
  nameES?: string;
  nameEN?: string;
  iso2: string;
  iso3?: string;
  phoneCode?: string;
  name?: string;
  emoji?: string;
  unicode?: string;
  image?: string;
}


@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() {}

}



// Interface para el resultado combinado


