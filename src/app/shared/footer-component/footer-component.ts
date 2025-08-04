import { Component } from '@angular/core';
interface FooterLink {
  text: string;
  url: string;
}
@Component({
  selector: 'app-footer-component',
  imports: [],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss'
})
export default class FooterComponent {
  currentYear = new Date().getFullYear();
  appVersion = '0.0.43';
    // Enlaces del footer
  footerLinks: FooterLink[] = [
    { text: 'Políticas de Privacidad', url: '#' },
    { text: 'Términos y Condiciones', url: '#' },
    { text: 'Sobre Nosotros', url: '#' },
    { text: 'Contacto', url: '#' }
  ];


}
