import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';



const routes: Routes = [
  { path: 'login/:messageid', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'reset', component: ResetComponent },

];

export const routing = RouterModule.forChild(routes);