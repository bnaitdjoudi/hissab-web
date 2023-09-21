import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RapportPageRoutingModule } from './rapport-routing.module';

import { RapportPage } from './rapport.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { StoreModule } from 'src/app/store/store.module';
import { AssetRapportComponent } from './rapport-views/asset-rapport/asset-rapport.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { GlobalRapportComponent } from './rapport-views/asset-rapport/global-rapport/global-rapport.component';
import { OverTimeRapportComponent } from './rapport-views/asset-rapport/overtime-rapport/overtime-rapport.component';
import { IncomeExpensesComponent } from './rapport-views/incomes-expences/incomes-expences.component';
import { InexRapportComponent } from './rapport-views/incomes-expences/inex-rapport/inex-rapport.component';
import { IncomesPieChartComponent } from './rapport-views/incomes-expences/incomes-pie-chart/incomes-pie-chart.component';
import { MaterialModule } from 'src/app/material.module';
import { ExpencesChartComponent } from './rapport-views/incomes-expences/expences-chart/expences-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RapportPageRoutingModule,
    FontAwesomeModule,
    StoreModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    MaterialModule,
  ],
  declarations: [
    RapportPage,
    AssetRapportComponent,
    GlobalRapportComponent,
    OverTimeRapportComponent,
    IncomeExpensesComponent,
    InexRapportComponent,
    IncomesPieChartComponent,
    ExpencesChartComponent,
  ],
})
export class RapportPageModule {}
