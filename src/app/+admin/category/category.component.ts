import { Component, OnInit } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Category } from '../admin.models';

@Component({
  selector: 'appc-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: FirebaseListObservable<any[]>;
  currentCategory: any;

  constructor(private db: AngularFireDatabase, private modalService: NgbModal) { }

  ngOnInit() {
    this.categories = this.db.list('/categories');
  }

  delete(category: any) {
    this.categories.remove(category)
      .catch(x => {
        //console.log(x.message);
      });
  }

  save(category) {
    category.dateAdded = firebase.database.ServerValue.TIMESTAMP
    if (category.$key) {
      this.categories.update(category.$key, { name: category.name, description: category.description });
    } else {
      this.categories.push(category);
    }
  }

  open(template, category) {
    this.currentCategory = category ? Object.assign({}, category) : { name: '', description: '' };
    this.modalService.open(template).result.then((result) => {
      this.save(result);
      //console.log(`Closed with: ${result}`);
    }, (reason) => {
      //console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
