from flask import request
from flask_restful import Resource
from flask_jsonpify import jsonify


class CarTravelPrice(Resource):

    required_parameters = ["distance", "fuelConsumption", "fuelPrice", "numberOfTravellers"]

    def get(self):
        args = request.args
        for required_parameter in self.required_parameters:
            if required_parameter not in args:
                return jsonify({"error": "Not all parameters provided. Needed parameters: "
                                         "distance, fuelConsumption, fuelPrice, numberOfTravellers"})

        return jsonify({"car_travel_price": self.car_travel_price(
            float(args["distance"]),
            float(args["fuelConsumption"]),
            float(args["fuelPrice"]),
            int(args["numberOfTravellers"])
        )})

    @staticmethod
    def car_travel_price(distance, av_fuel_consumption, fuel_price, nb_people):
        """
        Compute travel price for a car trip.
        Calculations based on the website https://www.spritkostenrechner.de/
        INPUT:
          - distance: int with travelled distance in kilometers
          - av_fuel_consumption: float/int with liters/100km
          - fuel_price: float with fuel price per liter
          - nb_people: int with number of people who ride in the car
        OUTPUT:
          - float price of car travel per person in € including petrol price and car
            usage
        """
        usage_p = distance * 0.05
        fuel_p = (distance / 100) * fuel_price * av_fuel_consumption

        price = (usage_p + fuel_p) / nb_people

        return price
