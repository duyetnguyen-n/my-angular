import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaOfEvaluateComponent } from './criteria-of-evaluate.component';

describe('CriteriaOfEvaluateComponent', () => {
  let component: CriteriaOfEvaluateComponent;
  let fixture: ComponentFixture<CriteriaOfEvaluateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriaOfEvaluateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaOfEvaluateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
