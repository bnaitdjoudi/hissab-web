import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { RapportStore } from '../../../rapport.store';
import { OverTimeAssetRapportResult } from 'src/app/model/rapport-store.model';
import { format } from 'date-fns';
import { Subscription } from 'rxjs';

@Component({
  selector: 'overtime-rapport',
  templateUrl: './overtime-rapport.component.html',
  styleUrls: ['./overtime-rapport.component.scss'],
})
export class OverTimeRapportComponent
  implements OnDestroy, OnInit, AfterViewInit
{
  periodSubscription: Subscription;
  resultSubscription: Subscription;
  app: any = {};
  options: EChartsOption;

  assetsValue: number = 0;
  passifValue: number = 0;
  period: string;
  result: OverTimeAssetRapportResult = { result: [] };

  constructor(private readonly rapportStore: RapportStore) {}
  ngOnDestroy(): void {
    this.periodSubscription?.unsubscribe();
    this.resultSubscription?.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    this.periodSubscription = this.rapportStore.periodAsset$.subscribe(
      (val) => {
        this.period = val;
        console.log(val);
        this.rapportStore.loadOverTimeAssetRapport(val);
      }
    );

    this.resultSubscription =
      this.rapportStore.overTimeAssetsRapport$.subscribe((val) => {
        this.result = val;
        this.reloadChart();
      });
  }

  periodChange(event: any) {
    this.rapportStore.uodateDateAssetsPeriod(event.detail.value);
  }

  reloadChart() {
    this.options = {
      dataZoom: [
        {
          type: 'inside',
          start: 80,
          end: 100,
        },
        {
          start: 80,
          end: 100,
        },
      ],
      legend: {
        data: ['Assets', 'Balance', 'Liabilities'],
        textStyle: {
          color: '#f1f1f2',
          fontWeight: 'bold',
        },
      },
      color: ['#33804b', '#0090e3', '#9c0b0b'],
      xAxis: {
        type: 'category',
        data: this.result.result.map((row) =>
          format(row.date, this.period === 'week' ? 'yyyy-MM-dd' : 'MMM yyyy')
        ),
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (val: any) => {
            if (Math.abs(val) < 1000) {
              return val;
            }
            if (Math.abs(val) < 1000000) {
              return `${val / 1000}K`;
            }
            if (Math.abs(val) < 1000000000) {
              return `${val / 1000000}M`;
            }

            return;
          },
          overflow: 'truncate',
          color: '#f1f1f2',
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      series: [
        {
          name: 'Assets',
          data: this.result.result.map((row) =>
            row.assets ? row.assets.toFixed(2) : 0
          ),
          type: 'line',
          smooth: true,
        },

        {
          name: 'Balance',
          data: this.result.result.map((row) =>
            (row.assets - row.liabilities).toFixed(2)
          ),
          type: 'line',
          smooth: true,
        },
        {
          name: 'Liabilities',
          data: this.result.result.map((row) =>
            row.liabilities ? row.liabilities.toFixed(2) : 0
          ),
          type: 'line',
          smooth: true,
        },
      ],
    };
  }

  ngAfterViewInit(): void {
    //this.reloadChart();
  }
}
