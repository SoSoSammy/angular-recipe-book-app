import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  // * Every module works on its own in Angular. We must export what we want to use
  // When we import a module, we import everything that module exports
})
export class AppRoutingModule {}
