import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'wallet', loadChildren: () => import('./features/wallet/routes').then((m) => m.routes) },
];
