import { Component, HostListener } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../services/flowbite-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-component',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss',
})
export default class AdminComponent {
  flagSidebar = false;
  currentYear = new Date().getFullYear();
  isReportesSection = false;
  isConfigSection = false;
  namePlace: any;
      isDropdownOpen: boolean = true // Estado inicial del dropdown

  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router
  ) {
    this.checkReportesRoute();

    // Escuchar cambios de ruta
    this.router.events.subscribe(() => {
      this.checkReportesRoute();
    });
  }

  ngOnInit(): void {
            this.toggleDropdown()

    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  openSidebar(flag) {
    this.flagSidebar = flag;
  }

  private checkReportesRoute(): void {
    const currentUrl = this.router.url;
    this.isReportesSection = currentUrl.startsWith('/administrador/reportes');
    this.isConfigSection = currentUrl.startsWith(
      '/administrador/configuracion'
    );
    if (this.isReportesSection) {
      this.namePlace = 'Reportes';
    } else if (this.isConfigSection) {
      this.namePlace = 'Configuración';
    }
    console.log('res ==> ', this.isReportesSection);
    console.log('res ==> ', this.namePlace);
  }

     // Cerrar el dropdown cuando se hace clic fuera de él
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdownButton = document.getElementById('dropdown-button')
    const dropdownMenu = document.getElementById('dropdown-menu')

    if (dropdownButton && dropdownMenu && !dropdownButton.contains(event.target as Node) && !dropdownMenu.contains(event.target as Node)) {
      this.isDropdownOpen = false
    }
  }


    toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen
  }

  redirectTo(){
    this.router.navigateByUrl('/administrador/cuenta');
       this.toggleDropdown();
  }

  returnInit(){
    console.log('exit');
        this.toggleDropdown();
        setTimeout(() => {
                  this.router.navigateByUrl('/');

        }, 300);


  }

}
