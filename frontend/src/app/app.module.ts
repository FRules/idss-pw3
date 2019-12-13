import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HttpClientModule} from '@angular/common/http';
import {AgmCoreModule} from '@agm/core';
import {FilterComponent} from './filter/filter.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC_dUvrZ8QEAuXGIc2Lbfql9moM0dxMEi4'
    }),
    LeafletModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
