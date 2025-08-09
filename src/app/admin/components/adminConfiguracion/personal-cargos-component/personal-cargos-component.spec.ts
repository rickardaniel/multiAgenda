import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCargosComponent } from './personal-cargos-component';

describe('PersonalCargosComponent', () => {
  let component: PersonalCargosComponent;
  let fixture: ComponentFixture<PersonalCargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalCargosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalCargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
