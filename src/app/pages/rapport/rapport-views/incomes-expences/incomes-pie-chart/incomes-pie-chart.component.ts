import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';

import { EChartsOption, init } from 'echarts';

import {
  AccountBalancePeriod,
  IncomesExpenceRapport,
} from 'src/app/model/rapport-store.model';

@Component({
  selector: 'incomes-pie-chart',
  templateUrl: './incomes-pie-chart.component.html',
  styleUrls: ['./incomes-pie-chart.component.scss'],
})
export class IncomesPieChartComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  charttype: 'bar' | 'pie' = 'pie';

  inRapport: AccountBalancePeriod[] = [];
  ngAfterViewInit(): void {
    console.log('IncomesPieChartComponent::ngAfterViewInit');
  }
  ngOnDestroy(): void {
    console.log('IncomesPieChartComponent::ngOnDestroy');
  }

  ngOnInit(): void {
    console.log('IncomesPieChartComponent::ngOnInit');
  }

  inexRapport: IncomesExpenceRapport = { result: [] };
  dataComul: any[] = [];
  options: EChartsOption;
  app: any = {};

  @Input() set incomesRapport(incomesRapport: AccountBalancePeriod[] | null) {
    this.inRapport = incomesRapport ? incomesRapport : [];
    this.performData();
    this.reloadOptions();
  }

  reloadOptions() {
    this.options = {
      title: {
        text: 'Incomes',
        subtext: '',
        left: 'center',
        subtextStyle: {
          color: '#f1f1f2',
        },
        textStyle: {
          color: '#f1f1f2',
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: '#f1f1f2',
          fontWeight: 'bold',
        },
      },
      series: [
        {
          name: 'Incomes',
          type: 'pie',
          radius: '50%',
          label: {
            color: '#f1f1f2',
          },

          data: this.dataComul
            .filter((el) => Math.abs(el.value) > 0)
            .map((el) => {
              return { name: el.name, value: el.value.toFixed(2) };
            }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              color: '#f1f1f2',
            },
          },
        },
      ],
    };
  }

  performData() {
    const myMap = new Map<string, number>();
    this.inRapport.forEach((el) =>
      el.accountBalance.forEach((el1) => {
        let bal = myMap.get(el1.accountName);

        myMap.set(el1.accountName, el1.balance + (bal?.toFixed(2) ? bal : 0));
      })
    );
    this.dataComul = [];
    for (let key of myMap.keys()) {
      this.dataComul.push({ value: myMap.get(key), name: key });
    }

    this.dataComul = this.dataComul
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .map((el) => {
        return { value: +el.value.toFixed(2), name: el.name };
      });
  }

  onCharttypeChange(event: MatButtonToggleChange) {
    this.charttype = event.value;
    this.reloadOptions();
  }
}
