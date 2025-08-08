import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasServicioComponent } from './citas-servicio-component';

describe('CitasServicioComponent', () => {
  let component: CitasServicioComponent;
  let fixture: ComponentFixture<CitasServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
