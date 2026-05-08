import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWalletPage } from './create-wallet-page';

describe('CreateWalletPage', () => {
  let component: CreateWalletPage;
  let fixture: ComponentFixture<CreateWalletPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWalletPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateWalletPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
