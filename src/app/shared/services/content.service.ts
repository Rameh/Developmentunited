import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase';

@Injectable()
export class ContentService {

    constructor(private afAuth: AngularFireAuth,
        private db: AngularFireDatabase,
        private router:Router) { }

    get(lang?: string): FirebaseObjectObservable<any> {
        return this.db.object(`/content/${lang}`);
    }
}
