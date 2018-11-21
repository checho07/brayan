import { Component, OnInit, Inject } from "@angular/core";

import { FirebaseStorageService } from "../../services/FirebaseStorage/firebase-storage.service";
import { EpisodesService } from "../../services/Firestore/EpisodesService/episodes-service.service";

import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material";
import "../../../assets/js/demo.js";
import swal from "sweetalert";
declare var demo: any;

import { SeasonEpisodeEditorComponent } from "../season-episode-editor/season-episode-editor.component";

import { TvShow } from "../../models/TvShow";
import { Season } from "../../models/Season";
import { Episode } from "../../models/Episode";
import { SeasonEpisodePlayerComponent } from "../season-episode-player/season-episode-player.component";

@Component({
  selector: "app-seasons-episodes",
  templateUrl: "./seasons-episodes.component.html",
  styleUrls: ["./seasons-episodes.component.css"]
})
export class SeasonsEpisodesComponent implements OnInit {
  tvShow: TvShow;
  season: Season;
  seasonEpisodes: Episode[] = [];

  constructor(
    private episodesService: EpisodesService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tvShow = data.tvShow;
    this.season = data.season;
  }

  ngOnInit() {
    this.getSeasonEpisodes();
  }

  getSeasonEpisodes() {
    this.spinner.show();

    this.episodesService
      .getEpisodes(this.tvShow, this.season)
      .then((result: any) => {
        this.seasonEpisodes = result.seasonEpisodes;
        this.spinner.hide();
      });
  }

  addNewSeasonEpisode(): void {
    const dialogRef = this.dialog.open(SeasonEpisodeEditorComponent, {
      width: "500px",
      data: {
        isEditMode: false,
        tvShow: this.tvShow,
        season: this.season
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        this.seasonEpisodes.push(result.newEpisode);
        demo.showSuccessNotification("Episode successfully added!");
      }
    });
  }

  edit(episode: Episode) {
    const dialogRef = this.dialog.open(SeasonEpisodeEditorComponent, {
      width: "650px",
      data: {
        isEditMode: true,
        tvShow: this.tvShow,
        season: this.season,
        episode: episode
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        if (result.episodeNameUpdated) {
          // Edit name
          episode.name = result.newEpisodeName;

          demo.showSuccessNotification(
            "Season's episode name successfully updated!"
          );
        } else if (result.episodeDescriptionUpdated) {
          // Edit description
          episode.description = result.newEpisodeDescription;

          demo.showSuccessNotification(
            "Season's episode description successfully updated!"
          );
        } else if (result.episodePictureUpdated) {
          // Edit picture
          episode.picture = result.newEpisodePicture;

          demo.showSuccessNotification(
            "Season's episode picture successfully updated!"
          );
        }
      }
    });
  }

  delete(episode: Episode) {
    const options = {
      title: "Delete season episode?",
      text: "Are you sure you want to delete this episode?",
      icon: "error",
      buttons: ["Cancel", "Ok"],
      dangerMode: true
    };

    swal(options).then(willDelete => {
      if (willDelete) {
        this.spinner.show();

        // Delete artist
        this.episodesService
          .deleteEpisode(this.tvShow, this.season, episode)
          .then(
            (result: any) => {
              this.removeEpisodeFromList(episode);

              demo.showSuccessNotification("Episode successfully deleted!");

              this.spinner.hide();
            },
            (error: any) => {
              this.spinner.hide();
              demo.showErrorNotification("An error occured: " + error);
            }
          );
      }
    });
  }

  removeEpisodeFromList(episode: Episode) {
    const index = this.seasonEpisodes.indexOf(episode);

    if (index > -1) {
      this.seasonEpisodes.splice(index, 1);
    }
  }

  preview(episode: Episode) {
    const dialogRef = this.dialog.open(SeasonEpisodePlayerComponent, {
      width: "550px",
      height: "450px",
      data: {
        episode: episode
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
