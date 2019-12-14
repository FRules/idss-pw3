from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from footprint import Footprint
from car_travel_price import CarTravelPrice
from train_data import TrainData


def add_resources_to_api(app):
    api = Api(app)
    api.add_resource(Footprint, '/footprint/<string:vehicle>')
    api.add_resource(CarTravelPrice, '/carTravelPrice')
    api.add_resource(TrainData, '/trainData')


def main():
    app = Flask(__name__)
    CORS(app)
    add_resources_to_api(app)

    app.run(port=5002)


if __name__ == "__main__":
    main()
