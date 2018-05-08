import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ProductComponent } from './product.component';
import { ProductService } from './product.service';


@NgModule({
    imports: [SharedModule],
    exports: [ProductComponent],
    declarations: [ProductComponent],
    providers: [ProductService]
})
export class ProductModule { }
