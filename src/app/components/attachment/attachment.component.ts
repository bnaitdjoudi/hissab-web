import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';

import { FilePicker, PickedFile } from '@capawesome/capacitor-file-picker';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
  providers: [CurrencyPipe],
})
export class AttachmentComponent implements OnInit, OnDestroy {
  @Input()
  title: string;
  filethumb: string;
  fileAttachement: PickedFile;
  @Output()
  onAttachement: EventEmitter<PickedFile> = new EventEmitter<PickedFile>();
  constructor() {}

  ngOnDestroy(): void {}
  ngOnInit(): void {}

  async openFileExplorer() {
    const result = await FilePicker.pickFiles({
      types: ['image/png', 'application/pdf', 'image/jpeg'],
      multiple: false,
      readData: true,
    });

    this.fileAttachement = result.files[0];

    this.filethumb =
      'data:' +
      this.fileAttachement.mimeType +
      ';base64,' +
      this.fileAttachement.data;
  }

  async openCallery() {
    const image = await FilePicker.pickImages({
      readData: true,
    });
    this.fileAttachement = image.files[0];

    this.filethumb =
      'data:' +
      this.fileAttachement.mimeType +
      ';base64,' +
      this.fileAttachement.data;
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
    });
    this.filethumb = 'data:image/png;base64,' + image.base64String;
    this.fileAttachement = {
      mimeType: 'image/png',
      name: 'attachement.png',
      size: 0,
      data: image.base64String,
    };
  }

  async done() {
    const regex: any = /(?:\.([^.]+))?$/;
    const ext: string | null = regex.exec(this.fileAttachement.name)[1];
    const fileName = Math.random().toString(36).slice(2) + '.' + ext;
    
    console.log(',done');
    this.onAttachement.emit(this.fileAttachement);
  }
}
