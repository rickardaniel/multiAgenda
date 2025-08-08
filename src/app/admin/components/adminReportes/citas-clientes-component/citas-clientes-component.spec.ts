import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasClientesComponent } from './citas-clientes-component';

describe('CitasClientesComponent', () => {
  let component: CitasClientesComponent;
  let fixture: ComponentFixture<CitasClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
