import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable ,FirebaseListObservable} from 'angularfire2/database';
import { v4 as uuid } from 'uuid';
import { OrgInfo } from "../models/orginfo.model"


@Injectable()
export class OrganizationService {
  orginfo:object ={};
  currentDate:any;
  completeDate:any;
  day:any;
  month:number;
  year:any;

  constructor(private db: AngularFireDatabase, private storageService: StorageService) { }

  addOrganization(org: object) { 
      let orgId = this.storageService.getItem('orgid');
      let userid = this.storageService.getItem('userid')
      let orgName = org['orgName'];

      // getting date starts here 31st oct 2017
      var currentTime = new Date();
      this.day = currentTime.getDate();
   
      this.month = currentTime.getMonth();
      //here we are adding 1 to month because when we are getting month number,
      // even it is octber it will give us 9 because january starts from 0 not 1
      this.month = (this.month+1);
   
      this.year = currentTime.getFullYear();
    
      this.currentDate= currentTime.toString();
      this.completeDate = this.currentDate.slice(15,33);
     

      var date = this.month+'-'+this.day+'-'+this.year+''+this.completeDate;
      
      // getting date ends here 31st oct 2017
      // org['createdOn'] = currentTime.toLocaleTimeString('en-US', { hour12: false });
      org['createdOn'] = date;
      org['createdBy'] = userid;
      org['orgStatus'] = true;

 // ramesh
      let path = this.db.object('/organizations/' + orgId);
      path.update(
        org
      );

      let listObjectObservable = this.db.object('/users/' +userid);
      
      this.orginfo['orgId']=orgId;
      this.orginfo['orgName']=orgName;
      listObjectObservable.$ref.child("/myorgs/"+orgId+"/").update(this.orginfo);
    
      
    }
    

  getOrganizations(start, end): FirebaseListObservable<any> {
    return this.db.list('/organizations', {
      query: {
        orderByChild: 'orgName',
        limitToFirst: 10,
        startAt: start,
        endAt: end
      }
    });
  }


  updateOrganizationStatus() {
    //alert("update org service")   
    let orgid = this.storageService.getItem('orgid');
    //alert("update org service"+this.uid)   
    let organization = this.db.object('/organizations/' + orgid);
    organization.update({
      isRegistered: true
    });
  }

  getAll(query: string) {
    let items = this.db.list('/organizations').map(i=>{return i});
    items.forEach(i => {
     i.forEach(e => {
         if (e.orgName.includes(query)) {
          return e.orgName;
        }      
      })
     });
    return items;
  }

  isAdmin(userid: string,orgid:string) {
    let item = this.db.list('/users/'+userid+"/myorgs/"+orgid).map(i=>{return i});
    item.forEach(i => {
     i.forEach(e => {
         console.log(JSON.stringify(e))
         if (e.$value.includes(orgid) && e.$key.includes('orgId')) {
          return e.$value;
        }      
      })
     });
    return item;
    

  }


  getAllOrgs() {
    let items = this.db.list('/organizations').map(i=>{return i});
    return items;
  }

  getOrganization(id: string) {
    return this.db.object('/organizations/' + id);
    
  }


  getOrganizationObject(id: string) {
    return this.db.object('/organizations/' + id).subscribe((result) => {
      //console.log(result);
      return result;
    
    });
  }

}
