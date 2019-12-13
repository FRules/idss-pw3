import {Component, EventEmitter, Output} from '@angular/core';
import {ajax, AjaxResponse} from 'rxjs/ajax';
import {forkJoin, Observable} from 'rxjs';

import {BackendRequest} from '../interfaces/backendRequest';
import {BackendResult} from '../interfaces/backendResult';


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
    weight_for_sustainability: 5,
    weight_for_price: 5,
    weight_for_time: 5
  };

  result: BackendResult = null;

  onSubmit() {
    this.result = null;
    const request: BackendRequest = this.formModel;

    // TODO(Dominik): has to be fetched from open street map by Piotr
    const distance = 5000;

    const observables = [this.getFootprintRequest(distance, request.trip_number_of_travellers,
      request.car_fuel_consumption, this.fuelTypesMap[request.car_fuel_type]),
      this.getCarPriceRequest(distance, request.trip_number_of_travellers,
        request.car_fuel_consumption, request.car_fuel_price),
      this.getTrainDataRequest(request.trip_source, request.trip_dest,
        request.trip_date, this.supportedClassesMap[request.train_preferred_class], request.trip_number_of_travellers)];

    forkJoin(observables).subscribe(ajaxResponses => {
      this.result = ajaxResponses.map((ajaxResponse: AjaxResponse) => {
        return ajaxResponse.response;
      }).concat().reduce(((previousValue, currentValue) => ({...previousValue, ...currentValue})), {});
      this.resultMessageEvent.emit(this.result);
    });
  }

  getFootprintRequest(distance, numberOfTravellers, fuelConsumption, fuelType): Observable<AjaxResponse> {
    const uri = `http://localhost:5002/footprint?distance=${distance}&` +
      `numberOfTravellers=${numberOfTravellers}&` +
      `fuelConsumption=${fuelConsumption}&` +
      `fuelType=${fuelType}`;
    return ajax(uri);
  }

  getCarPriceRequest(distance, numberOfTravellers, fuelConsumption, fuelPrice): Observable<AjaxResponse> {
    const uri = `http://localhost:5002/carTravelPrice?distance=${distance}&` +
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

}
