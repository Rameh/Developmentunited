import { Injectable } from '@angular/core';
import { AngularFireDatabaseModule, AngularFireDatabase, FirebaseListObservable,FirebaseObjectObservable } from 'angularfire2/database';

@Injectable()
export class WidgetService {
  constructor(private db: AngularFireDatabase) { }

  get() {
    return this.db.list('/widgets');
  }
  put() {
    this.db.list('/widgets').remove();
    this.db.list('/widgets').push({ name: 'Angular 2', description: 'One Framework Mobile and desktop', link: 'https://angular.io/' });
    this.db.list('/widgets').push({ name: 'Firebase', description: 'Realtime backend as database', link: 'https://www.firebase.com/' });
    this.db.list('/widgets').push({ name: 'ng-bootstrap', description: 'Angular 2, powered by Bootstrap 4 written by the angular-ui Team.', link: 'https://ng-bootstrap.github.io/' });
    // tslint:disable-next-line:max-line-length
    this.db.list('/widgets').push({ name: 'Bootstrap 4', description: 'Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.', link: 'http://v4-alpha.getbootstrap.com/' });
    this.db.list('/widgets').push({ name: 'Webpack', description: 'Module bundler', link: 'https://webpack.github.io/' });
    this.db.list('/widgets').push({ name: '@ngx-translate', description: 'The internationalization (i18n) library for Angular 2+', link: 'http://www.ngx-translate.com/' });
  }

}
