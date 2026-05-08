import { Routes } from '@angular/router';
import { CreateWalletPage } from '../pages/create-wallet-page/create-wallet-page';
import { ImportWalletPage } from '../pages/import-wallet-page/import-wallet-page';

export const routes: Routes = [
  { path: 'create', component: CreateWalletPage },
  { path: 'import', component: ImportWalletPage },
];
