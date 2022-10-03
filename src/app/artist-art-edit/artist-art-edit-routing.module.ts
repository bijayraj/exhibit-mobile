import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtistArtEditPage } from './artist-art-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ArtistArtEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtistArtEditPageRoutingModule {}
