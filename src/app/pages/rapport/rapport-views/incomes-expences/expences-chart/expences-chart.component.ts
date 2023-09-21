import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { EChartsOption } from 'echarts';

import { AccountBalancePeriod } from 'src/app/model/rapport-store.model';

@Component({
  selector: 'expences-chart',
  templateUrl: './expences-chart.component.html',
  styleUrls: ['./expences-chart.component.css'],
})
export class ExpencesChartComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  exRapport: AccountBalancePeriod[] = [];
  ngAfterViewInit(): void {
    console.log('IncomesPieChartComponent::ngAfterViewInit');
  }
  ngOnDestroy(): void {
    console.log('IncomesPieChartComponent::ngOnDestroy');
  }

  ngOnInit(): void {
    console.log('IncomesPieChartComponent::ngOnInit');
  }

  dataComul: any[] = [];
  options: EChartsOption;
  app: any = {};

  @Input() set expencesRapport(expencesRapport: AccountBalancePeriod[] | null) {
    this.exRapport = expencesRapport ? expencesRapport : [];
    this.performData();
    this.reloadOptions();
  }

  reloadOptions() {
    this.options = {
      title: {
        text: 'Expences',
        subtext: 'Pie Chart',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: 'Expences',
          type: 'pie',
          radius: '50%',
          data: this.dataComul
            .filter((el) => Math.abs(el.value) > 0)
            .map((el) => {
              return { name: el.name, value: +Math.abs(el.value).toFixed(2) };
            }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  performData() {
    const myMap = new Map<string, number>();
    this.exRapport.forEach((el) =>
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
        return { name: el.name, value: Math.abs(el.value).toFixed(2) };
      });
  }
}
