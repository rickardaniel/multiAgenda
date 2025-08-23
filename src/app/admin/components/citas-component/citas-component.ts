import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { ApiService } from '../../../services/api-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UtilService } from '../../../services/util-service';
import { Instance } from 'flatpickr/dist/types/instance';
import { Spanish } from 'flatpickr/dist/l10n/es';
import flatpickr from 'flatpickr';

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
  citas: any;
  citasN: any;
  citasN2: any;
  filteredCitas: any[] = [];
  currentServiceFilter: string = '';
  modal: any;
  flagClassOverflow = false;
  flagActive = false;

  @ViewChild('calendarContainer2', { static: true })
  calendarContainer!: ElementRef;
  @ViewChild('Horarios') horariosRef!: ElementRef<HTMLDivElement>;

  horarios = [
    { id: 1, horaI: '09:00', horaF: '09:30' },
    { id: 2, horaI: '09:30', horaF: '10:00' },
    { id: 3, horaI: '10:00', horaF: '10:30' },
    { id: 4, horaI: '10:30', horaF: '11:00' },
    { id: 5, horaI: '11:00', horaF: '11:30' },
  ];

  horarioSelected = this.horarios[0];

  selectedScheduleId: number | null = null;
  colorButtonOne = false;

  private flatpickrInstance!: Instance;
  selectedDate: string = '';
  @Input() mode: 'single' | 'multiple' | 'range' = 'single';
  today = new Date();
  dateSelected: any;
  private onChange = (value: any) => {};
  servicios: any = [];
  especialistas: any = [];
  // isDropdownOpen: boolean = true; // Estado inicial del dropdown
  openDropdownId: string | number | null = null; // ✅ AGREGAR

  constructor(
    private api: ApiService,
    private util: UtilService,
    private cdr: ChangeDetectorRef
  ) {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      // Si no se hizo click dentro de un dropdown, cerrar todos
      if (!target.closest('.dropdown-container')) {
        this.openDropdownId = null;
      }
    });
  }

  ngAfterViewInit(): void {
    // ❌ NO inicializar flatpickr aquí porque el modal está oculto
    // this.initializeFlatpickr();
  }

  ngOnInit() {
    // this.toggleDropdown();
    this.getCitas();
    this.getEspecialistas();
    this.getServicios();
  }

  getCitas() {
    this.api.getCitas().subscribe({
      next: (resp: any) => {
        console.log('resp', resp);
        this.all_data = resp;
        this.filteredCitas = [...resp];

        let search = {
          page: 1,
          pageSize: 10,
        };

        this.getCitasFilter(search, this.filteredCitas).then((data: any) => {
          this.citas = data;
          this.citasN = data.data;
          this.citasN2 = data.data;
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
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / params.pageSize);
    const currentPage = Math.max(1, Math.min(params.page, totalPages));
    const startIndex = (currentPage - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

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

  getVisiblePages(pagination): (number | any)[] {
    const currentPage = pagination?.currentPage;
    const totalPages = pagination?.totalPages;
    const pages: (number | any)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
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
        this.citasN = datos.data;
        this.citasN2 = datos.data;
        this.cdr.detectChanges();
      });
    }
  }

  goToPreviousPage(pagination, data) {
    if (pagination.hasPreviousPage) {
      let search = {
        page: pagination.currentPage - 1,
        pageSize: pagination.pageSize,
      };

      console.log('search', search);
      console.log('search', data);

      this.getCitasFilter(search, data).then((datos: any) => {
        console.log('dataos', datos);
        this.citas = datos;
        this.citasN = datos.data;
        this.citasN2 = datos.data;

        this.cdr.detectChanges();
      });
    }
  }

  filterByService(event: any) {
    const selectedService = event.target.value;
    this.currentServiceFilter = selectedService;

    console.log('Servicio seleccionado:', selectedService);

    if (!selectedService || selectedService === '') {
      this.filteredCitas = [...this.all_data];
    } else {
      this.filteredCitas = this.all_data.filter(
        (cita) => cita.servicio === selectedService
      );
    }

    console.log('Datos filtrados:', this.filteredCitas);
    this.applyPaginationToFilteredData(1);
  }

  filterByEmpleado(event: any) {
    const selectedEmpleado = event.target.value;
    this.currentServiceFilter = selectedEmpleado;

    console.log('Servicio seleccionado:', selectedEmpleado);

    if (!selectedEmpleado || selectedEmpleado === '') {
      this.filteredCitas = [...this.all_data];
    } else {
      this.filteredCitas = this.all_data.filter(
        (cita) => cita.empleado === selectedEmpleado
      );
    }

    console.log('Datos filtrados:', this.filteredCitas);
    this.applyPaginationToFilteredData(1);
  }

  filterByEstado(event: any) {
    const selectedEstado = event.target.value;
    this.currentServiceFilter = selectedEstado;

    console.log('Servicio seleccionado:', selectedEstado);

    if (!selectedEstado || selectedEstado === '') {
      this.filteredCitas = [...this.all_data];
    } else {
      this.filteredCitas = this.all_data.filter(
        (cita) => cita.estadoN === selectedEstado
      );
    }

    console.log('Datos filtrados:', this.filteredCitas);
    this.applyPaginationToFilteredData(1);
  }

  applyPaginationToFilteredData(page: number = 1) {
    const search = {
      page: page,
      pageSize: 10,
    };

    this.getCitasFilter(search, this.filteredCitas).then((datos: any) => {
      this.citas = datos;
      this.citasN = datos.data;
      this.citasN2 = datos.data;
      console.log('Datos paginados con filtro:', this.citas);
      this.cdr.detectChanges();
    });
  }

  clearFilters() {
    this.formService.patchValue({
      especialidad: '',
    });

    this.currentServiceFilter = '';
    this.filteredCitas = [...this.all_data];
    this.applyPaginationToFilteredData(1);
  }

  // ✅ MÉTODO MODIFICADO: Inicializar flatpickr cuando se abre el modal
  crearEditarCita(type, obj, name) {
    if (type == 'create') {
      this.modal = this.util.createModal(name);
      this.modal.show();

      // ✅ Inicializar flatpickr DESPUÉS de mostrar el modal
      setTimeout(() => {
        this.initializeFlatpickr();
      }, 100); // Pequeño delay para que el modal se renderice completamente
    } else {
      // Lógica para editar
    }
  }

  closeModal() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
    this.modal.hide();

    // Resetear estado
    this.flagClassOverflow = false;
    this.selectedScheduleId = null;
    this.dateSelected = null;
  }

  selectDay(event) {
    console.log('event', event);
    if (event) {
      console.log('entra');
      console.log('event', event.target?.value);
      this.flagClassOverflow = true;
      this.dateSelected = event.target?.value;
      console.log('horarios', this.horariosRef);
      this.selectSchedule(this.horarioSelected);
      this.getButtonClasses(1);
      if (this.horariosRef) {
        this.scrollToHorarios();
      }
    }
  }

  private initializeFlatpickr() {
    // ✅ Verificar que el elemento existe y es visible
    if (!this.calendarContainer?.nativeElement) {
      console.error('Elemento del calendario no encontrado');
      return;
    }

    // ✅ Destruir instancia previa si existe
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }

    const options: any = {
      inline: true,
      dateFormat: 'm-d-Y',
      mode: this.mode,
      locale: Spanish,
      defaultDate: this.today,

      onChange: (selectedDates: Date[], dateStr: string) => {
        let value: string | Date | Date[] = dateStr;

        if (this.mode === 'multiple' || this.mode === 'range') {
          value = selectedDates;
        } else if (selectedDates.length > 0) {
          value = selectedDates[0];
        }

        this.onChange(value);
        console.log('Fecha seleccionada:', value);
      },
    };

    try {
      this.flatpickrInstance = flatpickr(
        this.calendarContainer.nativeElement,
        options
      );
      console.log('Flatpickr inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar flatpickr:', error);
    }
  }

  scrollToElement($element: any): void {
    setTimeout(() => {
      $element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }, 300);
  }

  scrollToHorarios(): void {
    if (this.horariosRef) {
      this.scrollToElement(this.horariosRef.nativeElement);
    }
  }

  getButtonClasses(horarioId: number): string {
    const baseClasses =
      'cursor-pointer w-full rounded-lg py-3.5 text-xs transition-all duration-200';
    if (this.isSelected(horarioId)) {
      this.colorButtonOne = true;
      return `${baseClasses} bg-red-500 text-white shadow-lg`;
    } else {
      return `${baseClasses} bg-transparent hover:bg-white hover:shadow-md shadow border border-gray-300`;
    }
  }

  isSelected(horarioId: number): boolean {
    return this.selectedScheduleId === horarioId;
  }

  selectSchedule(horario: any): void {
    console.log('horario', horario);
    this.selectedScheduleId = horario.id;
    this.flagActive=true;
  }

  getServicios() {
    this.api.getEspecialidades().subscribe({
      next: (resp: any) => {
        this.servicios = resp;
      },
    });
  }

  getEspecialistas() {
    this.api.getMedicos().subscribe({
      next: (resp: any) => {
        this.especialistas = resp;
      },
    });
  }

  searchTable(event) {
    const texto = (event.target.value || '').trim();
    if (texto != '') {
      console.log('event', texto);
      const textoLower = texto.toLowerCase();

      this.citasN = this.citasN2.filter((citas) => {
        const cliente = (citas.cliente || '').toLowerCase();
        const codigo = (citas.codigo || '').toString();
        const empleado = (citas.empleado || '').toString();
        const servicio = (citas.servicio || '').toLowerCase();

        return (
          cliente.includes(textoLower) ||
          codigo.includes(texto) || // Sin toLowerCase para documento
          empleado.includes(texto) || // Sin toLowerCase para teléfono
          servicio.includes(textoLower)
        );
      });
    } else {
      this.citasN = this.citasN2;
    }
  }

  toggleDropdown(registroId: string | number, event?: Event): void {
    // Prevenir que el click se propague y cierre inmediatamente el dropdown
    if (event) {
      event.stopPropagation();
    }

    if (this.openDropdownId === registroId) {
      this.openDropdownId = null;
    } else {
      this.openDropdownId = registroId;
    }
  }

  isDropdownOpen(registroId: string | number): boolean {
    return this.openDropdownId === registroId;
  }

  closeAllDropdowns(): void {
    this.openDropdownId = null;
  }

  // Método para manejar clicks dentro del dropdown (prevenir cierre)
  onDropdownClick(event: Event): void {
    event.stopPropagation();
  }
}
