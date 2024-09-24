import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriaFormAddComponent } from './criteria-form-add.component';

describe('CriteriaFormAddComponent', () => {
  let component: CriteriaFormAddComponent;
  let fixture: ComponentFixture<CriteriaFormAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriteriaFormAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriteriaFormAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
