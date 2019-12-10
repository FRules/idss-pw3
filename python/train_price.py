from flask import request
from flask_restful import Resource
from flask_jsonpify import jsonify

from urllib.request import Request, urlopen
import json


class TrainPrice(Resource):

    required_parameters = ["origin", "destination", "date", "class", "numberOfTravellers"]
    apikey = 'fcdbd1c4a6a3444a84f8d0d6142d2e6f'

    def get(self):
        args = request.args
        for required_parameter in self.required_parameters:
            if required_parameter not in args:
                return jsonify({"error": "Not all parameters provided. Needed parameters: "
                                         "origin, destination, date, class, numberOfTravellers"})

        trip = self.train_search(args["origin"], args["destination"], args["date"])["trips"][0]
        stops = self.get_stops(trip)
        price = self.get_price(trip, args["class"])

        return jsonify({
            "duration": trip["plannedDurationInMinutes"],
            "stops": stops,
            "price": price
        })

    @staticmethod
    def get_price(trip, chosen_class):
        cheapest_price = 9999999999
        for fare in trip["fares"]:
            if fare["travelClass"] == chosen_class and fare["discountType"] == "NO_DISCOUNT":
                if cheapest_price > fare["priceInCents"]:
                    cheapest_price = fare["priceInCents"]
        return float(cheapest_price) / 100.0

    @staticmethod
    def get_stops(trip):
        stops = []
        for stop in trip["legs"][0]["stops"]:
            stops.append({
                "lat": stop["lat"],
                "lng": stop["lng"],
                "name": stop["name"]
            })
        return stops

    def train_search(self, origin, destination, date):
        url = 'https://gateway.apiportal.ns.nl/public-reisinformatie/api/v3/trips'
        url = url + '?fromStation=' + str(origin) + '&toStation=' + str(destination)
        url = url + '&dateTime=' + date
        req = Request(url)
        req.add_header('Ocp-Apim-Subscription-Key', self.apikey)
        return json.load(urlopen(req))
