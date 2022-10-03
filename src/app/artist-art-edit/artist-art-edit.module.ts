import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtistArtEditPageRoutingModule } from './artist-art-edit-routing.module';

import { ArtistArtEditPage } from './artist-art-edit.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArtistArtEditPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule,
  ],
  declarations: [ArtistArtEditPage]
})
export class ArtistArtEditPageModule { }
