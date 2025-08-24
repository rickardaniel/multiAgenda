// import { Component, HostListener } from '@angular/core';
// import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { initFlowbite } from 'flowbite';
// import { FlowbiteService } from '../../services/flowbite-service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-admin-component',
//   imports: [RouterOutlet, CommonModule, RouterModule],
//   templateUrl: './admin-component.html',
//   styleUrl: './admin-component.scss',
// })
// export default class AdminComponent {
//   flagSidebar = false;
//   currentYear = new Date().getFullYear();
//   isReportesSection = false;
//   isConfigSection = false;
//   namePlace: any;
//       isDropdownOpen: boolean = true // Estado inicial del dropdown

//   constructor(
//     private flowbiteService: FlowbiteService,
//     private router: Router
//   ) {
//     this.checkReportesRoute();

//     // Escuchar cambios de ruta
//     this.router.events.subscribe(() => {
//       this.checkReportesRoute();
//     });
//   }

//   ngOnInit(): void {
//             this.toggleDropdown()

//     this.flowbiteService.loadFlowbite((flowbite) => {
//       initFlowbite();
//     });
//   }

//   openSidebar(flag) {
//     this.flagSidebar = flag;
//   }

//   private checkReportesRoute(): void {
//     const currentUrl = this.router.url;
//     this.isReportesSection = currentUrl.startsWith('/administrador/reportes');
//     this.isConfigSection = currentUrl.startsWith(
//       '/administrador/configuracion'
//     );
//     if (this.isReportesSection) {
//       this.namePlace = 'Reportes';
//     } else if (this.isConfigSection) {
//       this.namePlace = 'Configuración';
//     }
//     console.log('res ==> ', this.isReportesSection);
//     console.log('res ==> ', this.namePlace);
//   }

//      // Cerrar el dropdown cuando se hace clic fuera de él
//   @HostListener('document:click', ['$event'])
//   onClickOutside(event: MouseEvent): void {
//     const dropdownButton = document.getElementById('dropdown-button')
//     const dropdownMenu = document.getElementById('dropdown-menu')

//     if (dropdownButton && dropdownMenu && !dropdownButton.contains(event.target as Node) && !dropdownMenu.contains(event.target as Node)) {
//       this.isDropdownOpen = false
//     }
//   }


//     toggleDropdown(): void {
//     this.isDropdownOpen = !this.isDropdownOpen
//   }

//   redirectTo(){
//     this.router.navigateByUrl('/administrador/cuenta');
//        this.toggleDropdown();
//   }

//   returnInit(){
//     console.log('exit');
//         this.toggleDropdown();
//         setTimeout(() => {
//                   this.router.navigateByUrl('/');

//         }, 300);


//   }

// }

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../services/flowbite-service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-admin-component',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss',
})
export default class AdminComponent implements OnInit, OnDestroy {
  // Sidebar state
  flagSidebar = false;
  
  // Mobile detection
  isMobile = false;
  
  // Current year
  currentYear = new Date().getFullYear();
  
  // Route detection
  isReportesSection = false;
  isConfigSection = false;
  namePlace: string = '';
  
  // Dropdown state
  isDropdownOpen = false;
  
  // Component lifecycle
  private destroy$ = new Subject<void>();
  
  // Screen size breakpoints
  private readonly MOBILE_BREAKPOINT = 1024; // lg breakpoint in Tailwind

  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router
  ) {
    // Initialize mobile detection
    this.checkScreenSize();
    
    // Initialize route checking
    this.checkReportesRoute();

    // Listen to router events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkReportesRoute();
        // Close sidebar on mobile after navigation
        if (this.isMobile) {
          this.openSidebar(false);
        }
      });
  }

  ngOnInit(): void {
    // Initialize dropdown as closed
    this.isDropdownOpen = false;

    // Initialize Flowbite
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    // Set initial sidebar state based on screen size
    this.initializeSidebarState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Window resize listener
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
    this.initializeSidebarState();
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (dropdownButton && dropdownMenu && 
        !dropdownButton.contains(event.target as Node) && 
        !dropdownMenu.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  // Handle keyboard navigation
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Close sidebar with Escape key on mobile
    if (event.key === 'Escape' && this.isMobile && this.flagSidebar) {
      this.openSidebar(false);
    }
    
    // Close dropdown with Escape key
    if (event.key === 'Escape' && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  /**
   * Check if the current screen size is mobile
   */
  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;
    }
  }

  /**
   * Initialize sidebar state based on screen size
   */
  private initializeSidebarState(): void {
    if (this.isMobile) {
      // On mobile, sidebar should be closed by default
      this.flagSidebar = false;
    } else {
      // On desktop, sidebar can be expanded by default
      // You can change this behavior as needed
      this.flagSidebar = false; // or true if you want it expanded by default
    }
  }

  /**
   * Open or close sidebar
   */
  openSidebar(flag: boolean): void {
    this.flagSidebar = flag;
    
    // Add/remove body scroll lock on mobile when sidebar is open
    if (this.isMobile) {
      if (flag) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  /**
   * Toggle mobile menu (hamburger button)
   */
  toggleMobileMenu(): void {
    this.openSidebar(!this.flagSidebar);
  }

  /**
   * Handle mobile navigation click
   * Closes sidebar after navigation on mobile
   */
  onMobileNavClick(): void {
    if (this.isMobile) {
      // Small delay to allow navigation to complete
      setTimeout(() => {
        this.openSidebar(false);
      }, 150);
    }
  }

  /**
   * Check current route and set section flags
   */
  private checkReportesRoute(): void {
    const currentUrl = this.router.url;
    
    this.isReportesSection = currentUrl.startsWith('/administrador/reportes');
    this.isConfigSection = currentUrl.startsWith('/administrador/configuracion');
    
    if (this.isReportesSection) {
      this.namePlace = 'Reportes';
    } else if (this.isConfigSection) {
      this.namePlace = 'Configuración';
    } else {
      this.namePlace = '';
    }
  }

  /**
   * Toggle user dropdown
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Redirect to user account
   */
  redirectTo(): void {
    this.router.navigateByUrl('/administrador/cuenta');
    this.toggleDropdown();
  }

  /**
   * Return to initial/login page
   */
  returnInit(): void {
    console.log('Logging out...');
    this.toggleDropdown();
    
    // Remove body scroll lock if it was applied
    document.body.style.overflow = '';
    
    // Delay navigation to allow dropdown animation
    setTimeout(() => {
      this.router.navigateByUrl('/');
    }, 300);
  }

  /**
   * Get responsive class for elements
   */
  getResponsiveClass(baseClass: string): string {
    return `${baseClass} ${this.isMobile ? 'mobile' : 'desktop'}`;
  }

  /**
   * Check if current route is active
   */
  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  /**
   * Get sidebar width class based on screen size
   */
  getSidebarWidthClass(): string {
    if (this.isMobile) {
      return 'w-80 max-w-[85vw]';
    }
    return 'w-60 sm:w-64 md:w-60';
  }

  /**
   * Handle touch events for mobile sidebar
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (this.isMobile && this.flagSidebar) {
      const touch = event.touches[0];
      const startX = touch.clientX;
      
      // If touch starts from the right side of the screen, prepare to close sidebar
      if (startX > 240) { // Sidebar width
        this.handleTouchClose(event);
      }
    }
  }

  /**
   * Handle touch close for sidebar
   */
  private handleTouchClose(event: TouchEvent): void {
    let startX = event.touches[0].clientX;
    
    const onTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      // If swiping left significantly, close sidebar
      if (deltaX < -50) {
        this.openSidebar(false);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      }
    };
    
    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
    
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
  }

  /**
   * Track by function for ngFor optimization (if needed)
   */
  trackByIndex(index: number): number {
    return index;
  }
}