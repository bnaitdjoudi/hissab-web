import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportStore } from './rapport.store';
import { RapportType } from 'src/app/model/rapport-store.model';
import { Subscription } from 'rxjs';
import { JSONPath } from 'jsonpath-plus';

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.page.html',
  styleUrls: ['./rapport.page.scss'],
})
export class RapportPage implements OnInit, OnDestroy {
  rapports: RapportType[];
  currentRap: RapportType[];
  rapportSubscription: Subscription;
  short: string | null;
  currentRapport: RapportType | undefined;
  constructor(
    private readonly rapportStore: RapportStore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.rapportSubscription = this.rapportStore.rapports$.subscribe(
      (val) => (this.rapports = val)
    );

    this.route.paramMap.subscribe((paramMap) => {
      this.short = paramMap.get('page');

      if (this.short) {
        let path = "$..[?( @.short === '" + this.short + "' )]";
        let rap: RapportType[] = JSONPath({
          path: path,
          json: this.rapports,
        });
        if (rap.length === 1 && rap[0].subType.length === 0) {
          this.currentRapport = rap[0];
          this.currentRap = [];
        } else {
          this.currentRap = rap[0].subType;
          this.currentRapport = undefined;
        }
      } else {
        this.currentRap = this.rapports;
      }
    });
  }
  ngOnDestroy(): void {
    this.rapportSubscription?.unsubscribe();
  }
  goToHome() {
    this.router.navigate(['/'], {});
  }

  goto(go: string) {
    this.router.navigate(['/rapport/' + go], {});
  }
}
