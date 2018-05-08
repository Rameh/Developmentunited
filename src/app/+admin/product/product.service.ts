import { Injectable } from '@angular/core';

import { DataService } from '../../shared/services/data.service';

@Injectable()
export class ProductService {

    private adminApiUrl: string = 'api/admin/product/';

    constructor(private dataService: DataService) { }
}
