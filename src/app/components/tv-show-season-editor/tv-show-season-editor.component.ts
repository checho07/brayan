import { Component, OnInit, Inject } from "@angular/core";

import { FirebaseStorageService } from "../../services/FirebaseStorage/firebase-storage.service";
import { SeasonsService } from "../../services/Firestore/SeasonsService/seasons-service.service";

import { NgxSpinnerService } from "ngx-spinner";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import "../../../assets/js/demo.js";
declare var demo: any;

import { Season } from "../../models/Season";
import { TvShow } from "../../models/TvShow";

@Component({
  selector: "app-tv-show-season-editor",
  templateUrl: "./tv-show-season-editor.component.html",
  styleUrls: ["./tv-show-season-editor.component.css"]
})
export class TvShowSeasonEditorComponent implements OnInit {
  seasonName = "";
  seasonId = "";
  tvShow: TvShow;

  isEditMode = false;

  constructor(
    private seasonsService: SeasonsService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<TvShowSeasonEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode;
    this.tvShow = data.tvShow;

    if (this.isEditMode) {
      this.seasonName = data.season.name;
      this.seasonId = data.season.seasonId;
    }
  }

  ngOnInit() {}

  addNewSeason() {
    if (!this.seasonName) {
      demo.showWarningNotification("Please provide a name for the TV show season.");
      return;
    }

    const season = new Season();
    season.name = this.seasonName;
    season.tvShowId = this.tvShow.tvShowId;
    season.tvShowName = this.tvShow.name;

    // If upload is successful, add the artist to the firestore
    this.seasonsService.addNewSeason(this.tvShow, season).then(
      (result: any) => {
        this.spinner.hide();

        season.seasonId = result.newSeasonId;

        this.dialogRef.close({
          isSuccess: true,
          newSeason: season
        });
      },
      (error: any) => {
        this.spinner.hide();

        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  updateSeasonName() {
    if (!this.seasonName) {
      demo.showWarningNotification("Please provide a name for the TV show season.");
      return;
    }

    this.seasonsService.editSeasonName(this.tvShow, this.seasonId, this.seasonName).then(
      (result: any) => {
        this.dialogRef.close({
          isSuccess: true,
          newSeasonName: this.seasonName
        });
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  closeEditor() {
    this.dialogRef.close({
      isSuccess: false
    });
  }
}
