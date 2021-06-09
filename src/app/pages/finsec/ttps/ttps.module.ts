import {NgModule} from '@angular/core';
import {FinsecModule} from '../finsec.module';
import {TtpsComponent} from './ttps.component';
import {NbWindowModule} from "@nebular/theme";
import {ShowComponent} from "../../../../components/table/show/show.component";

@NgModule({
            imports: [
              FinsecModule,
              NbWindowModule.forRoot({}),
            ],
            declarations: [
              TtpsComponent,
            ],
            exports: [TtpsComponent],
            entryComponents: [ShowComponent],
          })
export class TtpsModule {
}
