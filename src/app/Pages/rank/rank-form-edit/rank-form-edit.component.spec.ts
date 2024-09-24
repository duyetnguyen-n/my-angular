import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankFormEditComponent } from './rank-form-edit.component';

describe('RankFormEditComponent', () => {
  let component: RankFormEditComponent;
  let fixture: ComponentFixture<RankFormEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankFormEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankFormEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
