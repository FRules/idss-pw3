from flask import Flask
from flask_cors import CORS
from flask_restful import Api

from footprint import Footprint
from car_travel_price import CarTravelPrice
from train_price import TrainPrice


def define_api(app):
    api = Api(app)
    api.add_resource(Footprint, '/footprint')
    api.add_resource(CarTravelPrice, '/carTravelPrice')
    api.add_resource(TrainPrice, '/trainPrice')
    return api


def main():
    app = Flask(__name__)
    CORS(app)
    api = define_api(app)

    app.run(port=5002)
    print("test")


if __name__ == "__main__":
    main()
