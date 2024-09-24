import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachGroupFormAddComponent } from './teach-group-form-add.component';

describe('TeachGroupFormAddComponent', () => {
  let component: TeachGroupFormAddComponent;
  let fixture: ComponentFixture<TeachGroupFormAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachGroupFormAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachGroupFormAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
