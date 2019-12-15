import requests
from flask import request
from flask_restful import Resource
from flask_jsonpify import jsonify

import json
import geopy.distance


class TrainData(Resource):

    required_parameters = ["origin", "destination", "date", "class", "numberOfTravellers"]
    apikey = 'fcdbd1c4a6a3444a84f8d0d6142d2e6f'

    @staticmethod
    def _get_shortest_trip(trips):
        trips_sorted = sorted(trips, key=lambda k: k['optimal'], reverse=True)
        return trips_sorted[0]

    def get(self):
        args = request.args
        for required_parameter in self.required_parameters:
            if required_parameter not in args:
                return jsonify({"error": "Not all parameters provided. Needed parameters: "
                                         "origin, destination, date, class, numberOfTravellers"})

        try:
            response = self.train_search(args["origin"], args["destination"], args["date"])
        except Exception as e:
            return jsonify({
                "error": str(e)
            })

        trip = self._get_shortest_trip(response["trips"])

        stops = self.get_stops(trip)
        distance = self.get_distance(stops)
        price = self.get_price(trip, args["class"], int(args["numberOfTravellers"]))

        return jsonify({
            "train_data": {
                "duration": trip["plannedDurationInMinutes"],
                "stops": stops,
                "price": price,
                "distance": distance
            }
        })

    @staticmethod
    def get_price(trip, chosen_class, number_of_travellers):
        # TODO(Piotr): Decide if we show results (kg and prices) per person or for all people
        del number_of_travellers
        cheapest_price = 9999999999
        for fare in trip["fares"]:
            if fare["travelClass"] == chosen_class and fare["discountType"] == "NO_DISCOUNT":
                if cheapest_price > fare["priceInCents"]:
                    cheapest_price = fare["priceInCents"]
        return float(cheapest_price) / 100.0

    @staticmethod
    def get_stops(trip):
        stops = []
        for leg in trip["legs"]:
            for stop in leg["stops"]:
                stops.append({
                    "lat": stop["lat"],
                    "lng": stop["lng"],
                    "name": stop["name"]
                })
        return stops

    @staticmethod
    def get_distance(stops):
        distance = 0
        prev_stop_lat, prev_stop_lng = 0, 0
        for stop in stops:
            if prev_stop_lat == 0 or prev_stop_lng == 0:
                prev_stop_lat, prev_stop_lng = stop["lat"], stop["lng"]
                continue
            distance = distance + geopy.distance.vincenty((prev_stop_lat, prev_stop_lng), (stop["lat"], stop["lng"])).km
            prev_stop_lat, prev_stop_lng = stop["lat"], stop["lng"]
        return distance

    def train_search(self, origin, destination, date):
        url = 'https://gateway.apiportal.ns.nl/public-reisinformatie/api/v3/trips'
        params = {
            'fromStation': str(origin),
            'toStation': str(destination),
            'dateTime': str(date)
        }

        req = requests.get(url, params=params, headers={'Ocp-Apim-Subscription-Key': self.apikey})

        if req.status_code != 200:
            raise Exception(req.json()['errors'][0]['type'])
        return req.json()
