import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: '', redirectTo: 'editor', pathMatch: 'full' },
  { path: '**', redirectTo: '',  pathMatch: 'full'},
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(routes);
