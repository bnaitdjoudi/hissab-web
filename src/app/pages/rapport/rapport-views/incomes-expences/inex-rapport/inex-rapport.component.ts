import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { format } from 'date-fns';
import { EChartsOption } from 'echarts';
import { IncomesExpenceRapport } from 'src/app/model/rapport-store.model';

type BarLabelOption = NonNullable<echarts.BarSeriesOption['label']>;

@Component({
  selector: 'inex-rapport',
  templateUrl: './inex-rapport.component.html',
  styleUrls: ['./inex-rapport.component.scss'],
})
export class InexRapportComponent implements OnInit, OnDestroy, AfterViewInit {
  charttype: 'bar' | 'line' = 'bar';
  ngAfterViewInit(): void {
    console.log('InexRapportComponent::ngAfterViewInit');
  }
  ngOnDestroy(): void {
    console.log('InexRapportComponent::ngOnDestroy');
  }

  ngOnInit(): void {
    console.log('InexRapportComponent::ngOnInit');
  }

  inexRapport: IncomesExpenceRapport = { result: [] };
  options: EChartsOption;
  app: any = {};

  posList = [
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

  labelOption: BarLabelOption;

  @Input() set incomesExpenceRapport(
    incomesExpenceRapport: IncomesExpenceRapport | null
  ) {
    console.log(JSON.stringify(incomesExpenceRapport));
    this.inexRapport = incomesExpenceRapport
      ? incomesExpenceRapport
      : { result: [] };
    this.reloadOptions();
  }

  performBarLabelOption() {
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
        options: this.posList.reduce(function (map, pos) {
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
      },
    };

    this.labelOption = {
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
  }

  reloadOptions() {
    let incomesSeries: any = {
      name: 'Incomes',
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series',
      },
      data: this.inexRapport.result.map((el) => el.assets.toFixed(2)),
    };

    let expencesSerries: any = {
      name: 'Expenses',
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series',
      },
      data: this.inexRapport.result.map((el) => el.liabilities.toFixed(2)),
    };

    let worthSerries: any = {
      name: 'Worth',
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series',
      },
      data: this.inexRapport.result.map((el) =>
        (el.assets - el.liabilities).toFixed(2)
      ),
      itemStyle: {
        color: (param: any) => {
          return +param.value >= 0 ? '#33804b' : '#9c0b0b';
        },
      },
    };

    if (this.charttype === 'bar') {
      this.performBarLabelOption();

      incomesSeries = {
        name: 'Incomes',
        type: 'bar',
        barGap: 0,
        label: this.labelOption,
        emphasis: {
          focus: 'series',
        },
        data: this.inexRapport.result.map((el) => el.assets.toFixed(2)),
      };

      expencesSerries = {
        name: 'Expenses',
        type: 'bar',
        label: this.labelOption,
        emphasis: {
          focus: 'series',
        },
        data: this.inexRapport.result.map((el) => el.liabilities.toFixed(2)),
      };

      worthSerries = {
        name: 'Worth',
        type: 'bar',
        label: this.labelOption,
        emphasis: {
          focus: 'series',
        },
        data: this.inexRapport.result.map((el) =>
          (el.assets - el.liabilities).toFixed(2)
        ),

        itemStyle: {
          color: (param: any) => {
            return +param.value >= 0 ? '#33804b' : '#9c0b0b';
          },
        },
      };
    }

    this.options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['Incomes', 'Expenses', 'Worth'],
      },

      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: this.inexRapport.result.map((el) =>
            format(el.date, 'MMM yyyy')
          ),
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],

      dataZoom: [
        {
          show: true,
          start: 33,
          end: 66,
        },
        {
          type: 'inside',
          start: 94,
          end: 100,
        },
      ],

      color: ['#0090e3', '#d1880a', '#9e9b9b'],
      series: [incomesSeries, expencesSerries, worthSerries],
    };
  }

  onCharttypeChange(event: MatButtonToggleChange) {
    this.charttype = event.value;
    this.reloadOptions();
  }
}
