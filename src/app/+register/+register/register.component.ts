import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../shared/services/auth.service';
import { RegisterModel } from '../register.model';
import { ControlBase, ControlTextbox } from '../../shared/forms';

@Component({
    selector: 'appc-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    registerModel: RegisterModel;
    private errors: string[];
    private controls: ControlBase<any>[];
    registermsg:string;

    constructor(public auth: AuthService, public router: Router, private route: ActivatedRoute) {
        this.registerModel = new RegisterModel('', '');
    }

    register(model: any): void {
        this.registerModel.email = model.email;
        this.registerModel.password = model.password;
        this.auth.emailSignUp(this.registerModel.email.toString(),this.registerModel.password.toString())
            .then(result => {
                this.auth.emailLogin(this.registerModel.email.toString(),this.registerModel.password.toString())
                .then( result => {
                    //alert("You are successfully registered. Please login.")
                    this.router.navigateByUrl('/login/new')
                }).catch( error => {
                    //console.log(error)
                    this.registermsg = error.message
                })
            }).catch(error => {
                //console.log(error)
                this.registermsg = error.message
            });
    }

    ngOnInit() {
        let controls: ControlBase<any>[] = [
            new ControlTextbox({
                key: 'email',
                label: 'Email',
                placeholder: 'Email',
                value: '',
                type: 'email',
                required: true,
                order: 1
            }),
            new ControlTextbox({
                key: 'password',
                label: 'Password',
                placeholder: 'Password',
                value: '',
                type: 'password',
                required: true,
                order: 2
            })
        ];

        this.controls = controls;
    }


    signin(){
        
                this.router.navigateByUrl("/login/new");
    }

}
