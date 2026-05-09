import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransactionPage } from './create-transaction-page';

describe('CreateTransactionPage', () => {
  let component: CreateTransactionPage;
  let fixture: ComponentFixture<CreateTransactionPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTransactionPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTransactionPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
