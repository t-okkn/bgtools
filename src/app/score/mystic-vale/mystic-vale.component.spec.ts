import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MysticValeComponent } from './mystic-vale.component';

describe('MysticValeComponent', () => {
  let component: MysticValeComponent;
  let fixture: ComponentFixture<MysticValeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MysticValeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MysticValeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
