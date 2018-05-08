import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { SocialLoginComponent } from './sociallogin/social-login.component';
import { LoginComponent } from './login.component';
import { routing } from './login.routes';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';


@NgModule({
    imports: [
        routing,
        SharedModule
    ], entryComponents:[LoginComponent,ForgotComponent,ResetComponent],
    declarations: [LoginComponent, SocialLoginComponent, ForgotComponent, ResetComponent]
})
export class LoginModule { }
