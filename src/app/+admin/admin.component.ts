import { Component } from '@angular/core';

import { AdminService } from './admin.service';

@Component({
    selector: 'appc-admin',
    styleUrls: ['./admin.component.scss'],
    templateUrl: './admin.component.html'
})
export class AdminComponent {
    constructor(private adminService: AdminService) { }
}

