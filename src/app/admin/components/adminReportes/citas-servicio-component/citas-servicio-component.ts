import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../../../services/api-service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-citas-servicio-component',
  imports: [],
  templateUrl: './citas-servicio-component.html',
  styleUrl: './citas-servicio-component.scss',
})
export default class CitasServicioComponent {
  flagFilters = true;
  dayToday: any;
  filteredCitasServicio: any[] = []; // 👈 NUEVO: Datos filtrados

  pagination: any;
  all_data: any = [];
  citasServicio: any; // Los datos paginados actuales

  constructor
  (
    private api: ApiService,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef

  
  ) {}

  ngOnInit() {
    this.dayToday = this.generarRangoFechasMes();
    console.log(this.dayToday);
    this.getCitasSesion();
  }

  showFilters(flag) {
    this.flagFilters = flag;
  }

  generarRangoFechasMes(): string {
    const today = new Date();
    const mesAnterior = new Date(today);
    mesAnterior.setMonth(today.getMonth() - 1);

    const formatearFechaES = (fecha: Date): string => {
      return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    const fechaInicio = formatearFechaES(mesAnterior);
    const fechaFin = formatearFechaES(today);

    return `${fechaInicio} - ${fechaFin}`;
  }

  getCitasSesion() {
    this.api.getCitasPorServicio().subscribe({
      next: (resp: any) => {
        console.log('resp', resp);

        // Guardar todos los datos originales
        this.all_data = resp;
        this.filteredCitasServicio = [...resp]; // 👈 Inicialmente, filtrados = todos

        let search = {
          page: 1,
          pageSize: 10,
        };

        this.getCitasServicioFilter(search, this.filteredCitasServicio).then((data: any) => {
          this.citasServicio = data;
          console.log('data ==> ', this.citasServicio);
          this.cdr.detectChanges();
        });
      },
      error(err) {
        console.error('Error:', err);
      },
      complete() {
        console.log('Completado');
      },
    });
  }

  async getCitasServicioFilter(
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

   goToNextPage(pagination, data) {
    console.log('data', data);

    if (pagination.hasNextPage) {
      let search = {
        page: pagination.currentPage + 1,
        pageSize: pagination.pageSize,
      };

      console.log('search', search);

      this.getCitasServicioFilter(search, data).then((datos: any) => {
        console.log('dataos', datos);

        this.citasServicio = datos;
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

      this.getCitasServicioFilter(search, data).then((datos: any) => {
        console.log('dataos', datos);

        this.citasServicio = datos;
        // this.pagination = data.pagination;
        this.cdr.detectChanges();
      });
    }
  }

  // Descargar Excel
  exportTable() {
    const table = document.getElementById('mi-tabla');
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, 'mi-archivo.xlsx');
}
}
