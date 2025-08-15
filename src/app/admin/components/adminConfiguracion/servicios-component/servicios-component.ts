import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../../../services/api-service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UtilService } from '../../../../services/util-service';

@Component({
  selector: 'app-servicios-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicios-component.html',
  styleUrl: './servicios-component.scss',
})
export default class ServiciosComponent {
  flagFilters = true;

  servicios = [
    {
      id: 1,
      nombre: 'Consulta médica general',
      duracion: '30 min',
      intervalo: '10 min',
      estado: 1,
      especialistas: [
        { profesional: 'JP', nombre: 'Juan Peña' },
        { profesional: 'CL', nombre: 'Carlos Lopez' },
      ],
    },
    {
      id: 2,
      nombre: 'Consulta cardiológica',
      duracion: '45 min',
      intervalo: '15 min',
      estado: 1,
      especialistas: [
        { profesional: 'MG', nombre: 'María Granados' },
        { profesional: 'JP', nombre: 'Julian Pintado' },
      ],
    },
    {
      id: 3,
      nombre: 'Consulta dermatológica',
      duracion: '20 min',
      intervalo: '5 min',
      estado: 1,
      especialistas: [{ profesional: 'CL', nombre: 'Celia Langañate' }],
    },
    {
      id: 4,
      nombre: 'Consulta pediátrica',
      duracion: '35 min',
      intervalo: '10 min',
       estado: 0,
      especialistas: [
        { profesional: 'MG', nombre: 'Mario Gualotuña' },
        { profesional: 'AP', nombre: 'Alex Puerta' },
      ],
    },
    {
      id: 5,
      nombre: 'Consulta ginecológica',
      duracion: '40 min',
      intervalo: '15 min',
      estado: 1,
      especialistas: [
        { profesional: 'LR', nombre: 'Leandro Ramirez' },
        { profesional: 'MG', nombre: 'María Granados' },
      ],
    },
    {
      id: 6,
      nombre: 'Consulta neurológica',
      duracion: '50 min',
      intervalo: '20 min',
      estado: 0,
      especialistas: [
        { profesional: 'DS', nombre: 'Dario Saritama' },
        { profesional: 'JP', nombre: 'Juan Peña' },
      ],
    },
    {
      id: 7,
      nombre: 'Consulta oftalmológica',
      duracion: '25 min',
      intervalo: '10 min',
      estado: 1,
      especialistas: [
        { profesional: 'RB', nombre: 'Rubén Benitez' },
        { profesional: 'CL', nombre: 'Celia Langañate' },
      ],
    },
    {
      id: 8,
      nombre: 'Consulta traumatológica',
      duracion: '35 min',
      intervalo: '15 min',
      estado: 1,
      especialistas: [
        { profesional: 'MT', nombre: 'Marco Tandazo' },
        { profesional: 'AP', nombre: 'Alex Pintado' },
        { profesional: 'JP', nombre: 'Juan Peña' },
      ],
    },
    {
      id: 9,
      nombre: 'Consulta psiquiátrica',
      duracion: '60 min',
      intervalo: '30 min',
      estado: 1,
      especialistas: [
        { profesional: 'EM', nombre: 'Eduardo Martinez' },
        { profesional: 'LR', nombre: 'Leandro Ramirez' },
      ],
    },
    {
      id: 10,
      nombre: 'Consulta endocrinológica',
      duracion: '40 min',
      intervalo: '15 min',
      estado: 1,
      especialistas: [
        { profesional: 'NG', nombre: 'Nora Guarniza' },
        { profesional: 'MG', nombre: 'Margo Guachizaca' },
        { profesional: 'CL', nombre: 'Claudia Limones' },
      ],
    },
  ];

  typeS: any;
  modal: any;
  arrayEmpleados = [];
  servicioSelected: any = [];
  constructor(private api: ApiService, private util: UtilService) {}

  //Formulario
  formServicio = new FormGroup({
    nombre: new FormControl(''),
    duracion: new FormControl('15 min'),
    intervalo: new FormControl('5 min'),
    especialistas: new FormControl(''),
    estado: new FormControl(''),
  });

  showFilters(flag) {
    this.flagFilters = flag;
  }
  // utils
  getRandomColor(letter) {
    return this.api.getDualColorObject(letter);
  }

  nameAvatar(name) {
    return this.api.getInitials(name);
  }

  //------------ Modales ------------

  // 1. Crear Servicio
  createEditServicio(type, obj, name) {
    console.log('obj', obj);

    if (type == 'create') {
      this.typeS = type;
      this.modal = this.util.createModal(name);
      this.modal.show();
    } else {
      this.typeS = type;
      this.servicioSelected = obj;
      this.formServicio.controls['nombre'].setValue(obj.nombre);
      this.formServicio.controls['duracion'].setValue(obj.duracion);
      this.formServicio.controls['intervalo'].setValue(obj.intervalo);
      this.formServicio.controls['estado'].setValue(obj.estado);

      for(let o of obj.especialistas){
        this.arrayEmpleados.push(o.nombre)
      }
      console.log('arrayEmpleados', this.arrayEmpleados);
      
      this.modal = this.util.createModal(name);
      this.modal.show();
    }
  }

  // 2. Modal Eliminar Servicio
  deleteServicio(name, obj){
    console.log(obj);
    
    this.servicioSelected = obj;
      this.modal = this.util.createModal(name);
      this.modal.show();
  }
  closeModal() {
    this.arrayEmpleados = [];
    this.servicioSelected=[];
    this.formServicio.reset();
    this.formServicio.controls['duracion'].setValue('15 min');
    this.formServicio.controls['intervalo'].setValue('5 min');
    this.modal.hide();
  }

  addEmpleado(event) {
    let empleado = event.target.value.trim(); // trim automático

    if (!empleado) {
      this.mostrarMensaje('Ingrese un nombre de empleado', 'warning');
      return;
    }

    // Verificar duplicados (case-insensitive)
    const existeEmpleado = this.arrayEmpleados.some(
      (emp) => emp.toLowerCase() === empleado.toLowerCase()
    );

    if (existeEmpleado) {
      this.mostrarMensaje(`"${empleado}" ya está en la lista`, 'info');
      return;
    }

    // Agregar empleado
    this.arrayEmpleados.push(empleado);
    this.mostrarMensaje(`"${empleado}" agregado correctamente`, 'success');

    console.log('Empleados actuales:', this.arrayEmpleados);
    console.log('Total empleados:', this.arrayEmpleados.length);

    // Limpiar input
    event.target.value = '';
  }

  mostrarMensaje(mensaje: string, tipo: string) {
    // Implementa tu sistema de notificaciones aquí
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
  }

  removeEmpleado(empleadoNombre: string) {
    const index = this.arrayEmpleados.indexOf(empleadoNombre);

    if (index === -1) {
      console.log(`Empleado "${empleadoNombre}" no encontrado`);
      return false;
    }

    this.arrayEmpleados.splice(index, 1);
    console.log(`Empleado "${empleadoNombre}" eliminado`);
    console.log('Array actualizado:', this.arrayEmpleados);
    return true;
  }
}
