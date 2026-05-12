import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonPreview } from './json-preview';

describe('JsonPreview', () => {
  let fixture: ComponentFixture<JsonPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(JsonPreview);
    fixture.componentRef.setInput('label', 'Payload');
    fixture.componentRef.setInput('value', { amount: 10 });
    fixture.detectChanges();
  });

  it('should create and render formatted JSON', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(element.textContent).toContain('Payload');
    expect(element.querySelector('pre')?.textContent).toContain('"amount": 10');
  });
});
