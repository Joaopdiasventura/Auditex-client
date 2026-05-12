import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  let fixture: ComponentFixture<StatusBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadge);
  });

  it('should create and render a mined status as gold', () => {
    fixture.componentRef.setInput('status', 'MINED');
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector('.badge');
    expect(fixture.componentInstance).toBeTruthy();
    expect(badge?.textContent).toContain('Minerada');
    expect(badge?.classList.contains('gold')).toBe(true);
  });

  it('should render errors as danger', () => {
    fixture.componentRef.setInput('status', 'REJECTED');
    fixture.detectChanges();

    const badge = (fixture.nativeElement as HTMLElement).querySelector('.badge');
    expect(badge?.classList.contains('danger')).toBe(true);
  });
});
