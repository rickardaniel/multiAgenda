import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioConfigComponent } from './calendario-config-component';

describe('CalendarioConfigComponent', () => {
  let component: CalendarioConfigComponent;
  let fixture: ComponentFixture<CalendarioConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarioConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarioConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
