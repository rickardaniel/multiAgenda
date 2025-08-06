import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
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

  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });
  }

  openSidebar(flag){
    this.flagSidebar=flag;
  }

}
