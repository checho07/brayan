import { Component, OnInit, Inject } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MAT_DIALOG_DATA } from "@angular/material";

import { HomeScreenService } from "../../services/Firestore/HomeScreenService/home-screen.service";
import { NgxSpinnerService } from "ngx-spinner";

import { HomeScreenGroup } from "../../models/HomeScreenGroup";
import { Movie } from "../../models/Movie";
import { TvShow } from "../../models/TvShow";

@Component({
  selector: "app-home-screen-group-items",
  templateUrl: "./home-screen-group-items.component.html",
  styleUrls: ["./home-screen-group-items.component.css"]
})
export class HomeScreenGroupItemsComponent implements OnInit {
  isHomeScreenGroupEditing = false;
  homeScreenGroup: HomeScreenGroup;
  homeScreenGroupMovies: Movie[] = [];
  homeScreenGroupTvShows: TvShow[] = [];

  constructor(
    private homeScreenService: HomeScreenService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService
  ) {
    this.homeScreenGroup = data.homeScreenGroup;
  }
  ngOnInit() {
    this.isHomeScreenGroupEditing = true;
    this.getHomeScreenGroupMovies();
    this.getHomeScreenGroupTvShows();
  }

  getHomeScreenGroupMovies() {
    this.spinner.show();

    this.homeScreenService
      .getHomeScreenGroupMovies(this.homeScreenGroup)
      .then((result: any) => {
        this.homeScreenGroupMovies = result.homeScreenGroupMovies;
        console.log(this.homeScreenGroupMovies);
        
        this.spinner.hide();
      });
  }

  getHomeScreenGroupTvShows() {
    this.spinner.show();

    this.homeScreenService
      .getHomeScreenGroupTvShows(this.homeScreenGroup)
      .then((result: any) => {
        this.homeScreenGroupTvShows = result.homeScreenGroupTvShows;
        this.spinner.hide();
      });
  }
}
