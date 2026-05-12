import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'create',
    loadComponent: () => import('../pages/create-transaction-page/create-transaction-page').then((m) => m.CreateTransactionPage),
  },
];
