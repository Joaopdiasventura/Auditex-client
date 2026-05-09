import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'wallet', loadChildren: () => import('./features/wallet/routes').then((m) => m.routes) },
  { path: 'transaction', loadChildren: () => import('./features/transaction/routes').then((m) => m.routes) },
];
