import {AfterViewInit, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EChartOption} from 'echarts';
import {VisualizeService} from '../../../@core/services/finsec/visualize/visualize.service';
import CONFIG from '../../../app.config';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import {NbStepperComponent, NbThemeService, NbToastrService, NbWindowService} from '@nebular/theme';
import {ItemDetailService} from '../../../@core/services/finsec/item-detail/item-detail.service';
import {map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';
import * as mapboxgl from 'mapbox-gl';
import {CollaborativeRiskService} from '../../../@core/services/finsec/collaborative-risk/collaborative-risk.service';
import {MapService} from '../../../@core/services/finsec/map/map.service';
import {Subscription} from "rxjs/Subscription";
import {TargetService} from "../../../@core/services/finsec/dual-list/target.service";


@Component({
             selector: 'ngx-services',
             templateUrl: './services.component.html',
             styleUrls: ['./services.component.scss'],
           })
export class ServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() type: string;
  source: any;
  event_query = {'datatype': 'Model'};
  service: any = null;
  private targetSubscription: Subscription;
  @ViewChild('stepper', {static: false}) stepper: NbStepperComponent;


  settings = {
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'right',
      custom: [
        {
          name: 'configure',
          title: '<i class="nb-edit inline-block" style="width: 50px"></i>',
        },
      ],
    },
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      created: {
        title: 'Created',
        type: 'string',
      },
      modified: {
        title: 'Modified',
        type: 'string',
      },
    },
  };

  overview_settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 4,
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
      created: {
        title: 'Created',
        type: 'string',
        width: '15%',
      },
    },
  };

  risk_settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 4,
    },
    columns: {
      id: {
        title: 'Id',
        type: 'string',
        width: '20%',
      },
      total_risk: {
        title: 'Total Risk',
        type: 'string',
        width: '20%',
      },
      total_risk_numerical: {
        title: 'Total Risk Numerical',
        type: 'string',
        width: '30%',
      },
      created: {
        title: 'Created',
        type: 'string',
        width: '15%',
      },
    },
  };
  // demo_html = require('!!html-loader!./vulnerabilities.component.html');
  // demo_ts = require('!!raw-loader!./vulnerabilities.component.ts');
  options: Observable<EChartOption>;
  services = [];
  target: Array<any>;
  display = false;
  displayThreats = false;
  displayConfigurations = false;
  addNew = false;
  service_assets = [];
  service_threats = [];
  service_risks = [];
  service_configurations = [];
  service_risk_events = [];
  riskRefMap = new Map();
  assetRefMap = new Map();
  themeSubscription: any;
  threatRefMap = new Map();
  configurationRefMap = new Map();
  eventModelRefMap = new Map();
  eventRefMap = new Map();
  map: mapboxgl.Map;
  nodes = [];
  links = [];
  @Input() identifier: string;
  fields = ['name', 'subtype', 'description', 'domain', 'asset_refs'];
  @ViewChild('contentTemplate', {static: false}) contentTemplate: TemplateRef<any>;
  protected base_url = CONFIG.finsec_retrieve_url;

  constructor(private http: HttpClient,
              private collaborativeRiskService: CollaborativeRiskService,
              private itemDetailService: ItemDetailService,
              private theme: NbThemeService,
              private toastService: NbToastrService,
              private targetService: TargetService,
              private visualizeService: VisualizeService,
              private datalayerService: DatalayerService,
              private mapService: MapService,
              private windowService: NbWindowService) {
  }


  ngOnInit(): void {
    this.targetSubscription = this.targetService.target$.subscribe(item => {
      this.target = item;
    });

    this.collaborativeRiskService.rootNode('services')
        .pipe(switchMap(service => service))
        .pipe(map(service => {
          if (service['datatype'] === 'Model') {
            return;
          }
          if (service['id'] !== 0) {
            this.services.push(service);
            this.riskRefMap.set(service['id'], service['risk_refs']);
            this.assetRefMap.set(service['id'], ['asset_refs']);
            this.eventRefMap.set(service['id'], []);
            this.threatRefMap.set(service['id'], []);
            this.configurationRefMap.set(service['id'], []);
            this.eventModelRefMap.set(service['id'], []);
          }
          return of([]);
        })).subscribe((data: any) => {
      this.source = this.services;
    });
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

    this.service_assets.forEach(function (item) {
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
    this.collaborativeRiskService.rootNode('services/' + event.data.id.replace('x-service--', '') + '/risks',
                                           null, {id: {'$in': this.riskRefMap.get(event.data.id)}},
    ).toPromise().then((risks: Array<any>) => {
      this.service_risks = risks;
      for (const risk of risks) {
        if (risk['event_refs'] && risk['event_refs'].length > 0) {
          this.eventRefMap.get(event.data.id).push(...risk['event_refs']);
        }
      }
    }).then(() => {
      this.collaborativeRiskService.rootNode('services/' + event.data.id.replace('x-service--', '') + '/assets',
                                             null, {id: {'$in': this.assetRefMap.get(event.data.id)}},
      ).toPromise().then((assets: Array<any>) => {
        this.service_assets = assets;
        if (this.service_assets.length > 0) {
          document.getElementById('asset-card').classList.remove('hidden');
          this.buildMap();
        }
        this.buildMap();
      });
    }).then(() => {
      this.collaborativeRiskService.rootNode('services/' + event.data.id.replace('x-service--', '') + '/threats',
                                             null, {id: {'$in': this.assetRefMap.get(event.data.id)}},
      ).toPromise().then((threats: Array<any>) => {
        this.service_threats = threats;
        for (const threat_ref of threats) {
          this.threatRefMap.get(event.data.id).push(threat_ref['id']);
          //TODO: fix the configuration ref map
          this.configurationRefMap.get(event.data.id).push(...threat_ref['x-risk_configuration_refs']);
        }
        if (this.service_threats.length > 0) {
          this.displayThreats = true;
          document.getElementById('threat-card').classList.remove('hidden');
        }
      }).then(() => {
        for (const threat_ref of this.threatRefMap.get(event.data.id)) {
          this.collaborativeRiskService.rootNode('threats/' + threat_ref.replace('x-threat--', '') + '/configurations')
              .toPromise().then((configuration_instance: any) => {
            this.service_configurations.push(configuration_instance);
            if (this.service_configurations.length === this.configurationRefMap.get(event.data.id).length) {
              this.displayConfigurations = true;
              document.getElementById('configuration-card').classList.remove('hidden');
            }
          });
        }
      }).then(() => {
        for (const event_ref of this.eventRefMap.get(event.data.id)) {
          this.collaborativeRiskService.rootNode('events', event_ref.replace('x-event--', ''))
              .toPromise().then((event_instance: any) => {
            this.service_risk_events.push(event_instance);
            if (this.service_risk_events.length === this.eventRefMap.get(event.data.id).length) {
              this.display = true;
              document.getElementById('event-card').classList.remove('hidden');
            }
          });
        }
      });
    });
  }

  associateAssets() {
    if (!this.service) {
      this.toastService.danger('Service missing. Please provide the required properties');
    }
    this.service['asset_refs'] = this.target;
    this.collaborativeRiskService.update('services', this.service['id'], this.service).toPromise().then(result => {
      this.toastService.warning('Service Updated successfully');
      this.stepper.next();
    });
  }

  ngAfterViewInit() {

  }

  onDeleteConfirm($event): void {
  }

  onCustomAction($event) {
    this.service = $event.data;
    document.getElementById('service-details').style.display = 'none';
    document.getElementById('service-configurations').style.display = 'block';
  }

  cancel_configuration() {
    this.addNew = false;
    document.getElementById('service-details').style.display = 'block';
    document.getElementById('service-configurations').style.display = 'none';
  }

  ngOnDestroy(): void {
    this.targetSubscription.unsubscribe();
  }

}
