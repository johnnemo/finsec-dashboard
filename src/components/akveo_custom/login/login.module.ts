import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login.component";
import {NbAlertModule, NbButtonModule, NbCheckboxModule, NbInputModule} from "@nebular/theme";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule({
            declarations: [LoginComponent],
            imports: [
              CommonModule,
              FormsModule,
              RouterModule,
              NbAlertModule,
              NbInputModule,
              NbButtonModule,
              NbCheckboxModule,
            ]
          })
export class LoginModule {
}
