import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashHeroComponent } from './dash-hero.component';

describe('DashHeroComponent', () => {
  let component: DashHeroComponent;
  let fixture: ComponentFixture<DashHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
