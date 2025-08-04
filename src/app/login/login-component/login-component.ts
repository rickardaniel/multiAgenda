import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import FooterComponent from '../../shared/footer-component/footer-component';

@Component({
  selector: 'app-login-component',
  imports: [ ReactiveFormsModule, FooterComponent],
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

  formAccess = new FormGroup({
    'usuario': new FormControl('', Validators.required),
    'password': new FormControl('', Validators.required),
  })

  goToPage(){
    this.router.navigateByUrl('agendar');
  }

  accessSystem(form){

  }

}
