import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase,FirebaseObjectObservable } from 'angularfire2/database';
import {  Profile } from '../models/profile.model'
import {  User } from '../models/user.model'
import * as firebase from 'firebase';

@Injectable()
export class UserService {
  public displayName: string;
  public email: string;
  public user : any;

    constructor(private db: AngularFireDatabase,
                private storageService: StorageService) {
      
  
    
    }

    isUserRegistered(uid) {
      //alert("hi")
      let user = this.db.object('/users/' + uid);
      return user['isRegistered'] === true;
    }

    
    updateUserStatus(uid) {
      //alert("hi")
      let user = this.db.object('/users/' + uid);
      user.update({
        isRegistered: true
      });
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

    getUserToken(){
          firebase.auth().currentUser.getToken(/* forceRefresh */ true).then(function(idToken) {
            // Send token to your backend via HTTPS
       
            return idToken;
          }).catch(function(error) {
            // Handle error
          });
    }

    saveUserLocally(currentUser, state: boolean) {
      this.storageService.addItem('uid', currentUser.uid);
      this.storageService.addItem('email', currentUser.email);
      this.storageService.addItem('name', currentUser.displayName);
      this.storageService.addItem('photoUrl', currentUser.photoURL);
      this.storageService.addItem('isRegistered', true.valueOf.toString());
      
    }

      saveUserinDb(currentUser, flag) {
      let user = this.db.object('/users/' + currentUser.uid);
      user.set({
        uid: currentUser.uid,
        fullName: currentUser.displayName,
        email: currentUser.email,
        photoUrl: currentUser.photoURL,
        isRegistered: flag
       });
      
    }
    
    keepInTouch(email) {
     return firebase.database().ref().child('touch/').push({
        email: email
      });   
    }

    getUser(id){
      //alert(id)
      this.user= this.db.object('/users/' + id) as FirebaseObjectObservable<User>;
      return this.user;
    }

    getUserProfileInformation() {
      let user = firebase.auth().currentUser;
      let name, email, photoUrl, uid, emailVerified;
      
      if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;
        return user.uid;
      }

    
    }

    

    verificationUserEmail() {
        firebase.auth().currentUser.sendEmailVerification().then(() => {
          // Email sent.
        }, (error) => {
          // An error happened.
        });
    }
    
   
    
    sendUserPasswordResetEmail() {
        firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email).then(() => {
          // Email sent.
        }, (error) => {
          // An error happened.
        });
    } 

    
    sendWelcomeEmail() {
      const mailOptions = {
        from: `noreply@membership-du-dev.firebaseapp.com`,
        to: 'kolakalurivijay91@gmail.com'
      };
//asas
     
    }
//vijayasdsad
    getUserObject(id: string) {
      return this.db.object('/users/' + id).subscribe((result) => {
        //console.log(result);
        return result;
      
      });
    }
  
      
}
