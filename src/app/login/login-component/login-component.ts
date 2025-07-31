import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [],
  templateUrl: './login-component.html',
  styleUrl: './login-component.scss'
})
export class LoginComponent {

  constructor
  (
    private router: Router
  )
  {
  }

  goToPage(){
    this.router.navigateByUrl('agendar');
  }

}
