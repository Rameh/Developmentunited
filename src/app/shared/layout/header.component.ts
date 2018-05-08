import { NgModule, Component, Inject, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
// for AngularFireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

import { CollapseModule } from 'ngx-bootstrap'

import { DialogComponent, DialogService, DialogOptions, DialogServiceConfig } from "ng2-bootstrap-modal";

import { LoginComponent } from '../../+login/login.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { OrgInfo } from '../models/orginfo.model'


@Component({
    selector: 'appc-header',
    styleUrls: ['./header.component.scss'],
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    emailId: string = '';
    userid: string = '';
    usersis:string;
    public isCollapsed: boolean = true;
    private subscription: Subscription;
    registeredorgs: FirebaseListObservable<OrgInfo>;
    orgData: Array<object>;
    projData: Array<object>;
    user: Observable<firebase.User>;
    orgTable: FirebaseListObservable<any[]>;


    constructor(public afAuth: AngularFireAuth,
        private dialogService: DialogService,
        public router: Router,
        private storageService: StorageService,
        public as: AuthService, public db: AngularFireDatabase
    ) {

        this.orgData = [];
        
        this.user = this.afAuth.authState;
        this.subscription = this.router.events.subscribe(s => {
            this.getOrganisationList();
            if (s instanceof NavigationEnd) {
                this.isCollapsed = true;

            }
        });

       
    }


   
    ngOnInit() {
                if (this.user) {
                    
                    this.emailId = this.storageService.getItem("email");
                    this.userid = this.storageService.getItem("userid");
        
                }
        
                this.getOrganisationList();
            }


    getOrganisationList() {
       this.usersis=this.storageService.getItem('userid')
        //console.log('Called getOrganisationList function')
        this.db.list('/users/' + this.usersis + '/myorgs/', { preserveSnapshot: true })
            .subscribe(orgRes => {
                this.orgData = [];
                orgRes.forEach(orgListRes => {
                    this.orgTable = orgListRes.val();
                    var key = orgListRes.key;
                    this.orgTable['orgKey'] = orgListRes.key;
                    this.orgData.push(this.orgTable);


                });

            })
    }









    logout() {
        // alert('you'+this.userid)
        this.as.signOut();
        //this.userid='';
        this.router.navigate(['home']);
        //this.orgData = [];
    }

    getAvatar() {
        return this.storageService.getAvatar();
    }

    getEmail() {
        return this.storageService.getUserName();
    }


}
