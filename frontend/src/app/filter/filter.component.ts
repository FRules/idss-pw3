import {Component, EventEmitter, Output} from '@angular/core';
import {ajax, AjaxResponse} from 'rxjs/ajax';
import {forkJoin, Observable} from 'rxjs';

import {BackendRequest} from '../interfaces/backendRequest';
import {BackendResult} from '../interfaces/backendResult';
import {PlacesService} from '../services/places/places.service';
import {OsrmRootObject} from '../interfaces/osrm';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent {

  @Output() resultMessageEvent = new EventEmitter<BackendResult>();

  supportedNumberOfTravellers = [1, 2, 3, 4, 5];
  supportedFuelTypes = ['Diesel', 'Gasoline'];
  fuelTypesMap = {Diesel: 'diesel', Gasoline: 'motorGasoline'};

  supportedClasses = ['First class', 'Second class'];
  supportedClassesMap = {'First class': 'FIRST_CLASS', 'Second class': 'SECOND_CLASS'};

  // Default values for form
  formModel: BackendRequest = {
    trip_date: new Date().toISOString().split('T')[0],
    trip_source: 'Amsterdam',
    trip_dest: 'Utrecht',
    trip_number_of_travellers: this.supportedNumberOfTravellers[0],
    car_fuel_type: this.supportedFuelTypes[0],
    car_fuel_price: 1.46,
    car_fuel_consumption: 7.0,
    train_preferred_class: this.supportedClasses[0],
    weight_for_sustainability: 1,
    weight_for_price: 1,
    weight_for_time: 1
  };

  result: BackendResult = null;

  differences: { duration: number; price: number; sustainability: number };
  biggerValues: { duration: number; price: number; sustainability: number };
  justificationValue: number;


  constructor(private placesService: PlacesService) {
  }

  async onSubmit() {
    this.result = undefined;
    this.justificationValue = undefined;
    const request: BackendRequest = this.formModel;

    const myReduceFn = ((previousValue, currentValue) => ({...previousValue, ...currentValue}));

    const trainDataAjaxResponse: AjaxResponse = await this.getTrainDataRequest(request.trip_source, request.trip_dest,
      request.trip_date, this.supportedClassesMap[request.train_preferred_class],
      request.trip_number_of_travellers).toPromise();

    const localResult: BackendResult = trainDataAjaxResponse.response;

    const osrmRootObject: OsrmRootObject = await this.placesService.getOsrmResponse(localResult.train_data.stops[0],
      localResult.train_data.stops[localResult.train_data.stops.length - 1]).toPromise();

    localResult.car_data = osrmRootObject;

    const observables = [this.getCarFootprintRequest(osrmRootObject.routes[0].distance, request.trip_number_of_travellers,
      request.car_fuel_consumption, this.fuelTypesMap[request.car_fuel_type]),
      this.getTrainFootprintRequest(localResult.train_data.distance * 1000),
      this.getCarPriceRequest(osrmRootObject.routes[0].distance, request.trip_number_of_travellers,
        request.car_fuel_consumption, request.car_fuel_price)];

    forkJoin(observables).subscribe(ajaxResponses => {
      this.result = ajaxResponses.map((ajaxResponse: AjaxResponse) => {
        return ajaxResponse.response;
      }).concat().reduce(myReduceFn, localResult);
      this.resultMessageEvent.emit(this.result);
      this.recalculateResults();
    });

  }

  getCarFootprintRequest(distance, numberOfTravellers, fuelConsumption, fuelType): Observable<AjaxResponse> {
    const uri = `http://localhost:5002/footprint/car?distance=${distance / 1000}&` +
      `numberOfTravellers=${numberOfTravellers}&` +
      `fuelConsumption=${fuelConsumption}&` +
      `fuelType=${fuelType}`;
    return ajax(uri);
  }

  getTrainFootprintRequest(distance): Observable<AjaxResponse> {
    const uri = `http://localhost:5002/footprint/train?distance=${distance / 1000}`;
    return ajax(uri);
  }

  getCarPriceRequest(distance, numberOfTravellers, fuelConsumption, fuelPrice): Observable<AjaxResponse> {
    const uri = `http://localhost:5002/carTravelPrice?distance=${distance / 1000}&` +
      `numberOfTravellers=${numberOfTravellers}&` +
      `fuelConsumption=${fuelConsumption}&` +
      `fuelPrice=${fuelPrice}`;
    return ajax(uri);
  }

  getTrainDataRequest(origin, destination, date, chosenClass, numberOfTravellers): Observable<AjaxResponse> {
    const uri = `http://localhost:5002/trainData?origin=${origin}&` +
      `destination=${destination}&` +
      `date=${date}&` +
      `class=${chosenClass}&` +
      `numberOfTravellers=${numberOfTravellers}`;
    return ajax(uri);
  }

  private recalculateResults() {
    const result = this.result;

    if (result === undefined) {
      return;
    }

    // tslint:disable-next-line:max-line-length
    this.differences = { sustainability: result.train_footprint - result.car_footprint, price: result.train_data.price - result.car_travel_price, duration: result.train_data.duration - result.car_data.routes[0].duration };
    // tslint:disable-next-line:max-line-length
    this.biggerValues = { sustainability: Math.max(result.train_footprint, result.car_footprint), price: Math.max(result.train_data.price, result.car_travel_price), duration: Math.max(result.train_data.duration, result.car_data.routes[0].duration)};

    this.justificationValue = this.formModel.weight_for_sustainability * this.differences.sustainability / this.biggerValues.sustainability
      + this.formModel.weight_for_price * this.differences.price / this.biggerValues.price
      + this.formModel.weight_for_time * this.differences.duration / this.biggerValues.duration;
  }
}
