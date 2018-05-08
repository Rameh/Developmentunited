import { Injectable,Output, EventEmitter} from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from "@angular/router";
import * as firebase from 'firebase';

// import * as Firebase from 'firebase';

import { AuthModel } from '../models/auth.model';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { AlertService } from './alert.service';



import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthService {

  authState: any = null;
  user : FirebaseObjectObservable<any>
  token: string;
  id:any;


  

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storageService:StorageService,
    private router: Router,
    private userService:UserService,
    private alertService:AlertService) {

    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });

    

  }




  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.authState !== null;
  }

 

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : 'Guest';
  }

  // Anonymous User
  get currentUserAnonymous(): boolean {
    return this.authenticated ? this.authState.isAnonymous : false
  }

  // Returns current user display name or Guest
  get currentUserDisplayName(): string {
    if (!this.authState) { return 'Guest' }
    else if (this.currentUserAnonymous) { return 'Anonymous' }
    else { return this.authState['displayName'] || 'User without a Name' }
  }

  //// Social Auth ////

  githubLogin() {
    const provider = new firebase.auth.GithubAuthProvider()
    return this.socialSignIn(provider);
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    return this.socialSignIn(provider);
  }


  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.authState = credential.user
        this.updateUserData()
      })
      .catch(error => console.log('This is sign in error '+error));
  }


  //// Anonymous Auth ////

  anonymousLogin() {
    return this.afAuth.auth.signInAnonymously()
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(error => console.log(error));
  }

  getAuth(){

    return this.afAuth.auth;

  }
  emailSignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user
        this.updateUserData()
      })
      .catch(error => {
         //console.log(error)
         throw error
        
      });
  }

  
  emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.authState = user;
        this.updateUserData();
        return user;
      })
      .catch(error => {
        //console.log(error)
        throw error
      });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    var auth = firebase.auth();

    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
  }


  //// Sign Out ////

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  getemail(){

  return this.authState? this.authState.email:'';
  }

  getUserId(){

    return this.authState? this.authState.uid:'';
  }


  //// Helpers ////

  private  updateUserData(): void {
    // Writes user name and email to realtime db
    // useful if your app displays information about users or for admin features

    let user = {
      name: 'Guest',
      photo: '/assets/img/default_avatar.png'
    };
    let authState = this.authState;
    this.storageService.addItem('userid', authState.uid);
    this.storageService.addItem('email', authState.email);
    this.storageService.addItem('name', authState.displayName? authState.displayName:authState.email);
    this.storageService.addItem('photoURL', authState.photoURL);
    //alert("display Name"+this.currentUserId)
    //alert("authState"+authState)
    let path = this.db.object("/users/" + this.afAuth.auth.currentUser.uid);
    path.update({
      email: authState.email,
      name: authState.displayName? authState.displayName:authState.email,
      photoUrl: authState.photoURL,
    });
    

  }

  getAvatar(){

    let path = `/users/${this.afAuth.auth.currentUser.uid}`;
    let user = this.db.object(path);
  }

  userName(): any {
    let path = `/users/${this.afAuth.auth.currentUser.uid}`;
    return this.db.object(path);
    
  }

  saveUserInfo(uid, name, email, photoUrl, flag) {
    let user = this.db.object('/users/' + uid);
    user.set({
      fullName: name,
      email: email,
      photoUrl: photoUrl,
      isRegistered: flag
    });
   
  }





}
