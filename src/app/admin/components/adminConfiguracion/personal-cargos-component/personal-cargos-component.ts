import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UtilService } from '../../../../services/util-service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../../services/api-service';
import { HorarioAtencionComponent } from "../../../../shared/configurationFolder/horario-atencion-component/horario-atencion-component";
import { InputPhoneComponent } from '../../../../shared/input-phone-component/input-phone-component';

@Component({
  selector: 'app-personal-cargos-component',
  imports: [CommonModule, ReactiveFormsModule, HorarioAtencionComponent, InputPhoneComponent],
  templateUrl: './personal-cargos-component.html',
  styleUrl: './personal-cargos-component.scss',
})
export default class PersonalCargosComponent {
  activeTab: number = 1;
  cargos = [
    {
      id: 1,
      nombre: 'Médico General',
      descripcion: 'Consulta médica general',
      asignados: 3,
    },
    {
      id: 2,
      nombre: 'Cardiólogo',
      descripcion: 'Especialista en cardiología',
      asignados: 2,
    },
    {
      id: 3,
      nombre: 'Traumatólogo',
      descripcion: 'Especialista en traumatología',
      asignados: 2,
    },
    {
      id: 4,
      nombre: 'Dermatólogo',
      descripcion: 'Especialista en dermatología ',
      asignados: 1,
    },
  ];

  // Configuración de tabs (fácil de mantener)
  tabs = [
    { id: 1, label: 'Cargos o  Especialidades', enabled: true },
    { id: 2, label: 'Empleados o Especialidades', enabled: true },
  ];

  especialidades:any=[];
  modal: any;
  typeC: any;
  typeE: any;
  cargoSelected: any = [];
  empleadoSelected: any = [];

  cardEmpleados: any = [];

  constructor(private util: UtilService, private api: ApiService) {}

  ngOnInit() {
    this.getEmpleados();
    this.getEspecialidades();
  }

  // utils
  getRandomColor(letter) {
    return this.api.getDualColorObject(letter);
  }

  nameAvatar(name) {
    return this.api.getInitials(name);
  }

    getEspecialidades() {
    this.api.getEspecialidades().subscribe({
      next: (resp: any) => {
        console.log('especialidades', resp);
        this.especialidades = resp;
      },
    });
  }

  getEmpleados() {
    this.api.getMedicos().subscribe({
      next: (resp: any) => {
        console.log('resp');
        for (let i = 0; i < 6; i++) {
          this.cardEmpleados.push(resp[i]);
        }
        console.log('EMPLEADOS', this.cardEmpleados);
      },
      error(err) {},
      complete() {},
    });
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

  // ------------ Form Agregar Editar Orden ------------

  formCargo = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl(''),
  });

  formEmpleado = new FormGroup({
    nombres: new FormControl('', Validators.required),
    apellidos: new FormControl('', Validators.required),
    correo: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    cargo: new FormControl('', Validators.required), 
    estado: new FormControl(1),
  });

  // ------------ Métodos Agregar Editar Orden ------------

  openModal(name, obj){
    this.empleadoSelected = obj;
     this.modal = this.util.createModal(name);
      this.modal.show();
  }

  // 1. Crear Cargo
  createEditC(type, obj, name) {
    if (type == 'create') {
      this.typeC = type;
      this.modal = this.util.createModal(name);
      this.modal.show();
    } else {
      this.typeC = type;
      // this.cargoSelected=obj;
      this.formCargo.setValue({
        nombre: obj.nombre,
        descripcion: obj.descripcion,
      });
      this.modal = this.util.createModal(name);
      this.modal.show();
    }
  }

  // 2. Crear Empleado
  createEditEmpleado(type, obj, name) {
    console.log('obj', obj);
    
    if (type == 'create') {
      this.typeE = type;
      this.modal = this.util.createModal(name);
      this.modal.show();
    } else {
      this.typeE = type;
      this.formEmpleado.setValue({
        nombres: obj.nombre,
        apellidos: obj.nombre,
        correo: obj.email,
        telefono: obj.telefono,
        cargo: obj.especialidad,
        estado: 1,
      });
      this.modal = this.util.createModal(name);
      this.modal.show();
    }
  }

  closeModal() {
    this.modal.hide();
  }

  deleteModal(type, obj, name) {
    this.cargoSelected=[];
    this.empleadoSelected=[];
    if (type == 'cargo') {
      this.cargoSelected = obj;
      this.modal = this.util.createModal(name);
      this.modal.show();
    }else{
      this.empleadoSelected = obj;
      this.modal = this.util.createModal(name);
      this.modal.show();
    }
  }
}
