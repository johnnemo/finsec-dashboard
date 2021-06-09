import {Injectable} from '@angular/core';

@Injectable({
              providedIn: 'root'
            })
export class GeojsonGeneratorService {

  json: any = {
    'Graph': {
      'Node': []
    }
  };

  constructor() {
  }

  generateMarkers(markers: Array<any>) {

    const geojson = {
      type: 'FeatureCollection',
      features: []
    };

    geojson.features = markers.map(x => {
      const obj = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [x.lat, x.lon]
        },
        'properties': {
          'title': x.name,
          'description': x.name
        }
      };
      return obj;
    });

    return geojson;
  }


  generate(json: any) {
    const data = json.Graph;
    for (let i = 0; i < json.Graph.Node.length; i++) {
      let arr;
      let arr1;
      let arr2;
      let arr3;
      if (data.Node[i].V1) {
        arr = data.Node[i].V1.split(',', 2);
        arr1 = data.Node[i].V2.split(',', 2);
        arr2 = data.Node[i].V3.split(',', 2);
        arr3 = data.Node[i].V4.split(',', 2);
        data.Node[i]['type'] = 'Feature';
        data.Node[i]['geometry'] = {
          'type': 'Polygon',
          'coordinates': [
            [
              [
                arr[0],
                arr[1]
              ],
              [
                arr1[0],
                arr[1]
              ],
              [
                arr2[0],
                arr2[1]
              ],
              [
                arr3[0],
                arr3[1]
              ],
              [
                arr[0],
                arr[1]
              ]
            ]
          ]
        };
      }
    }
    return json;
  }

}
