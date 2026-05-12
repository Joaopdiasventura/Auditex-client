import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'create',
    loadComponent: () => import('../pages/create-wallet-page/create-wallet-page').then((m) => m.CreateWalletPage),
  },
  {
    path: 'import',
    loadComponent: () => import('../pages/import-wallet-page/import-wallet-page').then((m) => m.ImportWalletPage),
  },
];
