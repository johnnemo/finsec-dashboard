import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {NbThemeService} from '@nebular/theme';
import {DatalayerService} from '../../../@core/services/finsec/data-layer/data-layer.service';
import {forkJoin} from 'rxjs/index';
import {takeWhile} from 'rxjs/operators';
import {Asset} from '../../../@core/data/finsec/sdos/asset';
import {GeoJson} from '../../../@core/data/finsec/map/geo-json';
import * as mapboxgl from 'mapbox-gl';
import {Marker} from 'mapbox-gl';
import {MapService} from '../../../@core/services/finsec/map/map.service';

@Component({
             selector: 'total-assets',
             templateUrl: 'assets.component.html',
             styleUrls: ['assets.component.scss'],
           })
export class AssetsComponent implements AfterViewInit, OnDestroy, OnInit {
  pois: Array<Marker> = [];
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
  markers: Array<any> = [];
  lon: any;
  assets: any[];
  grouped_assets: any[] = [];
  grouped_vendor_assets: any[] = [];
  vendor_labels: any[] = [];
  grouped_type_assets: any[] = [];
  type_labels: any[] = ['Undefined'];
  map_source: any[];
  options: any = {};
  type_options: any = {};
  vendor_options: any = {};
  themeSubscription: any;
  data: any;
  private alive = true;

  constructor(private theme: NbThemeService,
              private datalayerService: DatalayerService,
              private mapService: MapService,
  ) {
  }


  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngOnInit(): void {
    // TODO: use these selectors to handle the chart update functionality
    const chartElement1 = <HTMLDivElement>document.getElementById('asset-chart');
    const myChart = echarts.init(chartElement1);
    const chartElement2 = <HTMLDivElement>document.getElementById('vendor-chart');
    const myVendorChart = echarts.init(chartElement2);
    const chartElement3 = <HTMLDivElement>document.getElementById('type-chart');
    const myTypeChart = echarts.init(chartElement3);
    forkJoin(
      this.datalayerService.rootNode('x-asset'),
      this.datalayerService.groupBy('x-asset', ['domain'], 'created',
                                    {'$year': {'$dateFromString': {'dateString': '$created'}}}),
    )
      .pipe(takeWhile(() => this.alive))
      .subscribe(([assets, grouped_assets]: [Asset[], any[]]) => {
        if (assets.length === 0) {
          return;
        }
        assets.splice(-1, 1);
        this.assets = assets;
        this.map_source = assets;
        const this_copy = {...this};
        this.grouped_type_assets['Undefined'] = {name: 'Undefined', value: 0};
        this.grouped_vendor_assets['Undefined'] = {name: 'Undefined', value: 0};
        assets.forEach(function (asset) {
          if (asset.coordinates) {
            this_copy.markers.push(asset.coordinates);
          }
          if (asset.asset_type && asset.asset_type !== 'undefined') {
            if (!this_copy.grouped_type_assets[asset.asset_type]) {
              this_copy.type_labels.push(asset.asset_type);
              this_copy.grouped_type_assets[asset.asset_type] = {name: asset.asset_type, value: 1};
            } else {
              this_copy.grouped_type_assets[asset.asset_type].value++;
            }
          } else {
            this_copy.grouped_type_assets['Undefined'].value++;
          }
          if (asset.product_vendor && asset.product_vendor !== 'undefined') {
            if (asset.product_vendor && !this_copy.grouped_type_assets[asset.product_vendor]) {
              this_copy.vendor_labels.push(asset.product_vendor);
              this_copy.grouped_vendor_assets[asset.product_vendor] = {
                name: asset.product_vendor,
                value: 1,
              };
            } else if (this_copy.grouped_vendor_assets[asset.product_vendor]) {
              this_copy.grouped_vendor_assets[asset.product_vendor].value++;
            }
          } else {
            this_copy.grouped_vendor_assets['Undefined'].value++;
          }
        });

        this.buildMap();
        if (!grouped_assets) {
          return;
        }
        grouped_assets.splice(-1, 1);
        grouped_assets.forEach(function (item) {
          this_copy.grouped_assets.push({'name': item._id['domain'], 'value': item.count});
        });
        this.options = {
          title: {
            show: false,
            text: 'Asset Types',
            x: 'center',
            textStyle: {
              color: '#fff',
            },
          },
          tooltip: {
            confine: true,
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: {
            show: false,
            x: 'left',
            orient: 'vertical',
            data: ['None', 'Cyber', 'Physical'],
            textStyle: {
              color: '#fff',
            },
          },
          calculable: true,
          series: [
            {
              name: 'All Assets',
              type: 'pie',
              radius: ['40%', '65%'],
              avoidLabelOverlap: false,
              data: this.grouped_assets,
              label: {
                // TODO: if counter needed return the correct value. now only [0] and [1] are considered
                show: false,
                color: '#fff',
                position: 'center',
                fontSize: 13,
                fontWeight: 'bolder',
                formatter:
                  '' +
                  (
                  this.grouped_assets[0].value +
                  (this.grouped_assets[1] ? this.grouped_assets[1].value : '')
                  ),
              },
            },
          ],
        };

        this.vendor_options = {
          color: ['#01a5f8', '#454c9f'],
          title: {
            show: false,
            text: 'Assets By Vendor',
            x: 'center',
            textStyle: {
              color: '#fff',
            },
          },
          tooltip: {
            confine: true,
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: {
            show: false,
            x: 'left',
            orient: 'vertical',
            data: this.vendor_labels,
            textStyle: {
              color: '#fff',
            },
          },
          calculable: true,
          series: [
            {
              name: 'Assets By Vendor',
              type: 'pie',
              radius: ['40%', '60%'],
              avoidLabelOverlap: false,
              data: Object.values(this.grouped_vendor_assets),
              label: {
                show: false,
                color: '#fff',
              },
            },
          ],
        };
        this.type_options = {
          title: {
            show: false,
            text: 'Assets by Type',
            x: 'center',
            textStyle: {
              color: '#fff',
            },
          },
          tooltip: {
            confine: true,
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: {
            show: false,
            x: 'left',
            orient: 'vertical',
            data: ['Other', 'Low'],
            textStyle: {
              color: '#fff',
            },
          },
          calculable: true,
          series: [
            {
              name: 'Assets by Type',
              type: 'pie',
              radius: ['40%', '60%'],
              avoidLabelOverlap: false,
              data: Object.values(this.grouped_type_assets),
              label: {
                show: false,
                color: '#fff',
              },
            },
          ],
        };
      });
    // Dummy interval update
    /*   let counter = 0;
       timer(5, 5000).pipe(take(10)).subscribe(x => {

           let vendor_name =
           this.vendor_options.series[0].data[Math.floor(Math.random() *
           this.vendor_options.series[0].data.length)].name;
           let type_name =
           this.type_options.series[0].data[Math.floor(Math.random() * this.type_options.series[0].data.length)].name;
           if (counter % 4 == 0) {
               this.options.series[0].data[0]['value']++;
           }
           else {
               this.options.series[0].data[1]['value']++;
           }
           this.grouped_vendor_assets[vendor_name].value++;
           this.vendor_options.series[0].data = Object.values(this.grouped_vendor_assets);
           this.grouped_type_assets[type_name].value++;
           this.type_options.series[0].data = Object.values(this.grouped_type_assets);
           this.options.series[0].label.formatter = '' + (this.grouped_assets[0].value + this.grouped_assets[1].value);
           counter++;
           myChart.setOption(this.options);
           myVendorChart.setOption(this.vendor_options);
           myTypeChart.setOption(this.type_options);
           this.assets.push(
           {
              name: 'New asset',
              description: 'Random description',
              coordinates: [(Math.random() * (360 - 360) + 360).toFixed(5) * 1, (Math.random() * (360 - 360) +
              360).toFixed(5) * 1]});
       });*/
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
    const popup = new mapboxgl.Popup({
                                       closeButton: true,
                                       closeOnClick: true,
                                     });
    const that = {...this};
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

    this.map.on('mouseenter', 'unclustered-point', function (e) {
      that.map.getCanvas().style.cursor = 'pointer';
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.description;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates)
           .setHTML('<small style=\'color:black;\'>' + description + '</small>')
           .addTo(that.map);
    });

    this.map.on('mouseenter', 'clusters', function () {
      that.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'clusters', function () {
      that.map.getCanvas().style.cursor = '';
    });

  }

}
