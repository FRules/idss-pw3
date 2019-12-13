import {Component} from '@angular/core';
import {latLng, tileLayer} from 'leaflet';
import {BackendResult} from './interfaces/backendResult';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
  ]
})
export class AppComponent {
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ],
    zoom: 7,
    center: latLng(52.370216, 4.895168)
  };

  private result: BackendResult;

  receiveResultMessage($event) {
    this.result = $event;
    console.log(this.result);
  }

}



