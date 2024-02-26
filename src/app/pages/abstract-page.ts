import { LoadingController } from '@ionic/angular';

export class AbstractPage {
  private loading: any = undefined;

  constructor(private loadingCtrl: LoadingController) {}

  protected async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Processing...',
    });

    this.loading.present();
  }

  protected async dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }
}
