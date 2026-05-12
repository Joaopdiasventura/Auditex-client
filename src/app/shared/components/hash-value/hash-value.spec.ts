import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HashValue } from './hash-value';

describe('HashValue', () => {
  let fixture: ComponentFixture<HashValue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HashValue],
    }).compileComponents();

    fixture = TestBed.createComponent(HashValue);
  });

  it('should create and shorten long values', () => {
    fixture.componentRef.setInput('value', 'abcdef1234567890abcdef1234567890');
    fixture.componentRef.setInput('head', 6);
    fixture.componentRef.setInput('tail', 4);
    fixture.detectChanges();

    const code = (fixture.nativeElement as HTMLElement).querySelector('code');
    expect(fixture.componentInstance).toBeTruthy();
    expect(code?.textContent).toBe('abcdef...7890');
    expect(code?.getAttribute('title')).toBe('abcdef1234567890abcdef1234567890');
  });
});
