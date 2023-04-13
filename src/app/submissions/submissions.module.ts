import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubmissionsRoutingModule } from './submissions-routing.module';
import { SubmissionsComponent } from './submissions.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SubmissionsComponent
  ],
  imports: [
    CommonModule,
    SubmissionsRoutingModule,
    FormsModule
  ]
})
export class SubmissionsModule { }
