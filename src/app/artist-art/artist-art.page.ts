import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router) { }

  ngOnInit() {
    this.artService.getAll().subscribe(data => {
      this.artworks = data;
      console.log(data);
    });
  }

  editArt(id) {
    this.router.navigateByUrl(`/tabs/artist-art-edit/${id}`, { replaceUrl: true });

  }

}
