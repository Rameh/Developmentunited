import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import * as firebase from 'firebase';

import {FileUpload} from '../../shared/interfaces/fileupload';
import {Upload} from '../../shared/interfaces/upload';















@Injectable()
export class UploadFileService {

  private basePath = '/projectdocuments';
  fileUploads: FirebaseListObservable<FileUpload[]>;

  //private basePath:string = '/uploads';
  uploads: FirebaseListObservable<Upload[]>;
 



  constructor(private db: AngularFireDatabase) {}

  pushFileToStorage(fileUpload: FileUpload, progress: {percentage: number}) {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${fileUpload.file.name}`).put(fileUpload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot
        progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
      },
      (error) => {
        // fail
        //console.log(error)
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL
        fileUpload.name = fileUpload.file.name
        this.saveFileData(fileUpload)
      }
    );
  }

  private saveFileData(fileUpload: FileUpload) {
    this.db.list(`${this.basePath}/`).push(fileUpload)
  }

  getFileUploads(query = {}) {
    this.fileUploads = this.db.list(this.basePath, {
      query: query
    });
    return this.fileUploads
  }

  deleteFileUpload(fileUpload: FileUpload) {
    this.deleteFileDatabase(fileUpload.$key)
      .then(() => {
        this.deleteFileStorage(fileUpload.name)
      })
      .catch(error => console.log(error))
  }

  private deleteFileDatabase(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key)
  }

  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref()
    storageRef.child(`${this.basePath}/${name}`).delete()
  }

   //private basePath:string = '/uploads';
   //uploads: FirebaseListObservable<Upload[]>;
   
pushUpload(upload: Upload) {
  console.log("this is upload "+JSON.stringify(upload.file.name))
  let storageRef = firebase.storage().ref();
  let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot) =>  {
      // upload in progress
      upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    },
    (error) => {
      // upload failed
      console.log(error)
    },
    () => {
      // upload success
      upload.url = uploadTask.snapshot.downloadURL
      upload.name = upload.file.name
      this.saveFileData(upload)
    }
  );
}

}


// Writes the file details to the realtime db
// private saveFileData(upload: Upload) {
//   this.db.list(`${this.basePath}/`).push(upload);
// }
// 
