import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';

import { AuthService } from '../shared/services/auth.service';
import { ChangeNameModel } from './changename/change-name.model';
import { ChangePasswordModel } from './changepassword/change-password.model';

@Injectable()
export class ProfileService {
    public userNameModel: FirebaseObjectObservable<ChangeNameModel>;
    public newPasswordModel: FirebaseObjectObservable<ChangePasswordModel>;

    constructor(private db: AngularFireDatabase, private auth: AuthService) { }

    userName(userNameModel?: ChangeNameModel): any {
        let path = `/profile/${this.auth.currentUserId}`;
        if (userNameModel) {
            return this.db.object(path).set(userNameModel);
        } else {
            return this.db.object(path);
        }
    }

    changePassword(changePasswordModel: ChangePasswordModel) {
        this.newPasswordModel.set(changePasswordModel)
    }

}
