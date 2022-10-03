import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonicSwiper, IonSlides, LoadingController, Platform } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { first } from 'rxjs/operators';
import { Artwork } from '../models/artwork';
import { Exhibit } from '../models/exhibit';
import { ArtworkService } from '../services/artwork.service';
import { AuthenticationService } from '../services/authentication.service';
import { ExhibitService } from '../services/exhibit.service';
import { SwiperComponent } from 'swiper/angular';
import { SwiperOptions } from 'swiper';

import { Camera, CameraResultType } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder'
import { AssetService } from '../services/asset.service';
import { ArtworkAsset } from '../models/artworkAsset';
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx';

@Component({
  selector: 'app-add-art',
  templateUrl: './add-art.page.html',
  styleUrls: ['./add-art.page.scss'],
})
export class AddArtPage implements OnInit {
  @ViewChild('mainSwiper') slides: SwiperComponent;
  @ViewChild('imageElement') imageElement: HTMLImageElement;
  imageSource: string;
  artForm: FormGroup;
  artWork: Artwork;

  exhibits: Exhibit[];
  exhibit: Exhibit;

  recording = false;
  storedAudioFileNames = [];

  imageUrl = "";
  audioUrl: string = "";

  swiperConfig: SwiperOptions = {
    allowTouchMove: false
  };

  constructor(private exhibitService: ExhibitService,
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private artService: ArtworkService,
    private assetService: AssetService,
    private platform: Platform,
    private nfc: NFC, private ndef: Ndef) {



  }

  get f() {
    return this.artForm.controls;
  }

  ngOnInit() {

    // Camera.requestPermissions();
    // VoiceRecorder.requestAudioRecordingPermission();

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

  }

  async createArt() {

    const loading = await this.loadingController.create();

    const currentUser = this.authService.userValue;

    if (this.artForm.invalid) {
      return;
    }
    await loading.present();

    const userData = this.artForm.value;
    userData.ExhibitId = this.exhibit.id;
    userData.UserId = currentUser.id;
    userData.approved = true;
    userData.artType = 'General';

    this.artService.create(userData)
      .pipe(first())
      .subscribe({
        next: async (response) => {
          await loading.dismiss();
          this.artWork = response;
          // this.slides.swiperRef.slideNext();
          await this.nextToAssets();
        },

        error: async error => {
          await loading.dismiss();
          console.log(error);
          const alert = await this.alertController.create({
            header: 'Failed',
            message: error.error.message,
            buttons: ['OK'],
          });
          await alert.present();
        }
      });
  }


  portChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
  }

  nextSlide() {
    this.slides.swiperRef.slideNext();
  }

  prevSlide() {
    this.slides.swiperRef.slidePrev();
  }

  async nextToAssets() {
    await this.makeDir();
    this.loadFiles();
    this.slides.swiperRef.slideNext();
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const imageUrl = image.webPath;

    // Can be set to the src of an image now
    // this.imageElement.src = imageUrl;
    this.imageSource = imageUrl;
  }




  async makeDir() {
    let id = 0;
    if (this.artWork) {
      id = this.artWork.id;
    }
    try {

      await Filesystem.mkdir({
        path: `${id}`,
        directory: Directory.Data
      });
    } catch {

    }

  }

  async loadFiles() {
    let id = 0;
    if (this.artWork) {
      id = this.artWork.id;
    }
    Filesystem.readdir({
      path: `${id}`,
      directory: Directory.Data
    }).then(result => {
      console.log(result);
      this.storedAudioFileNames = result.files;
    });
  }

  startRecording() {
    if (this.recording) {
      return;
    }

    this.recording = true;
    VoiceRecorder.startRecording();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }

    let id = 0;
    if (this.artWork) {
      id = this.artWork.id;
    }

    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        console.log('Recording Result', recordData);

        const fileName = new Date().getTime() + '.wav';
        await Filesystem.writeFile({
          path: `${id}/${fileName}`,
          directory: Directory.Data,
          data: recordData
        });
        this.loadFiles();
      }
    });
    this.recording = false;
  }

  async playFile(fileName) {
    let id = 0;
    if (this.artWork) {
      id = this.artWork.id;
    }

    const audioFile = await Filesystem.readFile({
      path: `${id}/${fileName}`,
      directory: Directory.Data
    });
    console.log('Audio file loaded', audioFile);
    const base64Sound = audioFile.data;

    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`)
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }


  async uploadImage() {

  }

  async addAssets() {
    const loading = await this.loadingController.create();
    const currentUser = this.authService.userValue;


    await loading.present();

    const imageArtwork: ArtworkAsset = new ArtworkAsset();
    imageArtwork.address = this.imageUrl;
    imageArtwork.approved = true;
    imageArtwork.assetType = 0;
    imageArtwork.description = "Image ";
    imageArtwork.title = "Image";
    imageArtwork.visible = true;
    imageArtwork.ArtworkId = this.artWork.id;

    const audioArtwork: ArtworkAsset = new ArtworkAsset();
    audioArtwork.address = this.audioUrl;
    audioArtwork.approved = true;
    audioArtwork.assetType = 1;
    audioArtwork.description = "Audio ";
    audioArtwork.title = "Audio";
    audioArtwork.visible = true;
    audioArtwork.ArtworkId = this.artWork.id;

    this.assetService.create(imageArtwork)
      .pipe(first())
      .subscribe({
        next: async (response) => {

          this.assetService.create(audioArtwork).pipe(first())
            .subscribe({
              next: async (response) => {
                this.loadingController.dismiss();
                const alert = await this.alertController.create({
                  header: 'Success',
                  message: 'Assets Added',
                  buttons: ['OK'],
                });
                await alert.present();
                this.slides.swiperRef.slideNext();

              },
              error: async error => {
                await loading.dismiss();
                console.log(error);
              }
            });



        },

        error: async error => {
          await loading.dismiss();
          console.log(error);
          const alert = await this.alertController.create({
            header: 'Failed',
            message: error.error.message,
            buttons: ['OK'],
          });
          await alert.present();
        }
      });
  }


  async writeTagIos() {
    try {
      let tag = await this.nfc.scanNdef({ keepSessionOpen: true });
      // you can read tag data here
      console.log(tag);
      let message = [
        this.ndef.textRecord(this.artWork.id.toString()),
        this.ndef.textRecord(this.artWork.title)
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

  finishAdd() {
    this.router.navigate(['tabs', 'tab1']);
  }

}
