import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artwork } from '../models/artwork';
import { ArtworkService } from '../services/artwork.service';
import { Location } from '@angular/common';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { ArtworkAsset } from '../models/artworkAsset';
import { IonModal, ModalController, Platform } from '@ionic/angular';
import { ModalpopupComponent } from './modalpopup/modalpopup.component';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-artwork',
  templateUrl: './artwork.page.html',
  styleUrls: ['./artwork.page.scss'],
})
export class ArtworkPage implements OnInit {
  artwork?: Artwork;
  artworkAssets: ArtworkAsset[];
  imageList: any[] = [];

  threedurl = "https://sketchfab.com/3d-models/huaca-lora-fbde22869d3146ca9af61816421a6d0d"
  idTemp = 1;
  descTemp = "Item 1";
  userQuestion: string = '';
  questionResponse: string = '';

  playingTTS: boolean = false;
  isCallingAnswer: boolean = false;

  recording: boolean = false;

  @ViewChild(IonModal) modal: IonModal;


  constructor(private artworkService: ArtworkService,
    private route: ActivatedRoute,
    private location: Location,
    private photoViewer: PhotoViewer,
    private router: Router,
    public modalController: ModalController,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform) {

    SpeechRecognition.requestPermission();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params.id;
      this.idTemp = id;
      console.log('THe id is');
      console.log(id);
      this.artworkService.get(id).subscribe(data => {
        this.artwork = data;
        this.artworkAssets = this.artwork.ArtworkAssets;
        console.log(data);

      });
      // this.artworkService.getAssets(id).subscribe(data => {
      //   this.artworkAssets = data;
      //   console.log('Loaded assets');
      // });


    });

    this.route.queryParams
      .subscribe(params => {
        console.log(params);
        this.descTemp = params.desc;
      }
      );

    TextToSpeech.getSupportedLanguages().then(res => {
      console.log(res);
    });



  }

  showPhoto(url: string, title: string) {

    this.photoViewer.show(url);
    // this.router.navigate(
    //   ['/photoviewer'],
    //   { queryParams: { url, title } }
    // );
    console.log(url);

  }

  async showDialog() {
  }


  modelData: any;
  async openIonModal() {
    const modal = await this.modalController.create({
      component: ModalpopupComponent,
      componentProps: {
        'model_title': "Model"
      }
    });
    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modelData = modelData.data;
        console.log('Modal Data : ' + modelData.data);
      }
    });
    return await modal.present();
  }

  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  someFunction() {
    console.log('Clicked here');
  }

  async askQuestion() {
    this.isCallingAnswer = true;
    this.artworkService.askQuestion(this.artwork.id, this.userQuestion)
      .pipe(
        catchError((err: any, caught: Observable<any>) => {
          console.log(err);
          return throwError(err);
        }),
        finalize(() => {
          this.isCallingAnswer = false;
        }))
      .subscribe(response => {
        this.questionResponse = response.message;
        this.speakText(this.questionResponse);
        // if (response && response.message) {
        //   this.questionResponse = response.message;
        //   this.speakText(this.questionResponse);
        // }
        // this.questionResponse = 'Error getting response';
        // this.isCallingAnswer = false;
      },
        err => {
          console.log(err);
          this.isCallingAnswer = false;
        }
      ).add(() => { this.isCallingAnswer = false; })
    console.log('Asking question');

  }

  async speakText(myText: string) {

    if (this.playingTTS) {
      await this.stopTTS();
    }
    this.playingTTS = true;

    try {
      await TextToSpeech.speak({
        text: myText,
        lang: 'en-US',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });

    } catch (ex) {
      console.log(ex);
    } finally {
      this.playingTTS = false;

    }


  }


  async stopTTS() {
    try {
      await TextToSpeech.stop();

    } catch (ex) {
      console.log(ex);
    } finally {
      this.playingTTS = false;

    }

  }


  async startRecognition() {
    const { available } = await SpeechRecognition.available();
    if (available) {
      this.recording = true;
      SpeechRecognition.start({
        popup: false,
        partialResults: true,
      });

      SpeechRecognition.addListener("partialResults", (data: any) => {
        console.log("partialResults was fired", data.matches);

        if (this.platform.is('ios')) {
          if (data.matches && data.matches.length > 0) {
            this.userQuestion = data.matches[0];
            this.changeDetectorRef.detectChanges();
          }
        } else {
          if (data.value && data.value.length > 0) {
            this.userQuestion = data.value[0];
            this.changeDetectorRef.detectChanges();
          }
        }


      });

    }
  }
  async cancelRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();

  }
  async stopRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();
    await this.askQuestion();

  }

  async onModalClose() {
    console.log('CLOSING THE MODAL');
    this.userQuestion = '';
    this.questionResponse = '';
    this.isCallingAnswer = false;

    if (this.recording) {
      await this.cancelRecognition();
    }

    if (this.playingTTS) {
      await this.stopTTS();
    }
  }

  async closeModal() {
    await this.modal.dismiss();
  }


}
