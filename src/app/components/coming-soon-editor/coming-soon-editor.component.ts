import { Component, OnInit, Inject } from "@angular/core";
import {
  MatFormFieldModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { ComingSoonService } from "../../services/Firestore/ComingSoonService/coming-soon.service.js";
import { FirebaseStorageService } from "../../services/FirebaseStorage/firebase-storage.service.js";

import "../../../assets/js/demo.js";
import { ComingSoon } from "../../models/ComingSoon.js";
declare var demo: any;

@Component({
  selector: "app-coming-soon-editor",
  templateUrl: "./coming-soon-editor.component.html",
  styleUrls: ["./coming-soon-editor.component.css"]
})
export class ComingSoonEditorComponent implements OnInit {
  comingSoonId: string;
  comingSoonName: string;
  comingSoonDescription: string;
  comingSoonReleaseDate: string;

  isEditMode = false;
  showProgress = false;
  progress = 0;

  constructor(
    private comingSoonService: ComingSoonService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<ComingSoonEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.isEditMode = data.isEditMode;

    if (this.isEditMode) {
      this.comingSoonId = data.comingSoon.comingSoonId;
      this.comingSoonName = data.comingSoon.name;
      this.comingSoonDescription = data.comingSoon.description;
      this.comingSoonReleaseDate = data.comingSoon.releaseDate;
    }
  }

  ngOnInit() {}

  addNewComingSoon() {
    if (!this.comingSoonName) {
      demo.showWarningNotification("Please provide a name.");
      return;
    }

    const comingSoonPicture = (<HTMLInputElement>(
      document.getElementById("comingSoonPicture")
    )).files[0];
    if (!comingSoonPicture) {
      demo.showWarningNotification("Please select an image file to upload.");
      return;
    }

    if (!this.comingSoonDescription) {
      demo.showWarningNotification("Please provide a description.");
      return;
    }

    if (!this.comingSoonReleaseDate) {
      demo.showWarningNotification("Please provide a release date.");
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const pictureUploadPath = `/Coming Soon/${
      this.comingSoonName
    }/comingSoonPicture`;

    // Upload picture
    this.firebaseStorage
      .uploadPicture(
        pictureUploadPath,
        comingSoonPicture,
        (progress: number) => {
          console.log("Uploading... " + Math.round(progress) + "% done");
          this.progress = Math.round(progress);
        }
      )
      .then(
        (pictureUploadResult: any) => {
          const newComingSoon = new ComingSoon();
          newComingSoon.name = this.comingSoonName;
          newComingSoon.picture = pictureUploadResult.downloadURL;
          newComingSoon.description = this.comingSoonDescription;
          newComingSoon.releaseDate = this.comingSoonReleaseDate;

          // If upload is successful, add to the firestore
          this.comingSoonService.addNewComingSoon(newComingSoon).then(
            (result: any) => {
              this.spinner.hide();
              this.showProgress = false;

              newComingSoon.comingSoonId = result.newComingSoonId;

              this.dialogRef.close({
                isSuccess: true,
                newComingSoon: newComingSoon
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

  updateComingSoonName() {
    if (!this.comingSoonName) {
      demo.showWarningNotification("Please provide a name.");
      return;
    }

    this.comingSoonService
      .editComingSoonName(this.comingSoonId, this.comingSoonName)
      .then(
        (result: any) => {
          this.dialogRef.close({
            isSuccess: true,
            comingSoonNameUpdated: true,
            newComingSoonName: this.comingSoonName
          });
        },
        (error: any) => {
          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }

  updateComingSoonDescription() {
    if (!this.comingSoonDescription) {
      demo.showWarningNotification("Please provide a description.");
      return;
    }

    this.comingSoonService
      .editComingSoonDescription(this.comingSoonId, this.comingSoonDescription)
      .then(
        (result: any) => {
          this.dialogRef.close({
            isSuccess: true,
            comingSoonDescriptionUpdated: true,
            newComingSoonDescription: this.comingSoonDescription
          });
        },
        (error: any) => {
          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }

  updateComingSoonReleaseDate() {
    if (!this.comingSoonReleaseDate) {
      demo.showWarningNotification("Please provide a release date.");
      return;
    }

    this.comingSoonService
      .editComingSoonReleaseDate(this.comingSoonId, this.comingSoonReleaseDate)
      .then(
        (result: any) => {
          this.dialogRef.close({
            isSuccess: true,
            comingSoonReleaseDateUpdated: true,
            newComingSoonReleaseDate: this.comingSoonDescription
          });
        },
        (error: any) => {
          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }

  updateComingSoonPicture() {
    const comingSoonPicture = (<HTMLInputElement>(
      document.getElementById("comingSoonPicture")
    )).files[0];
    if (!comingSoonPicture) {
      demo.showWarningNotification("Please select an image file to upload.");
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const pictureUploadPath = `/Coming Soon/${
      this.comingSoonName
    }/comingSoonPicture`;

    // Upload picture
    this.firebaseStorage
      .uploadPicture(
        pictureUploadPath,
        comingSoonPicture,
        (progress: number) => {
          console.log("Uploading... " + Math.round(progress) + "% done");
          this.progress = Math.round(progress);
        }
      )
      .then(
        (pictureUploadResult: any) => {
          // If upload is successful
          this.comingSoonService
            .editComingSoonPicture(
              this.comingSoonId,
              pictureUploadResult.downloadURL
            )
            .then(
              (result: any) => {
                this.spinner.hide();
                this.showProgress = false;

                this.dialogRef.close({
                  isSuccess: true,
                  comingSoonPictureUpdated: true,
                  newComingSoonPicture: pictureUploadResult.downloadURL
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
