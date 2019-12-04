import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

import { Request }    from '../request';
import { Results }    from '../results';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {

  supported_number_of_travellers = [1,2,3,4,5];

  // Default values
  model = new Request("Amsterdam", "Rotterdam", this.supported_number_of_travellers[0], 5, 5, 5, 7.0);
  result = new Results();

  constructor() { }

  onSubmit(form: NgForm) {
    var request = form.value
    console.log(request);

    const distance = 5000; // has to be fetched from open street map by Piotr
    const fuelType = "diesel"; // maybe include in the frontend? Or just leave it const?
    const fuelPrice = 1.46; // maybe include in the frontend? Or just leave it const?

    var observables = []
    observables.push(this.getFootprintRequest(distance, request.number_of_travellers,
                      request.fuel_consumption_car, fuelType));
    observables.push(this.getCarPriceRequest(distance, request.number_of_travellers,
                      request.fuel_consumption_car, fuelPrice));
    forkJoin(...observables).subscribe(results => {
      var footprint = 0;
      var carTravelPrice = 0;
      results.map(result => {
        if ("footprint" in result.response) {
          this.result.footprint = result.response.footprint;
        } else if ("car_travel_price" in result.response) {
          this.result.carTravelPrice = result.response.car_travel_price;
        }
      })
      // Do something with the data
      console.log(this.result.footprint);
      console.log(this.result.carTravelPrice);
    });
  }

  ngOnInit() {
  }

  getFootprintRequest(distance, numberOfTravellers, fuelConsumption, fuelType): Observable<AjaxResponse> {
    var uri = `http://localhost:5002/footprint?distance=${distance}&` +
                `numberOfTravellers=${numberOfTravellers}&` +
                `fuelConsumption=${fuelConsumption}&` +
                `fuelType=${fuelType}`
    return ajax(uri);
  }

  getCarPriceRequest(distance, numberOfTravellers, fuelConsumption, fuelPrice): Observable<AjaxResponse> {
    var uri = `http://localhost:5002/carTravelPrice?distance=${distance}&` +
                `numberOfTravellers=${numberOfTravellers}&` +
                `fuelConsumption=${fuelConsumption}&` +
                `fuelPrice=${fuelPrice}`
    return ajax(uri);
  }

}
