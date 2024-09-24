import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MainComponent } from '../main/main.component';

// export const ROUTES: Routes = [
//   {
//     path: '', component: MainComponent,
//     children: [
//       {
//         path: 'dashboard', component: DashboardComponent
//       }
//     ]
//   },

// ];
export const ROUTES: Routes = [
  { path: '', component: DashboardComponent },
];
