import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { Artwork } from '../models/artwork';
import { ArtworkService } from '../services/artwork.service';

@Component({
  selector: 'app-artist-art',
  templateUrl: './artist-art.page.html',
  styleUrls: ['./artist-art.page.scss'],
})
export class ArtistArtPage implements OnInit {
  artworks: Artwork[] = [];
  constructor(private artService: ArtworkService,
    private alertController: AlertController,
    private platform: Platform,
    private router: Router,
    private nfc: NFC, private ndef: Ndef) { }

  ngOnInit() {
    this.artService.getAll().subscribe(data => {
      this.artworks = data;
      console.log(data);
    });
  }

  editArt(id) {
    this.router.navigateByUrl(`/tabs/artist-art-edit/${id}`, { replaceUrl: true });

  }

  makeNFCTag() {

  }

  async writeTagIos(artWork: Artwork) {
    try {
      let tag = await this.nfc.scanNdef({ keepSessionOpen: true });
      // you can read tag data here
      console.log(tag);
      let message = [
        this.ndef.textRecord(artWork.id.toString()),
        this.ndef.textRecord(artWork.title)
      ]

      try {
        let writeResult = await this.nfc.write(message);
        console.log('Write succesful')
        // const alert = await this.alertController.create({
        //   header: 'Success',
        //   message: 'Tag created',
        //   buttons: ['OK'],
        // });
        // await alert.present();


      } catch (write_error) {
        console.log('Could not write tag');
        console.log(write_error);

        // const alert = await this.alertController.create({
        //   header: 'Failed',
        //   message: 'Tag could not be written. Try again',
        //   buttons: ['OK'],
        // });
        // await alert.present();

      }


    } catch (err) {
      console.log(err);
    }
  }

  async writeTagAndroid(artWork: Artwork) {
    this.nfc.addNdefListener(() => {
      console.log('successfully attached ndef listener');
    }, (err) => {
      console.log('error attaching ndef listener', err);
    }).subscribe((event) => {
      console.log('received ndef message. the tag contains: ', event.tag);
      console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));

      let message = [
        this.ndef.textRecord(artWork.id.toString()),
        this.ndef.textRecord(artWork.title)
      ]

      this.nfc.write(
        message).then(msg => {
          console.log('Wrote the message ');
          this.alertController.create({
            header: 'User registration success',
            message: 'success',
            buttons: ['OK'],
          });
          this.nfc.close()
        })
        .catch(error => {
          this.alertController.create({
            header: 'User registration success',
            message: error,
            buttons: ['OK'],
          });
          console.log(error)
        });

      // this.nfc.share([message]).then(onSuccess).catch(onError);
    });
  }


  async writeTag(event, artWork: Artwork) {
    event.stopPropagation();

    this.nfc.close();
    this.alertController.create({
      header: 'Bring Tag Closer',
      message: 'success',
      buttons: ['OK'],
    });

    if (this.platform.is('ios')) {
      await this.writeTagIos(artWork);
    } else {
      await this.writeTagAndroid(artWork);
    }
  }

}
