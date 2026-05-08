import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportWalletPage } from './import-wallet-page';

describe('ImportWalletPage', () => {
  let component: ImportWalletPage;
  let fixture: ComponentFixture<ImportWalletPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportWalletPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportWalletPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
