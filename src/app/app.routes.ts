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
    // children: [
    //   // <i class="bi bi-speedometer"></i>
    //   {},
    // ],
  },
];
