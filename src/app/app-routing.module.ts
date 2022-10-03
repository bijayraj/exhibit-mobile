import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [IntroGuard, AutoLoginGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [IntroGuard]
  },
  {
    path: 'artwork',
    loadChildren: () => import('./artwork/artwork.module').then(m => m.ArtworkPageModule)
  },
  {
    path: 'photoviewer',
    loadChildren: () => import('./viewer/viewer.module').then(m => m.ViewerPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'add-art',
    loadChildren: () => import('./add-art/add-art.module').then(m => m.AddArtPageModule)
  },
  {
    path: 'artist-art',
    loadChildren: () => import('./artist-art/artist-art.module').then(m => m.ArtistArtPageModule)
  },
  {
    path: 'artist-art-edit',
    loadChildren: () => import('./artist-art-edit/artist-art-edit.module').then(m => m.ArtistArtEditPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
