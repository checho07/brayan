import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { NgxSpinnerService } from "ngx-spinner";
import { HomeScreenService } from "../../services/Firestore/HomeScreenService/home-screen.service.js";

import "../../../assets/js/demo.js";
declare var demo: any;

import { HomeScreenGroup } from "../../models/HomeScreenGroup.js";

@Component({
  selector: "app-home-screen-group-editor",
  templateUrl: "./home-screen-group-editor.component.html",
  styleUrls: ["./home-screen-group-editor.component.css"]
})
export class HomeScreenGroupEditorComponent implements OnInit {
  homeScreenGroupName = "";
  homeScreenGroupId = "";
  isEditMode = false;

  constructor(
    private homeScreenService: HomeScreenService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<HomeScreenGroupEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data.isEditMode;

    if (this.isEditMode) {
      this.homeScreenGroupName = data.homeScreenGroup.name;
      this.homeScreenGroupId = data.homeScreenGroup.groupId;
    }
  }

  ngOnInit() {}

  addNewHomeScreenGroup() {
    if (!this.homeScreenGroupName) {
      demo.showWarningNotification(
        "Please provide a name for the home screen group."
      );
      return;
    }

    this.spinner.show();

    const newHomeScreenGroup = new HomeScreenGroup();
    newHomeScreenGroup.name = this.homeScreenGroupName;

    this.homeScreenService.addNewHomeScreenGroup(newHomeScreenGroup).then(
      (result: any) => {
        this.spinner.hide();

        newHomeScreenGroup.groupId = result.newHomeScreenGroupId;

        this.dialogRef.close({
          isSuccess: true,
          newHomeScreenGroup: newHomeScreenGroup
        });
      },
      (error: any) => {
        this.spinner.hide();
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  updateHomeScreenGroupName() {
    if (!this.homeScreenGroupName) {
      demo.showWarningNotification(
        "Please provide a name for the home screen group."
      );
      return;
    }

    console.log(this.homeScreenGroupId);

    this.homeScreenService
      .editHomeScreenGroupName(this.homeScreenGroupId, this.homeScreenGroupName)
      .then(
        (result: any) => {
          this.dialogRef.close({
            isSuccess: true,
            homeScreenGroupNameUpdated: true,
            newHomeScreenGroupName: this.homeScreenGroupName
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
