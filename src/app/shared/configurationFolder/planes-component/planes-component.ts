import { Component } from '@angular/core';
import { UtilService } from '../../../services/util-service';

@Component({
  selector: 'app-planes-component',
  imports: [],
  templateUrl: './planes-component.html',
  styleUrl: './planes-component.scss',
})
export class PlanesComponent {
  constructor(private util: UtilService) {}
  modal :any;
  flagSuscription=false;
  openModal(name) {
    this.modal = this.util.createModal(name);
    this.modal.show();
  }

  closeModal() {
    // let modal = this.util.createModal(name);
    this.modal.hide();
  }

  suscriptionRenew(flag){
    this.closeModal();
    this.flagSuscription=flag;

  }
}
