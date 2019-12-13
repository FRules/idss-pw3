from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from car_footprint import CarFootprint
from car_travel_price import CarTravelPrice
from train_data import TrainData


def define_api(app):
    api = Api(app)
    api.add_resource(CarFootprint, '/footprint')
    api.add_resource(CarTravelPrice, '/carTravelPrice')
    api.add_resource(TrainData, '/trainData')
    return api


def main():
    app = Flask(__name__)
    CORS(app)
    api = define_api(app)

    app.run(port=5002)
    print("test")


if __name__ == "__main__":
    main()
