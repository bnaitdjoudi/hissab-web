import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption, init } from 'echarts';
import { RapportStore } from '../../../rapport.store';

@Component({
  selector: 'app-global-rapport',
  templateUrl: './global-rapport.component.html',
  styleUrls: ['./global-rapport.component.css'],
})
export class GlobalRapportComponent
  implements OnDestroy, OnInit{
  app: any = {};
  options: EChartsOption;

  assetsValue: number = 0;
  passifValue: number = 0;

  constructor(private readonly rapportStore: RapportStore) {}

  ngOnDestroy(): void {}
  async ngOnInit(): Promise<void> {
    console.log('view inited rapport');
    this.rapportStore.globalAssetsRapport$.subscribe((vals) => {
      vals.forEach((val) => {
        if (val.type === 'actif') {
          this.assetsValue = val.result;
        }

        if (val.type === 'passif') {
          this.passifValue = val.result;
        }
      });
      this.reloadChart();
    });
    this.rapportStore.loadAllBalance();
  }
  reloadChart() {
    var chartDom = document.getElementById('charts');
    var myChart = init(chartDom);

    const posList = [
      'left',
      'right',
      'top',
      'bottom',
      'inside',
      'insideTop',
      'insideLeft',
      'insideRight',
      'insideBottom',
      'insideTopLeft',
      'insideTopRight',
      'insideBottomLeft',
      'insideBottomRight',
    ] as const;

    this.app.configParameters = {
      rotate: {
        min: -90,
        max: 90,
      },
      align: {
        options: {
          left: 'left',
          center: 'center',
          right: 'right',
        },
      },
      verticalAlign: {
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom',
        },
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {} as Record<string, string>),
      },
      distance: {
        min: 0,
        max: 100,
      },
    };

    this.app.config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      onChange: function () {
        const labelOption: BarLabelOption = {
          rotate: this.app.config.rotate as BarLabelOption['rotate'],
          align: this.app.config.align as BarLabelOption['align'],
          verticalAlign: this.app.config
            .verticalAlign as BarLabelOption['verticalAlign'],
          position: this.app.config.position as BarLabelOption['position'],
          distance: this.app.config.distance as BarLabelOption['distance'],
        };
        myChart.setOption<echarts.EChartsOption>({
          series: [
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
            {
              label: labelOption,
            },
          ],
        });
      },
    };

    type BarLabelOption = NonNullable<echarts.BarSeriesOption['label']>;

    const labelOption: BarLabelOption = {
      show: true,
      position: this.app.config.position as BarLabelOption['position'],
      distance: this.app.config.distance as BarLabelOption['distance'],
      align: this.app.config.align as BarLabelOption['align'],
      verticalAlign: this.app.config
        .verticalAlign as BarLabelOption['verticalAlign'],
      rotate: this.app.config.rotate as BarLabelOption['rotate'],
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {},
      },
    };

    this.options = {
      color: [
        '#33804b',
        this.assetsValue + this.passifValue >= 0 ? '#0090e3' : '#d1880a',
        '#9c0b0b',
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Assets', 'Balances', 'Liabilities'],
        textStyle: {
          color: '#f1f1f2',
          fontWeight: 'bold',
        },
      },

      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['Global'],

          axisLabel: {
            overflow: 'truncate',
            color: '#f1f1f2',
            fontWeight: 'bold',
          },
        },
      ],
      yAxis: [
        {
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
      ],
      series: [
        {
          name: 'Assets',
          type: 'bar',
          barGap: 0,
          label: labelOption,
          emphasis: {
            focus: 'series',
          },
          data: [this.assetsValue.toFixed(2)],
        },
        {
          name: 'Balances',
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series',
          },
          data: [(this.assetsValue + this.passifValue).toFixed(2)],
        },
        {
          name: 'Liabilities',
          type: 'bar',
          label: labelOption,
          emphasis: {
            focus: 'series',
          },
          data: [this.passifValue.toFixed(2)],
        },
      ],
    };
  }
}
