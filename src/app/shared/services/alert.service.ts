import { Injectable } from '@angular/core';
import { SnackbarService, SnackbarConfig, SnackbarFade } from "ngx-heyl-snackbar";



@Injectable()
export class AlertService {
    snackbarOneConfig: SnackbarConfig = new SnackbarConfig().setFade(SnackbarFade.TOP).setTitle("Snackbar One").setCloseButton(true);
    snackbarTwoConfig: SnackbarConfig = new SnackbarConfig().setFade(SnackbarFade.BOTTOM).setTitle("Snackbar Two");


    constructor(private snackbarService: SnackbarService) {
    }


    showToast1(msg: string) {

        this.snackbarService.openSnackbar(this.snackbarOneConfig, msg)
    }

    showToast2(msg: string) {

        this.snackbarService.openSnackbar(this.snackbarTwoConfig, msg)
    }


}