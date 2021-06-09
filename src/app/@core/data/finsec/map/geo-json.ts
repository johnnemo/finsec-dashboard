import {IGeoJson} from './igeo-json';
import {IGeometry} from './igeometry';

export class GeoJson implements IGeoJson {
  type = 'Feature';
  geometry: IGeometry;

  constructor(coordinates, public properties?) {
    this.geometry = {
      type: 'Point',
      coordinates: coordinates
    };
  }
}
