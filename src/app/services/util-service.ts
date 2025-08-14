import { Injectable } from '@angular/core';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

   createModal(modal: any) {
    const $modalElement: HTMLElement | any = document.querySelector(modal);

    const modalOptions: ModalOptions = {
      placement: 'center',
      backdrop: 'static',
      backdropClasses:
        'bg-gray-500/50 dark:bg-gray-500/80 fixed inset-0 z-40',
      closable: false,
    };

    const modalF: ModalInterface = new Modal($modalElement, modalOptions);
    return modalF;
    // modalF.show();
  }
  
}
