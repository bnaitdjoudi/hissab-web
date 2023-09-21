import { Component, OnInit } from '@angular/core';
import {
  Chooser,
  ChooserOptions,
  ChooserResult,
} from '@awesome-cordova-plugins/chooser/ngx';
import { SupportPageStore } from '../support-page.store';

@Component({
  selector: 'patch',
  templateUrl: './patch.page.html',
  styleUrls: ['./patch.page.scss'],
})
export class PatchPage implements OnInit {
  fileObject: ChooserResult | undefined;

  chooseFile() {
    const fileType: ChooserOptions = { mimeTypes: 'application/pdf' };
    this.chooser
      .getFile(fileType)
      .then((file) => {
        this.fileObject = file;
        this.supportPageStore.setFileObject(file);
      })
      .catch((error: any) => console.error(error));
  }
  constructor(
    private chooser: Chooser,
    readonly supportPageStore: SupportPageStore
  ) {}

  ngOnInit() {}

  async apply() {
    try {
      await this.supportPageStore.applyFile();
    } catch (error: any) {
      console.log(JSON.stringify(error));
    }
  }
}
