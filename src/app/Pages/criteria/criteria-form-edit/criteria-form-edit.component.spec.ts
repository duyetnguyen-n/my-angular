import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaFormEditComponent } from './criteria-form-edit.component';

describe('CriteriaFormEditComponent', () => {
  let component: CriteriaFormEditComponent;
  let fixture: ComponentFixture<CriteriaFormEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriaFormEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
