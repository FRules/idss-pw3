export class Request {

  constructor(
    public source: string,
    public dest: string,
    public number_of_travellers: number,
    public fuel_type: string,
    public fuel_price: number,
    public value_on_sustainability: number,
    public value_on_price: number,
    public value_on_time: number,
    public fuel_consumption_car?: number
  ) {  }

}
