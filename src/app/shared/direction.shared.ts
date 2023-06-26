import { Router } from '@angular/router';

export class GoHome {
  constructor(readonly router: Router) {}

  goHome() {
    this.router.navigate(['/dashboard'], {});
  }
}
