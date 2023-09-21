import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { RapportStore } from '../../rapport.store';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'incomes-expences',
  templateUrl: './incomes-expences.component.html',
  styleUrls: ['./incomes-expences.component.scss'],
})
export class IncomeExpensesComponent
  implements OnDestroy, OnInit, AfterViewInit
{
  periodSelections: String[];
  constructor(readonly rapportStore: RapportStore) {}
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.rapportStore.periodsSelected$.subscribe((periods) => {
      this.periodSelections = periods;
    });
  }
  valueChange($event: any) {
    this.rapportStore.upDateSelectedPeriods($event.detail.value);
  }

  selectedTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 1: {
        this.rapportStore.loadIncomesRapport();
        break;
      }
      case 2: {
        this.rapportStore.loadExpencesRapport();
        break;
      }
    }
  }
}
