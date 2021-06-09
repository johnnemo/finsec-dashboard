import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GeoJson} from '../../../@core/data/finsec/map/geo-json';
import {MapService} from '../../../@core/services/finsec/map/map.service';
import * as mapboxgl from 'mapbox-gl';
import {Marker} from 'mapbox-gl';
import {NbThemeService} from '@nebular/theme';
import {Asset} from '../../../@core/data/finsec/sdos/asset';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import CONFIG from '../../../app.config';
import {map, mergeMap, switchMap, toArray} from 'rxjs/operators';
import {ScanResultsComponent} from './scan-results/scan-results.component';
import {from, of} from 'rxjs';
import {flatten} from '@angular/compiler';

@Component({
             selector: 'ngx-tls-assistant',
             templateUrl: './tls-assistant.component.html',
             styleUrls: ['./tls-assistant.component.scss'],
           })
export class TlsAssistantComponent implements OnInit, AfterViewInit {

  pois: Array<Marker> = [];
  target: Asset;
  scanRefMap = new Map();
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


  assets: any[] = [];
  asset_ids: any[] = [];
  map_source: any[];
  actions: Array<any> = [];
  course_of_actions: Array<any> = [];
  vulnerabilities: Array<any> = [];
  intermediate: Array<any> = [];
  finsec_kb_url = CONFIG.finsec_kb_url;
  vulnerabilityScoreRefMap = new Map();
  tls_assistant_url = CONFIG.tls_assistant_url;
  source: Array<any> = [];
  settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 4,
    },
    columns: {
      id: {
        title: 'Id',
        type: 'string',
      },
      spec_version: {
        title: 'Specification Version',
        type: 'string',
      },
      results: {
        title: 'Results',
        type: 'custom',
        valuePrepareFunction: (value, row) => {
          return this.scanRefMap.get(row['id']) ? this.scanRefMap.get(row['id']) : [];
        },
        renderComponent: ScanResultsComponent,
      },
      modified: {
        title: 'Sighting Timestamp',
        type: 'string',
      },
    },
  };
  overview_settings = {
    actions: false,
    pager: {
      display: true,
      perPage: 7,
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
        width: '20%',
      },
      description: {
        title: 'Description',
        type: 'html',
        width: '40%',
      },
      base_score: {
        title: 'Base Score',
        type: 'string',
        width: '10%',
      },
      impact_score: {
        title: 'Impact Score',
        type: 'string',
        width: '10%',
      },
      exploitability_score: {
        title: 'Exploitability Score',
        type: 'string',
        width: '10%',
      },
      cvss_version: {
        title: 'CVSS Version',
        type: 'string',
        width: '10%',
      },
    },
  };

  constructor(private dataLayerService: DatalayerService,
              private http: HttpClient,
              private theme: NbThemeService,
              private mapService: MapService) {
  }

  ngOnInit(): void {
    const now = new Date();
    const pastDay = new Date(now.getTime() - (1000 * 60 * 60 * 24));
    const headers = {
      headers: new HttpHeaders({
                                 'Accept': 'application/json',
                                 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                               }),
    };
    this.http.post(this.finsec_kb_url, {
      '$query': {
        // The sighting objects do not have the x_organization field.
        x_organization: sessionStorage.getItem('x_organization'),
        type: 'sighting',
        // 'created': {
        //     $gte: pastDay,
        // },
      },
    }, headers)
        .pipe(switchMap((sighting: any) => sighting))
        .pipe(map((sighting: any) => {
                    if (sighting['id'] !== 0) {
                      if (sighting['x_scan_id'] != null) {
                        if (this.scanRefMap.get(sighting['x_scan_id']) &&
                            !this.scanRefMap.get(sighting['x_scan_id'].includes(sighting['sighting_of_ref']))) {
                          if (this.source.filter(scan => scan.id !== sighting['x_scan_id']).length >
                              0 ||
                              this.source.length ===
                              0) {
                            this.source.push({
                                               id: sighting['x_scan_id'],
                                               x_asset_refs: sighting['x_asset_refs'],
                                               spec_version: sighting['spec_version'],
                                               modified: sighting['modified'],
                                             });
                          }
                          this.scanRefMap.get(sighting['x_scan_id']).push(sighting['sighting_of_ref']);
                        } else {
                          this.scanRefMap.set(sighting['x_scan_id'], [sighting['sighting_of_ref']]);
                        }
                        if (!(this.asset_ids.length > 0) ||
                            (sighting['x_asset_refs'] &&
                             sighting['x_asset_refs'].every(asset => !this.asset_ids.includes(asset)))) {
                          this.asset_ids = Array.from(new Set(this.asset_ids.concat(sighting['x_asset_refs'])));
                        }
                      }
                    }
                    return of([]);
                  },
        )).subscribe((result: any) => {
      return;
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

    // for (const marker of markers) {
    //     // TODO: change backend file app/views/api/v1/first_responders/requests.json.jbuilder
    //     const poi = new mapboxgl.Marker().setLngLat([marker[1], marker[0]]);
    //     this.pois.push(poi);
    //     poi.addTo(this.map);
    // }
  }

  drawMarkers(): void {
    // this.clearMarkers();

  }

  clearMarkers(): void {
    if (this.pois != null) {
      for (let i = this.pois.length - 1; i >= 0; i--) {
        this.pois[i].remove();
      }
    }
  }

  onRowSelect(event): void {
    this.vulnerabilities = [];
    this.intermediate = [];
    this.vulnerabilityScoreRefMap.clear();
    const headers = {
      headers: new HttpHeaders({
                                 'Accept': 'application/json',
                                 'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                               }),
    };
    const scan_id = event.data.id;
    this.http.get(this.tls_assistant_url + '/result/' + scan_id, headers).toPromise().then(result => {
      this.course_of_actions = result['course_of_action'];
      from(result['vulnerability']).pipe(mergeMap((item: any) => {
        this.vulnerabilityScoreRefMap.set(item, []);

        return this.http.post<any>(this.finsec_kb_url, {
          '$query': {
            'type': 'x-vulnerability-score',
            'reference': item['id'],
          },
        }, headers);
      }), toArray()).subscribe(scores => {
        const flat = [].concat(...scores);
        scores = flat.some(Array.isArray) ? flatten(flat) : flat;
        const that = {...this};
        this.vulnerabilityScoreRefMap.forEach(function (value, vulnerability, map) {
          const item = {
            base_score: 'N.A.',
            impact_score: 'N.A',
            exploitability_score: 'N.A.',
            cvss_version: 'N.A.',
          };
          scores.forEach(function (score, index) {
            if (score['reference'] && score['reference'] === vulnerability['id']) {
              item.base_score = score['details']['base_score'];
              item.impact_score = score['details']['impact_score'];
              item.exploitability_score = score['details']['exploitability_score'];
              item.cvss_version = score['subtype'];
            }
          });
          that.intermediate.push({...item, ...vulnerability});
        });
        this.vulnerabilities = this.intermediate;
      });
      this.dataLayerService.rootNode('x-asset', null,
                                     {
                                       id: {'$in': this.asset_ids},
                                     }).toPromise().then(assets => {
        assets.splice(-1, 1);
        this.assets = assets;
        this.map_source = this.assets;
      });
    });
  }

  ngAfterViewInit(): void {

  }

}
