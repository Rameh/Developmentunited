import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { OrgSearchComponent } from './main/org-search/org-search.component';
import { MemberProfileComponent } from './main/member-profile/member-profile.component';
import { OrgProfileComponent } from './main/org-profile/org-profile.component';
import { ProjectProfileComponent } from './main/project-profile/project-profile.component';
import {RegisterorgComponent} from './main/+forms/registerorg/registerorg.component';
// import { ProjectorgComponent } from './main/+forms/projectorg/projectorg.component';
import { RegisterprojectComponent } from './main/+forms/registerproject/registerproject.component';
import { HomeComponent } from './home/home.component';
import { TemplatesComponent } from './shared/components/templates/templates.component';
import { ExploreComponent } from './main/explore/explore.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';



const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home',
  component: HomeComponent,
  data: { title: 'Development United' }},
  // Lazy async modules
  {
    path: 'login/:messageid', loadChildren: './+login/login.module#LoginModule'
  },
  {
    path: 'register', loadChildren: './+register/register.module#RegisterModule'
  },
  {
    path: 'profile', loadChildren: './+profile/profile.module#ProfileModule'
  },
  {
    path: 'admin', loadChildren: './+admin/admin.module#AdminModule'
  },
  {
     path: 'orgsearch', component: OrgSearchComponent, pathMatch: 'full'
  },
  {
    path: 'member', component: MemberProfileComponent, pathMatch: 'full'
 },
 {
  path: 'org/:profileId', component: OrgProfileComponent, pathMatch: 'full'
},
{
  path: 'project/:profileId', component: ProjectProfileComponent, pathMatch: 'full'
},
{
  path: 'project', component: ProjectProfileComponent, pathMatch: 'full'
},
{
  path: 'registerorg/:mode/:profileId', component: RegisterorgComponent, pathMatch: 'full'
},

{
  path: 'template', component: TemplatesComponent, pathMatch: 'full'
},
{
  path: 'registerproject/:mode/:profileId', component: RegisterprojectComponent, pathMatch: 'full'
},
{
  path: 'explore', component: ExploreComponent, pathMatch: 'full'
},
{
  path: 'pagenotfound', component: PageNotFoundComponent, pathMatch: 'full'
},

];

export const routing = RouterModule.forRoot(routes, { enableTracing: true,preloadingStrategy: PreloadAllModules });
