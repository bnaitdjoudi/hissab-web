import { NgModule } from '@angular/core';
import { PermissionsService } from './auth.guard';

@NgModule({
  imports: [],
  providers: [PermissionsService],
})
export class GuardsModule {}
