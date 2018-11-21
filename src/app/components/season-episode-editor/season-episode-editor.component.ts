import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  AfterViewInit,
  Inject
} from "@angular/core";

import { FirebaseStorageService } from "../../services/FirebaseStorage/firebase-storage.service";
import { EpisodesService } from "../../services/Firestore/EpisodesService/episodes-service.service";

import { NgxSpinnerService } from "ngx-spinner";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import "../../../assets/js/demo.js";
declare var demo: any;

import { TvShow } from "../../models/TvShow";
import { Season } from "../../models/Season";
import { Episode } from "../../models/Episode";

@Component({
  selector: "app-season-episode-editor",
  templateUrl: "./season-episode-editor.component.html",
  styleUrls: ["./season-episode-editor.component.css"]
})
export class SeasonEpisodeEditorComponent implements OnInit {
  tvShow: TvShow;
  season: Season;

  episodeName = "";
  episodeDescription = "";
  episodeId = "";
  isEditMode = false;

  showProgress = false;
  progress = 0;

  constructor(
    private episodesService: EpisodesService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<SeasonEpisodeEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode;
    this.tvShow = data.tvShow;
    this.season = data.season;

    if (this.isEditMode) {
      this.episodeName = data.episode.name;
      this.episodeDescription = data.episode.description;
      this.episodeId = data.episode.episodeId;
    }
  }

  ngOnInit() {}

  addNewEpisode() {
    if (!this.episodeName) {
      demo.showWarningNotification("Please provide a name for the episode.");
      return;
    }

    if (!this.episodeDescription) {
      demo.showWarningNotification(
        "Please provide a description for the episode."
      );
      return;
    }

    const episodePicture = (<HTMLInputElement>(
      document.getElementById("episodePicture")
    )).files[0];
    if (!episodePicture) {
      demo.showWarningNotification("Please select an image file to upload.");
      return;
    }

    const episode = (<HTMLInputElement>document.getElementById("episode"))
      .files[0];
    if (!episode) {
      demo.showWarningNotification("Please select a video file to upload.");
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const pictureUploadPath = `/TV Shows/${this.tvShow.name}/${
      this.season.name
    }/${this.episodeName}/episodePicture`;

    // Upload episode picture
    this.firebaseStorage
      .uploadPicture(pictureUploadPath, episodePicture, (progress: number) => {
        console.log("Uploading... " + Math.round(progress) + "% done");
        this.progress = Math.round(progress);
      })
      .then(
        (pictureUploadResult: any) => {
          const videoUploadPath = `/TV Shows/${this.tvShow.name}/${this.season.name}/${
            this.episodeName
          }/episodeVideo`;

          this.firebaseStorage
            .uploadVideo(
              videoUploadPath,
              this.episodeName,
              pictureUploadResult.downloadURL,
              episode
            )
            .then((uploadResult: any) => {
              uploadResult.uploadTask.then(snapshot => {
                if (snapshot.state !== "success") {
                  demo.showErrorNotification("An error occured.");
                  return;
                }

                snapshot.ref.getDownloadURL().then(videoDownloadURL => {
                  const newEpisode = new Episode();
                  newEpisode.name = this.episodeName;
                  newEpisode.description = this.episodeDescription;
                  newEpisode.picture = pictureUploadResult.downloadURL;
                  newEpisode.seasonId = this.season.seasonId;
                  newEpisode.seasonName = this.season.name;
                  newEpisode.tvShowId = this.tvShow.tvShowId;
                  newEpisode.tvShowName = this.tvShow.name;
                  newEpisode.videoUrl = videoDownloadURL;

                  // If upload is successful, add the artist to the firestore
                  this.episodesService
                    .addNewEpisode(this.tvShow, this.season, newEpisode)
                    .then(
                      (result: any) => {
                        this.spinner.hide();
                        this.showProgress = false;

                        newEpisode.episodeId = result.newEpisodeId;

                        this.dialogRef.close({
                          isSuccess: true,
                          newEpisode: newEpisode
                        });
                      },
                      (error: any) => {
                        this.spinner.hide();
                        this.showProgress = false;

                        demo.showErrorNotification(
                          "An error occured: " + error
                        );
                      }
                    );
                });
              });
            });

          this.spinner.hide();
          this.dialogRef.close();
        },
        (error: any) => {
          this.spinner.hide();
          this.showProgress = false;

          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }

  updateEpisodeName() {
    if (!this.episodeName) {
      demo.showWarningNotification("Please provide a name for the episode.");
      return;
    }

    this.episodesService
      .editEpisodeName(
        this.tvShow,
        this.season,
        this.episodeId,
        this.episodeName
      )
      .then(
        (result: any) => {
          this.dialogRef.close({
            isSuccess: true,
            episodeNameUpdated: true,
            newEpisodeName: this.episodeName
          });
        },
        (error: any) => {
          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }

  updateEpisodeDescription() {
    if (!this.episodeDescription) {
      demo.showWarningNotification(
        "Please provide a description for the episode."
      );
      return;
    }

    this.episodesService
      .editEpisodeDescription(
        this.tvShow,
        this.season,
        this.episodeId,
        this.episodeDescription
      )
      .then(
        (result: any) => {
          this.dialogRef.close({
            isSuccess: true,
            episodeDescriptionUpdated: true,
            newEpisodeDescription: this.episodeDescription
          });
        },
        (error: any) => {
          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }

  updateEpisodePicture() {
    const episodePicture = (<HTMLInputElement>(
      document.getElementById("episodePicture")
    )).files[0];

    if (!episodePicture) {
      demo.showWarningNotification("Please select an image file to upload.");
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const uploadPath = `/TV Shows/${this.tvShow.name}/${this.season.name}/${
      this.episodeName
    }/episodePicture`;

    // Upload episode picture
    this.firebaseStorage
      .uploadPicture(uploadPath, episodePicture, (progress: number) => {
        console.log("Uploading... " + Math.round(progress) + "% done");
        this.progress = Math.round(progress);
      })
      .then(
        (uploadResult: any) => {
          this.episodesService
            .editEpisodePicture(
              this.tvShow,
              this.season,
              this.episodeId,
              uploadResult.downloadURL
            )
            .then(
              (result: any) => {
                this.spinner.hide();
                this.showProgress = false;

                this.dialogRef.close({
                  isSuccess: true,
                  episodePictureUpdated: true,
                  newEpisodePicture: uploadResult.downloadURL
                });
              },
              (error: any) => {
                this.spinner.hide();
                this.showProgress = false;

                demo.showErrorNotification("An error occured: " + error);
              }
            );
        },
        (error: any) => {
          this.spinner.hide();
          this.showProgress = false;

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
