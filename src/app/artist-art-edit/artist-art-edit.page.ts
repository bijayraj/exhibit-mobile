import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Artwork } from '../models/artwork';
import { ArtworkAsset } from '../models/artworkAsset';
import { Exhibit } from '../models/exhibit';
import { ArtworkService } from '../services/artwork.service';
import { AuthenticationService } from '../services/authentication.service';
import { ExhibitService } from '../services/exhibit.service';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-artist-art-edit',
  templateUrl: './artist-art-edit.page.html',
  styleUrls: ['./artist-art-edit.page.scss'],
})
export class ArtistArtEditPage implements OnInit {

  artForm: FormGroup;
  artWork: Artwork;
  artworkAssets: ArtworkAsset[];
  exhibits: Exhibit[];

  constructor(private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private platform: Platform,
    private router: Router,
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private artworkService: ArtworkService,
    private exhibitService: ExhibitService,
    private nfc: NFC, private ndef: Ndef) { }

  get f() {
    return this.artForm.controls;
  }

  ngOnInit() {

    this.exhibitService.getAll().subscribe(data => {
      this.exhibits = data;
      console.log(data);
    });

    this.artForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      moreInfo: [''],
      ExhibitId: ['']
    });


    this.route.params.subscribe(params => {
      const id = params.id;
      this.artworkService.get(id).subscribe(data => {
        this.artWork = data;

        this.artForm.patchValue({
          title: this.artWork.title,
          description: this.artWork.description,
          moreInfo: this.artWork.moreInfo,
          ExhibitId: this.artWork.ExhibitId
        });

      });

      this.artworkService.getAssets(id).subscribe(data => {
        this.artworkAssets = data;
        console.log('Loaded assets');
        console.log(data)
      });
    });



  }

  async writeTagIos() {

    try {
      let tag = await this.nfc.scanTag({ keepSessionOpen: true });
      let tagIdString = this.nfc.bytesToHexString(tag.id)
      console.log('The tag id is', tagIdString);

      // you can read tag data here
      console.log(tag);
      let message = [
        this.ndef.textRecord(this.artWork.id.toString()),
        this.ndef.textRecord(this.artWork.title)
      ]

      try {
        let location = ''

        try {
          const coordinates = await Geolocation.getCurrentPosition();
          console.log('Current position:', coordinates);
          location = JSON.stringify(coordinates)
        } catch (locationError) {
          console.log(locationError);
        }


        this.artworkService.addTag(tagIdString, this.artWork.id, location).subscribe(async data => {
          let writeResult = await this.nfc.write(message);
          console.log('Write succesful');
          // const alert = await this.alertController.create({
          //   header: 'Success',
          //   message: 'Tag created',
          //   buttons: ['OK'],
          // });
          // await alert.present();
        });




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

  async writeTagAndroid() {
    this.nfc.addNdefListener(() => {
      console.log('successfully attached ndef listener');
    }, (err) => {
      console.log('error attaching ndef listener', err);
    }).subscribe((event) => {
      console.log('received ndef message. the tag contains: ', event.tag);
      console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));

      let message = [
        this.ndef.textRecord(this.artWork.id.toString()),
        this.ndef.textRecord(this.artWork.title)
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


  async writeTag() {
    this.nfc.close();
    this.alertController.create({
      header: 'Bring Tag Closer',
      message: 'success',
      buttons: ['OK'],
    });

    if (this.platform.is('ios')) {
      await this.writeTagIos();
    } else {
      await this.writeTagAndroid();
    }
  }



}