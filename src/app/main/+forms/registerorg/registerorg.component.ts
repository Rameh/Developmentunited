import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { } from 'googlemaps';
import * as geoFire from 'geoFire';

import { AuthService } from '../../../shared/services/auth.service';
import { ControlBase, ControlTextbox } from '../../../shared/forms';

import { OrganizationService } from '../../../shared/services/organization.service';
import { Organization } from '../../../shared/models/organization.model';
import { StorageService } from '../../../shared/services/storage.service';
import { NgForm } from '@angular/forms/src/directives';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs/Rx';
import { v4 as uuid } from 'uuid';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { ConfirmComponent } from '../../../shared/components/confirm.component';

// declare var google: any;
import { GeocodingService } from '../../../shared/services/geocode.service';
import { FileUpload } from '../../../shared/interfaces/fileupload';
import { UploadFileService } from '../../../shared/services/upload-service';
import { AfterViewInit } from '@angular/core';
import { AlertService } from '../../../shared/services/alert.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { NguiMapComponent } from '@ngui/map';


@Component({
    selector: 'appc-registerorg',
    templateUrl: './registerorg.component.html',
    styleUrls: ['./registerorg.component.scss']
})
export class RegisterorgComponent implements OnInit {


    @ViewChild(NguiMapComponent)
    ngMap:NguiMapComponent;
  
    @ViewChild("search")
    public searchElementRef: ElementRef;

    private errors: string[];
    private controls: ControlBase<any>[];
    interests: Array<string>;
    specializations: Array<string>;
    contacts: Array<object>;

    subscription: Subscription;
    orgForm: FormGroup;
    organization: object;
    org: object;
    otherInterest: boolean = false;
    otherOrgType: boolean = false;
    newmode: boolean = true;
    selectedFiles: FileList
    selectedProfileFiles: FileList
    currentFileUpload: FileUpload
    profileFileUpload: FileUpload
    progress: { percentage: number } = { percentage: 0 }
    profileprogress: { percentage: number } = { percentage: 0 }

    lat: any;
    long: any;
    address: string;
    orgProjects: Array<any>;


    activeColor: string = 'green';
    baseColor: string = '#ccc';
    overlayColor: string = 'rgba(255,255,255,0.5)';

    dragging: boolean = false;
    loaded: boolean = false;
    profileloaded: boolean = false;
    imageLoaded: boolean = false;
    profileimageLoaded: boolean = false;

    imageSrc: string = '';
    profileimageSrc: string = '';
    imageSrcName: string = '';
    profileimageName: string = '';

    iconColor: string;
    borderColor: string;

    isSave: boolean = false;


    public centerPosition = [];
    public center: any;
    public orgaddress: any = {};
    
    marker = {
        display: true,
        lat: null,
        lng: null,
      };
    


    constructor(public auth: AuthService,
        public router: Router,
        private storageService: StorageService,
        private route: ActivatedRoute,
        private organizationService: OrganizationService,
        private formBuilder: FormBuilder,
        private geocode: GeocodingService,
        private uploadService: UploadFileService,
        private dialogService: DialogService,
        private alert: AlertService,
        private utility: UtilityService,
        private ref: ChangeDetectorRef,
        private ngZone: NgZone,
    ) {
    }

    registerorg(model: any): void {

    };


    ngAfterViewInit() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    
    handleImageLoad() {
        this.imageLoaded = true;
        this.iconColor = this.overlayColor;
    }


    _handleReaderLoaded(e) {
        var reader = e.target;
        this.imageSrc = reader.result;
        this.loaded = true;
    }
    handleprofileImageLoad() {
        this.profileimageLoaded = true;
        this.iconColor = this.overlayColor;
    }


    _handleprofileReaderLoaded(e) {
        var reader = e.target;
        this.profileimageSrc = reader.result;
        this.profileloaded = true;
    }



    clicked({target: marker}) {
        this.marker.lat = marker.getPosition().lat();
        this.marker.lng = marker.getPosition().lng();
    
        marker.nguiMapComponent.openInfoWindow('iw', marker);
      }


      dragend({target: marker}){
        this.marker.lat = marker.getPosition().lat();
        this.marker.lng = marker.getPosition().lng();
        var latlng = new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng());
        //------Geocoding the Address using coordinates--------
        var geocoderObj = {
            'lat': '' + marker.getPosition().lat(),
            'lng': '' + marker.getPosition().lat()
        }
        this.geocode.getAddress(geocoderObj)
            .subscribe(address => {
                console.log('This is address ' + address)
                this.orgForm.controls['address'].setValue(address)
            })
        //------Geocoding the Address using coordinates--------
        marker.nguiMapComponent.openInfoWindow('iw', marker);
      }


      
    
      hideMarkerInfo() {
        this.marker.display = !this.marker.display;
      }






    //-------image preview----------//

    ngOnInit() {

        document.body.scrollTop = document.documentElement.scrollTop = 0;

        if (!this.auth.authState) {
            this.alert.showToast1("You have tried to access a memeber only Area. Please Rregister and sign in to register");
            this.storageService.addItem('auth2reg', "Please Sign in to register your organization");
            this.utility.signInWithMessageId("auth2reg");
        }

        this.interests = [];
        this.specializations = [];
        this.contacts = [];

        this.orgForm = this.formBuilder.group({
            name: [null],
            isFunding: [null],
            isAccessResources: [null],
            isFindPartner: [null],
            isAccessData: [null],
            isIncreaseVisibility: [null],
            isWorkshops: [null],
            isTraining: [null],
            isNetworking: [null],

            orgType: [''],
            address: [null],

            website: [''],
            facebooksite: [''],
            twittersite: [''],
            youtubesite: [''],
            linkedinsite: [''],

            isbusiness: [null],
            isChildOrphanages: [null],
            isChildSponsorship: [null],
            isChildfeedingprograms: [null],
            isDisasterrelief: [null],
            isEducationpreschool: [null],
            isEducationelementary: [null],
            isEducationhighschool: [null],
            isEducationuniversity: [null],
            isEducationtradeschool: [null],
            isEnvironment: [null],
            isFaithchurches: [null],
            isFaithteaching: [null],
            isFoodfoodaidrelief: [null],
            isFoodfoodsustainability: [null],
            isFoodagroecology: [null],
            isHealth: [null],
            isHumanrights: [null],
            isLegalaffairs: [null],
            isMicrofinance: [null],
            isRefugees: [null],
            isResearch: [null],
            isScienceandtechnology: [null],
            isShorttermvolunteertrips: [null],
            isSports: [null],
            isWaterandsanitation: [null],
            isWomen: [null],

            contacts: this.formBuilder.array([
                this.initContact(),

            ]),

        });

        this.subscription = this.route.params.subscribe(

            (param: any) => {

                let orgid = uuid();
                this.storageService.addItem("orgid", orgid);
                this.storageService.addMode("mode", param.mode);
                //alert(JSON.stringify(param))
                if (param.mode === 'edit') {
                    this.orgProjects = [];
                    this.newmode = false;
                    param.profileId ? this.organizationService.getOrganization(param.profileId)
                        .subscribe(
                        res => {
                            //alert(JSON.stringify(res));
                            this.organization = res;
                            console.log('This is the organisation data '+JSON.stringify(this.organization))
                            //**added by venkt on 31-10-2017 for check boxes validations START*/
                            if (this.organization['specializations'] === undefined || this.organization['specializations'] === null) {
                                this.organization['specializations'] = [];

                            };
                            if (this.organization['interests'] === undefined || this.organization['interests'] === null) {
                                this.organization['interests'] = [];
                            };
                             //**added by venkt for check boxes validations END*/
                            this.orgProjects = this.organization['projects'];
                            console.log('org' + JSON.stringify(this.organization['projects']))
                            console.log('coverPhoto ' + JSON.stringify(this.organization['coverPhoto']))
                            this.storageService.addItem("orgid", param.profileId);


                            if (this.organization !== null || this.organization !== undefined) {

                                this.orgForm = this.formBuilder.group({
                                    name: [this.organization['orgName'], Validators.required],
                                    //==================== Area of Intrests
                                    isFunding: [this.organization['interests'].includes('Funding') ? true : null],
                                    isAccessResources: [this.organization['interests'].includes('Access Resources') ? true : null],
                                    isFindPartner: [this.organization['interests'].includes('Find Partners') ? true : null],
                                    isAccessData: [this.organization['interests'].includes('Access Data') ? true : null],
                                    isIncreaseVisibility: [this.organization['interests'].includes('Increase Visibility') ? true : null],
                                    isWorkshops: [this.organization['interests'].includes('Attend/Facilitate Workshops') ? true : null],
                                    isTraining: [this.organization['interests'].includes('Attend/Facilitate Training') ? true : null],
                                    isNetworking: [this.organization['interests'].includes('Network') ? true : null],
                                    orgType: [this.organization['orgType']],
                                    // isOtherOrgType: [null],
                                    // orgOtherType: [null],
                                    //===============  Specialzations =====================
                                    isbusiness: [this.organization['specializations'].includes('Business') ? true : null],
                                    isChildOrphanages: [this.organization['specializations'].includes('Child: Orphanages') ? true : null],
                                    isChildSponsorship: [this.organization['specializations'].includes('Child: Sponsorship') ? true : null],
                                    isChildfeedingprograms: [this.organization['specializations'].includes('Child: Feeding Programs') ? true : null],
                                    isDisasterrelief: [this.organization['specializations'].includes('Disaster Relief') ? true : null],
                                    isEducationpreschool: [this.organization['specializations'].includes('Education: Preschool') ? true : null],
                                    isEducationelementary: [this.organization['specializations'].includes('Education: Elementary') ? true : null],
                                    isEducationhighschool: [this.organization['specializations'].includes('Education: High School') ? true : null],
                                    isEducationuniversity: [this.organization['specializations'].includes('Education: University') ? true : null],
                                    isEducationtradeschool: [this.organization['specializations'].includes('Education: Trade School') ? true : null],
                                    isEnvironment: [this.organization['specializations'].includes('Environment') ? true : null],
                                    isFaithchurches: [this.organization['specializations'].includes('Faith: Churches') ? true : null],
                                    isFaithteaching: [this.organization['specializations'].includes('Faith: Teaching') ? true : null],
                                    isFoodfoodaidrelief: [this.organization['specializations'].includes('Food: Food Aid Relief') ? true : null],
                                    isFoodfoodsustainability: [this.organization['specializations'].includes('Food: Food Sustainability') ? true : null],
                                    isFoodagroecology: [this.organization['specializations'].includes('Food: Agro Ecology') ? true : null],
                                    isHealth: [this.organization['specializations'].includes('Health') ? true : null],
                                    isHumanrights: [this.organization['specializations'].includes('Human Rights') ? true : null],
                                    isLegalaffairs: [this.organization['specializations'].includes('Legal Affairs') ? true : null],
                                    isMicrofinance: [this.organization['specializations'].includes('Micro Finance') ? true : null],
                                    isRefugees: [this.organization['specializations'].includes('Refugees') ? true : null],
                                    isResearch: [this.organization['specializations'].includes('Research') ? true : null],
                                    isScienceandtechnology: [this.organization['specializations'].includes('Science And Technology') ? true : null],
                                    isShorttermvolunteertrips: [this.organization['specializations'].includes('Short Term Volunteer Trips') ? true : null],
                                    isSports: [this.organization['specializations'].includes('Sports') ? true : null],
                                    isWaterandsanitation: [this.organization['specializations'].includes('Water And Sanitation') ? true : null],
                                    isWomen: [this.organization['specializations'].includes('Women') ? true : null],
                                    address: [this.organization['address'], Validators.required],
                                    contacts: this.formBuilder.array([
                                        this.initContactAfterFetch(this.organization['contacts']),
                                    ]),
                                    website: [this.organization['website']],
                                    facebooksite: [this.organization['facebook']],
                                    twittersite: [this.organization['twitter']],
                                    youtubesite: [this.organization['youtube']],
                                    linkedinsite: [this.organization['linkedin']],
                                    projects: [this.orgProjects]

                                })

                                this.orgForm.controls['orgType'].setValue(this.organization['orgType'])
                                //-------Riyan-------------------------------------------------------------
                                if (this.organization['coverPhoto'] == null || this.organization['profilePhoto'] == null) {
                                    console.log('These values are null')
                                } else {
                                    this.imageSrc = this.organization['coverPhoto']['url'];
                                    this.imageSrcName = this.organization['coverPhoto']['name'];
                                    this.profileimageSrc = this.organization['profilePhoto']['url'];
                                    this.profileimageName = this.organization['profilePhoto']['name'];
                                    //-------Riyan-------------------------------------------------------------
                                }
                            }
                        }) : null;


                }
            }
        );




    }
    ngOnDestroy() {
        if (this.subscription)
            this.subscription.unsubscribe();
    }
    selectFile(e) {
        this.selectedFiles = e.target.files;
        //-------Riyan-------------------------------------------------------------
        this.imageSrcName = e.target.files[0].name;
        //-------Riyan-------------------------------------------------------------
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = /image-*/;
        var reader = new FileReader();

        if (!file.type.match(pattern)) {
            alert('invalid format');
            return;
        }

        this.loaded = false;

        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
    }

    upload() {
        const file = this.selectedFiles.item(0)
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload, this.progress)
    }

    selectProfileFile(e) {
        this.selectedProfileFiles = e.target.files;
        //-------Riyan-------------------------------------------------------------
        this.profileimageName = e.target.files[0].name;
        //-------Riyan-------------------------------------------------------------
        var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

        var pattern = /image-*/;
        var reader1 = new FileReader();

        if (!file.type.match(pattern)) {
            alert('invalid format');
            return;
        }

        this.profileloaded = false;

        reader1.onload = this._handleprofileReaderLoaded.bind(this);
        reader1.readAsDataURL(file);
    }

    profileUpload() {
        const file = this.selectedProfileFiles.item(0)
        this.profileFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.profileFileUpload, this.profileprogress)
    }
    initContact(): FormGroup {
        return this.formBuilder.group({
            contactName: [],
            contactEmail: [],
            contactPhone: []
        });
    }

    initContactAfterFetch(x): FormGroup {
        //console.log("afterfetch" + JSON.stringify(x))

        if(x!= undefined){
        for (var i = 0; i < x.length; i++) {
            return this.formBuilder.group({

                contactName: [x[i].contactName],
                contactEmail: [x[i].contactEmail],
                contactPhone: [x[i].contactPhone]
            });
        }
     }
     else{

            return this.formBuilder.group({
                
                contactName: [],
                contactEmail: [],
                contactPhone: []
                
            }); 
        
         }
       
     }


    initAreasOfInterest() {



    }


    addContact() {
        const control = <FormArray>this.orgForm.get('contacts');
        control.push(this.initContact());

    }
    removeContact(i: number) {
        const control = <FormArray>this.orgForm.controls['contacts'];
        control.removeAt(i);
    }


    toggleVisibility(e, mode: string) {

        if (mode === 'interest') {
            this.otherInterest = e.target.checked;
        } else {
            this.otherOrgType = e.target.checked;

        }
    }


    placeChanged(place) {
        this.centerPosition = [];
        //console.log('This is the place changed ' + JSON.stringify(place.geometry.location))
        this.center = place.geometry.location;
        this.centerPosition.push(place.geometry.location)
        //console.log('This is the center position ' + this.centerPosition)
        for (let i = 0; i < place.address_components.length; i++) {
          let addressType = place.address_components[i].types[0];
          this.orgaddress[addressType] = place.address_components[i].long_name;
        }
        this.ref.detectChanges();
      }
    

    onSave(x) {
        this.processData();
        this.isSave = x === 'save' ? true : false;
        let msg = this.isSave ? ' Press OK to continue to view your profile OR cancel to continue editing  OR Cancel, and choose to add projects' : 'Press OK to create projects or cancel to continue editing profile ';
        let orgId = this.storageService.getItem('orgid')

        let org: LooseObject = {};
        org = this.organization;
        org['orgId'] = orgId;


        this.storageService.addItem('orgName', org.orgName)
        this.geocode.getAddr(org['address'], this.saveGeoCodeResults, org, this.organizationService, this.router, this.isSave, this.orgProjects);


    }


    saveGeoCodeResults(status, x, org, orgservice, router, isSave, orgProjects) {


        if (status == 'ok') {
            //alert(x);
            var res = x.toString().replace("(", "").replace(")", "").split(",");
            org['latitude'] = res[0].toString();
            org['longitude'] = res[1].toString();

        } else {

            org['latitude'] = '47.7511';
            org['longitude'] = '120.7401';
        }


        if (orgProjects !== undefined) {
            org.projects = orgProjects;
        }
        orgservice.addOrganization(org);


        if (isSave === true)
            router.navigateByUrl('/org/' + org['orgId']);
        else
            router.navigateByUrl('/registerproject/new/new');

    }




    processData() {
        if (this.orgForm.value.isFunding)
            this.interests.push('Funding');

        if (this.orgForm.value.isAccessResources)
            this.interests.push('Access Resources');

        if (this.orgForm.value.isFindPartner)
            this.interests.push('Find Partners');

        if (this.orgForm.value.isAccessData)
            this.interests.push('Access Data');

        if (this.orgForm.value.isIncreaseVisibility)
            this.interests.push('Increase Visibility');

        if (this.orgForm.value.isWorkshops)
            this.interests.push('Attend/Facilitate Workshops');

        if (this.orgForm.value.isTraining)
            this.interests.push('Attend/Facilitate Training');

        if (this.orgForm.value.isNetworking)
            this.interests.push('Network');

        if (this.orgForm.value.isbusiness)
            this.specializations.push('Business');

        if (this.orgForm.value.isChildOrphanages)
            this.specializations.push('Child: Orphanages');

        if (this.orgForm.value.isChildSponsorship)
            this.specializations.push('Child: Sponsorship');

        if (this.orgForm.value.isChildfeedingprograms)
            this.specializations.push('Child: Feeding Programs');

        if (this.orgForm.value.isDisasterrelief)
            this.specializations.push('Disaster Relief');

        if (this.orgForm.value.isEducationpreschool)
            this.specializations.push('Education: Preschool');

        if (this.orgForm.value.isEducationelementary)
            this.specializations.push('Education: Elementary');

        if (this.orgForm.value.isEducationhighschool)
            this.specializations.push('Education: High School');


        if (this.orgForm.value.isEducationuniversity)
            this.specializations.push('Education: University');

        if (this.orgForm.value.isEducationtradeschool)
            this.specializations.push('Education: Trade School');

        if (this.orgForm.value.isEnvironment)
            this.specializations.push('Environment');

        if (this.orgForm.value.isFaithchurches)
            this.specializations.push('Faith: Churches');

        if (this.orgForm.value.isFaithteaching)
            this.specializations.push('Faith: Teaching');

        if (this.orgForm.value.isFoodfoodaidrelief)
            this.specializations.push('Food: Food Aid Relief');

        if (this.orgForm.value.isFoodfoodsustainability)
            this.specializations.push('Food: Food Sustainability');

        if (this.orgForm.value.isFoodagroecology)
            this.specializations.push('Food: Agro Ecology');

        if (this.orgForm.value.isHealth)
            this.specializations.push('Health');

        if (this.orgForm.value.isHumanrights)
            this.specializations.push('Human Rights');

        if (this.orgForm.value.isLegalaffairs)
            this.specializations.push('Legal Affairs');

        if (this.orgForm.value.isMicrofinance)
            this.specializations.push('Micro Finance');

        if (this.orgForm.value.isRefugees)
            this.specializations.push('Refugees');

        if (this.orgForm.value.isResearch)
            this.specializations.push('Research');

        if (this.orgForm.value.isScienceandtechnology)
            this.specializations.push('Science And Technology');

        if (this.orgForm.value.isShorttermvolunteertrips)
            this.specializations.push('Short Term Volunteer Trips');

        if (this.orgForm.value.isSports)
            this.specializations.push('Sports');

        if (this.orgForm.value.isWaterandsanitation)
            this.specializations.push('Water And Sanitation');

        if (this.orgForm.value.isWomen)
            this.specializations.push('Women');


        // this.orgForm.value.contacts.forEach(element => {
        //     this.contacts.push({
        //         'contactName': element.contactName? element.contactName:'',
        //         'contactEmail': element.contactEmail?element.contactEmail:'',
        //         'contactPhone': element.contactPhone?element.contactPhone:''
        //         //'otherdetails': element.otherdetails,

        //     });
        //     //console.log('medd' + JSON.stringify(this.contacts))
        // });
        this.orgForm.value.contacts.forEach(element => {
            this.contacts.push({
                'contactName': element.contactName,
                'contactEmail': element.contactEmail,
                'contactPhone': element.contactPhone
                //'otherdetails': element.otherdetails,

            });
            //console.log('medd' + JSON.stringify(this.contacts))
        });






        // Vijay : Don't remove this i need to add defalut image for 
        var mode = this.storageService.getMode('mode')
        var organizationCoverPhoto = { url: '', name: '' };

        if (this.currentFileUpload == null || this.currentFileUpload == undefined) {
            if (mode === 'edit') {
                    if(this.organization['coverPhoto'] == null){
                        organizationCoverPhoto.url = "/assets/img/default_cover_img.jpg";
                        organizationCoverPhoto.name = 'default_cover_img.jpg';
                    }else{
                        organizationCoverPhoto.url = this.organization['coverPhoto'].url;
                        organizationCoverPhoto.name = this.organization['coverPhoto'].name;
                    }

            } else {
                organizationCoverPhoto.url = "/assets/img/default_cover_img.jpg";
                organizationCoverPhoto.name = 'default_cover_img.jpg';
            }
        } else {
            organizationCoverPhoto.url = this.currentFileUpload.url;
            organizationCoverPhoto.name = this.currentFileUpload.name;
        }

        var organizationProfilePhoto = { url: '', name: '' };
        if (this.profileFileUpload == null || this.profileFileUpload == undefined) {
            organizationProfilePhoto.url = "/assets/img/default_profile_img.jpg";
            organizationProfilePhoto.name = 'default_profile_img.jpg';
            //-------Riyan-------------------------------------------------------------
            var modeForImage = this.storageService.getItem('mode')
            if (modeForImage === 'edit' ) {
                if (this.organization['coverPhoto'] == null || this.organization['profilePhoto'] == null) {
                    console.log('These values are null inside  organizationProfilePhoto ')
                } else {
                    //alert(this.organization['coverPhoto']['url'])
                    organizationProfilePhoto['url'] = this.organization['profilePhoto']['url'];
                    organizationProfilePhoto['name'] = this.organization['profilePhoto']['name'];
                }
            }
            //-------Riyan-------------------------------------------------------------            

        } else {
            organizationProfilePhoto['url'] = this.profileFileUpload.url;
            organizationProfilePhoto['name'] = this.profileFileUpload.name;
        }

        this.organization = {

            'orgName': this.orgForm.value.name,
            'interests': this.interests,
            'coverPhoto': organizationCoverPhoto,
            'profilePhoto': organizationProfilePhoto,
            'orgType': this.orgForm.value.orgType,
            'specializations': this.specializations,
            'address': this.orgForm.value.address,
            'contacts': this.contacts,
            'website': this.orgForm.value.website,
            'facebook': this.orgForm.value.facebooksite,
            'twitter': this.orgForm.value.twittersite,
            'youtube': this.orgForm.value.youtubesite,
            'linkedin': this.orgForm.value.linkedinsite,
            'longitude': '',
            'latitude': '',
            'projects': [],

        };
    }





}


interface LooseObject {
    [key: string]: any
}
