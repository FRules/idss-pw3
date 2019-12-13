export interface BackendResult {
  footprint?: number;
  car_travel_price?: number;
  train_data?: TrainData;
}

export interface TrainData {
  price: number;
  duration: number;
  distance: number;
  stops: [];
}
