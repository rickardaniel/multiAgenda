import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, fromEvent, debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BigCalendarComponent } from '../../../shared/big-calendar-component/big-calendar-component';
import { ApiService } from '../../../services/api-service';
import { stateColorsNormal, stateColorsStrong } from '../../../interface/styles-agenda.interface';
import { CalendarioConfigComponent } from "../../../shared/calendario-config-component/calendario-config-component";
import CalendarComponetn from '../../../shared/calendar/calendar-components';

export type TabType = 'calendar' | 'appointments';

export interface AppointmentCard {
  id?: string;
  professional?: {
    name: string;
    id?: string;
  };
  specialty?: string;
  status?: string;
  statusText?: string;
  time?: string;
  date?: string;
  patient?: string;
}

export interface HourlyAppointment {
  iniciales: string;
  nombre: string;
  event_theme: string;
  cita: string;
  event_date: string;
  event_time: string;
  id?: string;
}

@Component({
  selector: 'app-inicio-component',
  imports: [CommonModule, BigCalendarComponent, CalendarComponetn],
  templateUrl: './inicio-component.html',
  styleUrl: './inicio-component.scss'
})
export default class InicioComponent implements OnInit, OnDestroy {
  // Mobile and responsive properties
  isMobile = false;
  isTablet = false;
  activeTab: TabType = 'calendar';
  
  // Data properties
  dateSelected: any;
  citasByDay: AppointmentCard[] = [];
  citasHora: HourlyAppointment[] = [];
  
  // Color utilities
  colorStateLetter = stateColorsStrong;
  colorStateBg = stateColorsNormal;
  
  // Loading states
  isLoadingAppointments = false;
  isLoadingCalendar = false;
  
  // Component lifecycle
  private destroy$ = new Subject<void>();
  
  // Screen size breakpoints
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly TABLET_BREAKPOINT = 1024;
  
  // ViewChild references for direct DOM manipulation if needed
  @ViewChild('mobileTabNavigation', { static: false }) mobileTabNav!: ElementRef;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Initialize screen size detection
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Set up resize listener with debounce
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(200),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkScreenSize();
        this.handleResponsiveChanges();
      });

    // Initialize with appropriate tab for screen size
    this.initializeDefaultTab();
    
    // Load initial data
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Screen size detection and responsive handling
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
    this.handleResponsiveChanges();
  }

  // Handle keyboard navigation
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Tab navigation with arrow keys on mobile
    if (this.isMobile && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      this.navigateTabs(event.key === 'ArrowRight' ? 'next' : 'previous');
    }
    
    // Quick actions with keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case '1':
          event.preventDefault();
          this.setActiveTab('calendar');
          break;
        case '2':
          event.preventDefault();
          this.setActiveTab('appointments');
          break;
      }
    }
  }

  /**
   * Check current screen size and set responsive flags
   */
  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      this.isMobile = width < this.MOBILE_BREAKPOINT;
      this.isTablet = width >= this.MOBILE_BREAKPOINT && width < this.TABLET_BREAKPOINT;
    }
  }

  /**
   * Handle responsive layout changes
   */
  private handleResponsiveChanges(): void {
    if (!this.isMobile && this.activeTab) {
      // Reset to show all columns on desktop
      this.activeTab = 'calendar';
    }
    
    this.cdr.detectChanges();
  }

  /**
   * Initialize default tab based on screen size
   */
  private initializeDefaultTab(): void {
    if (this.isMobile) {
      this.activeTab = 'calendar';
    }
  }

  /**
   * Load initial dashboard data
   */
  private loadInitialData(): void {
    // This would typically load from a service
    // For now, we'll use the existing data structure
    console.log('Loading initial dashboard data...');
  }

  /**
   * Set active tab for mobile navigation
   */
  setActiveTab(tab: TabType): void {
    if (tab !== this.activeTab) {
      this.activeTab = tab;
      
      // Add animation class
      this.animateTabChange();
      
      // Track analytics if needed
      this.trackTabChange(tab);
    }
  }

  /**
   * Navigate between tabs programmatically
   */
  navigateTabs(direction: 'next' | 'previous'): void {
    const tabs: TabType[] = ['calendar', 'appointments'];
    const currentIndex = tabs.indexOf(this.activeTab);
    
    let newIndex: number;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % tabs.length;
    } else {
      newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    }
    
    this.setActiveTab(tabs[newIndex]);
  }

  /**
   * Animate tab changes for better UX
   */
  private animateTabChange(): void {
    // Add entrance animation to the active content
    const activeContent = document.querySelector(`[data-tab="${this.activeTab}"]`);
    if (activeContent) {
      activeContent.classList.add('fade-in');
      setTimeout(() => {
        activeContent.classList.remove('fade-in');
      }, 300);
    }
  }

  /**
   * Track tab changes for analytics
   */
  private trackTabChange(tab: TabType): void {
    console.log(`Tab changed to: ${tab}`);
    // Implement analytics tracking here if needed
  }

  /**
   * Detect date selection from calendar
   */
  detectDate(event: any): void {
    if (event) {
      this.dateSelected = event.target?.value || event;
      
      // Auto-switch to appointments tab on mobile after date selection
      if (this.isMobile && this.dateSelected) {
        setTimeout(() => {
          this.setActiveTab('appointments');
        }, 300);
      }
      
      // Load appointments for selected date
      this.loadAppointmentsForDate(this.dateSelected);
    }
  }

  /**
   * Get appointments data
   */
  getCitas(event: AppointmentCard[]): void {
    this.isLoadingAppointments = true;
    this.citasHora = [];
    this.citasByDay = event || [];
    
    // Simulate loading delay
    setTimeout(() => {
      this.isLoadingAppointments = false;
      this.cdr.detectChanges();
    }, 300);
    
    console.log('Daily appointments received:', this.citasByDay);
  }

  /**
   * Get hourly schedule data
   */
  getHorarioCitas(evento: HourlyAppointment): void {
    this.isLoadingAppointments = true;
    this.citasByDay = [];
    this.citasHora = [evento];
    
    // Auto-switch to appointments tab on mobile
    if (this.isMobile) {
      this.setActiveTab('appointments');
    }
    
    setTimeout(() => {
      this.isLoadingAppointments = false;
      this.cdr.detectChanges();
    }, 300);
    
    console.log('Hourly appointment received:', this.citasHora);
  }

  /**
   * Load appointments for a specific date
   */
  private loadAppointmentsForDate(date: any): void {
    this.isLoadingAppointments = true;
    // Implement actual data loading here
    setTimeout(() => {
      this.isLoadingAppointments = false;
    }, 500);
  }

  /**
   * Get initials for avatar
   */
  nameAvatar(name: string): string {
    return this.api.getInitials(name);
  }

  /**
   * Get status colors for appointments
   */
  getStatusColors(status: any): { bg: string; text: string } {
    const colorMap = {
      'completada': { bg: stateColorsNormal['green-n'], text: stateColorsStrong['green-s'] },
      'en-proceso': { bg: stateColorsNormal['purple-n'], text: stateColorsStrong['purple-s'] },
      'confirmada': { bg: stateColorsNormal['blue-n'], text: stateColorsStrong['blue-s'] },
      'pendiente': { bg: stateColorsNormal['yellow-n'], text: stateColorsStrong['yellow-s'] },
      'cancelada': { bg: stateColorsNormal['red-n'], text: stateColorsStrong['red-s'] },
      'sin-confirmar': { bg: stateColorsNormal['orange-n'], text: stateColorsStrong['orange-s'] }
    };
    
    return colorMap[status] || { bg: '#f3f4f6', text: '#374151' };
  }

  /**
   * Get CSS class for appointment status
   */
  getStatusClass(status: string): string {
    return this.api.getStatusClass(status);
  }

  /**
   * Get random color for avatars
   */
  getRandomColor(letter: string): any {
    return this.api.getDualColorObject(letter);
  }

  /**
   * Get event theme CSS class
   */
  getEventThemeClass(theme: string): string {
    const themeClasses = {
      red: 'bg-red-50 border-l-4 border-red-500 text-red-800',
      blue: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
      green: 'bg-lime-50 border-l-4 border-lime-500 text-lime-700',
      yellow: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
      purple: 'bg-purple-50 border-l-4 border-purple-400 text-purple-700',
      cyan: 'bg-cyan-100 border-l-4 border-cyan-500 text-cyan-800',
    };
    return themeClasses[theme] || themeClasses['blue'];
  }

  /**
   * Open quick actions modal/drawer
   */
  openQuickActions(): void {
    console.log('Opening quick actions...');
    // Implement quick actions functionality
    // This could open a modal or navigate to a new appointment form
    
    // For now, let's navigate to create appointment
    if (this.router) {
      this.router.navigate(['/administrador/citas/nueva']);
    }
  }

  /**
   * Handle appointment card click
   */
  onAppointmentClick(appointment: AppointmentCard): void {
    console.log('Appointment clicked:', appointment);
    // Implement navigation to appointment details
  }

  /**
   * Handle appointment action (complete, cancel, etc.)
   */
  onAppointmentAction(action: string, appointment: any): void {
    console.log(`Action: ${action} for appointment:`, appointment);
    
    // Implement appointment action logic
    switch (action) {
      case 'complete':
        this.completeAppointment(appointment);
        break;
      case 'cancel':
        this.cancelAppointment(appointment);
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }

  /**
   * Complete an appointment
   */
  private completeAppointment(appointment: any): void {
    // Implement completion logic
    console.log('Completing appointment:', appointment);
    
    // Update UI
    if (this.citasHora.length > 0) {
      this.citasHora[0].event_theme = 'green';
    }
  }

  /**
   * Cancel an appointment
   */
  private cancelAppointment(appointment: any): void {
    // Implement cancellation logic
    console.log('Cancelling appointment:', appointment);
    
    // Update UI
    if (this.citasHora.length > 0) {
      this.citasHora[0].event_theme = 'red';
    }
  }

  /**
   * Refresh dashboard data
   */
  refreshData(): void {
    this.isLoadingAppointments = true;
    this.isLoadingCalendar = true;
    
    // Simulate data refresh
    setTimeout(() => {
      this.isLoadingAppointments = false;
      this.isLoadingCalendar = false;
      this.cdr.detectChanges();
    }, 1000);
    
    console.log('Refreshing dashboard data...');
  }

  /**
   * Get responsive class based on screen size
   */
  getResponsiveClass(baseClass: string): string {
    let modifiers = [];
    
    if (this.isMobile) {
      modifiers.push('mobile');
    }
    
    if (this.isTablet) {
      modifiers.push('tablet');
    }
    
    return `${baseClass} ${modifiers.join(' ')}`;
  }

  /**
   * Check if we should show empty state
   */
  shouldShowEmptyState(): boolean {
    return this.citasByDay.length === 0 && this.citasHora.length === 0 && !this.isLoadingAppointments;
  }

  /**
   * Get current tab indicator position for mobile navigation
   */
  getTabIndicatorStyle(): { [key: string]: any } {
    const tabs: TabType[] = ['calendar', 'appointments'];
    const activeIndex = tabs.indexOf(this.activeTab);
    const percentage = (activeIndex / tabs.length) * 100;
    
    return {
      transform: `translateX(${percentage}%)`,
      width: `${100 / tabs.length}%`
    };
  }

  /**
   * Handle swipe gestures on mobile
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (!this.isMobile) return;
    
    this.handleSwipeStart(event);
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (!this.isMobile) return;
    
    this.handleSwipeEnd(event);
  }

  private touchStartX = 0;
  private touchEndX = 0;

  private handleSwipeStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  private handleSwipeEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  private handleSwipeGesture(): void {
    const minSwipeDistance = 50;
    const swipeDistance = this.touchEndX - this.touchStartX;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right - previous tab
        this.navigateTabs('previous');
      } else {
        // Swipe left - next tab
        this.navigateTabs('next');
      }
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(action: string, startTime: number): void {
    const duration = Date.now() - startTime;
    console.log(`Performance: ${action} took ${duration}ms`);
  }
}