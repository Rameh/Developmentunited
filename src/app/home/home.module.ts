import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { WidgetService } from './widget/widget.service';
import { routing } from "./home.routes";
import { NguiMapModule} from '@ngui/map';


@NgModule({
  
    imports: [
        routing,
        SharedModule,
        NguiMapModule],
    providers: [WidgetService],
    declarations: [HomeComponent]
    
})
export class HomeModule {

    
}