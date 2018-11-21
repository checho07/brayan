import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material";
import { HomeScreenService } from "../../services/Firestore/HomeScreenService/home-screen.service";

import "../../../assets/js/demo.js";
declare var demo: any;

import { HomeScreenGroupEditorComponent } from "../home-screen-group-editor/home-screen-group-editor.component";
import { HomeScreenGroupItemsComponent } from "../home-screen-group-items/home-screen-group-items.component";

import { HomeScreenGroup } from "../../models/HomeScreenGroup";

@Component({
  selector: "app-home-screen",
  templateUrl: "./home-screen.component.html",
  styleUrls: ["./home-screen.component.css"]
})
export class HomeScreenComponent implements OnInit {
  homeScreenGroups: HomeScreenGroup[] = [];

  constructor(
    private homeScreenService: HomeScreenService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getHomeScreenGroups();
  }

  getHomeScreenGroups() {
    this.spinner.show();

    this.homeScreenService.getHomeScreenGroups().then((result: any) => {
      this.homeScreenGroups = result.homeScreenGroups;
      this.spinner.hide();
    });
  }

  addHomeScreenGroup(): void {
    const dialogRef = this.dialog.open(HomeScreenGroupEditorComponent, {
      width: "500px",
      data: {
        isEditMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Add new home screen group
        this.homeScreenGroups.unshift(result.newHomeScreenGroup);
        demo.showSuccessNotification("Home Screen Group successfully added!");
      }
    });
  }

  edit(homeScreenGroup: HomeScreenGroup) {
    const dialogRef = this.dialog.open(HomeScreenGroupEditorComponent, {
      width: "650px",
      data: {
        isEditMode: true,
        homeScreenGroup: homeScreenGroup
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Edit name
        if (result.homeScreenGroupNameUpdated) {
          homeScreenGroup.name = result.newHomeScreenGroupName;
          demo.showSuccessNotification(
            "Home Screen Group name successfully updated!"
          );
        }
      }
    });
  }
  
  delete(homeScreenGroup: HomeScreenGroup) {
    const options = {
      title: "Delete Home Screen Group?",
      text: "Are you sure you want to delete this?",
      icon: "error",
      buttons: ["Cancel", "Ok"],
      dangerMode: true
    };

    swal(options).then(willDelete => {
      if (willDelete) {
        this.spinner.show();

        // Delete
        this.homeScreenService.deleteHomeScreenGroup(homeScreenGroup).then(
          (result: any) => {
            this.removeHomeScreenGroupFromList(homeScreenGroup);
            demo.showSuccessNotification(
              "Home Screen Group successfully deleted!"
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

  removeHomeScreenGroupFromList(homeScreenGroup: HomeScreenGroup) {
    const index = this.homeScreenGroups.indexOf(homeScreenGroup);
    if (index > -1) {
      this.homeScreenGroups.splice(index, 1);
    }
  }

  openHomeScreenGroup(homeScreenGroup: HomeScreenGroup) {
    const dialogRef = this.dialog.open(HomeScreenGroupItemsComponent, {
      data: {
        homeScreenGroup: homeScreenGroup
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
