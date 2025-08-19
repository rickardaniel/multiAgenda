import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api-service';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../../services/util-service';
import { InputPhoneComponent } from "../../../shared/input-phone-component/input-phone-component";

@Component({
  selector: 'app-clientes-component',
  imports: [CommonModule, InputPhoneComponent],
  templateUrl: './clientes-component.html',
  styleUrl: './clientes-component.scss',
})
export default class ClientesComponent implements OnInit {
  flagFilters = true;
  pagination: any;
  all_clientes: any = [];
  clientes: any; // Los datos paginados actuales
  // allCitas: any[] = []; // Todos los datos originales
  filteredClientes: any[] = []; // 👈 NUEVO: Datos filtrados
  currentServiceFilter: string = ''; // 👈 NUEVO: Filtro actual
  modal: any;

  constructor(
    private api: ApiService,
    private util: UtilService,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getClients();
    // this.getRandomColor('RC');
  }

  getClients() {
    this.api.getClientes().subscribe({
      next: (resp: any) => {
        console.log('resp', resp);

        // Guardar todos los datos originales
        this.all_clientes = resp;
        this.filteredClientes = [...resp]; // 👈 Inicialmente, filtrados = todos

        let search = {
          page: 1,
          pageSize: 10,
        };

        this.getClientesFilter(search, this.filteredClientes).then(
          (data: any) => {
            this.clientes = data;
            console.log('data ==> ', this.clientes);
            this.cdr.detectChanges();
          }
        );
      },
      error(err) {
        console.error('Error:', err);
      },
      complete() {
        console.log('Completado');
      },
    });
  }

  async getClientesFilter(
    params: PaginationParams,
    data
  ): Promise<PaginatedResponse<Cita>> {
    // Simular delay de API

    // ===== PAGINACIÓN =====
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / params.pageSize);
    const currentPage = Math.max(1, Math.min(params.page, totalPages));
    const startIndex = (currentPage - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    // ===== RESPUESTA =====
    return {
      data: paginatedData,
      pagination: {
        currentPage,
        pageSize: params.pageSize,
        totalItems,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  showFilters(flag) {
    this.flagFilters = flag;
  }

  nameAvatar(name) {
    return this.api.getInitials(name);
  }

  goToNextPage(pagination, data) {
    console.log('data', data);

    if (pagination.hasNextPage) {
      let search = {
        page: pagination.currentPage + 1,
        pageSize: pagination.pageSize,
      };

      console.log('search', search);

      this.getClientesFilter(search, data).then((datos: any) => {
        console.log('dataos', datos);

        this.clientes = datos;
        // this.pagination = data.pagination;
        this.cdr.detectChanges();
      });
    }
  }

  goToPreviousPage(pagination, data) {
    if (pagination.hasPreviousPage) {
      // this.getCitas(pagination.currentPage - 1, pagination.pageSize);
      let search = {
        page: pagination.currentPage - 1,
        pageSize: pagination.pageSize,
      };

      console.log('search', search);
      console.log('search', data);

      this.getClientesFilter(search, data).then((datos: any) => {
        console.log('dataos', datos);

        this.clientes = datos;
        // this.pagination = data.pagination;
        this.cdr.detectChanges();
      });
    }
  }

  getRandomColor(letter) {
    return this.api.getDualColorObject(letter);
  }

  crearEditarClientes(type, obj, name) {
    if (type == 'create') {
      this.modal = this.util.createModal(name);
      this.modal.show();
    } else {
      // Lógica para editar
    }
  }

  closeModal() {
    this.modal.hide();
  }
}
