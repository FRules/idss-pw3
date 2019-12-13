import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public coordinateOne: any;
  public coordinateTwo: any;

  constructor(private http: HttpClient) {

  }

  setCoordinates(coordinateOne: any, coordinateTwo: any) {
    this.coordinateOne = coordinateOne;
    this.coordinateTwo = coordinateTwo;
  }

  getAllPoints(): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`http://localhost:5000/route/v1/driving/${this.coordinateOne.lng},${this.coordinateOne.lat};${this.coordinateTwo.lng},${this.coordinateTwo.lat}?overview=simplified&geometries=geojson&steps=false&alternatives=2`);
  }
}




