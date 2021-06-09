import {NgModule} from '@angular/core';
import {OrganizationsComponent} from './organizations.component';
import {FinsecModule} from '../finsec.module';

@NgModule({
            imports: [
              FinsecModule,
            ],
            declarations: [
              OrganizationsComponent,
            ],
            exports: [OrganizationsComponent],
          })
export class OrganizationsModule {
}
