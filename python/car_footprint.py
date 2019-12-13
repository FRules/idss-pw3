from flask import request
from flask_restful import Resource
from flask_jsonpify import jsonify

import requests
import json
from urllib.parse import urlencode


class CarFootprint(Resource):

    required_parameters = ["distance", "fuelConsumption", "fuelType", "numberOfTravellers"]

    def get(self):
        args = request.args
        for required_parameter in self.required_parameters:
            if required_parameter not in args:
                return jsonify({"error": "Not all parameters provided. Needed parameters: "
                                         "distance, fuelConsumption, fuelType, numberOfTravellers"})

        return jsonify({"car_footprint": self.footprint(
            float(args["distance"]),
            float(args["fuelConsumption"]),
            args["fuelType"],
            int(args["numberOfTravellers"])
        )})

    @staticmethod
    def footprint(distance, av_fuel_consumption, fuel_type, nb_people):
        """
        This function computes the carbon footprint of a trip with the car.
        20 Requests per minute are possible. \n
        INPUT:
          - distance: int with travelled distance in kilometers
          - av_fuel_consumption: float/int with liters/100km
          - fuel_type: 'diesel' or 'motorGasoline'
          - nb_people: int with number of people who ride in the car
        OUTPUT:
          - float with carbon footprint in kilograms
        """

        gallon_const = 0.264172
        activity = (distance / 100) * av_fuel_consumption * gallon_const

        info_dict = {'activity': str(activity),
                     'country': 'def',
                     'activityType': 'fuel',
                     'fuelType': fuel_type}

        params = urlencode(info_dict)
        api_url = "https://api.triptocarbon.xyz/v1/footprint?" + params
        response = requests.get(api_url)

        if response.status_code == 200:
            response_dict = json.loads(response.content.decode('utf-8'))
        else:
            return None

        fp = float(response_dict['carbonFootprint'])
        footprint = fp / nb_people

        return footprint
