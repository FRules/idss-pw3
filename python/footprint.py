from typing import Dict

from flask import request
from flask_restful import Resource
from flask_jsonpify import jsonify

import requests
import json
from urllib.parse import urlencode


class Footprint(Resource):

    CAR = "car"
    TRAIN = "train"

    required_parameters = {
        CAR: ["distance", "fuelConsumption", "fuelType", "numberOfTravellers"],
        TRAIN: ["distance"]
    }

    def get(self, vehicle: str):
        if vehicle not in (Footprint.CAR, Footprint.TRAIN):
            return jsonify({"error": "Vehicle type can be either `car` or `train`."})

        args = request.args
        for required_parameter in self.required_parameters[vehicle]:
            if required_parameter not in args:
                return jsonify({"error": "Not all parameters provided. Needed parameters: {}".format(", ".join(self.required_parameters[vehicle]))})

        if vehicle in Footprint.CAR:
            return jsonify({"car_footprint": self.car_footprint(
                float(args["distance"]),
                float(args["fuelConsumption"]),
                args["fuelType"],
                int(args["numberOfTravellers"])
            )})
        else:
            return jsonify({"train_footprint": self.train_footprint(
                float(args["distance"])
            )})

    @staticmethod
    def fetch_footprint(info_dict: Dict):
        params = urlencode(info_dict)
        api_url = "https://api.triptocarbon.xyz/v1/footprint?" + params
        response = requests.get(api_url)

        if response.status_code == 200:
            response_dict = json.loads(response.content.decode('utf-8'))
        else:
            return None

        return float(response_dict['carbonFootprint'])

    @staticmethod
    def train_footprint(distance: float):
        """
        Method gets distance and calculate train footprint using `tripcarbon.xyz` API.

        :param distance: float with distance of train route in kilometers
        :return: float with carbon footprint in kilograms
        """

        miles_const = 0.621371
        activity = distance * miles_const

        info_dict = {'activity': str(activity),
                     'country': 'def',
                     'activityType': 'miles',
                     'mode': 'transitRail'}

        return Footprint.fetch_footprint(info_dict)

    @staticmethod
    def car_footprint(distance, av_fuel_consumption, fuel_type, nb_people):
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
                     'fuelType': fuel_type,
                     'mode': 'dieselCar' if 'diesel' in fuel_type else 'petrolCar'}

        footprint = Footprint.fetch_footprint(info_dict) / nb_people

        return footprint
