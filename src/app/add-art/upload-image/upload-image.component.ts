import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { ArtworkAsset } from 'src/app/models/artworkAsset';
import { AssetService } from 'src/app/services/asset.service';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Artwork } from 'src/app/models/artwork';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss'],
})
export class UploadImageComponent implements OnInit {

  images: ArtworkAsset[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(private api: AssetService, private plt: Platform, private actionSheetCtrl: ActionSheetController) {
    this.loadImages();
  }

  ngOnInit(): void {
    
  }

  loadImages() {
    this.api.getImages().subscribe(images => {
      this.images = images;
    });
  }

  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Photos Photo',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });

    const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
    const imageName = 'Give me a name';

    this.api.uploadImage(blobData, imageName, image.format,2).subscribe((newImage: ArtworkAsset) => {
      this.images.push(newImage);
    });
  }

  // Used for browser direct file upload
  uploadFile(event: EventTarget) {
    const eventObj: any = event as any;
    const target: HTMLInputElement = eventObj.target as HTMLInputElement;
    const file: File = target.files[0];
    this.api.uploadImageFile(file).subscribe((newImage: ArtworkAsset) => {
      this.images.push(newImage);
    });
  }

  deleteImage(image: ArtworkAsset, index) {
    this.api.deleteImage(image.id).subscribe(res => {
      this.images.splice(index, 1);
    });
  }

  // Helper function
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}
