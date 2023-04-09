import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'submittions',
    pathMatch: 'full'
  },
  {
    path: 'submittions',
    loadChildren: () => import('./submissions/submissions.module').then(m => m.SubmissionsModule)
  },
  {
    path: '**',
    redirectTo: 'submittions',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
