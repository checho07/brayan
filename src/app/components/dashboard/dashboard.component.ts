import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import * as firebase from "firebase";

import { TvShowsService } from "../../services/Firestore/TvShowsService/tv-shows-service.service";
import { MoviesService } from "../../services/Firestore/MoviesService/movies.service";
import { HomeScreenService } from "../../services/Firestore/HomeScreenService/home-screen.service";
import { CategoriesService } from "../../services/Firestore/CategoriesService/categories.service";
import { ComingSoonService } from "../../services/Firestore/ComingSoonService/coming-soon.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  tvShowsCount: number;
  moviesCount: number;
  homeScreenGroupsCount: number;
  categoriesCount: number;
  comingSoonCount: number;

  constructor(private spinner: NgxSpinnerService,
    private router: Router,
    private tvShowService: TvShowsService,
    private moviesService: MoviesService,
    private homeScreenService: HomeScreenService,
    private categoriesService: CategoriesService,
    private comingSoonService: ComingSoonService) { }

  ngOnInit() {
    this.spinner.show();

    const promises = [
      this.tvShowService.getTvShowsCount(),
      this.moviesService.getMoviesCount(),
      this.homeScreenService.getHomeScreenGroupCount(),
      this.categoriesService.getCategoriesCount(),
      this.comingSoonService.getComingSoonCount()
    ];

    Promise.all(promises).then((values: any) => {
      this.tvShowsCount = values[0].count;
      this.moviesCount = values[1].count;
      this.homeScreenGroupsCount = values[2].count;
      this.categoriesCount = values[3].count;
      this.comingSoonCount = values[4].count;

      this.spinner.hide();
    });
  }
}
