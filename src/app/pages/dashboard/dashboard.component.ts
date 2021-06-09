import {Component, OnDestroy} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {takeWhile} from 'rxjs/operators';

interface CardSettings {
  title: string;
  iconClass: string;
  type: string;
}

@Component({
             selector: 'ngx-dashboard',
             styleUrls: ['./dashboard.component.scss'],
             templateUrl: './dashboard.component.html',
           })
export class DashboardComponent implements OnDestroy {

  options: any = {};
  notifications = [];
  cyberCount = 0;
  cyberData = [];
  solarValue: number;
  lightCard: CardSettings = {
    title: 'Light',
    iconClass: 'nb-lightbulb',
    type: 'primary',
  };
  rollerShadesCard: CardSettings = {
    title: 'Roller Shades',
    iconClass: 'nb-roller-shades',
    type: 'success',
  };
  wirelessAudioCard: CardSettings = {
    title: 'Wireless Audio',
    iconClass: 'nb-audio',
    type: 'info',
  };
  coffeeMakerCard: CardSettings = {
    title: 'Coffee Maker',
    iconClass: 'nb-coffee-maker',
    type: 'warning',
  };
  statusCards: string;
  echartsInstance: any;
  commonStatusCardsSet: CardSettings[] = [
    this.lightCard,
    this.rollerShadesCard,
    this.wirelessAudioCard,
    this.coffeeMakerCard,
  ];
  statusCardsByThemes: {
    default: CardSettings[];
    cosmic: CardSettings[];
    corporate: CardSettings[];
    dark: CardSettings[];
  } = {
    default: this.commonStatusCardsSet,
    cosmic: this.commonStatusCardsSet,
    corporate: [
      {
        ...this.lightCard,
        type: 'warning',
      },
      {
        ...this.rollerShadesCard,
        type: 'primary',
      },
      {
        ...this.wirelessAudioCard,
        type: 'danger',
      },
      {
        ...this.coffeeMakerCard,
        type: 'info',
      },
    ],
    dark: this.commonStatusCardsSet,
  };
  private alive = true;

  constructor(private themeService: NbThemeService/*, private notificationService: NotificationService*/) {

    this.options = {
      backgroundColor: echarts.bg,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
      },
      legend: {
        left: 'left',
        data: ['Cyber', 'Physicall'],
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
      ],
      yAxis: [
        {
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: echarts.splitLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      series: [
        {
          name: 'Cyber',
          type: 'line',
          data: [0],
        },
        {
          name: 'Physical',
          type: 'line',
          data: [0],
        },
      ],
    };
    this.themeService.getJsTheme()
        .pipe(takeWhile(() => this.alive))
        .subscribe(theme => {
          this.statusCards = this.statusCardsByThemes[theme.name];
        });
    // this.notificationService.getNotificationItems().subscribe((notification: Notification) => {
    //     this.notifications.push(notification);
    //     this.notifications.push({title: notification.name});
    //     if (notification.domain == 'Cyber') {
    //         this.cyberCount++;
    //         this.cyberData.push(this.cyberCount);
    //         this.echartsInstance.setOption({
    //             series: [{
    //                 type: "line",
    //                 name: "Cyber",
    //                 data: this.cyberData
    //             }]
    //         });
    //     }
    // });

  }

// cache echartsInstance in your component
  onChartInit(e: any) {
    this.echartsInstance = e;
  }

  resize() {
    this.echartsInstance.resize();
  }

  ngOnDestroy() {
    this.alive = false;
  }


}
