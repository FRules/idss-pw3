export interface BackendRequest {
  trip_date: string;
  trip_source: string;
  trip_dest: string;
  trip_number_of_travellers: number;

  car_fuel_type: string;
  car_fuel_price: number;
  car_fuel_consumption: number;

  train_preferred_class: string;

  weight_for_sustainability: number;
  weight_for_price: number;
  weight_for_time: number;
}
