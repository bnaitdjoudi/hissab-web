import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxTranslateModule } from './translate/translate.module';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { GuardsModule } from './guards/guards.module';
import { IonicStorageModule } from '@ionic/storage-angular';

import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { StoreModule } from './store/store.module';
import { PipeModule } from './pipes/pipes.moule';

@NgModule({
  declarations: [AppComponent],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    SQLitePorter,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxTranslateModule,
    FontAwesomeModule,
    GuardsModule,
    IonicStorageModule.forRoot(),
    StoreModule,
    PipeModule,
  ],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
