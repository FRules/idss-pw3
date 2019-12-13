import {Component} from '@angular/core';
import {icon, LatLng, latLng, marker, polyline, tileLayer} from 'leaflet';
import {BackendResult, TrainStop} from './interfaces/backendResult';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
  ]
})
export class AppComponent {
  private static defaultIcon = icon({
    iconSize: [ 12, 20 ],
    iconAnchor: [ 5, 20 ],
    iconUrl: 'assets/marker-icon.png',
    shadowUrl: 'assets/marker-shadow.png'
  });

  private options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ],
    zoom: 8,
    center: latLng(52.370216, 4.895168)
  };


  private result: BackendResult;

  private layers = [];

  private showLayers = true;

  receiveResultMessage($event) {
    this.result = $event;

    const trainStops: TrainStop[] = this.result.train_data.stops;
    const routeWaypoints: LatLng[] = this.result.car_data.routes[0].geometry.coordinates.map(coords => latLng(coords[1], coords[0]));

    this.layers = [polyline(trainStops, {color: 'red'}),
      polyline(routeWaypoints, {color: 'orange'}),
    marker(trainStops[0], {icon: AppComponent.defaultIcon}),
    marker(trainStops[trainStops.length - 1], {icon: AppComponent.defaultIcon})];
  }

}



