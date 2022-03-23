import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MysticValeComponent } from './mystic-vale/mystic-vale.component';



@NgModule({
  declarations: [
    MysticValeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MysticValeComponent
  ]
})
export class ScoreModule { }
