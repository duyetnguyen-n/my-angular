import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachGroupComponent } from './teach-group.component';

describe('TeachGroupComponent', () => {
  let component: TeachGroupComponent;
  let fixture: ComponentFixture<TeachGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
