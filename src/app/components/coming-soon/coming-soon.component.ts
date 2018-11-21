import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { ComingSoonService } from "../../services/Firestore/ComingSoonService/coming-soon.service";
import { ComingSoon } from "../../models/ComingSoon";
import { ComingSoonEditorComponent } from "../coming-soon-editor/coming-soon-editor.component";

import "../../../assets/js/demo.js";
declare var demo: any;

@Component({
  selector: "app-coming-soon",
  templateUrl: "./coming-soon.component.html",
  styleUrls: ["./coming-soon.component.css"]
})
export class ComingSoonComponent implements OnInit {
  comingSoonList: ComingSoon[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private comingSoonService: ComingSoonService
  ) {}

  ngOnInit() {
    this.getComingSoon();
  }

  getComingSoon(): void {
    this.spinner.show();

    this.comingSoonService.getComingSoon().then((result: any) => {
      this.comingSoonList = result.comingSoonList;
      this.spinner.hide();
    });
  }

  addNewComingSoon() {
    const dialogRef = this.dialog.open(ComingSoonEditorComponent, {
      width: "500px",
      data: {
        isEditMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Add new coming soon
        this.comingSoonList.unshift(result.newComingSoon);
        demo.showSuccessNotification("Coming Soon successfully added!");
      }
    });
  }

  edit(comingSoon: ComingSoon) {
    const dialogRef = this.dialog.open(ComingSoonEditorComponent, {
      width: "650px",
      data: {
        isEditMode: true,
        comingSoon: comingSoon
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Edit name
        if (result.comingSoonNameUpdated) {
          comingSoon.name = result.newComingSoonName;
          demo.showSuccessNotification(
            "Coming soon name successfully updated!"
          );
        }

        // Edit picture
        else if (result.comingSoonPictureUpdated) {
          comingSoon.picture = result.newComingSoonPicture;
          demo.showSuccessNotification(
            "Coming soon picture successfully updated!"
          );
        }

        // Edit description
        else if (result.comingSoonDescriptionUpdated) {
          comingSoon.description = result.newComingSoonDescription;
          demo.showSuccessNotification(
            "Coming soon description successfully updated!"
          );
        }

        // Edit release date
        else if (result.comingSoonReleaseDateUpdated) {
          comingSoon.releaseDate = result.newComingSoonReleaseDate;
          demo.showSuccessNotification(
            "Coming soon release date successfully updated!"
          );
        }
      }
    });
  }

  delete(comingSoon: ComingSoon) {
    const options = {
      title: "Delete?",
      text: "Are you sure you want to delete this?",
      icon: "error",
      buttons: ["Cancel", "Ok"],
      dangerMode: true
    };

    swal(options).then(willDelete => {
      if (willDelete) {
        this.spinner.show();

        // Delete
        this.comingSoonService.deleteComingSoon(comingSoon).then(
          (result: any) => {
            this.removeComingSoonFromList(comingSoon);
            demo.showSuccessNotification("Successfully deleted!");

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

  removeComingSoonFromList(comingSoon: ComingSoon) {
    const index = this.comingSoonList.indexOf(comingSoon);
    if (index > -1) {
      this.comingSoonList.splice(index, 1);
    }
  }
}
