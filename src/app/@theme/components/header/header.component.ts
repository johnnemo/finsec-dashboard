import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';

import {LayoutService} from '../../../@core/utils';
import {map, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../../@core/services/shared/auth.service';
import * as jwt_decode from 'jwt-decode';

@Component({
             selector: 'ngx-header',
             styleUrls: ['./header.component.scss'],
             templateUrl: './header.component.html',
           })
export class HeaderComponent implements OnInit, OnDestroy {

  userPictureOnly = false;
  user: any;
  token: any;
  notifications = [];
  notificationCount = 0;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];
  currentTheme = 'default';
  userMenu = [{title: 'Profile'}, {title: 'Log out'}];
  notificationMenu = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private sidebarService: NbSidebarService,
              private authenticationService: AuthService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              // private notificationService: NotificationService,
  ) {
  }

  onContecxtItemSelection(title) {
    if (title === 'Log out') {
      this.authenticationService.logoutUser();
    } else {
      // TODO: create the navigation to the notification show page
    }
  }

  ngOnInit(): void {
    const user = '27d78572-d762-4478-b7ca-360301532e53'; // SYSTEM user backend test user id

    this.token = jwt_decode(sessionStorage.getItem('token'));

    this.currentTheme = this.themeService.currentTheme;


    this.menuService.onItemClick()
        .subscribe((event) => {
          this.onContecxtItemSelection(event.item.title);
        });


    this.user = {
      name: this.token['preferred_username'],
      organization: this.token['x_organization'],
      role: this.token['x_role'],
    };

    const {xl} = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
        .pipe(
          map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
          takeUntil(this.destroy$),
        )
        .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
        .pipe(
          map(({name}) => name),
          takeUntil(this.destroy$),
        )
        .subscribe(themeName => this.currentTheme = themeName);

    // this.notificationMenu.push({title: 'Malware Detected'});
    // this.notificationService.getNotificationItems().subscribe((notification: Notification) => {
    //     this.notifications.push(notification);
    //     this.notificationMenu.push({title: notification.name});
    //     this.notificationCount++;
    // });

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
