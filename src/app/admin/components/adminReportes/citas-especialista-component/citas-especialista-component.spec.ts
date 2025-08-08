import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasEspecialistaComponent } from './citas-especialista-component';

describe('CitasEspecialistaComponent', () => {
  let component: CitasEspecialistaComponent;
  let fixture: ComponentFixture<CitasEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitasEspecialistaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
