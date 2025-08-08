import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../../services/api-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-citas-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './citas-component.html',
  styleUrl: './citas-component.scss',
})
export default class CitasComponent implements AfterViewInit {
  flagFilters = true;
  pagination: any;
  all_data: any = [];
  citas: any; // Los datos paginados actuales
  filteredCitas: any[] = []; // 👈 NUEVO: Datos filtrados
  currentServiceFilter: string = ''; // 👈 NUEVO: Filtro actual
  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.getCitas();
  }

  getCitas() {
    this.api.getCitas().subscribe({
      next: (resp: any) => {
        console.log('resp', resp);

        // Guardar todos los datos originales
        this.all_data = resp;
        this.filteredCitas = [...resp]; // 👈 Inicialmente, filtrados = todos

        let search = {
          page: 1,
          pageSize: 10,
        };

        this.getCitasFilter(search, this.filteredCitas).then((data: any) => {
          this.citas = data;
          console.log('data ==> ', this.citas);
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

  async getCitasFilter(
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

  getStatusClass(status: string): string {
    return this.api.getStatusClass(status);
  }

  // ===== MÉTODO PARA GENERAR PÁGINAS VISIBLES =====
  getVisiblePages(pagination): (number | any)[] {
    const currentPage = pagination?.currentPage;
    const totalPages = pagination?.totalPages;
    const pages: (number | any)[] = [];

    if (totalPages <= 7) {
      // Si hay 7 o menos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas con puntos suspensivos
      if (currentPage <= 4) {
        // Inicio: 1 2 3 4 5 ... 10
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Final: 1 ... 6 7 8 9 10
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        // Medio: 1 ... 4 5 6 ... 10
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
  }

  // ===== NAVEGACIÓN =====

  formService = new FormGroup({
    especialidad: new FormControl(''),
  });

  goToNextPage(pagination, data) {
    console.log('data', data);

    if (pagination.hasNextPage) {
      let search = {
        page: pagination.currentPage + 1,
        pageSize: pagination.pageSize,
      };

      console.log('search', search);

      this.getCitasFilter(search, data).then((datos: any) => {
        console.log('dataos', datos);

        this.citas = datos;
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

      this.getCitasFilter(search, data).then((datos: any) => {
        console.log('dataos', datos);

        this.citas = datos;
        // this.pagination = data.pagination;
        this.cdr.detectChanges();
      });
    }
  }

  filterByService(event: any) {
    const selectedService = event.target.value;
    this.currentServiceFilter = selectedService;

    console.log('Servicio seleccionado:', selectedService);

    // Si no hay filtro, usar todos los datos
    if (!selectedService || selectedService === '') {
      this.filteredCitas = [...this.all_data];
    } else {
      // Filtrar por servicio
      this.filteredCitas = this.all_data.filter(
        (cita) => cita.servicio === selectedService
      );
    }

    console.log('Datos filtrados:', this.filteredCitas);

    // Resetear a la página 1 y aplicar paginación
    this.applyPaginationToFilteredData(1);
  }

  applyPaginationToFilteredData(page: number = 1) {
    const search = {
      page: page,
      pageSize: 10,
    };

    this.getCitasFilter(search, this.filteredCitas).then((datos: any) => {
      this.citas = datos;
      console.log('Datos paginados con filtro:', this.citas);
      this.cdr.detectChanges();
    });
  }

  clearFilters() {
    // Resetear el formulario
    this.formService.patchValue({
      especialidad: '',
    });

    // Resetear filtros
    this.currentServiceFilter = '';
    this.filteredCitas = [...this.all_data];

    // Volver a la página 1
    this.applyPaginationToFilteredData(1);
  }
}
