import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeDialogComponent } from './episode-dialog.component';

describe('EpisodeDialogComponent', () => {
  let component: EpisodeDialogComponent;
  let fixture: ComponentFixture<EpisodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
