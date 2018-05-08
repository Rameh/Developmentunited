import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProjectService {
  uid: string;
  projects: Array<string> = [];

  constructor(private db: AngularFireDatabase, private storageService: StorageService) { }

  addProject(org: object) {    
    this.uid = uuid();
    let project = this.db.object('/projects/' + this.uid);
    var currentTime = new Date();
    project['createdOn'] = currentTime.toLocaleTimeString();
    project['createdBy'] = this.storageService.getItem('userid');
    project.update(
      project
    );

    this.storageService.removeItem('project');
  }

  getAllProjects() {

    let projectTable:FirebaseObjectObservable<any[]>;
    let projectData:Array<object>;
    let projects = [];
    this.db.list('/projects', { preserveSnapshot: true })
      .subscribe(projRes => {
        projRes.forEach(projListRes => {
          projectTable = projListRes.val();
          var key = projListRes.key;
          projectTable['projKey'] = projListRes.key;
          projects.push(projectTable);
        });
        for (var i = 0; i < projects.length; i++) {
        
          //console.log('This is the looped data of organisation ' + JSON.stringify(projects[i]['name']) );
            
          }
                
      })

      return projects;
  }

  getAll(query: string) {
    let items = this.db.list('/projects').map(i=>{return i});
    items.forEach(i => {
     i.forEach(e => {
         if (e.name.includes(query)) {
          return e.name;
        }      
      })
     });
    return items;
  }

  getMyProjectsContaining(query: string,userid:string) {
    let items = this.db.list('/projects').map(i=>{return i});
    items.forEach(i => {
     i.forEach(e => {
         if (e.name.includes(query)) {
          return e.name;
        }      
      })
     });
    return items;
  }
  getMyProjectsC(userid:string) {
    let items = this.db.list('/projects').map(i=>{return i});
    items.forEach(i => {
     i.forEach(e => {
         if (e.CreatedBy.includes(userid)) {
          return e.name;
        }      
      })
     });
    return items;
  }

  getProject(id: string) {
    return this.db.object('/projects/' + id);
  }

}
