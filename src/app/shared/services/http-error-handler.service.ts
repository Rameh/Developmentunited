// CREDIT:
//  The vast majority of this code came right from Ben Nadel's post:
//  http://www.bennadel.com/blog/3047-creating-specialized-http-clients-in-angular-2-beta-8.htm
//
// My updates are mostly adapting it for Typescript:
//  1. Importing required modules
//  2. Adding type notations
//  3. Using the 'fat-arrow' syntax to properly scope in-line functions
//
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiGatewayService } from './api-gateway.service';

@Injectable()
export class HttpErrorHandlerService {

    constructor(private apiGateway: ApiGatewayService) {
        apiGateway.errors$.subscribe(
            (value: any) => {
                console.group("HttpErrorHandler");
                //console.log(value.status, "status code detected.");
                console.dir(value);
                console.groupEnd();
                // If the user made a request that they were not authorized
                // to, it's possible that their session has expired. Let's
                // refresh the page and let the server-side routing move the
                // user to a more appropriate landing page.
                if (value.status === 401) {
                    window.location.reload();
                }
            });
    }
    
    // constructor(private _router: Router) { }

    // handle(error: any) {
    //     if (error.status === 401) {
    //         sessionStorage.clear();
    //         // window.location.href = 'login';
    //         this._router.navigate(['Login']);
    //     }
    // }
}
