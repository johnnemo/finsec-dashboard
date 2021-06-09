import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GeoJson} from '../../../@core/data/finsec/map/geo-json';
import * as mapboxgl from 'mapbox-gl';
import {NbThemeService} from '@nebular/theme';
import {
  PredictiveAnalyticsService} from '../../../@core/services/finsec/predictive-analytics/predictive-analytics.service';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import {AttackResultsComponent} from './scan-results/attack-results.component';
import {of} from 'rxjs/internal/observable/of';
import {MitigationService} from '../../../@core/services/finsec/mitigation/mitigation.service';
import {ActivatedRoute} from '@angular/router';
import {AnomalyDetectionService} from '../../../@core/services/finsec/anomaly-detection/anomaly-detection.service';
import {MapService} from '../../../@core/services/finsec/map/map.service';

@Component({
             selector: 'ngx-predictive-analytics',
             templateUrl: './predictive-analytics.component.html',
             styleUrls: ['./predictive-analytics.component.scss'],
           })
export class PredictiveAnalyticsComponent implements OnInit, AfterViewInit {

  themeSubscription: any;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/dark-v10';
  center: GeoJson = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [13.404954, 52.520008],
    },
    'properties': {
      'message': 'World Map',
      'marker-size': 'small',
      'zoom': 0,
    },
  };

  assets: any[];
  actions: Array<any> = [];
  course_of_actions: Array<any> = [];
  source = [];
  attacks = [];
  refMap = new Map();
  assetRefMap = new Map();
  attack_events = [];
  attack_assets = [];
  attack_service: string;
  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      id: {
        title: 'Identifier',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
      },

      attack_type: {
        title: 'Attack Type',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      window: {
        title: 'Window',
        type: 'string',
      },
      algorithms: {
        title: 'Algorithms',
        type: 'string',
      },
      created: {
        title: 'Created',
        type: 'string',
      },
    },
  };
  // events or courses of actions
  overview_settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      id: {
        title: 'Id',
        type: 'string',
        width: '20%',
      },
      name: {
        title: 'Name',
        type: 'string',
        width: '20%',
      },
      description: {
        title: 'Description',
        type: 'html',
        width: '30%',
      },
      details: {
        title: 'Details',
        type: 'custom',
        renderComponent: AttackResultsComponent,
        width: '15%',
      },
      created: {
        title: 'Created',
        type: 'string',
        width: '15%',
      },
    },
  };

  constructor(
    private route: ActivatedRoute,
    private anomalyDetectionService: AnomalyDetectionService,
    private predictiveAnalyticsService: PredictiveAnalyticsService,
    private datalayerService: DatalayerService,
    private mitigationService: MitigationService,
    private theme: NbThemeService,
    private mapService: MapService,
  ) {
    this.route.url.subscribe(params => {
      this.attack_service = params[0].path;
    });
  }

  ngOnInit(): void {
    if (this.attack_service !== 'predicted') {
      this.anomalyDetectionService.rootNode('x-attack', null, true)
          .pipe(switchMap(attack => attack))
          .pipe(map(attack => {
            if (attack['id'] !== 0) {
              this.attacks.push(attack);
              this.refMap.set(attack['id'], attack['event_refs']);
              this.assetRefMap.set(attack['id'], []);
            }
            return of([]);
          })).subscribe((data: any) => {
        this.source = this.attacks;
      });
    } else {
      this.predictiveAnalyticsService.rootNode()
          .pipe(map(attacks => attacks.attacks))
          .pipe(switchMap(attack => attack))
          .pipe(mergeMap(attack => {
            if (attack['id'] !== 0 && attack['x_organization'] === sessionStorage.getItem('x_organization')) {
              this.attacks.push(attack);
              this.refMap.set(attack['id'], attack['event_refs']);
              this.assetRefMap.set(attack['id'], []);
            }
            return of([]);
          })).subscribe((data: any) => {
        this.source = this.attacks;
      });
    }
  }

  buildMap() {
    this.map = new mapboxgl.Map({
                                  container: 'map',
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

    this.attack_assets.forEach(function (item) {
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
    this.map.addSource('assets', {
      type: 'geojson',
      data: data_source,
      cluster: true,
      clusterRadius: 50, // Radius of each cluster when clustering points
      clusterMaxZoom: 6, // Max zoom to cluster points on
    });
    this.map.addLayer({
                        id: 'clusters',
                        type: 'circle',
                        source: 'assets',
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
                        source: 'assets',
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
                        source: 'assets',
                        filter: ['!', ['has', 'point_count']],
                        paint: {
                          'circle-color': '#11b4da',
                          'circle-radius': 4,
                          'circle-stroke-width': 1,
                          'circle-stroke-color': '#fff',
                        },
                      });


  }

  onRowSelect(event) {
    this.course_of_actions = [];
    this.datalayerService.rootNode('x-event', null, {id: {'$in': this.refMap.get(event.data.id)}},
    ).toPromise().then((finsec_events: Array<any>) => {
      finsec_events.splice(-1, 1);
      this.attack_events = finsec_events;
      for (const finsec_event of finsec_events) {
        if (finsec_event['asset_refs'] && finsec_event['asset_refs'].length > 0) {
          this.assetRefMap.get(event.data.id).push(...finsec_event['asset_refs']);
        }
      }
    }).then(() => {
      this.datalayerService.rootNode('x-asset', null, {id: {'$in': this.assetRefMap.get(event.data.id)}},
      ).toPromise().then((assets: Array<any>) => {
        if (assets && assets.length > 0) {
          assets.splice(-1, 1);
        }
        this.attack_assets = assets;
        if (this.attack_assets.length > 0) {
          document.getElementById('asset-card').classList.remove('hidden');
          this.buildMap();
        }
        this.buildMap();
      });
    }).then(() => {
      // TODO: should be event.data.id -> now this attack is not a daily one.. So the table doesn't provide the
      // ability to click it
      this.datalayerService.rootNode('x-cpti',
                                     null,
                                     {attack_ref: event.data.id},
      ).toPromise().then((cpti) => {
        cpti.splice(-1, 1);
        for (const cpti_item of cpti) {
          this.mitigationService.rootNode().toPromise().then((course_of_actions) => {
            course_of_actions = course_of_actions.list;
            this.course_of_actions
                .push(...course_of_actions.filter(action => cpti_item['coa_refs'].includes(action.id)));
          });
        }
      });
    });
  }

  ngAfterViewInit() {

  }

}

