import {GeoJson} from './geo-json';

export class FeatureCollection {
  type = 'FeatureCollection';

  constructor(public features: Array<GeoJson>) {
  }
}
