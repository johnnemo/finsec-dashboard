import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {NbDialogService, NbThemeService} from '@nebular/theme';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import {Event} from '../../../@core/data/finsec/sdos/event';
import {takeWhile} from 'rxjs/operators';
import {forkJoin} from 'rxjs/index';
import {GeoJson} from '../../../@core/data/finsec/map/geo-json';
import * as mapboxgl from 'mapbox-gl';
import {MapService} from '../../../@core/services/finsec/map/map.service';

@Component({
             selector: 'total-events',
             templateUrl: 'events.component.html',
             styleUrls: ['events.component.scss'],
           })
// TODO: map clustering generic component
export class EventsComponent implements AfterViewInit, OnDestroy, OnInit {

  options: any = [];
  currentTheme: string;
  events: Event[];
  lat: any;
  lon: any;
  flag = false;
  map_source: any[];
  themeSubscription: any;
  data: any;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v10';
  center: GeoJson = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [0, 0],
    },
    'properties': {
      'message': 'World Map',
      'marker-size': 'small',
      'zoom': 0,
    },
  };
  private alive = true;

  constructor(
    private theme: NbThemeService,
    private elementRef: ElementRef,
    private datalayerService: DatalayerService,
    private dialogService: NbDialogService,
    private mapService: MapService,
  ) {
  }

  static msToTime(s) {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return (hrs !== 0 ? hrs : '0' + hrs) + ':' +
           (mins !== 0 ? mins : '0' + mins) + ':' +
           (secs !== 0 ? secs : '0' + secs);
  }

  static renderGanttItem(params, api) {
    const HEIGHT_RATIO = 0.05;
    const DIM_CATEGORY_INDEX = 0;
    const DIM_TIME_ARRIVAL = 1;
    const DIM_TIME_DEPARTURE = 2;
    const _cartesianXBounds = [];
    const _cartesianYBounds = [];
    const categoryIndex = api.value(DIM_CATEGORY_INDEX);
    const timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex]);
    const timeDeparture = api.coord([api.value(DIM_TIME_DEPARTURE), categoryIndex]);

    const coordSys = params.coordSys;
    _cartesianXBounds[0] = coordSys.x;
    _cartesianXBounds[1] = coordSys.x + coordSys.width;
    _cartesianYBounds[0] = coordSys.y;
    _cartesianYBounds[1] = coordSys.y + coordSys.height;

    const barLength = timeDeparture[0] - timeArrival[0];
    // Get the heigth corresponds to length 1 on y axis.
    const barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
    const x = timeArrival[0];
    const y = timeArrival[1] - barHeight;

    const flightNumber = api.value(3) + '';
    const flightNumberWidth = echarts.format.getTextRect(flightNumber).width;
    const text = (barLength > flightNumberWidth + 40 && x + barLength >= 180)
      ? flightNumber : '';

    const rectNormal = EventsComponent.clipRectByRect(params, {
      x: x, y: y, width: barLength, height: barHeight,
    });
    const rectVIP = EventsComponent.clipRectByRect(params, {
      x: x, y: y, width: (barLength) / 2, height: barHeight,
    });
    const rectText = EventsComponent.clipRectByRect(params, {
      x: x, y: y, width: barLength, height: barHeight,
    });

    return {
      type: 'group',
      children: [
        {
          type: 'rect',
          ignore: !rectNormal,
          shape: rectNormal,
          style: api.style({fill: 'red'}),
        }, {
          type: 'rect',
          ignore: !rectVIP && !api.value(4),
          shape: rectVIP,
          style: api.style({fill: ''}),
        }, {
          type: 'rect',
          ignore: !rectText,
          shape: rectText,
          style: api.style({
                             fill: 'transparent',
                             stroke: 'transparent',
                             text: text,
                             textFill: '#fff',
                           }),
        },
      ],
    };
  }

  static renderAxisLabelItem(params, api) {
    const y = api.coord([0, api.value(0)])[1];
    if (y < params.coordSys.y + 5) {
      return;
    }
    return {
      type: 'group',
      position: [
        10,
        y,
      ],
      children: [
        {
          type: 'path',
          shape: {
            d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
            x: 0,
            y: -20,
            width: 90,
            height: 20,
            layout: 'cover',
          },
          style: {
            fill: '',
          },
        }, {
          type: 'text',
          style: {
            x: 24,
            y: -3,
            text: api.value(1),
            textVerticalAlign: 'bottom',
            textAlign: 'center',
            textFill: '#fff',
          },
        }, {
          type: 'text',
          style: {
            x: 75,
            y: -2,
            textVerticalAlign: 'bottom',
            textAlign: 'center',
            text: api.value(2),
            textFill: '#000',
          },
        },
      ],
    };
  }

  static clipRectByRect(params, rect) {
    return echarts.graphic.clipRectByRect(rect, {
      x: params.coordSys.x,
      y: params.coordSys.y,
      width: params.coordSys.width,
      height: params.coordSys.height,
    });
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(theme => {
      this.currentTheme = theme.name;
    });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onClick(event) {
  }

  ngOnInit(): void {

    const now = new Date();

    const pastDay = new Date(now.getTime() - (1000 * 60 * 60 * 12));
    const query = {
      'created': {
        $gte: pastDay, // One day events
      },
    };
    forkJoin(
      this.datalayerService.rootNode('x-event', null, query),
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(([events]: [Event[]]) => {
        events.splice(-1, 1);
        if (events.length === 0) {
          return;
        }
        this.events = events;
        this.map_source = events;
        const DIM_CATEGORY_INDEX = 0;
        const DIM_TIME_ARRIVAL = 1;
        const DIM_TIME_DEPARTURE = 2;

        this.options = {
          tooltip: {
            triggerOn: 'click',
            confine: true,
            formatter: function (params) {
              const created = new Date(params.data[1]);
              const modified = new Date(params.data[2]);
              const duration = (modified.getTime() - created.getTime());
              const humanReadableDuration = EventsComponent.msToTime(duration);
              return `
                                    Name: ${params.data[3]}<br/>
                                    Id: ${params.data[4]}<br/>
                                    Description: ${params.data[5]}<br/>
                                    Duration: ${humanReadableDuration}<br/>
                                    <!--<a href="#" >Details</a>-->
                            `;
            },
          },
          animation: false,
          toolbox: {
            left: 20,
            top: 0,
            itemSize: 20,
            title: 'Event timeline',
          },
          title: {
            text: 'Events Timeline',
            left: 'center',
            textStyle: {
              color: '#fff',
            },
          },
          dataZoom: [
            {
              type: 'slider',
              xAxisIndex: 0,
              filterMode: 'weakFilter',
              height: 20,
              bottom: 0,
              start: 0,
              end: 26,
              handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,' +
                          '8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z' +
                          'M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              showDetail: false,
            }, {
              type: 'inside',
              id: 'insideX',
              xAxisIndex: 0,
              filterMode: 'weakFilter',
              start: 0,
              end: 26,
              zoomOnMouseWheel: false,
              moveOnMouseMove: true,
            }, {
              type: 'slider',
              yAxisIndex: 0,
              zoomLock: true,
              width: 10,
              right: 10,
              top: 70,
              bottom: 20,
              start: 95,
              end: 100,
              handleSize: 0,
              showDetail: false,
            }, {
              type: 'inside',
              id: 'insideY',
              yAxisIndex: 0,
              start: 95,
              end: 100,
              zoomOnMouseWheel: false,
              moveOnMouseMove: true,
              moveOnMouseWheel: true,
            },
          ],
          grid: {
            show: true,
            top: 70,
            bottom: 20,
            left: 100,
            right: 20,
            backgroundColor: '#222b45',
            borderWidth: 0,
          },
          xAxis: {
            type: 'time',
            position: 'top',
            splitLine: {
              lineStyle: {
                // TODO: based on the event level change the color in the timeline
                color: ['green'],
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              lineStyle: {
                color: 'green',
              },
            },
            axisLabel: {
              color: '#929ABA',
              inside: false,
              align: 'center',
            },
          },
          yAxis: {
            axisTick: {show: false},
            splitLine: {show: false},
            axisLine: {show: false},
            axisLabel: {show: false},
            min: 0,
            max: this.events.length,
          },
          series: [
            {
              id: 'flightData',
              type: 'custom',
              renderItem: EventsComponent.renderGanttItem,
              dimensions: [
                'Index',
                'Created',
                'Modified',
                'Name',
                'Id',
                'Description',
              ],
              encode: {
                x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
                y: DIM_CATEGORY_INDEX,
                tooltip: [DIM_CATEGORY_INDEX, DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
              },
              data: [],
            },

          ],
        };
        const that = {...this};
        let index = 0;
        // TODO: change index according to the subtype with an initial mapping subtype to index. Index is
        // used to place bars one after the other in the gantt chart
        this.events.forEach(function (event) {
          index++;
          if (event.domain && event.created && event.modified && event.name) {
            let createdDate = event.created;
            // display the events in the timeline even if the created date is past the start of the timeline
            if (Date.parse(event.created) > Date.parse(pastDay.toISOString())) {
              createdDate = pastDay.toISOString();
            }
            const event_representation = [
              index,
              Date.parse(createdDate),
              Date.parse(event.modified),
              event.name,
              event.id,
              event.description,
            ];
            that.options.series[0].data.push(event_representation);
          }
        });
        this.flag = true;
        this.buildMap();
      });

  }

  open() {
  }

  buildMap() {
    this.map = new mapboxgl.Map({
                                  container: 'event_map',
                                  style: 'mapbox://styles/mapbox/dark-v10',
                                  center: [13.404954, 52.520008],
                                  zoom: 1, // starting zoom
                                });
    this.map.on('load', this.onLoad.bind(this));
  }

  onLoad() {
    const data_source = {
      type: 'FeatureCollection',
      'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'}},
      features: [],
    };
    const features = [];
    data_source.features = features;

    this.map_source.forEach(function (item) {
      if (!item.coordinates) {
        return;
      }
      const geometry = {type: null, coordinates: []};
      const properties = {id: null, name: null, description: null, subtype: null, domain: null};
      properties.id = item.id;
      properties.name = item.name;
      properties.description = item.description;
      properties.subtype = item.sybtype;
      properties.domain = item.domain;
      geometry.type = 'Point';
      geometry.coordinates[0] = item.coordinates[1];
      geometry.coordinates[1] = item.coordinates[0];
      features.push({
                      type: 'Feature',
                      properties: properties,
                      geometry: geometry,
                    });
    });
    data_source.features.push(JSON.stringify(features));
    this.map.addSource('events', {
      type: 'geojson',
      data: data_source,
      cluster: true,
      clusterRadius: 50, // Radius of each cluster when clustering points
      clusterMaxZoom: 6, // Max zoom to cluster points on
    });
    this.map.addLayer({
                        id: 'clusters',
                        type: 'circle',
                        source: 'events',
                        filter: ['has', 'point_count'],
                        paint: {
                          // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                          // with three steps to implement three types of circles:
                          //   * Blue, 20px circles when point count is less than 100
                          //   * Yellow, 30px circles when point count is between 100 and 750
                          //   * Pink, 40px circles when point count is greater than or equal to 750
                          'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#51bbd6',
                            100,
                            '#f1f075',
                            750,
                            '#f28cb1',
                          ],
                          'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40,
                          ],
                        },
                      });
    this.map.addLayer({
                        id: 'cluster-count',
                        type: 'symbol',
                        source: 'events',
                        filter: ['has', 'point_count'],
                        layout: {
                          'text-field': '{point_count_abbreviated}',
                          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                          'text-size': 12,
                        },
                      });

    this.map.addLayer({
                        id: 'unclustered-point',
                        type: 'circle',
                        source: 'events',
                        filter: ['!', ['has', 'point_count']],
                        paint: {
                          'circle-color': '#11b4da',
                          'circle-radius': 4,
                          'circle-stroke-width': 1,
                          'circle-stroke-color': '#fff',
                        },
                      });
  }
}
