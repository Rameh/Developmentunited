import { Title } from '@angular/platform-browser';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {  AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'appc-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  // encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  private scrollExecuted: boolean = false;
  
  constructor(private translate: TranslateService, private titleService: Title,private activatedRoute: ActivatedRoute) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');


    
  }

  
    

  ngOnInit() {
    this.translate.get('Development United')
      .subscribe(title => this.setTitle(title));

  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
