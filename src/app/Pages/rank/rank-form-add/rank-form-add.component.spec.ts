import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankFormAddComponent } from './rank-form-add.component';

describe('RankFormAddComponent', () => {
  let component: RankFormAddComponent;
  let fixture: ComponentFixture<RankFormAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankFormAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankFormAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
