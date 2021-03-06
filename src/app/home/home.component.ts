import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { OrganizationService } from '../shared/services/organization.service';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import * as firebase from 'firebase/app'
import * as geoFire from 'geoFire';
import { UtilityService } from '../shared/services/utility.service';
import { Router } from '@angular/router';
import { NguiMapComponent } from '@ngui/map';
import {ActivatedRoute} from '@angular/router'; // <-- do not forget to import



declare var google: any;
@Component({
  selector: 'appc-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public center: any;
  public infoposition:boolean = true;
  private fragment: string;


  @ViewChild(NguiMapComponent)
  ngMap:NguiMapComponent;

  @ViewChild("search")
  public searchElementRef: ElementRef;



  autocomplete: google.maps.places.Autocomplete;
  address: any = {};
  jsonaddr: string = 'none';
  public positions = [];
  public organisationPositions = [];
  public centerPosition = [];

  public marker = {
    display: true,
    lat: null,
    lng: null,
    name:'',
    content:'',
    projId:'',
    orgId:'',
    projButton:false,
    orgButton: false,
    typeName: '',
    type: '',
    address: ''    
  };

  orgTable: FirebaseListObservable<any[]>;
  projTable: FirebaseListObservable<any[]>;
  orgData: Array<object>;
  projData: Array<object>;  

  constructor(
    private ref: ChangeDetectorRef,
    private ngZone: NgZone,
    private db: AngularFireDatabase,
    public orgService: OrganizationService,
    public router: Router,
    public utility: UtilityService , private route: ActivatedRoute  
  ) {

    this.orgData = [];
    this.projData = [];
    this.getOrganisationList();
    this.getProjectList();

    this.positions = this.getRandomMarkers();
    //var firebaseRef = firebase.database().ref();
    var firebaseRef = firebase.database().ref('organizations/');
    // Create a new GeoFire instance, pulling data from the public transit data
    var gf = new geoFire(firebaseRef.child("_geofire"));

    // Set the center as Firebase HQ
    var locations = {
      "FirebaseHQ": [37.785326, -122.405696],
      "Caltrain": [37.7789, -122.3917]
    };
    var center = locations["FirebaseHQ"];

    // Query radius
    var radiusInKm = 0.5;


    /*************/
    /*  GEOQUERY */
    /*************/
    // Keep track of all of the vehicles currently within the query
    var vehiclesInQuery = {};

    var geoQuery = gf.query({
      center: center,
      radius: radiusInKm
    });
    



  }



  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  placeChanged(place) {
    this.centerPosition = [];
    //console.log('This is the place changed ' + JSON.stringify(place.geometry.location))
    this.center = place.geometry.location;
    this.centerPosition.push(place.geometry.location)
    //console.log('This is the center position ' + this.centerPosition)
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }
    this.ref.detectChanges();
  }

  ngAfterViewInit(): void {
    try {
      document.querySelector('#' + this.fragment).scrollIntoView();
    } catch (e) { }
  }
  
  ngOnInit() {


    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });


  }

  

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
  //-------Riyan--------------------
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
  //-------Riyan--------------------
  onMapReady(map) {
    //console.log('map', map);
    //console.log('markers', map.markers);  // to get all markers as an array 
    
  }

  getRandomMarkers() {
    let randomLat: number, randomLng: number;

    let positions = [];
    for (let i = 0; i < 9; i++) {
      randomLat = Math.random() * (43.7399 - 43.7300) + 43.7300;
      randomLng = Math.random() * (-79.7600 - -79.7699) + -79.7699;
      positions.push([randomLat, randomLng]);
    }
    return positions;
  }

  showMarkersFromObservable() {
    Observable.of(this.getRandomMarkers()) // Think this as http call
      .subscribe(positions => {
        this.positions = positions;
        //console.log('These are the positions '+this.positions)
      });
  }

  gotoSearch(){
    this.router.navigateByUrl('/home/#search');
  }
  
  getOrganisationList(){
    //console.log('Called getOrganisationList function')
    this.db.list('/organizations', { preserveSnapshot: true })
      .subscribe(orgRes => {
        orgRes.forEach(orgListRes => {
          this.orgTable = orgListRes.val();
          var key = orgListRes.key;
          this.orgTable['orgKey'] = orgListRes.key;
          this.orgData.push(this.orgTable);
        });
        for (var i = 0; i < this.orgData.length; i++) {
          //console.log('This is the looped data of organisation ' + JSON.stringify(this.orgData[i]));
          if (this.orgData[i]['latitude'] == null || this.orgData[i]['longitude'] == null){
              //console.log('This is the null form of coordinates')
          }
          else if (this.orgData[i]['latitude'] == "" || this.orgData[i]['longitude'] == "") {
            //console.log('This is the empty string form of coordinates')
          }else{
            //console.log('This is the actual coordinates block ' + this.orgData[i]['orgKey'])
              var organisationPosObj = {
                'lat':''+this.orgData[i]['latitude'],
                'lng': ''+ this.orgData[i]['longitude'],
                'label':'O',
                'orgId': ''+this.orgData[i]['orgKey'],
                'details': '' + this.orgData[i]['address'],
                'name':'Organisation',
                'iconUrl': '../../assets/img/markers/yellow-dot.png',
                'typeName': '' + this.orgData[i]['orgName'],
                'type': '' + this.orgData[i]['orgType'],
                'address': '' + this.orgData[i]['address']
              }
              this.organisationPositions.push(organisationPosObj)
              //console.log('This is the organisationPositions pushed value ' + JSON.stringify(this.organisationPositions))
          }                    
        }
      })    
  }

  getProjectList(){
    //console.log('The getProjectList is called')
      this.db.list('/projects', { preserveSnapshot: true })
        .subscribe(projRes => {
          //console.log('This is the project response ' + JSON.stringify(projRes))
            projRes.forEach(projListRes => {
                  this.projTable = projListRes.val();
                  this.projData.push(this.projTable)              
            });

              for (var i = 0; i < this.projData.length;i++){
                //console.log('This is the looped projectData ' + JSON.stringify(this.projData[i]['projectid']))
                if (this.projData[i]['latitude'] == null || this.projData[i]['longitude'] == null) {
                  //console.log('This is the null form of coordinates for projects ')
                  return false;
                }
                if (this.projData[i]['latitude'] == "" || this.projData[i]['longitude'] == "") {
                  //console.log('This is the empty string form of coordinates for projects')
                  return false;
                } else {
                  //console.log('This is the actual coordinates block for projects ' + this.projData[i]['projectid'])
                      var projectPosObj = {
                        'lat': '' + this.projData[i]['latitude'],
                        'lng': '' + this.projData[i]['longitude'],
                        'label': 'P',
                        'projId': '' + this.projData[i]['projectid'],
                        'details': '' + this.projData[i]['description'],
                        'name': 'Projects',
                        'iconUrl':'../../assets/img/markers/blue-dot.png',
                        'typeName': '' + this.projData[i]['name'],
                        'type': '' + this.projData[i]['projectType'],
                        'address': '' + this.projData[i]['projectAddress']
                      }
                      this.organisationPositions.push(projectPosObj)
                      //console.log('This is the projectPositions pushed value ' + JSON.stringify(this.organisationPositions))
                }               
              }
        })
  }

  

  OrgProjPosition(x, { target: marker }) {
    //console.log('This is the orgProjPosition ' + JSON.stringify(x))
    this.marker.name = x.name;
    this.marker.typeName = x.typeName;
    this.marker.type = x.type;
    this.marker.address = x.address
    this.marker.content = x.details;
        if(x.projId == null){
          //console.log('The projectId is null at marker')
        }else {
          //console.log('The projectId is not null at marker')
          this.marker.projId = x.projId;
          this.marker.projButton = true;
          this.marker.orgButton = false;
        }        
        if(x.orgId == null){
          //console.log('The orgId is not null at marker')
        }else{
          //console.log('The orgId is not null at marker')
          this.marker.orgId = x.orgId;
          this.marker.orgButton = true;
          this.marker.projButton = false;
        }
    marker.nguiMapComponent.openInfoWindow('iw-container', marker);
  }

  hideMarkerInfo() {
    this.marker.display = !this.marker.display;
  }

  orgMoreInfo(x){
    //console.log('This is the organisation more info '+x)
      if (x == null || x == 'undefined'){
          //console.log('organisation Id unavailable')
          return false;
        }else{
          //console.log('This is organisation id not null')
          this.router.navigateByUrl('/org/'+x);
        }
  }

  projMoreInfo(x) {
    //console.log('This is the project more info ' + x)
    if (x == null || x == 'undefined') {
      //console.log('project Id unavailable')
      return false;
    } else {
      //console.log('This is project id not null')
      this.router.navigateByUrl('/project/' + x);
    }
  }  


}
