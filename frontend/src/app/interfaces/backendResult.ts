import {OsrmRootObject} from './osrm';

export interface BackendResult {
  car_footprint?: number;
  car_travel_price?: number;
  car_data?: OsrmRootObject;
  train_data?: TrainData;
  train_footprint?: number;
}

export interface TrainData {
  price: number;
  duration: number;
  distance: number;
  stops: TrainStop[];
}

export interface TrainStop {
  lat: number;
  lng: number;
  name: string;
}
