import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterorgComponent } from './registerorg.component';

describe('RegisterorgComponent', () => {
  let component: RegisterorgComponent;
  let fixture: ComponentFixture<RegisterorgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterorgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterorgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
