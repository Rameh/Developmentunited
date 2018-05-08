import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';


@Injectable()
export class UtilityService {

    private _router: Router;

    constructor(router: Router,private stsvc:StorageService) {
        this._router = router;
    }

    convertDateTime(date: Date) {
        let _formattedDate = new Date(date.toString());
        return _formattedDate.toDateString();
    }

    navigate(path: string) {
        this._router.navigate([path]);
    }
    navigatewithmessage(path: string,messageid:string) {
    
        path+="/"+messageid;
        this._router.navigateByUrl(path);
    }
    signInWithMessageId(messageid:string) {
        let path="/login/"+messageid;
        this._router.navigateByUrl(path);
    }

    gotoHashtag( path: string,hashtag:string ) {
        this._router.navigate( [ '/'+path ], { fragment: hashtag } );
      }

    navigateToSignIn() {
        this.navigate('/login/new');
    }
}
