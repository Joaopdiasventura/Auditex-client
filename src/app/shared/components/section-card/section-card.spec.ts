import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectionCard } from './section-card';

describe('SectionCard', () => {
  let fixture: ComponentFixture<SectionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionCard],
    }).compileComponents();

    fixture = TestBed.createComponent(SectionCard);
    fixture.componentRef.setInput('label', 'Ledger');
    fixture.componentRef.setInput('title', 'Integridade');
    fixture.componentRef.setInput('tone', 'accent');
    fixture.detectChanges();
  });

  it('should create and render section chrome', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.textContent).toContain('Ledger');
    expect(element.querySelector('h2')?.textContent).toContain('Integridade');
    expect(element.querySelector('.section-card')?.classList.contains('accent')).toBe(true);
  });
});
