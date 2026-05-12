import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  let fixture: ComponentFixture<EmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyState);
    fixture.componentRef.setInput('title', 'Nenhum dado');
    fixture.componentRef.setInput('message', 'Nada foi encontrado');
    fixture.detectChanges();
  });

  it('should create and render the empty state', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.querySelector('h2')?.textContent).toContain('Nenhum dado');
    expect(element.textContent).toContain('Nada foi encontrado');
  });
});
