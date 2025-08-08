import { Routes } from '@angular/router';
import { LoginComponent } from './login/login-component/login-component';
import AgendaComponent from './login/agenda-component/agenda-component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'agendar',
    component: AgendaComponent,
  },
  {
    path: 'administrador',
    loadComponent: () => import('./admin/admin-component/admin-component'),
    children: [
      {
        path: '',
        title: 'Inicio',
        loadComponent: () =>
          import('../app/admin/components/inicio-component/inicio-component'),
      },
      {
        path: 'citas',
        title: 'Citas',
        loadComponent: () =>
          import('../app/admin/components/citas-component/citas-component'),
      },
      {
        path: 'clientes',
        title: 'Clientes',
        loadComponent: () =>
          import('../app/admin/components/clientes-component/clientes-component'),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('../app/admin/components/reportes-component/reportes-component'),
        children:[
        {
        path: '',
        title: 'Dashboard',
        loadComponent: () =>
          import('../app/admin/components/adminReportes/dashboard-component/dashboard-component'),
        },
        {
        path: 'citas_servicios',
        title: 'Citas por servicio',
        loadComponent: () =>
          import('../app/admin/components/adminReportes/citas-servicio-component/citas-servicio-component'),
        },
        {
        path: 'citas_especialista',
        title: 'Citas por especialista',
        loadComponent: () =>
          import('../app/admin/components/adminReportes/citas-especialista-component/citas-especialista-component'),
        },
        {
        path: 'citas_clientes',
        title: 'Citas por cliente',
        loadComponent: () =>
          import('../app/admin/components/adminReportes/citas-clientes-component/citas-clientes-component'),
        },
        ]
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('../app/admin/components/configuracion-component/configuracion-component'),
        children:[
        ]
      }
    ],
  },
];
