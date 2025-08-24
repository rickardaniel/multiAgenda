// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { ApiService } from '../../../services/api-service';
// import { CommonModule } from '@angular/common';
// import { UtilService } from '../../../services/util-service';
// import { InputPhoneComponent } from '../../../shared/input-phone-component/input-phone-component';
// import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-clientes-component',
//   imports: [CommonModule, InputPhoneComponent, ReactiveFormsModule],
//   templateUrl: './clientes-component.html',
//   styleUrl: './clientes-component.scss',
// })
// export default class ClientesComponent implements OnInit {
//   flagFilters = true;
//   pagination: any;
//   all_clientes: any = [];
//   clientes: any; // Los datos paginados actuales
//   clientes2: any; // Los datos paginados actuales
//   clientesN: any; // Los datos paginados actuales
//   clientesN2: any; // Los datos paginados actuales
//   // allCitas: any[] = []; // Todos los datos originales
//   filteredClientes: any[] = []; // 👈 NUEVO: Datos filtrados
//   currentServiceFilter: string = ''; // 👈 NUEVO: Filtro actual
//   modal: any;
//   clienteSelected: any;
//   typeC: any;

//   constructor(
//     private api: ApiService,
//     private util: UtilService,
//     private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.getClients();
//     // this.getRandomColor('RC');
//   }

//   getClients() {
//     this.api.getClientes().subscribe({
//       next: (resp: any) => {
//         console.log('resp', resp);

//         // Guardar todos los datos originales
//         this.all_clientes = resp;
//         this.filteredClientes = [...resp]; // 👈 Inicialmente, filtrados = todos

//         let search = {
//           page: 1,
//           pageSize: 10,
//         };

//         this.getClientesFilter(search, this.filteredClientes).then(
//           (data: any) => {
//             this.clientesN = data.data;
//             this.clientesN2 = data.data;
//             this.clientes = data;
//             this.clientes2 = data;
//             console.log('data ==> ', this.clientes);
//             this.cdr.detectChanges();
//           }
//         );
//       },
//       error(err) {
//         console.error('Error:', err);
//       },
//       complete() {
//         console.log('Completado');
//       },
//     });
//   }

//   async getClientesFilter(
//     params: PaginationParams,
//     data
//   ): Promise<PaginatedResponse<Cita>> {
//     // Simular delay de API

//     // ===== PAGINACIÓN =====
//     const totalItems = data.length;
//     const totalPages = Math.ceil(totalItems / params.pageSize);
//     const currentPage = Math.max(1, Math.min(params.page, totalPages));
//     const startIndex = (currentPage - 1) * params.pageSize;
//     const endIndex = startIndex + params.pageSize;
//     const paginatedData = data.slice(startIndex, endIndex);

//     // ===== RESPUESTA =====
//     return {
//       data: paginatedData,
//       pagination: {
//         currentPage,
//         pageSize: params.pageSize,
//         totalItems,
//         totalPages,
//         hasNextPage: currentPage < totalPages,
//         hasPreviousPage: currentPage > 1,
//       },
//     };
//   }

//   showFilters(flag) {
//     this.flagFilters = flag;
//   }

//   nameAvatar(name) {
//     return this.api.getInitials(name);
//   }

//   goToNextPage(pagination, data) {
//     console.log('data', data);

//     if (pagination.hasNextPage) {
//       let search = {
//         page: pagination.currentPage + 1,
//         pageSize: pagination.pageSize,
//       };

//       console.log('search', search);

//       this.getClientesFilter(search, data).then((datos: any) => {
//         console.log('dataos', datos);
//         this.clientesN = datos.data;
//         this.clientesN2 = datos.data;

//         this.clientes = datos;
//         this.clientes2 = datos;
//         // this.pagination = data.pagination;
//         this.cdr.detectChanges();
//       });
//     }
//   }

//   goToPreviousPage(pagination, data) {
//     if (pagination.hasPreviousPage) {
//       // this.getCitas(pagination.currentPage - 1, pagination.pageSize);
//       let search = {
//         page: pagination.currentPage - 1,
//         pageSize: pagination.pageSize,
//       };

//       console.log('search', search);
//       console.log('search', data);

//       this.getClientesFilter(search, data).then((datos: any) => {
//         console.log('dataos', datos);
//         this.clientesN = datos.data;
//         this.clientesN2 = datos.data;

//         this.clientes = datos;
//         this.clientes2 = datos;
//         // this.pagination = data.pagination;
//         this.cdr.detectChanges();
//       });
//     }
//   }

//   getRandomColor(letter) {
//     return this.api.getDualColorObject(letter);
//   }

//   formCliente = new FormGroup({
//     nombres: new FormControl(''),
//     apellidos: new FormControl(''),
//     cedula: new FormControl(''),
//     telefono: new FormControl(''),
//     correo: new FormControl(''),
//     nacimiento: new FormControl(''),
//     estado: new FormControl(1),
//   });

//   crearEditarClientes(type, obj, name) {
//     console.log('form', obj);
//     this.typeC = type;
//     if (type == 'create') {
//       this.modal = this.util.createModal(name);
//       this.modal.show();
//     } else {
//       this.clienteSelected = obj;
//       this.formCliente.setValue({
//         nombres: obj.nombre,
//         apellidos: obj.nombre,
//         cedula: obj.documento,
//         telefono: obj.telefono,
//         correo: obj.email,
//         nacimiento: obj.fechaRegistro,
//         estado: 1,
//       });

//       console.log('form', this.formCliente.value);

//       this.modal = this.util.createModal(name);
//       this.modal.show();
//       // Lógica para editar
//     }
//   }

//   closeModal() {
//     this.formCliente.reset();
//     this.modal.hide();
//   }
//   deleteModal(type, obj, name) {
//     this.clienteSelected = [];

//     if (type == 'cliente') {
//       this.clienteSelected = obj;
//       this.modal = this.util.createModal(name);
//       this.modal.show();
//     }
//   }

//   searchTable(event) {
//     const texto = (event.target.value || '').trim();
//     if (texto != '') {
//       console.log('event', texto);
//       const textoLower = texto.toLowerCase();

//       this.clientesN = this.clientesN2.filter((cliente) => {
//         const nombre = (cliente.nombre || '').toLowerCase();
//         const documento = (cliente.documento || '').toString();
//         const telefono = (cliente.telefono || '').toString();
//         const email = (cliente.email || '').toLowerCase();
//         const iniciales = (cliente.iniciales || '').toLowerCase();

//         return (
//           nombre.includes(textoLower) ||
//           documento.includes(texto) || // Sin toLowerCase para documento
//           telefono.includes(texto) || // Sin toLowerCase para teléfono
//           email.includes(textoLower) ||
//           iniciales.includes(textoLower)
//         );
//       });
//     } else {
//       this.clientesN = this.clientesN2;
//     }
//   }
// }

import { 
  ChangeDetectorRef, 
  Component, 
  OnInit, 
  OnDestroy, 
  HostListener, 
  ViewChild, 
  ElementRef 
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, fromEvent, debounceTime } from 'rxjs';

import { ApiService } from '../../../services/api-service';
import { UtilService } from '../../../services/util-service';
import { InputPhoneComponent } from '../../../shared/input-phone-component/input-phone-component';

// Interfaces
interface PaginationParams {
  page: number;
  pageSize: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface Cliente {
  id?: string;
  nombre: string;
  documento: string;
  telefono: string;
  email: string;
  fechaRegistro: string;
  estado: string;
  iniciales?: string;
}

export type ClientModalType = 'create' | 'edit';

@Component({
  selector: 'app-clientes-component',
  imports: [CommonModule, InputPhoneComponent, ReactiveFormsModule],
  templateUrl: './clientes-component.html',
  styleUrl: './clientes-component.scss',
})
export default class ClientesComponent implements OnInit, OnDestroy {
  
  // Responsive properties
  isMobile = false;
  isTablet = false;
  screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop';

  // UI State
  flagFilters = true;
  isLoading = false;
  isModalOpen = false;
  
  // Data properties
  all_clientes: Cliente[] = [];
  clientes: any;
  clientes2: any;
  clientesN: Cliente[] = [];
  clientesN2: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  
  // Filter state
  currentStatusFilter = '';
  currentDateFromFilter = '';
  currentDateToFilter = '';
  
  // Modal management
  modal: any;
  deleteModal2: any;
  clienteSelected: Cliente | null = null;
  typeC: ClientModalType = 'create';
  
  // Component lifecycle
  private destroy$ = new Subject<void>();
  
  // Screen size breakpoints
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;

  // Form
  formCliente = new FormGroup({
    nombres: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellidos: new FormControl('', [Validators.required, Validators.minLength(2)]),
    cedula: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    telefono: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    nacimiento: new FormControl('', [Validators.required]),
    estado: new FormControl(1),
  });

  constructor(
    private api: ApiService,
    private util: UtilService,
    private cdr: ChangeDetectorRef
  ) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.setupResizeListener();
    this.getClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Responsive handling
  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
    this.handleResponsiveChanges();
  }

  /**
   * Check current screen size and update responsive flags
   */
  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      this.isMobile = width < this.MOBILE_BREAKPOINT;
      this.isTablet = width >= this.MOBILE_BREAKPOINT && width < this.TABLET_BREAKPOINT;
      
      if (this.isMobile) {
        this.screenSize = 'mobile';
      } else if (this.isTablet) {
        this.screenSize = 'tablet';
      } else {
        this.screenSize = 'desktop';
      }
    }
  }

  /**
   * Setup resize listener with debounce
   */
  private setupResizeListener(): void {
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkScreenSize();
        this.handleResponsiveChanges();
      });
  }

  /**
   * Handle responsive layout changes
   */
  private handleResponsiveChanges(): void {
    this.cdr.detectChanges();
  }

  // Data loading methods
  /**
   * Load clients data
   */
  getClients(): void {
    this.isLoading = true;
    
    this.api.getClientes().subscribe({
      next: (resp: any) => {
        this.all_clientes = resp;
        this.filteredClientes = [...resp];

        const search = { page: 1, pageSize: 10 };
        this.getClientesFilter(search, this.filteredClientes).then((data: any) => {
          this.clientesN = data.data;
          this.clientesN2 = data.data;
          this.clientes = data;
          this.clientes2 = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.isLoading = false;
        this.handleError(err, 'loading clients');
      }
    });
  }

  /**
   * Apply pagination to filtered data
   */
  async getClientesFilter(
    params: PaginationParams,
    data: Cliente[]
  ): Promise<PaginatedResponse<Cliente>> {
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

  // Filter methods
  /**
   * Toggle filters visibility
   */
  showFilters(flag: boolean): void {
    this.flagFilters = flag;
  }

  /**
   * Apply all active filters
   */
  private applyFilters(): void {
    this.filteredClientes = this.all_clientes.filter(cliente => {
      const statusMatch = !this.currentStatusFilter || cliente.estado === this.currentStatusFilter;
      const dateFromMatch = !this.currentDateFromFilter || 
        new Date(cliente.fechaRegistro) >= new Date(this.currentDateFromFilter);
      const dateToMatch = !this.currentDateToFilter || 
        new Date(cliente.fechaRegistro) <= new Date(this.currentDateToFilter);

      return statusMatch && dateFromMatch && dateToMatch;
    });

    this.applyPaginationToFilteredData(1);
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.currentStatusFilter = '';
    this.currentDateFromFilter = '';
    this.currentDateToFilter = '';

    // Clear select and input elements
    const selects = document.querySelectorAll('select');
    const inputs = document.querySelectorAll('input[type="date"]');
    
    selects.forEach(select => select.selectedIndex = 0);
    inputs.forEach(input => (input as HTMLInputElement).value = '');

    this.filteredClientes = [...this.all_clientes];
    this.applyPaginationToFilteredData(1);
  }

  /**
   * Apply pagination to filtered data
   */
  private applyPaginationToFilteredData(page: number = 1): void {
    const search = { page, pageSize: 10 };

    this.getClientesFilter(search, this.filteredClientes).then((data: any) => {
      this.clientes = data;
      this.clientesN = data.data;
      this.clientesN2 = data.data;
      this.cdr.detectChanges();
    });
  }

  // Search functionality
  /**
   * Search in table data
   */
  searchTable(event: Event): void {
    const target = event.target as HTMLInputElement;
    const searchTerm = (target.value || '').trim().toLowerCase();

    if (searchTerm) {
      this.clientesN = this.clientesN2.filter(cliente => {
        const nombre = (cliente.nombre || '').toLowerCase();
        const documento = (cliente.documento || '').toString().toLowerCase();
        const telefono = (cliente.telefono || '').toString().toLowerCase();
        const email = (cliente.email || '').toLowerCase();
        const iniciales = this.nameAvatar(cliente.nombre).toLowerCase();

        return nombre.includes(searchTerm) ||
               documento.includes(searchTerm) ||
               telefono.includes(searchTerm) ||
               email.includes(searchTerm) ||
               iniciales.includes(searchTerm);
      });
    } else {
      this.clientesN = [...this.clientesN2];
    }
  }

  // Pagination methods
  /**
   * Go to next page
   */
  goToNextPage(pagination: any, data: Cliente[]): void {
    if (pagination?.hasNextPage) {
      const search = {
        page: pagination.currentPage + 1,
        pageSize: pagination.pageSize,
      };

      this.getClientesFilter(search, data).then((result: any) => {
        this.clientesN = result.data;
        this.clientesN2 = result.data;
        this.clientes = result;
        this.clientes2 = result;
        this.cdr.detectChanges();
      });
    }
  }

  /**
   * Go to previous page
   */
  goToPreviousPage(pagination: any, data: Cliente[]): void {
    if (pagination?.hasPreviousPage) {
      const search = {
        page: pagination.currentPage - 1,
        pageSize: pagination.pageSize,
      };

      this.getClientesFilter(search, data).then((result: any) => {
        this.clientesN = result.data;
        this.clientesN2 = result.data;
        this.clientes = result;
        this.clientes2 = result;
        this.cdr.detectChanges();
      });
    }
  }

  // Avatar and color utilities
  /**
   * Get initials for avatar
   */
  nameAvatar(name: string): string {
    return this.api.getInitials(name);
  }

  /**
   * Get random color for avatars
   */
  getRandomColor(letter: string): any {
    return this.api.getDualColorObject(letter);
  }

  // Modal management
  /**
   * Create or edit client
   */
  crearEditarClientes(type: ClientModalType, cliente: Cliente | '', modalName: string): void {
    this.typeC = type;
    
    if (type === 'create') {
      this.formCliente.reset();
      this.formCliente.patchValue({
        estado: 1
      });
    } else if (cliente && typeof cliente === 'object') {
      this.clienteSelected = cliente;
      this.formCliente.patchValue({
        nombres: cliente.nombre.split(' ')[0] || '',
        apellidos: cliente.nombre.split(' ').slice(1).join(' ') || '',
        cedula: cliente.documento,
        telefono: cliente.telefono,
        correo: cliente.email,
        nacimiento: cliente.fechaRegistro,
        estado: cliente.estado === 'Activo' ? 1 : 0,
      });
    }

    this.isModalOpen = true;
    this.modal = this.util.createModal(modalName);
    this.modal.show();
  }

  /**
   * Close modal and reset state
   */
  closeModal(): void {
    this.formCliente.reset();
    
    if (this.modal) {
      this.modal.hide();
    }
    
    if (this.deleteModal) {
      this.deleteModal2.hide();
    }
    
    this.isModalOpen = false;
    this.clienteSelected = null;
  }

  /**
   * Open delete confirmation modal
   */
  deleteModal(type: string, cliente: Cliente, modalName: string): void {
    if (type === 'cliente') {
      this.clienteSelected = cliente;
      this.deleteModal2 = this.util.createModal(modalName);
      this.deleteModal2.show();
    }
  }

  /**
   * Confirm client deletion
   */
  confirmDelete(): void {
    if (this.clienteSelected) {
      console.log('Deleting client:', this.clienteSelected);
      
      // Here you would call the API to delete the client
      // this.api.deleteCliente(this.clienteSelected.id).subscribe({
      //   next: (response) => {
      //     this.getClients(); // Refresh data
      //     this.closeModal();
      //     this.showSuccessMessage('Cliente eliminado exitosamente');
      //   },
      //   error: (error) => {
      //     this.handleError(error, 'deleting client');
      //   }
      // });
      
      // For now, just close the modal
      this.closeModal();
      
      // Add haptic feedback on mobile
      if (this.isMobile && 'vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  }

  /**
   * Save client (create or update)
   */
  saveClient(): void {
    if (this.formCliente.valid) {
      const formValue = this.formCliente.value;
      const clientData = {
        nombres: formValue.nombres,
        apellidos: formValue.apellidos,
        cedula: formValue.cedula,
        telefono: formValue.telefono,
        correo: formValue.correo,
        nacimiento: formValue.nacimiento,
        estado: formValue.estado
      };

      console.log('Saving client:', clientData, 'Type:', this.typeC);

      if (this.typeC === 'create') {
        // Create new client
        // this.api.createCliente(clientData).subscribe({
        //   next: (response) => {
        //     this.getClients(); // Refresh data
        //     this.closeModal();
        //     this.showSuccessMessage('Cliente creado exitosamente');
        //   },
        //   error: (error) => {
        //     this.handleError(error, 'creating client');
        //   }
        // });
      } else {
        // Update existing client
        // this.api.updateCliente(this.clienteSelected?.id, clientData).subscribe({
        //   next: (response) => {
        //     this.getClients(); // Refresh data
        //     this.closeModal();
        //     this.showSuccessMessage('Cliente actualizado exitosamente');
        //   },
        //   error: (error) => {
        //     this.handleError(error, 'updating client');
        //   }
        // });
      }

      // For now, just close the modal
      this.closeModal();
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * Mark all form fields as touched to show validation errors
   */
  private markFormGroupTouched(): void {
    Object.keys(this.formCliente.controls).forEach(key => {
      const control = this.formCliente.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  /**
   * Check if form field has error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.formCliente.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Get error message for form field
   */
  getFieldError(fieldName: string): string {
    const field = this.formCliente.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }

  // Utility methods
  /**
   * Get responsive CSS classes
   */
  getResponsiveClass(baseClass: string): string {
    const modifiers = [];
    
    if (this.isMobile) {
      modifiers.push('mobile');
    }
    
    if (this.isTablet) {
      modifiers.push('tablet');
    }
    
    return `${baseClass} ${modifiers.join(' ')}`;
  }

  /**
   * Handle keyboard shortcuts
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Close modals with Escape
    if (event.key === 'Escape') {
      if (this.isModalOpen) {
        this.closeModal();
      }
    }
    
    // Keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'n':
          event.preventDefault();
          this.crearEditarClientes('create', '', '#modalCliente');
          break;
        case 'f':
          event.preventDefault();
          this.showFilters(!this.flagFilters);
          break;
      }
    }
  }

  /**
   * Handle mobile-specific interactions
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    // Handle touch interactions for better mobile UX
    const target = event.target as HTMLElement;
    
    if (target.closest('.action-btn')) {
      target.classList.add('touch-active');
    }
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    // Clean up touch interactions
    const target = event.target as HTMLElement;
    
    if (target.closest('.action-btn')) {
      setTimeout(() => {
        target.classList.remove('touch-active');
      }, 150);
    }
  }

  /**
   * Export clients data (future feature)
   */
  exportClients(format: 'csv' | 'pdf' | 'excel' = 'csv'): void {
    console.log(`Exporting clients in ${format} format...`);
    
    // Implementation would depend on your export service
    // this.exportService.exportClients(this.filteredClientes, format);
    
    // Add haptic feedback on mobile
    if (this.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  /**
   * Bulk operations (future feature)
   */
  performBulkAction(action: 'activate' | 'deactivate' | 'delete', clientIds: string[]): void {
    console.log(`Performing bulk ${action} on clients:`, clientIds);
    
    // Implementation would depend on your bulk operations API
    // this.api.bulkUpdateClients(action, clientIds).subscribe({
    //   next: (response) => {
    //     this.getClients(); // Refresh data
    //     this.showSuccessMessage(`${action} completed successfully`);
    //   },
    //   error: (error) => {
    //     this.handleError(error, `bulk ${action}`);
    //   }
    // });
  }

  /**
   * Show success message
   */
  private showSuccessMessage(message: string): void {
    // Implementation would depend on your notification service
    console.log('Success:', message);
  }

  /**
   * Error handling utility
   */
  private handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    
    // Show user-friendly error message
    // This would integrate with your notification service
    
    // Track error for monitoring
    this.trackPerformance(`Error in ${context}`, Date.now());
  }

  /**
   * Track performance metrics
   */
  private trackPerformance(action: string, startTime: number): void {
    const duration = Date.now() - startTime;
    console.log(`Performance: ${action} took ${duration}ms`);
    
    // Send to analytics if needed
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${action} took ${duration}ms`);
    }
  }

  /**
   * Get client statistics (future feature)
   */
  getClientStats(): { active: number; inactive: number; total: number; newThisMonth: number } {
    const active = this.all_clientes.filter(c => c.estado === 'Activo').length;
    const inactive = this.all_clientes.filter(c => c.estado === 'Inactivo').length;
    const total = this.all_clientes.length;
    
    // Calculate new clients this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const newThisMonth = this.all_clientes.filter(c => 
      new Date(c.fechaRegistro) >= thisMonth
    ).length;

    return { active, inactive, total, newThisMonth };
  }

  /**
   * Refresh data
   */
  refreshData(): void {
    this.isLoading = true;
    this.getClients();
  }

  /**
   * Check if client has birthday today (future feature)
   */
  hasBirthdayToday(cliente: Cliente): boolean {
    if (!cliente.fechaRegistro) return false;
    
    const today = new Date();
    const birthday = new Date(cliente.fechaRegistro);
    
    return today.getMonth() === birthday.getMonth() && 
           today.getDate() === birthday.getDate();
  }

  /**
   * Format phone number for display
   */
  formatPhoneNumber(phone: string): string {
    // Implementation would depend on your phone formatting requirements
    return phone;
  }

  /**
   * Validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get client age from birthday (if available)
   */
  getClientAge(fechaNacimiento: string): number | null {
    if (!fechaNacimiento) return null;
    
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}