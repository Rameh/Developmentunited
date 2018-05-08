import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      { path: 'home', component: AdminHomeComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'product', component: ProductComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
