import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  let fixture: ComponentFixture<EmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyState);
    fixture.componentRef.setInput('title', 'No data');
    fixture.componentRef.setInput('message', 'Nothing was found');
    fixture.detectChanges();
  });

  it('should create and render the empty state', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.querySelector('h2')?.textContent).toContain('No data');
    expect(element.textContent).toContain('Nothing was found');
  });
});
