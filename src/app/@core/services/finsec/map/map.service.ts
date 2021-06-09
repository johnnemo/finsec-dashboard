import {Injectable} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {HttpClient} from '@angular/common/http';
import CONFIG from '../../../../app.config';

@Injectable({
              providedIn: 'root',
            })
export class MapService {

  private token = CONFIG.mapboxToken;

  constructor(private http: HttpClient) {
    (mapboxgl as typeof mapboxgl).accessToken = this.token;
  }

}
