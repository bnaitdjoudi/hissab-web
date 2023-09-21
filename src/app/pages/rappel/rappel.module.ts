import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RappelPageRoutingModule } from './rappel-routing.module';

import { RappelViewComponent } from './view/rappel-view.component';
import { RappelListComponent } from './list/rappel-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RappelEditComponent } from './edit/rappel-edit.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/material.module';
import { PipeModule } from "../../pipes/pipes.moule";

@NgModule({
    declarations: [RappelListComponent, RappelViewComponent, RappelEditComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RappelPageRoutingModule,
        FontAwesomeModule,
        ComponentsModule,
        MaterialModule,
        PipeModule
    ]
})
export class RappelPageModule {}
