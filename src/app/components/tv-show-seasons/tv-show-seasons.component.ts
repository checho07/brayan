import { Component, OnInit, Inject } from "@angular/core";

import { FirebaseStorageService } from "../../services/FirebaseStorage/firebase-storage.service";
import { SeasonsService } from "../../services/Firestore/SeasonsService/seasons-service.service";

import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import "../../../assets/js/demo.js";
import swal from "sweetalert";
declare var demo: any;

import { Season } from "../../models/Season";
import { TvShowSeasonEditorComponent } from "../tv-show-season-editor/tv-show-season-editor.component";
import { TvShow } from "../../models/TvShow";
import { SeasonsEpisodesComponent } from "../seasons-episodes/seasons-episodes.component";

@Component({
  selector: "app-tv-show-seasons",
  templateUrl: "./tv-show-seasons.component.html",
  styleUrls: ["./tv-show-seasons.component.css"]
})
export class TvShowSeasonsComponent implements OnInit {
  tvShow: TvShow;
  tvShowSeasons: Season[] = [];

  constructor(
    private seasonsService: SeasonsService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tvShow = data.tvShow;
  }

  ngOnInit() {
    this.getTvShowSeasons();
  }

  getTvShowSeasons() {
    this.spinner.show();

    this.seasonsService.getSeasons(this.tvShow).then(
      (result: any) => {
        this.tvShowSeasons = result.tvShowSeasons;
        this.spinner.hide();
      },
      (error: any) => {
        console.error(error);
        this.spinner.hide();
      }
    );
  }

  addNewTvShowSeason(): void {
    const dialogRef = this.dialog.open(TvShowSeasonEditorComponent, {
      width: "500px",
      data: {
        isEditMode: false,
        tvShow: this.tvShow
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Add new tv show season
        this.tvShowSeasons.push(result.newSeason);
        demo.showSuccessNotification("TV show season successfully added!");
      }
    });
  }

  edit(season: Season) {
    const dialogRef = this.dialog.open(TvShowSeasonEditorComponent, {
      width: "650px",
      data: {
        isEditMode: true,
        tvShow: this.tvShow,
        season: season
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Edit name
        season.name = result.newSeasonName;
        demo.showSuccessNotification(
          "TV show season name successfully updated!"
        );
      }
    });
  }

  delete(season: Season) {
    const options = {
      title: "Delete TV show season?",
      text:
        "Are you sure you want to delete this season? All associated episodes will also be deleted.",
      icon: "error",
      buttons: ["Cancel", "Ok"],
      dangerMode: true
    };

    swal(options).then(willDelete => {
      if (willDelete) {
        this.spinner.show();

        // Delete artist
        this.seasonsService.deleteSeason(this.tvShow, season).then(
          (result: any) => {
            this.removeSeasonFromList(season);
            
            demo.showSuccessNotification(
              "TV show season successfully deleted!"
            );

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

  removeSeasonFromList(season: Season) {
    const index = this.tvShowSeasons.indexOf(season);
    if (index > -1) {
      this.tvShowSeasons.splice(index, 1);
    }
  }

  viewEpisodes(season: Season) {
    const dialogRef = this.dialog.open(SeasonsEpisodesComponent, {
      data: {
        tvShow: this.tvShow,
        season: season
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
