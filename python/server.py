from flask import Flask
from flask_restful import Api

from footprint import Footprint
from car_travel_price import CarTravelPrice


def define_api(app):
    api = Api(app)
    api.add_resource(Footprint, '/footprint')
    api.add_resource(CarTravelPrice, '/carTravelPrice')
    return api


def main():
    app = Flask(__name__)
    api = define_api(app)

    app.run(port=5002)
    print("test")


if __name__ == "__main__":
    main()
