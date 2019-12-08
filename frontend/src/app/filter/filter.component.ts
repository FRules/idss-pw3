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
  supported_fuel_types = ["Diesel", "Gasoline"]
  fuel_types_map = { "Diesel": "diesel", "Gasoline": "motorGasoline" };

  // Default values
  model = new Request("Amsterdam",
                      "Rotterdam",
                      this.supported_number_of_travellers[0],
                      this.supported_fuel_types[0],
                      1.46, 5, 5, 5, 7.0);
  result = new Results();
  submitted = false;
  constructor() { }

  onSubmit(form: NgForm) {
    //submitted = true;
    var request = form.value
    console.log(request);

    const distance = 5000; // has to be fetched from open street map by Piotr

    var observables = []
    observables.push(this.getFootprintRequest(distance, request.number_of_travellers,
                      request.fuel_consumption_car, this.fuel_types_map[request.fuel_type]));
    observables.push(this.getCarPriceRequest(distance, request.number_of_travellers,
                      request.fuel_consumption_car, request.fuel_price));
    forkJoin(...observables).subscribe(results => {
      var footprint = 0;
      var carTravelPrice = 0;
      results.map(result => {
        if ("footprint" in result.response) {
          this.result.footprint = result.response.footprint;
        } else if ("car_travel_price" in result.response) {
          this.result.carTravelPrice = result.response.car_travel_price;
        }
        this.submitted = true;
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
