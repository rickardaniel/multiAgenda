import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { InputPhoneComponent } from '../../../../shared/input-phone-component/input-phone-component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HorarioAtencionComponent } from '../../../../shared/configurationFolder/horario-atencion-component/horario-atencion-component';
import { InformacionAdicionalComponent } from '../../../../shared/configurationFolder/informacion-adicional-component/informacion-adicional-component';
import { PlanesComponent } from '../../../../shared/configurationFolder/planes-component/planes-component';

@Component({
  selector: 'app-negocio-component',
  imports: [
    CommonModule,
    InputPhoneComponent,
    ReactiveFormsModule,
    HorarioAtencionComponent,
    InformacionAdicionalComponent,
    PlanesComponent,
  ],
  templateUrl: './negocio-component.html',
  styleUrl: './negocio-component.scss',
})
export default class NegocioComponent {
  // Tipo de Red Social
  tipo = 1;
  socialMedias: FormArray;
  // Una sola variable para el tab activo
  activeTab: number = 1;

  // Configuración de tabs (fácil de mantener)
  tabs = [
    { id: 1, label: 'Información de Empresa', enabled: true },
    { id: 2, label: 'Contactos y Ubicación', enabled: true },
    { id: 3, label: 'Horario de atención', enabled: true },
    { id: 4, label: 'Información Adicional', enabled: true },
    { id: 5, label: 'Planes', enabled: true },
  ];
  formDatosNegocio!: FormGroup;
  // Files Img Bussiness
  imgBusiness: any = [];
  flagBusiness = false;
  pathTempB: any;
  accountSelect: any;
  cuentas: any = [];
  type: any;
  flagAcountSelect = false;
  accountDefault: any;
  urlImgFB: any;
  urlImgBD: any;
  idU:any;

  constructor(private fb: FormBuilder) {
    this.formDatosNegocio = new FormGroup({
      correo: new FormControl(''),
      telefono: new FormControl(''),
      celular: new FormControl(''),
      provincia: new FormControl(''),
      canton: new FormControl(''),
      ciudad: new FormControl(''),
      direccion: new FormControl(''),
      redSocial: this.fb.array([
        this.createSocialMediaGroup(1, 'https://facebook.com/mi-empresa'),
      ]),
    });
  }

  get redSocial() {
    return this.formDatosNegocio.get('redSocial') as FormArray;
  }

  addSocialMedia(): void {
    this.redSocial.push(this.createSocialMediaGroup());
  }

  deleteEvidencia(i: number) {
    this.redSocial.removeAt(i);
  }

  // Función simplificada para seleccionar tab
  selectTab(idTab: number): void {
    const tab = this.tabs.find((t) => t.id === idTab);
    if (tab && tab.enabled) {
      this.activeTab = idTab;
    }
  }

  // Función para verificar si un tab está activo
  isTabActive(tabId: number): boolean {
    return this.activeTab === tabId;
  }

  // Función para verificar si un tab está habilitado
  isTabEnabled(tabId: number): boolean {
    const tab = this.tabs.find((t) => t.id === tabId);
    return tab ? tab.enabled : false;
  }

  // Función para obtener las clases CSS dinámicamente
  getTabClasses(tabId: number): { [key: string]: boolean } {
    const isActive = this.isTabActive(tabId);
    const isEnabled = this.isTabEnabled(tabId);

    return {
      classActive: isActive && isEnabled,
      classInActive: !isActive && isEnabled,
      tabDisabled: !isEnabled,
      'cursor-pointer': isEnabled,
      'cursor-not-allowed': !isEnabled,
    };
  }

  async copyToClipboard(event: Event): Promise<void> {
    try {
      const input = document.getElementById('subdominio') as HTMLInputElement;
      if (!input) throw new Error('Elemento no encontrado');

      await navigator.clipboard.writeText(input.value);
      this.showCopySuccess(event);
    } catch (error) {
      this.showCopyError(event);
    }
  }

  private showCopySuccess(event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button') as HTMLButtonElement;

    if (!button) return;

    const originalHTML: string = button.innerHTML;
    const successIcon: string = `
    <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
    </svg>
  `;

    button.innerHTML = successIcon;
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.disabled = false;
    }, 2000);
  }

  private showCopyError(event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button') as HTMLButtonElement;

    if (!button) return;

    const originalHTML: string = button.innerHTML;
    const errorIcon: string = `
    <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
    </svg>
  `;

    button.innerHTML = errorIcon;

    setTimeout(() => {
      button.innerHTML = originalHTML;
    }, 2000);
  }

  createSocialMediaGroup(tipo: number = 1, url: string = ''): FormGroup {
    return this.fb.group({
      tipo: [tipo], // ✅ Cada elemento tiene su tipo
      url: [url],
    });
  }

  selectSocialMedia(event: any, index: number): void {
    const selectedValue = parseInt(event.target.value);
    // ✅ Solo actualizar el elemento específico
    this.redSocial.at(index).get('tipo')?.setValue(selectedValue);
  }

  seeInputComprobante(flag: boolean) {
    // this.seeComprobante = flag;
  }

 setImgBussiness(event: any) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    
    // Validar el archivo
    const validation = this.validateImageFile(file);
    
    if (!validation.isValid) {
      // this.alert.alertDanger(validation.error!, '');
      console.error('Error de validación:', validation.error);
      this.resetImageValues(event.target);
      return;
    }

    // Procesar archivo válido
    this.imgBusiness = file;
    this.pathTempB = URL.createObjectURL(this.imgBusiness);
    this.flagBusiness = true;

    // Generar las URLs
    this.urlImgFB = `business/${this.idU}/suscripcion/${this.imgBusiness.name}`;
    this.urlImgBD = `business%2F${this.idU}%2Fsuscripcion%2F${this.imgBusiness.name}`;
    
    console.log('Archivo procesado exitosamente:', {
      name: this.imgBusiness.name,
      size: `${(this.imgBusiness.size / (1024 * 1024)).toFixed(2)}MB`,
      type: this.imgBusiness.type
    });
  }
}

// Función de utilidad para validar imágenes
private validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Validación de tamaño - 5MB máximo
  const maxSize = 5 * 1024 * 1024; // 5MB en bytes
  if (file.size > maxSize) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        alert(`El archivo es demasiado grande (${sizeInMB}MB). El tamaño máximo permitido es 5MB.`)

    return {
      isValid: false,
      error: `El archivo es demasiado grande (${sizeInMB}MB). El tamaño máximo permitido es 5MB.`
    };
  }

  // Validación de tipos de archivo
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  
  const isValidType = allowedTypes.includes(file.type);
  const isValidExtension = allowedExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );

  if (!isValidType && !isValidExtension) {
    return {
      isValid: false,
      error: 'Solo se permiten archivos JPG, JPEG y PNG. Por favor, seleccione un formato válido.'
    };
  }

  return { isValid: true };
}

private resetImageValues(fileInput?: HTMLInputElement) {
  this.imgBusiness = {};
  this.flagBusiness = false;
  this.pathTempB = '';
  
  if (fileInput) {
    fileInput.value = '';
  }
}


      deleteImg() {
      this.imgBusiness = [];
      this.flagBusiness = false;
    }
}
