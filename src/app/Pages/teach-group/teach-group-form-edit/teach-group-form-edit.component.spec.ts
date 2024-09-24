import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachGroupFormEditComponent } from './teach-group-form-edit.component';

describe('TeachGroupFormEditComponent', () => {
  let component: TeachGroupFormEditComponent;
  let fixture: ComponentFixture<TeachGroupFormEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachGroupFormEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeachGroupFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
