import {AfterViewInit, Component, OnInit} from '@angular/core';
import {GeoJson} from '../../../@core/data/finsec/map/geo-json';
import * as mapboxgl from 'mapbox-gl';
import {NbThemeService} from '@nebular/theme';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import {MitigationService} from '../../../@core/services/finsec/mitigation/mitigation.service';
import {AuditService} from '../../../@core/services/finsec/audit/audit.service';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs/internal/observable/of';
import {mergeMap} from 'rxjs/operators';
import {from} from 'rxjs/internal/observable/from';

@Component({
             selector: 'ngx-finsec-audit',
             templateUrl: './audit.component.html',
             styleUrls: ['./audit.component.scss'],
           })
export class AuditComponent implements OnInit, AfterViewInit {

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

  source = [];
  assets: any[] = [];
  risks: any[] = [];
  course_of_actions: any[] = [];
  relationships: any[] = [];
  libraries: any[] = [];
  threat_scenarios: any[] = [];
  security_model: any;
  securityModelLibrariesRefMap = new Map();
  securityModelRisksRefMap = new Map();
  securityModelRelationshipsRefMap = new Map();
  securityModelAssetsRefMap = new Map();
  securityModelCoursesOfActionsRefMap = new Map();
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
      risk_level: {
        title: 'Risk Level',
        type: 'string',
        width: '20%',
      },
      created: {
        title: 'Created',
        type: 'string',
        width: '15%',
      },
    },
  };

  constructor(
    private auditService: AuditService,
    private http: HttpClient,
    private datalayerService: DatalayerService,
    private mitigationService: MitigationService,
    private theme: NbThemeService,
  ) {
  }

  ngOnInit(): void {
    this.auditService.models().subscribe(models => {
      this.source = models;
    });
  }


  buildMap() {
    this.map = new mapboxgl.Map({
                                  container: 'map',
                                  style: 'mapbox://styles/mapbox/dark-v10',
                                  center: [13.404954, 52.520008],
                                  zoom: 1,
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

    this.assets.forEach(function (item) {
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
    this.assets = [];
    this.risks = [];
    this.course_of_actions = [];
    this.relationships = [];
    this.libraries = [];
    const security_model_id = event.data.id;
    this.auditService.model(security_model_id).pipe(mergeMap((model: any) => {
      return from(model)
        .pipe(mergeMap(item => {
          switch (item['type']) {
            case 'x-security-model':
              this.security_model = item;
              this.securityModelLibrariesRefMap.set(security_model_id, item['library_refs']);
              break;
            case 'course-of-action':
              if (!this.securityModelCoursesOfActionsRefMap.get(security_model_id)) {
                this.securityModelCoursesOfActionsRefMap.set(security_model_id, [item]);
              } else {
                if (!this.securityModelCoursesOfActionsRefMap.get(security_model_id)
                         .find(action => action['id'] === item['id'])) {
                  this.securityModelCoursesOfActionsRefMap.get(security_model_id).push(item);
                }
              }
              break;
            case 'relationship':
              if (!this.securityModelRelationshipsRefMap.get(security_model_id)) {
                this.securityModelRelationshipsRefMap.set(security_model_id, [item]);
              } else {
                if (!this.securityModelRelationshipsRefMap.get(security_model_id)
                         .find(action => action['id'] === item['id'])) {
                  this.securityModelRelationshipsRefMap.get(security_model_id).push(item);
                }
              }
              break;
            case 'x-risk':
              if (!this.securityModelRisksRefMap.get(security_model_id)) {
                this.securityModelRisksRefMap.set(security_model_id, [item]);
              } else {
                if (!this.securityModelRisksRefMap.get(security_model_id)
                         .find(action => action['id'] === item['id'])) {
                  this.securityModelRisksRefMap.get(security_model_id).push(item);
                }
              }
              break;
            case 'x-asset':
              if (!this.securityModelAssetsRefMap.get(security_model_id)) {
                this.securityModelAssetsRefMap.set(security_model_id, [item]);
              } else {
                if (!this.securityModelAssetsRefMap.get(security_model_id)
                         .find(action => action['id'] === item['id'])) {
                  this.securityModelAssetsRefMap.get(security_model_id).push(item);
                }
              }
              break;
          }
          return of([item]);
        }));
    })).toPromise().then(() => {
      const external_asset_ids = this.securityModelAssetsRefMap.get(security_model_id).map(asset => asset.reference);
      this.datalayerService.ids(external_asset_ids).toPromise().then(external_assets => {
        external_assets.splice(-1, 1);
        this.assets = this.securityModelAssetsRefMap.get(security_model_id);
        for (const asset of external_assets) {
          this.assets.push(asset);
        }
        if (this.assets.length > 0) {
          document.getElementById('asset-card').classList.remove('hidden');
          this.buildMap();
        }
      });
      this.relationships = this.securityModelRelationshipsRefMap.get(security_model_id);
      this.libraries = this.securityModelLibrariesRefMap.get(security_model_id);
      this.course_of_actions = this.securityModelCoursesOfActionsRefMap.get(security_model_id);
      this.auditService.libraries(this.libraries).toPromise().then(library => {
        this.risks = this.securityModelRisksRefMap.get(security_model_id);
        for (const risk of this.risks) {
          const risk_ref =
            library.find(item => (item['type'] === 'x-risk-level' && risk['risk_level_ref'] === item['id']));
          risk['risk_level'] = risk_ref['name'];
        }
      });
    });
  }

  ngAfterViewInit() {

  }

}

