import { Component, NgModule, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { OrganizationService } from '../../shared/services/organization.service';
import { UtilityService } from '../../shared/services/utility.service';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';


@Component({
  selector: 'appc-org-search',
  templateUrl: './org-search.component.html',
  styleUrls: ['./org-search.component.scss'],

})
export class OrgSearchComponent implements OnInit {

  orgTable: FirebaseListObservable<any[]>;
  orgData: Array<object>;
  long:any;


  constructor(
    private db: AngularFireDatabase,
    private storageService: StorageService,
    public router: Router, public utility: UtilityService
  ) {

    this.orgData = [];

  }

  explore(){
    this.utility.gotoHashtag("home","explore");
  }
 
  public gotosearch() {
    this.router.navigate(['/search']);
  }
  public gotoexplore() {
    this.router.navigate(['/explore']);
  }
  ngAfterViewInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }
  ngOnInit() {

    this.orgData = [];
     this.db.list('/organizations', {
      query: {
          orderByChild: 'orgStatus',
          equalTo: false, 
      }
    }).subscribe(orgRes => {
        orgRes.forEach(orgListRes => {
          this.orgData.push(orgListRes);
        
        });

      })     

  }

  public onSelected(item) {
    //console.log(item.orgKey);
    this.router.navigate(["/registerorg/edit/" + item.$key]);
    //window.location.reload();
  }

  public onSelectedNew() {

    this.router.navigate(["/registerorg/new/new/"]);
    //window.location.reload();
  }



}

