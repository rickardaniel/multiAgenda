import { Routes } from '@angular/router';
import { LoginComponent } from './login/login-component/login-component';
import AgendaComponent from './login/agenda-component/agenda-component';

export const routes: Routes = [
    {
        path:'', component: LoginComponent
    },
    {
        path:'agendar', component: AgendaComponent
    }
];
