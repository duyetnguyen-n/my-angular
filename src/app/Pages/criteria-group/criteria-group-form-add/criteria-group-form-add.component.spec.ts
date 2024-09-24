import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaGroupFormAddComponent } from './criteria-group-form-add.component';

describe('CriteriaGroupFormAddComponent', () => {
  let component: CriteriaGroupFormAddComponent;
  let fixture: ComponentFixture<CriteriaGroupFormAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriaGroupFormAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaGroupFormAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
