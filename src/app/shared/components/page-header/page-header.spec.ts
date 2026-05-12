import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeader } from './page-header';

describe('PageHeader', () => {
  let fixture: ComponentFixture<PageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHeader);
    fixture.componentRef.setInput('eyebrow', 'Ledger');
    fixture.componentRef.setInput('title', 'Visão da auditoria');
    fixture.componentRef.setInput('description', 'Acompanhe a integridade');
    fixture.detectChanges();
  });

  it('should create and render header content', () => {
    expect(fixture.componentInstance).toBeTruthy();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Ledger');
    expect(element.querySelector('h1')?.textContent).toContain('Visão da auditoria');
    expect(element.textContent).toContain('Acompanhe a integridade');
  });
});
