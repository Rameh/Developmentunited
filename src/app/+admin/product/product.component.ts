import { Component, OnInit } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Category, Product } from '../admin.models';

@Component({
  selector: 'appc-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  selectedCategoryId: string = '';
  categories: FirebaseListObservable<Category[]>;
  products: FirebaseListObservable<Product[]>;
  currentProduct: any;

  constructor(private db: AngularFireDatabase, private modalService: NgbModal) { }

  ngOnInit() {
    this.categories = this.db.list('/categories');
  }

  delete(product: any) {
    this.products.remove(product);
  }

  save(product: Product) {
    //console.log(product.dateAdded);
    if (product.$key) {
      this.products.update(product.$key, {
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        dateAdded: new Date(product.dateAdded.year,product.dateAdded.month, product.dateAdded.day) 
      });
    }
    else {
      product.dateAdded = firebase.database.ServerValue.TIMESTAMP;
      this.products.push(product);
    }
  }

  open(template, product) {
    this.currentProduct = product ? Object.assign({}, product) : { name: '', description: '', price: '', quantity: '', dateAdded: '' };
    this.modalService.open(template).result.then((result) => {
      this.save(result);
      //console.log(`Closed with: ${result}`);
    }, (reason) => {
      //console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  onChange() {
    this.products = this.db.list(`/products/${this.selectedCategoryId}`);
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

