import {NgModule} from '@angular/core';
import {AuditComponent} from "./audit.component";
import {FinsecModule} from "../finsec.module";
import {Ng2SmartTableModule} from "ng2-smart-table";

@NgModule({
            declarations: [AuditComponent],
            imports: [
              FinsecModule,
              Ng2SmartTableModule
            ],
            exports: [AuditComponent]
          })
export class AuditModule {
}
