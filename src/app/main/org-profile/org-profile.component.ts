
import { OrganizationService } from '../../shared/services/organization.service';
import { ProjectService } from '../../shared/services/project.service';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Rx';
import { NgStyle } from "@angular/common";
import { TabsModule } from "ngx-tabs";
import { Ng2ScrollableModule } from 'ng2-scrollable';
import { StorageService } from '../../shared/services/storage.service';
import {OrgInfo} from '../../shared/models/orginfo.model'
declare var google: any;

@Component({
  selector: 'appc-org-profile',
  templateUrl: './org-profile.component.html',
  styleUrls: ['./org-profile.component.scss']
})


export class OrgProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  public map: google.maps.Map;
  currentFlag: boolean;
  pastFlag: boolean;
  proposalFlag: boolean;
  p: Array<String>;
  subscription: Subscription;
  org: FirebaseObjectObservable<any>;
  projects: Array<object> = [];
  currentProjects: Array<object> = [];
  pastProjects: Array<object> = [];
  proposedProjects: Array<object> = [];
  

  coverBackground: String;
  profileBackground: String;
  profilePic: String;

  lat: any;
  long: any;
  orgid: any;
  public markerPosition = [];
  public marker = {
    name:'',
    address: '',
    display: true
  }; 

  admin:boolean = false;
  projectTable: FirebaseListObservable<any[]>;

  


  constructor(private router: Router, private activatedRoute: ActivatedRoute, private db: AngularFireDatabase,
    private organizationService: OrganizationService, private storageService: StorageService,
    private projectService: ProjectService) {
      


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;      
  }



  getProjectList(orgid: string) {

    this.projects = [];
    //console.log('Called getOrganisationList function')
    this.db.list('/organizations/' + orgid + '/projects/', { preserveSnapshot: true })
      .subscribe(projRes => {
        this.proposedProjects = [];
        projRes.forEach(projListRes => {
          this.projectTable = projListRes.val();
          var key = projListRes.key;
          this.projectTable['projectKey'] = key;
          this.projects.push(this.projectTable);
          var element = this.projectTable;

          if (element['projectType'] === 'Ongoing') {
            element['currentComplete'] = element['spent'] / element['budget'] * 100;
  
            this.currentProjects.push(element);

          }

          else if (element['projectType'] === 'Past') {
            element['pastComplete'] = element['spent'] / element['budget'] * 100;
            this.pastProjects.push(element);

          }

          else if (element['projectType'] === 'Proposal') {
            element['proposeComplete'] = element['spent'] / element['budget'] * 100;
            this.proposedProjects.push(element);
            //alert(this.proposedProjects)  
          }

        })

        for (var i = 0; i < this.projects.length;i++){
          console.log('This is the length of the project '+JSON.stringify(this.projects[i]))
          if (this.projects[i]['latitude'] == null || this.projects[i]['longitude'] == null) {
            console.log('This is the null form of coordinates')
          }
          else if (this.projects[i]['latitude'] == "" || this.projects[i]['longitude'] == "") {
            console.log('This is the empty string form of coordinates')
          } else {
            console.log('This is the actual coordinates block ' + this.projects[i]['longitude'])

            var latLng = new google.maps.LatLng(this.projects[i]['latitude'] ,this.projects[i]['longitude']);
            var marker = new google.maps.Marker({
              position: latLng, 
              map: this.map});
                   
            var projectPosObj = {
              'lat': '' + this.projects[i]['latitude'],
              'lng': '' + this.projects[i]['longitude'],
              'name': '' + this.projects[i]['name'],
              'address': '' + this.projects[i]['projectAddress'],
              'iconUrl':'../../assets/img/markers/blue-dot.png',
              'position':latLng,
              'marker':marker

            }            
            this.markerPosition.push(projectPosObj)
          }          
        }    
        
        




      })
  }


  onMapReady(map) {
    console.log('map -->', map);
    console.log('markers -->', map.markers);  // to get all markers as an array 
    this.map = map;
    var latlng:google.maps.LatLng = new google.maps.LatLng(this.lat,this.long);
    this.map.setCenter(latlng);
    

    this.map=map;
    var bounds = new google.maps.LatLngBounds();    
    for (var i in this.markerPosition) // your marker list here
          bounds.extend(this.markerPosition[i].position) // your marker position, must be a LatLng instance
    
    this.map.fitBounds(bounds);
    this.map.panToBounds(bounds);  

    
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

    ////console.log(this.lat)
    this.currentFlag = true;
    this.pastFlag = false;
    this.proposalFlag = false;

    
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        var orgid = param['profileId']
        this.storageService.addItem("orgid", orgid)
        console.log(JSON.stringify('key value of organization' + orgid));
        let userid = this.storageService.getItem('userid');
  
       this.organizationService.getOrganization(param['profileId'],)
          .subscribe(
          res => {
            this.markerPosition = [];
            this.org = res;
            //alert('hiii'+JSON.stringify(this.org['contacts']))
            if(this.org['contacts'] === undefined ){
              this.org['contacts']=[];
            }
            this.storageService.addItem('orgName',this.org['orgName'])
            if(this.org['orgName'] === undefined ){
               this.router.navigateByUrl("/pagenotfound")
             }

            //org found 

            this.lat = res.latitude;
            this.long = res.longitude;
           
            //-----Riyan-----------------
              if (res.latitude == null || res.longitude == null){
                console.log('The value is null')
                //handling the null values for coordinates on map
                var obj = {
                  lat: ''+(38.8899244),
                  lng: ''+(-77.010008),
                  iconUrl:'../../assets/img/markers/yellow-dot.png',
                  name: '' + res.orgName,
                  address:''+res.address                  
                }
                this.markerPosition.push(obj)                
              }else{
              var object = {
                lat : ''+res.latitude,
                lng : ''+res.longitude,
                iconUrl:'../../assets/img/markers/yellow-dot.png',
                name: '' + res.orgName,
                address:''+res.address                
              }
              this.markerPosition.push(object)
              }            
            //-----Riyan-----------------
            if (this.org['coverPhoto'])
              this.coverBackground = " url(" + this.org['coverPhoto']['url'] + ")  center center ";
            if (this.org['profilePhoto'])
              this.profileBackground = "url(" + this.org['profilePhoto']['url'] + " ) center top";
            if (this.org['profilePhoto'])
              this.profilePic = this.org['profilePhoto']['url'];

            this.getProjectList(orgid);

            this.admin = (this.org['createdBy']===userid);

          },
          err => {
            console.error(err);
            //todo ?
          }
          );
      }
    );
  }


  viewProj(key) {
    // alert('clicked')
    this.router.navigateByUrl('/project/' + key)
  }

  getBackgroundStyle = function (imagepath) {
    return {
      'background': 'url(' + imagepath + ')'
    }
  }

  public Project(projectid) {
    var id = localStorage.getItem('projectid');
    this.router.navigateByUrl("/project/" + projectid);
    //window.location.reload();
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

  editorg() {
    var orgid = this.storageService.getItem("orgid")
    this.router.navigate(["/registerorg/edit/" + orgid]);
  }

  toggleView(action: String) {
    if (action === 'current') {
      this.currentFlag = true;
      this.pastFlag = false;
      this.proposalFlag = false;
      // alert(JSON.stringify(this.currentProjects)  )
    } else if (action === 'past') {
      this.currentFlag = false;
      this.pastFlag = true;
      this.proposalFlag = false;
      ////console.log(this.pastProjects) 
    } else {
      this.currentFlag = false;
      this.pastFlag = false;
      this.proposalFlag = true;
      //alert(this.proposedProjects)  
    }
  }

}
