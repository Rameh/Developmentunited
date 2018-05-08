import { ProjectService } from '../../shared/services/project.service';
import { Component, OnDestroy, OnInit ,AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Rx';
import { NgStyle } from "@angular/common";
import { StorageService } from '../../shared/services/storage.service';
@Component({
  selector: 'appc-project-profile',
  templateUrl: './project-profile.component.html',
  styleUrls: ['./project-profile.component.scss']
})
export class ProjectProfileComponent implements OnInit, OnDestroy ,AfterViewInit{
  subscription: Subscription;
  coverBackground: String;
  profileBackground: String;
  profilePic: String;
  projectPic: String;
  project: FirebaseObjectObservable<any>;
  public zoom: number;
  public center: any;
  lat: any;
  long: any;
  complete: any;
  public markerPosition = [];
  public infoposition: boolean = true;
  public marker = {
    display: true,
    lat: null,
    lng: null,
    content: '',
    name:'',
    address:''
  };


  admin:boolean =false;
  email:boolean =false;
  


  constructor(public router: Router,
    private activatedRoute: ActivatedRoute,
    private database: AngularFireDatabase,
    private storageService: StorageService,
    private projectService: ProjectService) { }
  ngOnDestroy() {
    if(this.subscription)
    this.subscription.unsubscribe();
  }
  ngAfterViewInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }


  onMapReady(map) {
    console.log('map', map);
    console.log('markers', map.markers);  // to get all markers as an array 
  }
  onIdle(event) {
    console.log('map', event.target);
  }
  onMarkerInit(marker) {
    console.log('marker', marker);
  }
  onMapClick(event) {
    //this..push(event.latLng);
    event.target.panTo(event.latLng);
  }

  ngOnInit() {
    this.markerPosition = [];
    // this.storageService.addItem("projectid",projectid)
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        let userid = this.storageService.getItem('userid');
        this.projectService.getProject(param['profileId'])
        

          .subscribe(
          res => {
            this.project = res;
            if(this.project['interventionmechanisms'] === undefined){
              this.project['interventionmechanisms']=[];
            }
            if(this.project['partnerOrganizations'] === undefined){
              this.project['partnerOrganizations']=[];
            }
            if(this.project['leads'] === undefined){
              this.project['leads']=[];
            }
            this.lat = res.latitude;
            this.long = res.longitude;
            var obj = {
              lat: '' + res.latitude,
              lng: '' + res.longitude,
              address:''+res.projectAddress,
              name:''+res.name,
              iconUrl:'../../assets/img/markers/blue-dot.png'              
            }
            this.markerPosition.push(obj)
            //this.project['projectComplete']=this.project['spent']/this.project['budget']*100;
            this.complete = res.spent / res.budget * 100;
            //alert(this.complete);
            this.admin = (res.createdBy === userid);
            this.email = false;
            this.email = (res.leads && res.leads[0] &&res.leads[0].email !== undefined && res.leads[0].email != '' )
          },


          err => {
            console.error(err);
          }


          );
        
      }
    );
  }

  

  editproject(projectid) {
    this.router.navigate(["/registerproject/edit/" + projectid]);
  }
  goBack(orgId) {
    this.router.navigate(["/org/" + orgId]);
  }

  showInfoWindow(x, { target: marker }) {
    //console.log('This is the showInfoWindow ' + JSON.stringify(x))
    this.marker.name = x.name;
    this.marker.address = x.address;
    marker.nguiMapComponent.openInfoWindow('iw-container', marker);
  }

  hideMarkerInfo() {
    this.marker.display = !this.marker.display;
  }

}

