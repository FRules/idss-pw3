import {Component} from '@angular/core';
import {OsrmRootObject} from './interfaces/osrm';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',
  ]
})
export class AppComponent {
  lat = 52.300962;
  lng = -1.479097;
  zoom = 6;

  selected = 0;

  private osrmRootObject: OsrmRootObject;

  receiveMessage($event) {
    this.osrmRootObject = $event;
    this.selected = 0;
  }

}



