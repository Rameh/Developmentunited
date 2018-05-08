import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ProfileService } from '../profile.service';
import { ChangeNameModel } from './change-name.model';
import { PageHeadingComponent } from '../../shared/directives/page-heading';

@Component({
    selector: 'appc-change-name',
    templateUrl: './change-name.component.html'
})
export class ChangeNameComponent implements OnInit {
    @Output() notification = new EventEmitter<string>();

    userNameModel: ChangeNameModel = new ChangeNameModel('', '');

    constructor(private profileService: ProfileService) { }

    ngOnInit() {
        this.profileService.userName()
            .subscribe((res: any) => {
                this.userNameModel = new ChangeNameModel(res.firstName, res.lastName);
            },
            (errors: any) => this.notification.emit(errors[0])
            );
    }

    save(): void {
        this.profileService.userName(this.userNameModel)
            .then((res: any) => {
                this.notification.emit(`Profile name changed to ${this.userNameModel.firstName} ${this.userNameModel.lastName}`);
            },
            (errors: any) => this.notification.emit(errors[0])
            );

    }

}
