import { Component } from '@angular/core';

@Component({
  selector: 'app-citas-component',
  imports: [],
  templateUrl: './citas-component.html',
  styleUrl: './citas-component.scss'
})
export default class CitasComponent {

  flagFilters = true;
  showFilters(flag){
    console.log('flag', flag);
    
    this.flagFilters=flag;
  }

}
