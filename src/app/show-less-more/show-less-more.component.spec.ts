import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLessMoreComponent } from './show-less-more.component';

describe('ShowLessMoreComponent', () => {
  let component: ShowLessMoreComponent;
  let fixture: ComponentFixture<ShowLessMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowLessMoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowLessMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
