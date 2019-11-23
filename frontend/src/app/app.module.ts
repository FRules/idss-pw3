import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PlacesComponent } from './places/places.component';
import { HttpClientModule, /* other http imports */ } from '@angular/common/http';
import { AgmCoreModule} from '@agm/core';
import {AngularOpenlayersModule} from 'ngx-openlayers';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PlacesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC_dUvrZ8QEAuXGIc2Lbfql9moM0dxMEi4'
    }),
    AngularOpenlayersModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
