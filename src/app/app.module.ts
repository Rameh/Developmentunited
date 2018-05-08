import { Title } from '@angular/platform-browser';
import { NgModule, NgModuleFactoryLoader } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  ApplicationRef, CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA} from '@angular/core';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { AgmCoreModule} from "angular2-google-maps/core";


import { routing } from "./app.routes";
import { PlacesAutoComplete} from './shared/directives/google-places.directive'
import { GeocodingService } from './shared/services/geocode.service';

import { UploadFileService } from './shared/services/upload-service';
// import { routing } from './app.routes';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';
import { LoginModule } from './+login/login.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';


@NgModule({
    declarations: [AppComponent,PlacesAutoComplete],
    imports: [
        BrowserModule,
        CommonModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        routing,
        AgmCoreModule.forRoot({
            apiKey: "AIzaSyDxzY0Z7zefnhw6HbzHcQqIOxy_UmJQV-4",
            libraries: ["places"]
          }),
        // Only module that app module loads
        SharedModule.forRoot(),
        HomeModule,
        LoginModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,FormsModule,ReactiveFormsModule,
        BootstrapModalModule
    ],
    exports: [
        CommonModule
    ], //entryComponents:[LoginComponent],
    
    providers: [
        AppService,
        Title,
        UploadFileService,
        GeocodingService
        
    ],
    schemas:  [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA ],
    bootstrap: [AppComponent]
})
export class AppModule { }


