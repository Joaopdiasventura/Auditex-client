import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
  {
    path: 'ledger/transaction/:hash',
    loadComponent: () =>
      import('./features/ledger/pages/transaction-detail-page/transaction-detail-page').then((m) => m.TransactionDetailPage),
  },
  {
    path: 'ledger',
    loadComponent: () => import('./features/ledger/pages/ledger-page/ledger-page').then((m) => m.LedgerPage),
  },
  {
    path: 'block/:id',
    loadComponent: () => import('./features/block/pages/block-detail-page/block-detail-page').then((m) => m.BlockDetailPage),
  },
  {
    path: 'block',
    loadComponent: () => import('./features/block/pages/block-list-page/block-list-page').then((m) => m.BlockListPage),
  },
  {
    path: 'event/create',
    loadComponent: () =>
      import('./features/transaction/pages/create-transaction-page/create-transaction-page').then(
        (m) => m.CreateTransactionPage,
      ),
  },
  { path: 'wallet', loadChildren: () => import('./features/wallet/routes').then((m) => m.routes) },
  { path: 'transaction', loadChildren: () => import('./features/transaction/routes').then((m) => m.routes) },
  { path: '**', redirectTo: 'dashboard' },
];
