import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CourseOfActionsComponent} from './course-of-actions.component';

describe('CourseOfActionsComponent', () => {
  let component: CourseOfActionsComponent;
  let fixture: ComponentFixture<CourseOfActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [CourseOfActionsComponent]
                                   })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseOfActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
