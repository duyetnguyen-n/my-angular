import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaGroupFormEditComponent } from './criteria-group-form-edit.component';

describe('CriteriaGroupFormEditComponent', () => {
  let component: CriteriaGroupFormEditComponent;
  let fixture: ComponentFixture<CriteriaGroupFormEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriaGroupFormEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaGroupFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
