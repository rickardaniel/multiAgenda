import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from '../../services/flowbite-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-component',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss'
})
export default class AdminComponent {
  flagSidebar=false;
  currentYear = new Date().getFullYear();
  isReportesSection = false;

  constructor
  (
    private flowbiteService: FlowbiteService,
    private router: Router
  ) 
  {
  this.checkReportesRoute();
    
    // Escuchar cambios de ruta
    this.router.events.subscribe(() => {
      this.checkReportesRoute();
    });

  }

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  openSidebar(flag){
    this.flagSidebar=flag;
  }

  private checkReportesRoute(): void {
    const currentUrl = this.router.url;
    this.isReportesSection = currentUrl.startsWith('/administrador/reportes');
    console.log('res ==> ', this.isReportesSection);
    
  }

}
