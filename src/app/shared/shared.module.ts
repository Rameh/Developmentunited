import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {  ApplicationRef, CUSTOM_ELEMENTS_SCHEMA ,NO_ERRORS_SCHEMA} from '@angular/core';
import { SnackbarModule } from "ngx-heyl-snackbar";


import { PageHeadingComponent } from './directives/page-heading';
import { XLargeDirective } from './directives/x-large.directive';
import { DynamicFormComponent, DynamicFormControlComponent, ErrorMessageComponent, ErrorSummaryComponent, FormControlService } from './forms';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { OrgSearchComponent } from '../main/org-search/org-search.component';
import { MemberProfileComponent } from '../main/member-profile/member-profile.component';
import { OrgProfileComponent } from '../main/org-profile/org-profile.component';
import { ProjectProfileComponent } from '../main/project-profile/project-profile.component';
import { ConfirmComponent } from '../shared/components/confirm.component';
import { ExploreComponent } from '../main/explore/explore.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterorgComponent } from '../main/+forms/registerorg/registerorg.component';
import { RegisterprojectComponent } from '../main/+forms/registerproject/registerproject.component';

// Services
import { DataService } from './services/data.service';
import { ApiGatewayService } from './services/api-gateway.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { HttpErrorHandlerService } from './services/http-error-handler.service';
import { ApiTranslationLoader } from './services/api-translation-loader.service';
import { ContentService } from './services/content.service';
import { UtilityService } from './services/utility.service';
import { OrganizationService } from './services/organization.service';
import { ProjectService } from './services/project.service';
import { StorageService } from './services/storage.service';
import { AlertService } from './services/alert.service';
import { UppercasePipe } from './pipes/uppercase.pipe';
import { NguiMapModule} from '@ngui/map';
import { TemplatesComponent } from './components/templates/templates.component';
import {TabsModule} from "ngx-tabs";
import {PipesModule} from './pipes/pipes.module'
import { CollapseModule } from 'ngx-bootstrap'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,CollapseModule,
    RouterModule,
    NgbModule.forRoot(),
    HttpModule,
    JsonpModule,SnackbarModule,
    TabsModule,
    PipesModule,
    TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: ApiTranslationLoader } }),
    NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyAe3fIo0BWOn4DDw1or2rHPI17HMDpkn74&libraries=visualization,places,drawing,geometry'}),
  ],entryComponents:[ConfirmComponent],
  declarations: [
    XLargeDirective,
    DynamicFormComponent,
    DynamicFormControlComponent,
    ErrorMessageComponent,
    ErrorSummaryComponent,
    FooterComponent,
    HeaderComponent,
    PageHeadingComponent,
    UppercasePipe,
    OrgSearchComponent,
    ProjectProfileComponent,
    MemberProfileComponent,
    OrgProfileComponent,
    ConfirmComponent, 
    TemplatesComponent,
    ExploreComponent,
    PageNotFoundComponent,
    RegisterprojectComponent, 
    RegisterorgComponent

  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    TranslateModule,
    // Providers, Components, directive, pipes
    DynamicFormComponent,
    DynamicFormControlComponent,
    ErrorSummaryComponent,
    ErrorMessageComponent,
    FooterComponent,
    HeaderComponent,
    PageHeadingComponent,
    XLargeDirective,
    UppercasePipe, PipesModule
  ],    schemas:  [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA ],
  

})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        // Providers
        HttpErrorHandlerService,
        ApiGatewayService,
        AuthService,
        DataService,
        ContentService,
        FormControlService,
        UtilityService,
        OrganizationService,
        ProjectService,
        StorageService,
        UserService,
        AlertService
      ]
    };
  }
}
