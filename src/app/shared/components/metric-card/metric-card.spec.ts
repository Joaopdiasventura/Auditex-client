import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCard } from './metric-card';

describe('MetricCard', () => {
  let fixture: ComponentFixture<MetricCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCard],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCard);
    fixture.componentRef.setInput('label', 'Blocks');
    fixture.componentRef.setInput('value', 12);
    fixture.componentRef.setInput('tone', 'gold');
    fixture.detectChanges();
  });

  it('should create and render metric values', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.textContent).toContain('Blocks');
    expect(element.querySelector('strong')?.textContent).toContain('12');
    expect(element.querySelector('strong')?.classList.contains('gold')).toBe(true);
  });
});
