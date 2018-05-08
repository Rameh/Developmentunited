import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './+register';
import { RegisterConfirmationComponent } from './+confirmation/register-confirmation.component';
import { routing } from './register.routes';


@NgModule({
    imports: [
        routing,
        SharedModule
    ],
    declarations: [
        RegisterComponent,
        RegisterConfirmationComponent
    ]
})
export class RegisterModule { }
