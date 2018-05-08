import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { LoginModel } from './login.model';
import { AuthService } from '../shared/services/auth.service';
import { ControlBase, ControlTextbox, ControlCheckbox } from '../shared/forms';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../shared/services/storage.service';
import { UserService } from '../shared/services/user.service';

export interface ConfirmModel {
  title:string;
  message:string;
}
@Component({
    selector: 'appc-login',
    styleUrls: ['./login.component.scss'],
    templateUrl: './login.component.html'
})
export class LoginComponent   implements ConfirmModel,OnInit {
    loginModel: LoginModel;
    errors: string[];
    controls: any;
    title: string;
    loginmsg: string;
    message:string;

    constructor(public userService:UserService,public storageSvc:StorageService,dialogService: DialogService,private auth: AuthService, private router: Router, private authService: AuthService,  private storageService:StorageService, private route :ActivatedRoute) {
        this.loginModel = new LoginModel('', '', false);
    }

    login(model: any) {
        this.loginModel.email = model.email;
        this.loginModel.password = model.password;
        this.auth.emailLogin(this.loginModel.email.toString(),this.loginModel.password.toString())
            .then((result) => {console.log("this is result login "+JSON.stringify(result))
        
                this.router.navigateByUrl('/orgsearch')
                
            }).catch( error => {
                //console.log(error)
                this.loginmsg = error.message
            });
    };



    ngOnInit() {

        this.route.params.subscribe(params => {
            let messageid=params['messageid'] ? params['messageid']:'';
            if(messageid && messageid ==='auth2reg'){

                this.loginmsg = this.storageSvc.getItem(messageid) ; 
            } else
            this.loginmsg = "Please login" ;
            
         });
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


    signup(){

        this.router.navigateByUrl("/register");
    }

}
