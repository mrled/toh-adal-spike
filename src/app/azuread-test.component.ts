import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { o365Adal } from './o365-adal.service';

@Component({
  selector: 'azuread-test',
  templateUrl: './azuread-test.component.html'
})
export class AzureadTestComponent {
    adalUserProperties: object;
    constructor(private adalService: o365Adal /*, isPrivate: boolean*/ ) {
        if (!this.adalService.isUserAuthenticated) {
            console.log("Not authenticated. Redirecting...");
            this.adalService.authContext.login();
        } else {
            console.log("We have authentication, sparkles emoji");
            this.adalUserProperties = adalService.userPropr;
        }
    }
}
