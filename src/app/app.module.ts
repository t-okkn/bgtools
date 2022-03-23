import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ScoreModule } from './score/score.module';

import { WebSocketService } from './services/websocket.service';
import { WebAPIService } from './services/webapi.service';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    ScoreModule,
  ],
  providers: [
    WebSocketService,
    WebAPIService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
