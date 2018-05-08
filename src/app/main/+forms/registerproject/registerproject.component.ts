import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../shared/services/auth.service';
import { ControlBase, ControlTextbox } from '../../../shared/forms';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { FileUpload } from '../../../shared/interfaces/fileupload';
import { Upload } from '../../../shared/interfaces/upload';
import { UploadFileService } from '../../../shared/services/upload-service';
import { StorageService } from '../../../shared/services/storage.service';
import { AlertService } from '../../../shared/services/alert.service';

import { OrganizationService } from '../../../shared/services/organization.service';
import { ProjectService } from '../../../shared/services/project.service';
//import { UserService } from '../../../shared/services/user.service';
import { Project } from '../../../shared/models/project';
import { GeocodingService } from '../../../shared/services/geocode.service';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { v4 as uuid } from 'uuid';
import * as firebase from 'firebase/app';
import * as _ from "lodash";
import { UtilityService } from '../../../shared/services/utility.service';

import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'appc-registerproject',
  templateUrl: './registerproject.component.html',
  styleUrls: ['./registerproject.component.scss']
})
export class RegisterprojectComponent implements OnInit {


 


  private errors: string[];
  private controls: ControlBase<any>[];
  projectForm: FormGroup;

  partnerOrganizations: Array<object>;
  leads: Array<object>;
  interventionMechanisms: Array<object>;
  projects: Array<object> = [];

  files: FileList;
  uploadedFiles: any[] = [];

  url: any;

  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

  dragging: boolean = false;
  loaded: boolean = false;
  profileloaded: boolean = false;
  imageLoaded: boolean = false;
  profileimageLoaded: boolean = false;

  detailsloaded: boolean = false;
  challengesloaded: boolean = false;
  partnersloaded: boolean = false;
  projectsloaded: boolean = false;

  projectDetailsImageLoaded: boolean = false;
  projectChallengesImageLoaded: boolean = false;
  partnersLoaded: boolean = false;
  projectsLoaded: boolean = false;


  imageSrc: string = '';
  imageSrcName: string = '';
  profileimageSrc: string = '';
  profileimageName: string = '';

  iconColor: string;
  borderColor: string;


  selectedprojectcoverimagesFiles: FileList

  selectedprojectprofileimagesFiles: FileList

  projectcoverimagesFileUpload: FileUpload
  projectcoverimagesProgress: { percentage: number } = { percentage: 0 }

  projectprofileimagesFileUpload: FileUpload
  projectprofileimagesProgress: { percentage: number } = { percentage: 0 }


  selectedprojectdetailsFiles: FileList
  selectedprojectchallengesFiles: FileList
  selectedprojectpartnerslistFiles: FileList
  selectedprojectimagesFiles: FileList



  projectdetailsUpload: Upload;
  currentdetailsMulti: Array<any>

  projectchallengesUpload: Upload;
  currentchallengesMulti: Array<any>

  projectpartnerlistUpload: Upload;
  currentpartnerlistMulti: Array<any>

  projectimagesUpload: Upload;
  currentimagesMulti: Array<any>



  challengesArray: Array<any>

  detailsArray: Array<any>

  partnersArray: Array<any>

  projectsArray: Array<any>



  subscription: Subscription;
  newmode: boolean = true;
  project: FirebaseObjectObservable<any>;

 
  constructor(
    public auth: AuthService,
    public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private uploadService: UploadFileService,
    private storageService: StorageService,
    private organizationService: OrganizationService,
    private projectService: ProjectService,
    private geocode: GeocodingService,
    private db: AngularFireDatabase,
    private alert: AlertService,
    private upSvc: UploadFileService,
    private utility: UtilityService,

  ) {

  }


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



  //-------image preview----------//

  /*----------Details Preview----------*/
  //  handleProjectDetailsLoad() {
  //   this.projectDetailsImageLoaded = true;
  //   this.iconColor = this.overlayColor;
  // }  

  // _handleprojectDetailsReaderLoaded(e) {
  //   var reader = e.target;


  //   var a = {
  //     'srcImage':reader.result
  //   }
  //   this.detailsArray.push(a)
  //   this.partnersloaded = true; 
  // }  
  // // 

  //-------image preview----------//

  detailsReaderPreview(e){
    
        var reader = e.target;
        // console.log('This is file name ')
        // this.stringObj['imgSrc'] = reader.result
        var stringObj1 = {
          imgSrc:reader.result
        }
    
        console.log('This is the stiringification of the JSON object '+JSON.stringify(stringObj1))
        this.detailsArray.push(stringObj1)
        console.log('The target file for project pushed '+this.detailsArray)
      } 
      detailsReaderPreviewDoc(e) {
        var reader = e.target;
        var docPreviewObj = {
          imgSrc: '../assets/img/doc.jpg'
        }
        this.detailsArray.push(docPreviewObj)
        console.log('The target document for project pushed ' + this.detailsArray)
      } 
      /*----------Details Preview----------*/
    
      //--------CHallenges Preview------//
      // handlechallengesImageLoad() {
      //   this.projectChallengesImageLoaded = true;
      //   this.iconColor = this.overlayColor;
      // }
    
      // _handleChallengesReaderLoaded(e) {
      //   var reader = e.target;
      //   var a = {
      //     'imgSrc': reader.result
      //   }
      //   console.log("Challenges Images are "+JSON.stringify(a))
      //   this.challengesArray.push(a)
      //   this.challengesloaded = true;
      //   // console.log('This is handleChallengesReaderLoaded '+this.challengesArray)
      // }
    
        challengesReaderPreview(e){
        
            var reader = e.target;
            // console.log('This is file name ')
            // this.stringObj['imgSrc'] = reader.result
            var a = {
              'imgSrc':reader.result
            }
            console.log('This is the stiringification of the JSON object '+JSON.stringify(a))
            this.challengesArray.push(a)
            console.log('The target file for project pushed '+this.challengesArray)
          } 
    
          challengesReaderPreviewDoc(e){
            var reader = e.target;
            var docPreviewObj = {
              imgSrc: '../assets/img/doc.jpg'
            }
            this.challengesArray.push(docPreviewObj)
            console.log('The target document for project pushed ' + this.challengesArray)
    
          }
      //--------Challenges Preview------//
      /*----------Partners Preview----------*/
    partnersReaderPreview(e){
        var reader = e.target;
        let obj = {
            'imgSrc':reader.result
            
        }
        console.log('This is the stiringification of the JSON object '+JSON.stringify(obj))
        this.partnersArray.push(obj)
        console.log('The target file for project pushed '+this.partnersArray)
      } 
      partnersReaderPreviewDoc(e){
        var reader = e.target;
        var docPreviewObj = {
          imgSrc: '../assets/img/doc.jpg'
        }
        this.partnersArray.push(docPreviewObj)
        console.log('The target document for project pushed ' + this.partnersArray)
      }
      /*----------Partners Preview----------*/
    
      /*----------Projects Preview----------*/
      projectsReaderPreview(e){
        var reader = e.target;
        let obj = {
            'imgSrc':reader.result
        }
        console.log('This is the stiringification of the JSON object '+JSON.stringify(obj))
        this.projectsArray.push(obj)
        console.log('The target file for project pushed '+this.projectsArray)
      } 
      projectsReaderPreviewDoc(e){
        var reader = e.target;
        var docPreviewObj = {
          imgSrc: '../assets/img/doc.jpg'
        }
        this.projectsArray.push(docPreviewObj)
        console.log('The target document for project pushed ' + this.projectsArray)
      }
      /*----------Projects Preview----------*/
     

  ngOnInit() {

    //document.body.scrollTop = document.documentElement.scrollTop = 0;
    // if (!this.auth.authState) {
    //   //this.alert.showToast1("You have tried to access a memeber only Area. Please Rregister and sign in to register");

    //   this.storageService.addItem('auth2reg', "Please Sign in to register your organization");
    //   this.utility.signInWithMessageId("auth2reg");
    //   //this.utility.navigateToSignIn();

    // }

    /*--------------MultipleFile Arrays--------*/
    this.detailsArray = [];
    this.challengesArray = [];
    this.partnersArray = [];
    this.projectsArray = [];
    /*--------------MultipleFile Arrays--------*/
    this.partnerOrganizations = [];
    this.leads = [];
    this.interventionMechanisms = [];

    this.currentdetailsMulti = [];
    this.currentchallengesMulti = [];
    this.currentpartnerlistMulti = [];
    this.currentimagesMulti = [];
    this.projects = [];

    this.projectForm = this.formBuilder.group({
      projectType: ['', Validators.required],
      name: [''],
      projectDescription: [''],
      projectAddress: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      numHouseholdsAffected: [''],

      interventionmechanisms: this.formBuilder.array([
        this.initInterventionMechanisms()
      ]),

      leads: this.formBuilder.array([
        this.initLeads(),
      ]),

      projectWebsite: [''],
      projectFacebooksite: [''],
      projectTwittersite: [''],
      projectYoutubesite: [''],
      projectLinkedInsite: [''],

      challenges: [''],

      partnerOrganizations: this.formBuilder.array([
        this.initPartnerOrg()
      ]),

      budget: [''],
      spent: ['']
    });

    this.subscription = this.route.params.subscribe(
      (param: any) => {
        this.storageService.addMode("mode", param.mode);
        if (param.mode === 'edit') {
          this.newmode = false;
          param.profileId ? this.projectService.getProject(param.profileId)
            .subscribe(
            res => {
              
              //alert(JSON.stringify(res));
              this.projects = [];
              this.projects.push(res);
              //alert("project" + JSON.stringify(this.projects))
              this.storageService.addItem("projectid", param.profileId);

              

              if (this.projects[0] !== null || this.projects[0] !== undefined) {

                this.projectForm = this.formBuilder.group({
                  projectType: [this.projects[0]['projectType'], Validators.required],
                  name: [this.projects[0]['name'], Validators.required],
                  projectDescription: [this.projects[0]['projectDescription'], Validators.required],
                  projectAddress: [this.projects[0]['projectAddress'], Validators.required],
                  startDate: [this.projects[0]['startDate'], Validators.required],
                  endDate: [this.projects[0]['endDate'], Validators.required],
                  numHouseholdsAffected: [this.projects[0]['numHouseholdsAffected'], Validators.required],
                  interventionmechanisms: this.formBuilder.array([
                    this.initInterventionMechanismsAfterFetch(this.projects[0]['interventionmechanisms']),
                  ]),
                  leads: this.formBuilder.array([
                    this.initleadsAfterFetch(this.projects[0]['leads']),
                  ]),
                  projectWebsite: [this.projects[0]['projectWebsite'], Validators.required],
                  projectFacebooksite: [this.projects[0]['projectFacebook'], Validators.required],
                  projectTwittersite: [this.projects[0]['projectTwitter'], Validators.required],
                  projectYoutubesite: [this.projects[0]['projectYoutube'], Validators.required],
                  projectLinkedInsite: [this.projects[0]['projecLinkedIn'], Validators.required],

                  challenges: [this.projects[0]['challenges'], Validators.required],

                  partnerOrganizations: this.formBuilder.array([
                    this.initPartnerOrganizationsAfterFetch(this.projects[0]['partnerOrganizations']),
                  ]),

                  budget: [this.projects[0]['budget'], Validators.required],
                  spent: [this.projects[0]['spent'], Validators.required],

                })
                // this.orgForm.controls['orgType'].setValue(this.organization['orgType'])

                if (this.projects[0]['projectcoverPhoto'] == null || this.projects[0]['projectprofilePhoto'] == null) {
                  console.log('These values are null')
                } else {
                  //alert(this.projects[0]['projectcoverPhoto']['url'])
                  this.imageSrc = this.projects[0]['projectcoverPhoto']['url'];
                  this.imageSrcName = this.projects[0]['projectcoverPhoto']['name'];
                  this.profileimageSrc = this.projects[0]['projectprofilePhoto']['url'];
                  this.profileimageName = this.projects[0]['projectprofilePhoto']['name'];
                }                 
              }
            }) : null;
        }
      }
    );



  }


  //**** Start interventionmechanisms *****//

  initInterventionMechanisms(): FormGroup {
    return this.formBuilder.group({
      interName: ['', [Validators.required]],
      interDescription: ['', [Validators.required]],
    });
  }


  addInterventionMechanisms() {
    const control = <FormArray>this.projectForm.get('interventionmechanisms');
    control.push(this.initInterventionMechanisms());
  }

  removeInterventionMechanisms(i: number) {
    const control = <FormArray>this.projectForm.get('interventionmechanisms');
    control.removeAt(i);
  }
  //**** End interventionmechanisms *****//

  initInterventionMechanismsAfterFetch(x): FormGroup {
    //console.log("afterfetch" + JSON.stringify(x))
   // alert("fjdhfjhf"+JSON.stringify(x))
    if(x!=undefined){
    for (var i = 0; i < x.length; i++) {
      ////console.log(x[i]);
      //console.log("this initContactAfterFetch " + JSON.stringify(x[i]))
      return this.formBuilder.group({

        interName: [x[i].interName],
        interDescription: [x[i].interDescription]
        //otherdetails: [x[i].otherdetails, [Validators.required]],
      });
    }
  }else{
    return this.formBuilder.group({
      interName: [],
      interDescription: []
    });

  }
  }
  

  initLeads(): FormGroup {
    return this.formBuilder.group({
      leadName: ['', [Validators.required]],
      leadEmail: ['', [Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)]],
      leadPhone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      // otherdetails: ['', [Validators.required]],

    });
  }

  addLeads() {
    const control = <FormArray>this.projectForm.get('leads');
    control.push(this.initLeads());
  }
  removeLeads(i: number) {
    const control = <FormArray>this.projectForm.controls['leads'];
    control.removeAt(i);
  }

  initleadsAfterFetch(x): FormGroup {
    //console.log("afterfetch" + JSON.stringify(x))
    if(x!= undefined){
    for (var i = 0; i < x.length; i++) {
      ////console.log(x[i]);
      //console.log("this initContactAfterFetch " + JSON.stringify(x[i]))
      return this.formBuilder.group({

        leadName: [x[i].leadName],
        leadEmail: [x[i].leadEmail],
        leadPhone: [x[i].leadPhone]
      });
    }
  }else{
    return this.formBuilder.group({
      leadName: [],
      leadEmail: [],
      leadPhone: []
      // otherdetails: ['', [Validators.required]],

    });

  }

  }
  //**** Start PartnerOrg *****//

  initPartnerOrg(): FormGroup {
    return this.formBuilder.group({
      partnerName: ['', [Validators.required]],
      partnershipDetails: ['', [Validators.required]]
    });
  }

  addPartnerOrganizations() {
    const control = <FormArray>this.projectForm.get('partnerOrganizations');
    control.push(this.initPartnerOrg());
  }

  removePartnerOrganizations(i: number) {
    const control = <FormArray>this.projectForm.get('partnerOrganizations');
    control.removeAt(i);
  }

  initPartnerOrganizationsAfterFetch(x): FormGroup {
    //console.log("afterfetch" + JSON.stringify(x))
    if(x!= undefined){
    for (var i = 0; i < x.length; i++) {
      ////console.log(x[i]);
      //console.log("this initContactAfterFetch " + JSON.stringify(x[i]))
      return this.formBuilder.group({

        partnerName: [x[i].partnerName],
        partnershipDetails: [x[i].partnershipDetails]

      });
    }
  }
  else{
    return this.formBuilder.group({
      partnerName: [],
      partnershipDetails: []
    });
  }
}
  //**** End PartnerOrg*****//


  onChange(files: FileList) {
    this.files = files;
  }

  selectProjectcoverimagesFile(event) {
    this.selectedprojectcoverimagesFiles = event.target.files;
    //-------Riyan-------------------------------------------------------------
    this.imageSrcName = event.target.files[0].name;
    //-------Riyan-------------------------------------------------------------
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];

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


  projectcoverimagesUpload() {
    const file = this.selectedprojectcoverimagesFiles.item(0)
    this.projectcoverimagesFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.projectcoverimagesFileUpload, this.projectcoverimagesProgress)
  }



  // start project profile images

  selectProjectprofileimagesFile(event) {
    this.selectedprojectprofileimagesFiles = event.target.files;
    //-------Riyan-------------------------------------------------------------
    this.profileimageName = event.target.files[0].name;
    //-------Riyan-------------------------------------------------------------
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];

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

  projectprofileimagesUpload() {
    const file = this.selectedprojectprofileimagesFiles.item(0)
    this.projectprofileimagesFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.projectprofileimagesFileUpload, this.projectprofileimagesProgress)
  }

   
     //***Start projectdetails *//
      detectprojectdetailsFiles(event) {
        this.detailsArray=[];
        this.selectedprojectdetailsFiles = event.target.files;
        console.log('This is the selectedProjectDetails files '+this.selectedprojectdetailsFiles.length)
        for(var i =0;i<this.selectedprojectdetailsFiles.length;i++){
          var file = this.selectedprojectdetailsFiles[i];
          //Only for Pics
          if(file.type.match('image')){
            console.log('This is image')
            var picReader = new FileReader();
            picReader.onload = this.detailsReaderPreview.bind(this);
            picReader.readAsDataURL(file)
          //Only for Pics
          }else{
            //Only for Documents
            console.log('This is not image')
            var picReader = new FileReader();
            picReader.onload = this.detailsReaderPreviewDoc.bind(this);
            picReader.readAsDataURL(file)
            //Only for Documents
          }
                 
      }
        }    
    
      projectdetailsuploadMulti() {
        let files = this.selectedprojectdetailsFiles
        console.log("selected files " + files.length)
        let filesIndex = _.range(files.length)
        _.each(filesIndex, (idx) => {
          this.projectdetailsUpload = new Upload(files[idx]);
      
          console.log("Array of images " + JSON.stringify(this.projectdetailsUpload))
          this.upSvc.pushUpload(this.projectdetailsUpload)
          this.currentdetailsMulti.push(this.projectdetailsUpload)
    
        }
      )
      }
      deleteDetails(upload) {
        console.log('This is the deleted upload ' + JSON.stringify(upload))
        let index = this.detailsArray.indexOf(upload);
        this.detailsArray.splice(index, 1);
        //this.selectedPicture.nativeElement.value = '';
      }
    
      //***End  projectdetails *//
    
      //***Start projectchallenges *//
      detectprojectchallengesFiles(event) {
        this.challengesArray=[];
        this.selectedprojectchallengesFiles = event.target.files;
        console.log('This is the selectedProjectDetails files '+this.selectedprojectchallengesFiles.length)
        for(var i =0;i<this.selectedprojectchallengesFiles.length;i++){
          var file = this.selectedprojectchallengesFiles[i];
          //Only for Pics
          if(file.type.match('image')){
            console.log('This is image')
            var picReader = new FileReader();
            picReader.onload = this.challengesReaderPreview.bind(this);
            picReader.readAsDataURL(file)
          //Only for Pics
          }else{
            //Only for Documents
            console.log('This is not image')
            var picReader = new FileReader();
            picReader.onload = this.challengesReaderPreviewDoc.bind(this);
            picReader.readAsDataURL(file)
            //Only for Documents
          }
                 
      }
      }
    
      projectchallengesuploadMulti() {
        let files = this.selectedprojectchallengesFiles
        console.log("selected files " + files.length)
        let filesIndex = _.range(files.length)
        _.each(filesIndex, (idx) => {
          this.projectchallengesUpload = new Upload(files[idx]);
      
          console.log("Array of images " + JSON.stringify(this.projectchallengesUpload))
          this.upSvc.pushUpload(this.projectchallengesUpload)
          this.currentchallengesMulti.push(this.projectchallengesUpload)
      
        }
        )
      }
    
      deleteChallenges(upload) {
        console.log('This is the deleted upload ' + JSON.stringify(upload))
        let index = this.challengesArray.indexOf(upload);
        this.challengesArray.splice(index, 1);
        //this.selectedPicture.nativeElement.value = '';
      }
    
    
    
      detectprojectpartnerslistFiles(event) {
        this.partnersArray=[];
        this.selectedprojectpartnerslistFiles = event.target.files;
        console.log('This is the selectedProjectDetails '+this.selectedprojectpartnerslistFiles)
        for(var i =0;i<this.selectedprojectpartnerslistFiles.length;i++){
          var file = this.selectedprojectpartnerslistFiles[i];
          console.log('This is the file '+file)   
          //Only for Pics                                  
          if(file.type.match('image')){
            console.log('This is image')
            var picReader = new FileReader();
            picReader.onload = this.partnersReaderPreview.bind(this);
            picReader.readAsDataURL(file)
          //Only for Pics
          }else{
            //Only for Documents
            console.log('This is not image')
            var picReader = new FileReader();
            picReader.onload = this.partnersReaderPreviewDoc.bind(this);
            picReader.readAsDataURL(file)
            //Only for Documents
          }
                 
        }
      }
    
    
      projectpartnerslistuploadMulti() {
        let files = this.selectedprojectpartnerslistFiles
        console.log("selected files " + files.length)
        let filesIndex = _.range(files.length)
        _.each(filesIndex, (idx) => {
          this.projectpartnerlistUpload = new Upload(files[idx]);
          this.upSvc.pushUpload(this.projectpartnerlistUpload)
          this.currentpartnerlistMulti.push(this.projectpartnerlistUpload)
        }
        )
      }
     
      deletePartners(upload) {
        console.log('This is the deleted upload ' + JSON.stringify(upload))
        let index = this.partnersArray.indexOf(upload);
        this.partnersArray.splice(index, 1);
        //this.selectedPicture.nativeElement.value = '';
    
      }
      //***End  projectpartnerslist *//
    
      //***Start projectimages *//
    
      detectprojectimagesFiles(event) {
        this.projectsArray=[];
        this.selectedprojectimagesFiles = event.target.files;
        console.log('This is the selectedProjectDetails '+this.selectedprojectimagesFiles)
        for(var i =0;i<this.selectedprojectimagesFiles.length;i++){
          var file = this.selectedprojectimagesFiles[i];
          console.log('This is the file '+file)                                
          if(file.type.match('image')){
            console.log('This is image')
            var picReader = new FileReader();
            picReader.onload = this.projectsReaderPreview.bind(this);
            picReader.readAsDataURL(file)
          //Only for Pics
          }else{
            //Only for Documents
            console.log('This is not image')
            var picReader = new FileReader();
            picReader.onload = this.projectsReaderPreviewDoc.bind(this);
            picReader.readAsDataURL(file)
            //Only for Documents     
        }
      }
      }
    
      projectimagesuploadMulti() {
        let files = this.selectedprojectimagesFiles
        console.log("selected files " + files.length)
        let filesIndex = _.range(files.length)
        _.each(filesIndex, (idx) => {
          this.projectimagesUpload = new Upload(files[idx]);
          this.upSvc.pushUpload(this.projectimagesUpload)
          this.currentimagesMulti.push(this.projectimagesUpload)
        }
        )
      }
    
    
      deleteImages(upload) {
        console.log('This is the deleted upload ' + JSON.stringify(upload))
        let index = this.projectsArray.indexOf(upload);
        this.projectsArray.splice(index, 1);
       // this.selectedPicture.nativeElement.value = '';
      }
      //***End  projectimages *//
    
 //* Start cancel button by venkat//
  
 cancel() {
  var orgId = this.storageService.getItem("orgid");
  this.router.navigate(["/org/" + orgId]);
}

//* End cancel button by venkat//



  saveproject(add: boolean) {

    console.log("saveproject called");


    this.processData();

    var proj: LooseObject = null;
    proj = this.projects[0];

    var strSvc: LooseObject = null;
    strSvc = this.storageService;

    var db: LooseObject = null;
    db = this.db;

    var router: LooseObject = null;
    router = this.router;

    // Ramesh
    if (proj['projectAddress']) {
      this.geocode.getProjAddr(proj['projectAddress'], this.saveGeoCodeResults, proj, strSvc, db, router, add, this);
    }



  }


  saveGeoCodeResults(status, x, proj, storageService, db, router, add: boolean, parent) {


    var orgid = storageService.getItem('orgid');
    var userid = storageService.getItem('userid');
    var projectid = storageService.getItem('projectid');
    var mode = storageService.getItem('mode');


    if (status == 'ok') {
      //alert(x);
      var res = x.toString().replace("(", "").replace(")", "").split(",");
      proj['latitude'] = res[0].toString();
      proj['longitude'] = res[1].toString();

    } else {

      proj['latitude'] = '47.7511';
      proj['longitude'] = '120.7401';
    }

    



    var pushId = uuid();
    
    if (mode === 'edit')
      pushId = projectid;
    // var currenttime = new Date();
    proj['projectid'] = pushId;
    //proj['createdOn'] = Date.now();
       //proj['createdOn'] = Date.now();
    //var options = { timeZone: 'GMT', timeZoneName: 'short' };
    // 24 hours time
    //proj['createdon'] = currenttime.toLocaleTimeString('en-US', options);
         // getting date starts here 31st oct 2017
         var currentTime = new Date();
         var day = currentTime.getDate();
      
         var month = currentTime.getMonth();
         //here we are adding 1 to month because when we are getting month number,
         // even it is octber it will give us 9 because january starts from 0 not 1
         month = (month+1);
      
         var year = currentTime.getFullYear();
       
         var currentDate= currentTime.toString();
         var completeDate = currentDate.slice(15,33);
        
   
         var date = month+'-'+day+'-'+year+''+completeDate;
         
         // getting date ends here 31st oct 2017
    proj['createdon'] = date;
    //proj['createdon'] = currenttime.toUTCString();
    //console.log("this is date: "+proj['createdon'] )
    // 24 hours time
    //proj['createdon'] = currenttime.toLocaleTimeString('en-US', { hour12: false });
    proj['createdBy'] = userid;
    let listObjectObservable = db.object('/organizations/');
    listObjectObservable.$ref.child(orgid + "/projects/" + pushId + "/").update(proj);


    db.object('/projects/' + pushId).set(
      proj
    );

    //fghf
    if (!add)
      router.navigateByUrl("/project/" + pushId);

    else {
      parent.projects = [];
      parent.projectForm.reset();
    }


  }




  saveandaddproject() {

    console.log("save and add project called");
    this.saveproject(true);



  }

  // Push the project data

  processData() {

    this.projectForm.value.leads.forEach(element => {
      this.leads.push({
        'leadName': element.leadName,
         'leadEmail': element.leadEmail,
        'leadPhone': element.leadPhone
      });
    });

    this.projectForm.value.partnerOrganizations.forEach(element => {
      this.partnerOrganizations.push({
        'partnerName': element.partnerName,
        'partnershipDetails': element.partnershipDetails
      });
    });
    this.projectForm.value.interventionmechanisms.forEach(element => {
      this.interventionMechanisms.push({
        'interName': element.interName,
        'interDescription': element.interDescription
      });
    });

    var coverPhoto = { url: '', name: '' };
    if (this.projectcoverimagesFileUpload == null || this.projectcoverimagesFileUpload == undefined) {
      coverPhoto.url = "/assets/img/default.jpg";
      coverPhoto.name = 'default.jpg';
      //-------Riyan-------------------------------------------------------------
      var modeForImage = this.storageService.getItem('mode')
      if (modeForImage === 'edit') {
        if (this.projects[0]['projectcoverPhoto'] == null || this.projects[0]['projectprofilePhoto'] == null) {
          console.log('These values are null inside coverPhoto')
        } else {
          //alert(this.projects[0]['projectcoverPhoto']['url'])
          coverPhoto.url = this.projects[0]['projectcoverPhoto']['url'];
          coverPhoto.name = this.projects[0]['projectcoverPhoto']['name'];
        }
      }
      //-------Riyan-------------------------------------------------------------      
    } else {
      coverPhoto.url = this.projectcoverimagesFileUpload.url;
      coverPhoto.name = this.projectcoverimagesFileUpload.name;
    }

    var profilePhoto = { url: '', name: '' };
    if (this.projectprofileimagesFileUpload == null || this.projectprofileimagesFileUpload == undefined) {
      profilePhoto.url = "/assets/img/default_projectprofile_img.jpg";
      profilePhoto.name = 'default_projectprofile_img.jpg';
      //-------Riyan-------------------------------------------------------------
      var modeForImage = this.storageService.getItem('mode')
      if (modeForImage === 'edit') {
        if (this.projects[0]['projectcoverPhoto'] == null || this.projects[0]['projectprofilePhoto'] == null) {
          console.log('These values are null inside projectprofilePhoto')
        } else {
          //alert(this.projects[0]['projectprofilePhoto']['url'])
          profilePhoto.url = this.projects[0]['projectprofilePhoto']['url'];
          profilePhoto.name = this.projects[0]['projectprofilePhoto']['name'];
        }
      }
      //-------Riyan-------------------------------------------------------------      
    } else {
      profilePhoto.url = this.projectprofileimagesFileUpload.url;
      profilePhoto.name = this.projectprofileimagesFileUpload.name;
    }

    this.projects = [];


    this.projects.push({
      'projectType': this.projectForm.value.projectType,
      'name': this.projectForm.value.name,
      'orgId': this.storageService.getItem('orgid'),
      'orgName': this.storageService.getItem('orgName'),
      'startDate': this.projectForm.value.startDate,
      'endDate': this.projectForm.value.endDate,
      'numHouseholdsAffected': this.projectForm.value.numHouseholdsAffected,
      'projectDescription': this.projectForm.value.projectDescription,
      //'category': this.projectForm.value.category,
      'projectAddress': this.projectForm.value.projectAddress,
      'leads': this.leads,
      'budget': this.projectForm.value.budget,
      'spent': this.projectForm.value.spent,
      'challenges': this.projectForm.value.challenges,
      'partnerOrganizations': this.partnerOrganizations,
      'interventionmechanisms': this.interventionMechanisms,

      'projectcoverPhoto': coverPhoto,
      'projectprofilePhoto': profilePhoto,

      'projectDetails': this.currentdetailsMulti,
      'projectChallenges': this.currentchallengesMulti,
      'projectPartnersList': this.currentpartnerlistMulti,
      'projectImages': this.currentimagesMulti,

      'projectWebsite': this.projectForm.value.projectWebsite,
      'projectFacebook': this.projectForm.value.projectFacebooksite,
      'projectTwitter': this.projectForm.value.projectTwittersite,
      'projectYoutube': this.projectForm.value.projectYoutubesite,
      'projecLinkedIn': this.projectForm.value.projectLinkedInsite,


    });
  }

}


interface LooseObject {
  [key: string]: any
}