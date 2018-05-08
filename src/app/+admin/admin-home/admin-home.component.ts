import { Component, OnInit } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  categories: any;
  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.categories = this.db.list('/categories');
  }
}
