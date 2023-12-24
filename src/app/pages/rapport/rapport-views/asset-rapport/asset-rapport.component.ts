import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'asset-rapport',
  templateUrl: './asset-rapport.component.html',
  styleUrls: ['./asset-rapport.component.scss'],
})
export class AssetRapportComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild(IonTabs) tabs: IonTabs;

  constructor() {}
  ngAfterViewInit(): void {
    this.tabs.select('global');
  }
  ngOnDestroy(): void {}
  ngOnInit(): void {}
}
