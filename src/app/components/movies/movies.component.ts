import { Component, OnInit, Input } from "@angular/core";

import { MoviesService } from "../../services/Firestore/MoviesService/movies.service";
import { FirebaseStorageService } from "../../services/FirebaseStorage/firebase-storage.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CategoriesService } from "../../services/Firestore/CategoriesService/categories.service";
import { HomeScreenService } from "../../services/Firestore/HomeScreenService/home-screen.service";

import { MatDialog } from "@angular/material";
import swal from "sweetalert";
declare var demo: any;

import { MoviesEditorComponent } from "../movies-editor/movies-editor.component";
import { MoviePlayerComponent } from "../movie-player/movie-player.component";

import { Movie } from "../../models/Movie";
import { Category } from "../../models/Category";
import { HomeScreenGroup } from "../../models/HomeScreenGroup";

@Component({
  selector: "app-movies",
  templateUrl: "./movies.component.html",
  styleUrls: ["./movies.component.css"]
})
export class MoviesComponent implements OnInit {
  @Input()
  isCategoryEditing = false;
  @Input()
  category: Category;
  @Input()
  categoryMovies: Movie[];

  @Input()
  isHomeScreenGroupEditing = false;
  @Input()
  homeScreenGroup: HomeScreenGroup;
  @Input()
  homeScreenGroupMovies: Movie[];

  movies: Movie[] = [];
  originalMovies: Movie[];

  public isSearching = false;

  constructor(
    private moviesService: MoviesService,
    private categoriesService: CategoriesService,
    private homeScreenService: HomeScreenService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getMovies();

    if (!this.isCategoryEditing && !this.isHomeScreenGroupEditing) {
      this.listenForSearchInput(500);
    }
  }

  getMovies(): void {
    this.spinner.show();

    this.moviesService.getMovies().then((result: any) => {
      this.movies = result.movies;
      this.originalMovies = this.movies;

      this.movies.forEach(movie => {
        if (this.isCategoryEditing) {
          this.checkIfCategoryMovie(movie);
        }
        else if (this.isHomeScreenGroupEditing) {
          this.checkIfHomeScreenGroupMovie(movie);
        }
      });

      this.spinner.hide();
    });
  }

  checkIfCategoryMovie(movie: Movie) {
    if (this.categoryMovies) {
      const categoryMovie = this.categoryMovies.find(
        x => x.movieId === movie.movieId
      );

      if (categoryMovie) {
        movie.isPartOfCategory = true;
        movie.categoryMovieId = categoryMovie.categoryMovieId;
      }
    }
  }

  checkIfHomeScreenGroupMovie(movie: Movie) {
    if (this.homeScreenGroupMovies) {
      const homeScreenGroupMovie = this.homeScreenGroupMovies.find(
        x => x.movieId === movie.movieId
      );

      if (homeScreenGroupMovie) {
        movie.isPartOfHomeScreenGroup = true;
        movie.homeScreenGroupMovieId = homeScreenGroupMovie.homeScreenGroupMovieId;
      }
    }
  }

  addNewMovie(): void {
    const dialogRef = this.dialog.open(MoviesEditorComponent, {
      width: "500px",
      data: {
        isEditMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Add new movie
        this.movies.unshift(result.newMovie);
        demo.showSuccessNotification("Movie successfully added!");
      }
    });
  }

  edit(movie: Movie) {
    const dialogRef = this.dialog.open(MoviesEditorComponent, {
      width: "650px",
      data: {
        isEditMode: true,
        movie: movie
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.isSuccess) {
        // Edit name
        if (result.movieNameUpdated) {
          movie.name = result.newMovieName;
          demo.showSuccessNotification("Movie name successfully updated!");
        }

        // Edit home screen picture
        else if (result.moviePictureUpdated) {
          movie.picture = result.newMoviePicture;
          demo.showSuccessNotification("Home screen picture successfully updated!");
        }        
        
        // Edit details picture
        else if (result.detailsPictureUpdated) {
          movie.detailsPicture = result.newDetailsPicture;
          demo.showSuccessNotification("Details picture successfully updated!");
        }

        // Edit release year
        else if (result.movieYearUpdated) {
          movie.releaseYear = result.newMovieYear;
          demo.showSuccessNotification(
            "Movie release year successfully updated!"
          );
        }

        // Edit rating
        else if (result.movieRatingUpdated) {
          movie.rating = result.newMovieRating;
          demo.showSuccessNotification(
            "Movie rating year successfully updated!"
          );
        }

        // Edit description
        else if (result.movieDescriptionUpdated) {
          movie.description = result.newMovieDescription;
          demo.showSuccessNotification(
            "Movie description successfully updated!"
          );
        }
      }
    });
  }

  delete(movie: Movie) {
    const options = {
      title: "Delete Movie?",
      text: "Are you sure you want to delete this Movie?",
      icon: "error",
      buttons: ["Cancel", "Ok"],
      dangerMode: true
    };

    swal(options).then(willDelete => {
      if (willDelete) {
        this.spinner.show();

        // Delete movie
        this.moviesService.deleteMovie(movie).then(
          (result: any) => {
            this.removeMovieFromList(movie);
            demo.showSuccessNotification("Movie successfully deleted!");

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

  removeMovieFromList(movie: Movie) {
    const index = this.movies.indexOf(movie);
    if (index > -1) {
      this.movies.splice(index, 1);
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
        this.searchMovies(searchInput.value);
      }, timeoutTime);
    };
  }

  searchMovies(searchValue: string) {
    this.isSearching = true;

    if (searchValue !== "" && searchValue.length >= 3) {
      this.spinner.show();

      this.movies = [];

      this.moviesService.getMovies().then((result: any) => {
        result.movies.forEach(movie => {
          if (
            movie.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
          ) {
            this.movies.push(movie);
          }
        });

        this.spinner.hide();
      });
    } else if (searchValue === "") {
      this.clearSearchInput();
    }
  }

  clearSearchInput() {
    this.movies = this.originalMovies;
    this.isSearching = false;

    const searchInput = <HTMLInputElement>(
      document.getElementById("searchInput")
    );
    searchInput.value = "";
  }

  preview(movie: Movie) {
    const dialogRef = this.dialog.open(MoviePlayerComponent, {
      width: "550px",
      height: "450px",
      data: {
        movie: movie
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  addMovieToCategory(movie: Movie) {
    this.categoriesService.addMovieToCategory(movie, this.category).then(
      (result: any) => {
        movie.categoryMovieId = result.newCategoryMovieId;
        movie.isPartOfCategory = true;
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  removeMovieFromCategory(movie: Movie) {
    this.categoriesService.removeMovieFromCategory(movie, this.category).then(
      (result: any) => {
        movie.isPartOfCategory = false;
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  addMovieToHomeScreenGroup(movie: Movie) {
    this.homeScreenService.addMovieToHomeScreenGroup(movie, this.homeScreenGroup).then(
      (result: any) => {
        movie.homeScreenGroupMovieId = result.newHomeScreenGroupMovieId;
        movie.isPartOfHomeScreenGroup = true;
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  removeMovieFromHomeScreenGroup(movie: Movie) {
    this.homeScreenService.removeMovieFromHomeScreenGroup(movie, this.homeScreenGroup).then(
      (result: any) => {
        movie.isPartOfHomeScreenGroup = false;
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }
}
