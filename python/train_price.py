from flask import request
from flask_restful import Resource
from flask_jsonpify import jsonify

from urllib.request import Request, urlopen  # Python 3
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

        return jsonify({"train_price": self.train_price(
            args["origin"],
            args["destination"],
            args["date"],
            args["class"],
            int(args["numberOfTravellers"])
        )})

    def train_price(self, origin, destination, date, chosen_class, number_of_travellers):
        data = self.price_search(date, origin, destination)

        # For the ease of use: Only look in the route without options for ease of use.
        # In the other list there are fixed price tickets like one for children and supplements
        # for a single use ov chipcard and for the international IC
        routes_without_options = data['priceOptions'][1]['totalPrices']

        for item in routes_without_options:
            if item['discountType'] == 'NONE' and item['classType'] == chosen_class:
                return item['price'] * number_of_travellers

    def price_search(self, date, fromstation, tostation):
        url = 'https://gateway.apiportal.ns.nl/public-prijsinformatie/prices/?'
        final_url = url + "&date=" + date + "&fromStation=" + fromstation + "&toStation=" + tostation
        req = Request(final_url)
        req.add_header('Ocp-Apim-Subscription-Key', self.apikey)
        return json.load(urlopen(req))
