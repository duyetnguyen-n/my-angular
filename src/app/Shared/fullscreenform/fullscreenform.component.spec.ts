import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenformComponent } from './fullscreenform.component';

describe('FullscreenformComponent', () => {
  let component: FullscreenformComponent;
  let fixture: ComponentFixture<FullscreenformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullscreenformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullscreenformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
