import { Component, OnInit, Input } from "@angular/core";

import { FirebaseStorageService } from "../../services/FirebaseStorage/firebase-storage.service";
import { TvShowsService } from "../../services/Firestore/TvShowsService/tv-shows-service.service";
import { CategoriesService } from "../../services/Firestore/CategoriesService/categories.service";
import { HomeScreenService } from "../../services/Firestore/HomeScreenService/home-screen.service";
import { NgxSpinnerService } from "ngx-spinner";

import { MatDialog } from "@angular/material/dialog";
import "../../../assets/js/demo.js";
import swal from "sweetalert";
declare var demo: any;

import { TvShowEditorComponent } from "../tv-show-editor/tv-show-editor.component";
import { TvShowSeasonsComponent } from "../tv-show-seasons/tv-show-seasons.component";

import { TvShow } from "../../models/TvShow";
import { Category } from "../../models/Category";
import { HomeScreenGroup } from "../../models/HomeScreenGroup";

@Component({
  selector: "app-tv-shows",
  templateUrl: "./tv-shows.component.html",
  styleUrls: ["./tv-shows.component.css"]
})
export class TvShowsComponent implements OnInit {
  @Input()
  isCategoryEditing = false;
  @Input()
  category: Category;
  @Input()
  categoryTvShows: TvShow[];

  @Input()
  isHomeScreenGroupEditing = false;
  @Input()
  homeScreenGroup: HomeScreenGroup;
  @Input()
  homeScreenGroupTvShows: TvShow[];

  tvShows: TvShow[] = [];
  originalTvShows: TvShow[];

  public isSearching = false;

  constructor(
    private tvShowsService: TvShowsService,
    private categoriesService: CategoriesService,
    private homeScreenService: HomeScreenService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getTvShows();

    if (!this.isCategoryEditing && !this.isHomeScreenGroupEditing) {
      this.listenForSearchInput(500);
    }
  }

  getTvShows(): void {
    this.spinner.show();

    this.tvShowsService.getTvShows().then((result: any) => {
      this.tvShows = result.tvShows;
      this.originalTvShows = this.tvShows;

      this.tvShows.forEach(tvShow => {
        if (this.isCategoryEditing) {
          this.checkIfCategoryTvShow(tvShow);
        } else if (this.isHomeScreenGroupEditing) {
          this.checkIfHomeScreenGroupTvShow(tvShow);
        }
      });

      this.spinner.hide();
    });
  }

  checkIfCategoryTvShow(tvShow: TvShow) {
    if (this.categoryTvShows) {
      const categoryTvShow = this.categoryTvShows.find(
        x => x.tvShowId === tvShow.tvShowId
      );

      if (categoryTvShow) {
        tvShow.isPartOfCategory = true;
        tvShow.categoryTvShowId = categoryTvShow.categoryTvShowId;
      }
    }
  }

  checkIfHomeScreenGroupTvShow(tvShow: TvShow) {
    if (this.homeScreenGroupTvShows) {
      const homeScreenGroupTvShow = this.homeScreenGroupTvShows.find(
        x => x.tvShowId === tvShow.tvShowId
      );

      if (homeScreenGroupTvShow) {
        tvShow.isPartOfHomeScreenGroup = true;
        tvShow.homeScreenGroupTvShowId =
          homeScreenGroupTvShow.homeScreenGroupTvShowId;
      }
    }
  }

  addNewTvShow(): void {
    const dialogRef = this.dialog.open(TvShowEditorComponent, {
      width: "500px",
      data: {
        isEditMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Add new tv show
        this.tvShows.unshift(result.newTvShow);
        demo.showSuccessNotification("TV show successfully added!");
      }
    });
  }

  edit(tvShow: TvShow) {
    const dialogRef = this.dialog.open(TvShowEditorComponent, {
      width: "650px",
      data: {
        isEditMode: true,
        tvShow: tvShow
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Edit name
        if (result.tvShowNameUpdated) {
          tvShow.name = result.newTvShowName;
          demo.showSuccessNotification("TV show name successfully updated!");
        }

        // Edit home screen picture
        else if (result.tvShowPictureUpdated) {
          tvShow.picture = result.newTvShowPicture;
          demo.showSuccessNotification("TV show home screen picture successfully updated!");
        }

        // Edit details picture
        else if (result.detailsPictureUpdated) {
          tvShow.detailsPicture = result.newDetailsPicture;
          demo.showSuccessNotification("TV show picture details successfully updated!");
        }

        // Edit release year
        else if (result.tvShowYearUpdated) {
          tvShow.releaseYear = result.newTvShowYear;
          demo.showSuccessNotification(
            "TV show release year successfully updated!"
          );
        }

        // Edit rating
        else if (result.tvShowRatingUpdated) {
          tvShow.rating = result.newTvShowRating;
          demo.showSuccessNotification(
            "TV show rating year successfully updated!"
          );
        }

        // Edit description
        else if (result.tvShowDescriptionUpdated) {
          tvShow.description = result.newTvShowDescription;
          demo.showSuccessNotification(
            "TV show description successfully updated!"
          );
        }
      }
    });
  }

  delete(tvShow: TvShow) {
    const options = {
      title: "Delete TV Show?",
      text:
        "Are you sure you want to delete this TV Show? All associated seasons and episodes will also be deleted.",
      icon: "error",
      buttons: ["Cancel", "Ok"],
      dangerMode: true
    };

    swal(options).then(willDelete => {
      if (willDelete) {
        this.spinner.show();

        // Delete artist
        this.tvShowsService.deleteTvShow(tvShow).then(
          (result: any) => {
            this.removeTvShowFromList(tvShow);
            demo.showSuccessNotification("TV Show successfully deleted!");

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

  removeTvShowFromList(tvShow: TvShow) {
    const index = this.tvShows.indexOf(tvShow);
    if (index > -1) {
      this.tvShows.splice(index, 1);
    }
  }

  listenForSearchInput(timeoutTime: number): any {
    const searchInput = <HTMLInputElement>(
      document.getElementById("searchInput")
    );
    let timeout = null;

    searchInput.onkeyup = e => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        this.searchTvShows(searchInput.value);
      }, timeoutTime);
    };
  }

  searchTvShows(searchValue: string) {
    this.isSearching = true;

    if (searchValue !== "" && searchValue.length >= 3) {
      this.spinner.show();

      this.tvShows = [];

      this.tvShowsService.getTvShows().then((result: any) => {
        result.tvShows.forEach(tvShow => {
          if (
            tvShow.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
          ) {
            this.tvShows.push(tvShow);
          }
        });

        this.spinner.hide();
      });
    } else if (searchValue === "") {
      this.clearSearchInput();
    }
  }

  clearSearchInput() {
    this.tvShows = this.originalTvShows;
    this.isSearching = false;

    const searchInput = <HTMLInputElement>(
      document.getElementById("searchInput")
    );
    searchInput.value = "";
  }

  viewSeasons(tvShow: TvShow) {
    const dialogRef = this.dialog.open(TvShowSeasonsComponent, {
      minHeight: "200px",
      minWidth: "600px",
      data: {
        tvShow: tvShow
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  addTvShowToCategory(tvShow: TvShow) {
    this.categoriesService.addTvShowToCategory(tvShow, this.category).then(
      (result: any) => {
        tvShow.categoryTvShowId = result.newCategoryTvShowId;
        tvShow.isPartOfCategory = true;
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  removeTvShowFromCategory(tvShow: TvShow) {
    this.categoriesService.removeTvShowFromCategory(tvShow, this.category).then(
      (result: any) => {
        tvShow.isPartOfCategory = false;
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  addTvShowToHomeScreenGroup(tvShow: TvShow) {
    this.homeScreenService
      .addTvShowToHomeScreenGroup(tvShow, this.homeScreenGroup)
      .then(
        (result: any) => {
          tvShow.homeScreenGroupTvShowId = result.newHomeScreenGroupTvShowId;
          tvShow.isPartOfHomeScreenGroup = true;
        },
        (error: any) => {
          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }

  removeTvShowFromHomeScreenGroup(tvShow: TvShow) {
    this.homeScreenService
      .removeTvShowFromHomeScreenGroup(tvShow, this.homeScreenGroup)
      .then(
        (result: any) => {
          tvShow.isPartOfHomeScreenGroup = false;
        },
        (error: any) => {
          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }
}
