import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
  Renderer2,
  EventEmitter
} from '@angular/core';
import places from 'places.js';
import {PlacesService} from '../services/places/places.service';
import {OsrmRootObject, Route} from '../interfaces/osrm';
import {HttpClient} from '@angular/common/http';

export interface PlacesComponentGeoloc {
  lat: number;
  lng: number;
}

export interface PlacesComponentHit {
  accident_id: number;
  objectID: number;
  _geoloc: PlacesComponentGeoloc;
}

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
})
export class PlacesComponent implements OnInit, AfterViewInit {

  @Input() q: string;
  @ViewChild('place1',  { read: ElementRef, static: false }) qElementRef: ElementRef;
  @ViewChild('place2',  { read: ElementRef, static: false }) qElementSecond: ElementRef;

  private placesOne: any;
  private placesTwo: any;

  private firstLocation: any;
  private secondLocation: any;

  constructor(private renderer: Renderer2, private http: HttpClient, private placesService: PlacesService) { }

  @Output() messageEvent = new EventEmitter<OsrmRootObject>();
  @Output() firstLocationEvent = new EventEmitter<OsrmRootObject>();
  @Output() secondLocationEvent = new EventEmitter<OsrmRootObject>();

  ngAfterViewInit() {
    this.placesOne = places({
      appId: 'plD85DLCMVN6',
      apiKey: '21ae1fd88f04362c9387d2e8e5f1054a',
      container:  this.qElementRef.nativeElement,
    });

    this.placesOne.on('change', (e) => {
      this.firstLocation = e.suggestion.latlng;
    });

    this.placesTwo = places({
      appId: 'plD85DLCMVN6',
      apiKey: '21ae1fd88f04362c9387d2e8e5f1054a',
      container:  this.qElementSecond.nativeElement,
    });

    this.placesTwo.on('change', (e) => {
      this.secondLocation = e.suggestion.latlng;
    });

  }

  public ngOnInit() {

  }

  submitData() {
    if (this.qElementRef.nativeElement.value && this.qElementSecond.nativeElement.value) {
      this.placesService.setCoordinates(this.firstLocation, this.secondLocation);
      this.placesService.getAllPoints().subscribe((response: OsrmRootObject) => {
        this.messageEvent.emit(response);
        this.firstLocationEvent.emit(this.firstLocation);
        this.secondLocationEvent.emit(this.secondLocation);
      });
    }
  }
}
