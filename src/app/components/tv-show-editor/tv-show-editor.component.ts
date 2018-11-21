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
import { TvShowsService } from "../../services/Firestore/TvShowsService/tv-shows-service.service";

import { NgxSpinnerService } from "ngx-spinner";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import "../../../assets/js/demo.js";
declare var demo: any;

import { TvShow } from "../../models/TvShow";

@Component({
  selector: "app-tv-show-editor",
  templateUrl: "./tv-show-editor.component.html",
  styleUrls: ["./tv-show-editor.component.css"]
})
export class TvShowEditorComponent implements OnInit {
  tvShowName = "";
  tvShowId = "";
  tvShowYear: number = new Date().getFullYear();
  tvShowRating = "G";
  tvShowDescription = "";

  isEditMode = false;
  showProgress = false;
  progress = 0;

  years: number[] = [];
  ratings: string[] = [];

  constructor(
    private tvShowsService: TvShowsService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<TvShowEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode;

    if (this.isEditMode) {
      this.tvShowName = data.tvShow.name;
      this.tvShowId = data.tvShow.tvShowId;
      this.tvShowYear = data.tvShow.releaseYear;
      this.tvShowRating = data.tvShow.rating;
      this.tvShowDescription = data.tvShow.description;
    }
  }

  ngOnInit() {
    this.initialiseYears();
    this.initialiseRatings();
  }

  initialiseYears() {
    for (let year = 1900; year <= new Date().getFullYear(); year++) {
      this.years.push(year);
    }
  }

  initialiseRatings() {
    this.ratings = ["G", "PG", "M", "MA 15+", "R18+"];
  }

  addNewTvShow() {
    if (!this.tvShowName) {
      demo.showWarningNotification("Please provide a name for the TV show.");
      return;
    }

    const tvShowPicture = (<HTMLInputElement>(
      document.getElementById("tvShowPicture")
    )).files[0];
    if (!tvShowPicture) {
      demo.showWarningNotification(
        "Please select a home screen image file to upload."
      );
      return;
    }

    const detailsPicture = (<HTMLInputElement>(
      document.getElementById("detailsPicture")
    )).files[0];
    if (!detailsPicture) {
      demo.showWarningNotification(
        "Please select a details image file to upload."
      );
      return;
    }

    if (!this.tvShowDescription) {
      demo.showWarningNotification(
        "Please provide a description for the TV show."
      );
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const homeScreenpictureUploadPath = `/TV Shows/${
      this.tvShowName
    }/tvShowPicture`;

    // Upload TV show picture
    this.firebaseStorage
      .uploadPicture(
        homeScreenpictureUploadPath,
        tvShowPicture,
        (progress: number) => {
          console.log("Uploading... " + Math.round(progress) + "% done");
          this.progress = Math.round(progress);
        }
      )
      .then((homeScreenPictureUploadResult: any) => {
        this.progress = 0;
        const detailsPictureUploadPath = `/TV Shows/${
          this.tvShowName
        }/detailsPicture`;

        this.firebaseStorage
          .uploadPicture(
            detailsPictureUploadPath,
            detailsPicture,
            (progress: number) => {
              console.log("Uploading... " + Math.round(progress) + "% done");
              this.progress = Math.round(progress);
            }
          )
          .then(
            (detailsPictureUploadResult: any) => {
              const newTvShow = new TvShow();
              newTvShow.name = this.tvShowName;
              newTvShow.picture = homeScreenPictureUploadResult.downloadURL;
              newTvShow.detailsPicture = detailsPictureUploadResult.downloadURL;
              newTvShow.releaseYear = this.tvShowYear;
              newTvShow.rating = this.tvShowRating;
              newTvShow.description = this.tvShowDescription;

              // If upload is successful, add the artist to the firestore
              this.tvShowsService.addNewTvShow(newTvShow).then(
                (result: any) => {
                  this.spinner.hide();
                  this.showProgress = false;

                  newTvShow.tvShowId = result.newTvShowId;

                  this.dialogRef.close({
                    isSuccess: true,
                    newTvShow: newTvShow
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
      });
  }

  updateTvShowName() {
    if (!this.tvShowName) {
      demo.showWarningNotification("Please provide a name for the TV show.");
      return;
    }

    this.tvShowsService.editTvShowName(this.tvShowId, this.tvShowName).then(
      (result: any) => {
        this.dialogRef.close({
          isSuccess: true,
          tvShowNameUpdated: true,
          newTvShowName: this.tvShowName
        });
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  updateTvShowPicture() {
    const tvShowPicture = (<HTMLInputElement>(
      document.getElementById("tvShowPicture")
    )).files[0];
    if (!tvShowPicture) {
      demo.showWarningNotification("Please select an image file to upload.");
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const uploadPath = `/TV Shows/${this.tvShowName}/tvShowPicture`;

    // Update TV show picture
    this.firebaseStorage
      .uploadPicture(uploadPath, tvShowPicture, (progress: number) => {
        console.log("Uploading... " + Math.round(progress) + "% done");
        this.progress = Math.round(progress);
      })
      .then(
        (uploadResult: any) => {
          // If upload is successful, edit the TV show picture
          this.tvShowsService
            .editTvShowPicture(this.tvShowId, uploadResult.downloadURL)
            .then(
              (result: any) => {
                this.spinner.hide();
                this.showProgress = false;

                this.dialogRef.close({
                  isSuccess: true,
                  tvShowPictureUpdated: true,
                  newTvShowPicture: uploadResult.downloadURL
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

  updateDetailsPicture() {
    const detailsPicture = (<HTMLInputElement>(
      document.getElementById("detailsPicture")
    )).files[0];
    if (!detailsPicture) {
      demo.showWarningNotification("Please select a details image file to upload.");
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const detailsPictureUploadPath = `/TV Shows/${this.tvShowName}/detailsPicture`;

    // Update details picture
    this.firebaseStorage
      .uploadPicture(detailsPictureUploadPath, detailsPicture, (progress: number) => {
        console.log("Uploading... " + Math.round(progress) + "% done");
        this.progress = Math.round(progress);
      })
      .then(
        (detailsPictureUploadResult: any) => {
          // If upload is successful, edit the TV show picture
          this.tvShowsService
            .editDetailsPicture(this.tvShowId, detailsPictureUploadResult.downloadURL)
            .then(
              (result: any) => {
                this.spinner.hide();
                this.showProgress = false;

                this.dialogRef.close({
                  isSuccess: true,
                  detailsPictureUpdated: true,
                  newDetailsPicture: detailsPictureUploadResult.downloadURL
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

  updateTvShowReleaseYear() {
    this.tvShowsService.editTvReleaseYear(this.tvShowId, this.tvShowYear).then(
      (result: any) => {
        this.dialogRef.close({
          isSuccess: true,
          tvShowYearUpdated: true,
          newTvShowYear: this.tvShowYear
        });
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  updateTvShowRating() {
    this.tvShowsService.editTvRating(this.tvShowId, this.tvShowRating).then(
      (result: any) => {
        this.dialogRef.close({
          isSuccess: true,
          tvShowRatingUpdated: true,
          newTvShowRating: this.tvShowRating
        });
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  updateTvShowDescription() {
    this.tvShowsService
      .editTvDescription(this.tvShowId, this.tvShowDescription)
      .then(
        (result: any) => {
          this.dialogRef.close({
            isSuccess: true,
            tvShowDescriptionUpdated: true,
            newTvShowDescription: this.tvShowDescription
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
