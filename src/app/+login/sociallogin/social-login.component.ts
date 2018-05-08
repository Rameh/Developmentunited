import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Response } from '@angular/http';

import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'appc-social-login',
    styleUrls: ['./social-login.component.scss'],
    templateUrl: './social-login.component.html'
})
export class SocialLoginComponent implements OnInit {
    constructor(private auth: AuthService, private router: Router) { }

    ngOnInit() { }

    signInWithGithub(): void {
        this.auth.githubLogin()
            .then((result) => this.postSignIn(result));
    }

    signInWithGoogle(): void {
        this.auth.googleLogin()
            .then((result) => this.postSignIn(result));
    }

    signInWithTwitter(): void {
        this.auth.twitterLogin()
            .then((result) => this.postSignIn(result));
    }

    signInWithFacebook(): void {
        this.auth.facebookLogin()
            .then((result) => this.postSignIn(result)
        );
    }
    signInWithLinkedIn(): void {
        //console.log('todo sigin with linked');
    }

    private postSignIn(result): void {
        console.log('This is the result '+result)
        this.auth.authenticated
        console.log('This is the authenticated '+this.auth.authenticated)
            if(this.auth.authenticated == true){
                this.router.navigate(['/orgsearch']);
            }else{
                console.log('This is false')
            }
    }


}
