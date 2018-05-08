import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';
import { UserService } from '../../shared/services/user.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'appc-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  userForm: FormGroup;
  email: string;
  passReset: boolean = false;
  
  
  ngOnInit(): void {
    this.buildForm();
  }

  constructor(private fb: FormBuilder, public userService: UserService, public storageSvc: StorageService, private auth: AuthService, private router: Router, private authService: AuthService, private storageService: StorageService, private route: ActivatedRoute) { }
 

  resetPassword() {
    this.auth.resetPassword(this.userForm.value['email'])
    .then(() => this.passReset = true)
    .catch((error) => {
      
      console.log("error in submit-->" + error)
      this.formErrors.email=error.message;
    })

    
    
  }
  buildForm(): void {
    this.userForm = this.fb.group({
      'email': ['', [
          Validators.required,
          Validators.email
        ]
      ],
      'password': ['', [
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
  }
 formErrors = {
    'email': '',
    'password': ''
  };
  validationMessages = {
    'email': {
      'required':      'Email is required.',
      'email':         'Email must be a valid email'
    },
    'password': {
      'required':      'Password is required.',
      'pattern':       'Password must be include at one letter and one number.',
      'minlength':     'Password must be at least 4 characters long.',
      'maxlength':     'Password cannot be more than 40 characters long.',
    }
  };

}
