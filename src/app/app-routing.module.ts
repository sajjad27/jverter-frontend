import { Routes } from '@angular/router';
import { ProgramsComponent } from './components/programs/components/programs.component';
import { TogglzGuard } from './guard/togglz.guard';
import { TogglzComponent } from './components/togglz/togglz.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [TogglzGuard],
    children: [
      { path: 'programs', component: ProgramsComponent },
      { path: 'togglz', component: TogglzComponent },
      { path: '**', redirectTo: '/programs' }
    ]
  }
];



