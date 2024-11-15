import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestScenariosComponent } from './components/test-scenarios/test-scenarios.component';
import { TestSessionsComponent } from './components/test-sessions/test-sessions.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/test-sessions',
    pathMatch: 'full',
  },
  {
    path: 'test-sessions',
    component: TestSessionsComponent,
  },
  {
    path: 'test-scenarios',
    component: TestScenariosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
