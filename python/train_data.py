from flask import request
from flask_restful import Resource
from flask_jsonpify import jsonify

from urllib.request import Request, urlopen
import json
import geopy.distance


class TrainData(Resource):

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
        cheapest_price = 9999999999
        for fare in trip["fares"]:
            if fare["travelClass"] == chosen_class and fare["discountType"] == "NO_DISCOUNT":
                if cheapest_price > fare["priceInCents"]:
                    cheapest_price = fare["priceInCents"]
        return (float(cheapest_price) / 100.0) * number_of_travellers

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
        url = url + '?fromStation=' + str(origin) + '&toStation=' + str(destination)
        url = url + '&dateTime=' + date
        req = Request(url)
        req.add_header('Ocp-Apim-Subscription-Key', self.apikey)
        return json.load(urlopen(req))
