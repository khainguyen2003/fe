import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenderStatusIconComponent } from './render-status-icon.component';

describe('RenderStatusIconComponent', () => {
  let component: RenderStatusIconComponent;
  let fixture: ComponentFixture<RenderStatusIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenderStatusIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RenderStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
