import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaOfEvaluateAddComponent } from './criteria-of-evaluate-add.component';

describe('CriteriaOfEvaluateAddComponent', () => {
  let component: CriteriaOfEvaluateAddComponent;
  let fixture: ComponentFixture<CriteriaOfEvaluateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriaOfEvaluateAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaOfEvaluateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
