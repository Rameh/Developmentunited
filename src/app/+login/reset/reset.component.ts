import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';
import { UserService } from '../../shared/services/user.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'appc-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  actioncode:string;
  userForm: FormGroup;
  email:string;
  errorStr:string;
  

  constructor(
    public userService:UserService,
    public storageSvc:StorageService,
    public auth: AuthService, 
    public router: Router, 
    public storageService:StorageService, 
    public route :ActivatedRoute,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    
    
    this.route.params.subscribe(params => {

      let mode = params.mode;
      let actionCode = params.oobCode;
      this.actioncode = params.oobCode;
      let continueUrl = "login";
      this.buildForm();
      
      
      switch (mode) {
        case 'resetPassword':
          
          // Display reset password handler and UI.
          this.handleResetPassword(this.auth.authState, params.oobCode, continueUrl);

          break;
        case 'recoverEmail':
          // Display email recovery handler and UI.
          this.handleRecoverEmail(this.auth.getAuth(), actionCode);
          break;
        case 'verifyEmail':
          // Display email verification handler and UI.
          this.handleVerifyEmail(this.auth.getAuth(), actionCode, continueUrl);
          break;
        default:
          // Error: invalid mode.
      }

      
   });


    // Handle the user management action.

  }


   handleVerifyEmail(auth, actionCode, continueUrl) {
    // Try to apply the email verification code.
    auth.applyActionCode(actionCode).then(function(resp) {
      // Email address has been verified.
  
      // TODO: Display a confirmation message to the user.
      // You could also provide the user with a link back to the app.
  
      // TODO: If a continue URL is available, display a button which on
      // click redirects the user back to the app via continueUrl with
      // additional state determined from that URL's parameters.
    }).catch(function(error) {
      // Code is invalid or expired. Ask the user to verify their email address
      // again.
    });
  }


  handleRecoverEmail(auth, actionCode) {
    var restoredEmail = null;
    // Confirm the action code is valid.
    auth.checkActionCode(actionCode).then(function(info) {
      // Get the restored email address.
      restoredEmail = info['data']['email'];
  
      // Revert to the old email.
      return auth.applyActionCode(actionCode);
    }).then(function() {
      // Account email reverted to restoredEmail
  
      // TODO: Display a confirmation message to the user.
  
      // You might also want to give the user the option to reset their password
      // in case the account was compromised:
      this.sendPasswordResetEmail(restoredEmail).then(function() {
        // Password reset confirmation sent. Ask user to check their email.
      }).catch(function(error) {
        // Error encountered while sending password reset code.
      });
    }).catch(function(error) {
      // Invalid code.
    });
  }


  handleResetPassword(auth, actionCode, continueUrl) {
    
      var accountEmail;
      // Verify the password reset code is valid.
      auth.verifyPasswordResetCode(actionCode).then(function(email) {
      this.email = email;
  
      // TODO: Show the reset screen with the user's email and ask the user for
      // the new password.
  
     
    }).catch(function(error) {

      this.errorStr=error.message;
      
    });
  }


  resetPassword(newPassword:string){

     // Save the new password.
    this.auth.getAuth().confirmPasswordReset(this.actioncode, newPassword).then(function(resp) {

    }).catch(function(error) {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
      this.formErrors['error'] = error.message;
    });

    this.router.navigateByUrl("login");


  }


  buildForm(): void {
    this.userForm = this.fb.group({
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
    ],
      'confirmPassword': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
    ],
    });
    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }
  // Updates validation state on form changes.
  onValueChanged(data?: any) {

    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }  
    }

    if(this.userForm.controls['password'].value !==this.userForm.controls['confirmPassword'].value )
    this.formErrors['error'] ="Password dont match"
  }


  formErrors = {
    'password': '',
    'confirmPassword': '',
    'error':''
  };
  validationMessages = {
    'password': {
      'required':      'Password is required.',
      'pattern':       'Password must be include at one letter and one number.',
      'minlength':     'Password must be at least 6 characters long.',
      'maxlength':     'Password cannot be more than 40 characters long.',
    },
    'confirmPassword': {
      'required':      'Password is required.',
      'pattern':       'Password must be include at one letter and one number.',
      'minlength':     'Password must be at least 6 characters long.',
      'maxlength':     'Password cannot be more than 40 characters long.',
    }
  };

}
