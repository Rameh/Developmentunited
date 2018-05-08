import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { CategoryComponent } from './category.component';
import { CategoryService } from './category.service';


@NgModule({
    imports: [SharedModule],
    exports: [CategoryComponent],
    declarations: [CategoryComponent],
    providers: [CategoryService]
})
export class CategoryModule { }
