import { Routes } from '@angular/router';
import { ProgramsComponent } from './components/programs/components/programs.component';

export const routes: Routes = [

  {
    path: 'programs', children: [
      { path: "", component: ProgramsComponent }
    ]
  },
  { path: '**', redirectTo: '/programs' }

];