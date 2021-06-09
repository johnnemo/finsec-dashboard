import {Component} from '@angular/core';

@Component({
             selector: 'ngx-footer',
             styleUrls: ['./footer.component.scss'],
             template: `
               <span class="created-by">Copyright © <a href="https://www.finsec-project.eu/"
                                                       target="_blank">FINSEC 2019</a> <br/>Credits to <b><a
                 href="https://akveo.com" target="_blank">Akveo</a></b> </span>
               <div class="socials">
                 <a href="https://gogs.finsec-project.eu/user/login" target="_blank" class="ion ion-social-google"></a>
                 <a href="https://twitter.com/finsec_project" target="_blank" class="ion ion-social-twitter"></a>
                 <a href="https://www.linkedin.com/in/finsec-project-075321164/" target="_blank"
                    class="ion ion-social-linkedin"></a>
               </div>
             `,
           })
export class FooterComponent {
}
