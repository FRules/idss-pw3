import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LatLngLiteral} from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private http: HttpClient) {}

  public getOsrmResponse(source: LatLngLiteral, dest: LatLngLiteral): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`http://localhost:5000/route/v1/driving/${source.lng},${source.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=false`);
  }
}




