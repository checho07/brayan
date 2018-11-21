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

import { Movie } from "../../models/Movie";
import { MoviesService } from "../../services/Firestore/MoviesService/movies.service";

@Component({
  selector: "app-movies-editor",
  templateUrl: "./movies-editor.component.html",
  styleUrls: ["./movies-editor.component.css"]
})
export class MoviesEditorComponent implements OnInit {
  movieName = "";
  movieId = "";
  moviePicture = "";
  movieYear: number = new Date().getFullYear();
  movieRating = "G";
  movieDescription = "";

  isEditMode = false;
  showProgress = false;
  progress = 0;

  years: number[] = [];
  ratings: string[] = [];

  constructor(
    private moviesService: MoviesService,
    private firebaseStorage: FirebaseStorageService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<MoviesEditorComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.isEditMode = data.isEditMode;

    if (this.isEditMode) {
      this.movieId = data.movie.movieId;
      this.movieName = data.movie.name;
      this.moviePicture = data.movie.picture;
      this.movieYear = data.movie.releaseYear;
      this.movieRating = data.movie.rating;
      this.movieDescription = data.movie.description;
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

  addNewMovie() {
    if (!this.movieName) {
      demo.showWarningNotification("Please provide a name for the movie.");
      return;
    }

    const homeScreenPicture = (<HTMLInputElement>(
      document.getElementById("homeScreenPicture")
    )).files[0];
    if (!homeScreenPicture) {
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

    if (!this.movieDescription) {
      demo.showWarningNotification(
        "Please provide a description for the movie."
      );
      return;
    }

    const movie = (<HTMLInputElement>document.getElementById("movie")).files[0];
    if (!movie) {
      demo.showWarningNotification("Please select a video file to upload.");
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const homeScreenpictureUploadPath = `/Movies/${
      this.movieName
    }/homeScreenPicture`;

    // Upload movie picture
    this.firebaseStorage
      .uploadPicture(
        homeScreenpictureUploadPath,
        homeScreenPicture,
        (progress: number) => {
          console.log("Uploading... " + Math.round(progress) + "% done");
          this.progress = Math.round(progress);
        }
      )
      .then((homeScreenPictureUploadResult: any) => {
        this.progress = 0;
        const detailsPictureUploadPath = `/Movies/${
          this.movieName
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
              const videoUploadPath = `/Movies/${this.movieName}/movieVideo`;

              this.firebaseStorage
                .uploadVideo(
                  videoUploadPath,
                  this.movieName,
                  homeScreenPictureUploadResult.downloadURL,
                  movie
                )
                .then((uploadResult: any) => {
                  uploadResult.uploadTask.then(snapshot => {
                    if (snapshot.state !== "success") {
                      demo.showErrorNotification("An error occured.");
                      return;
                    }

                    snapshot.ref.getDownloadURL().then(videoDownloadURL => {
                      const newMovie = new Movie();
                      newMovie.name = this.movieName;
                      newMovie.picture =
                        homeScreenPictureUploadResult.downloadURL;
                      newMovie.detailsPicture =
                        detailsPictureUploadResult.downloadURL;
                      newMovie.releaseYear = this.movieYear;
                      newMovie.rating = this.movieRating;
                      newMovie.description = this.movieDescription;
                      newMovie.videoUrl = videoDownloadURL;

                      // If upload is successful, add the movie to the firestore
                      this.moviesService.addNewMovie(newMovie).then(
                        (result: any) => {
                          this.spinner.hide();
                          this.showProgress = false;

                          newMovie.movieId = result.newMovieId;
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
      });
  }

  updateMovieName() {
    if (!this.movieName) {
      demo.showWarningNotification("Please provide a name for the movie.");
      return;
    }

    this.moviesService.editMovieName(this.movieId, this.movieName).then(
      (result: any) => {
        this.dialogRef.close({
          isSuccess: true,
          movieNameUpdated: true,
          newMovieName: this.movieName
        });
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  updateHomeScreenPicture() {
    const homeScreenPicture = (<HTMLInputElement>(
      document.getElementById("homeScreenPicture")
    )).files[0];
    if (!homeScreenPicture) {
      demo.showWarningNotification("Please select an image file to upload.");
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const uploadPath = `/Movies/${this.movieName}/homeScreenPicture`;

    // Update movie picture
    this.firebaseStorage
      .uploadPicture(uploadPath, homeScreenPicture, (progress: number) => {
        console.log("Uploading... " + Math.round(progress) + "% done");
        this.progress = Math.round(progress);
      })
      .then(
        (uploadResult: any) => {
          // If upload is successful, edit the movie picture
          this.moviesService
            .editHomeScreenPicture(this.movieId, uploadResult.downloadURL)
            .then(
              (result: any) => {
                this.spinner.hide();
                this.showProgress = false;

                this.dialogRef.close({
                  isSuccess: true,
                  moviePictureUpdated: true,
                  newMoviePicture: uploadResult.downloadURL
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
      demo.showWarningNotification(
        "Please select a details image file to upload."
      );
      return;
    }

    this.spinner.show();
    this.showProgress = true;

    const detailsPictureUploadPath = `/Movies/${this.movieName}/detailsPicture`;

    // Update movie picture
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
          // If upload is successful, edit the movie picture
          this.moviesService
            .editDetailsPicture(
              this.movieId,
              detailsPictureUploadResult.downloadURL
            )
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

  updateMovieReleaseYear() {
    this.moviesService.editMovieReleaseYear(this.movieId, this.movieYear).then(
      (result: any) => {
        this.dialogRef.close({
          isSuccess: true,
          movieYearUpdated: true,
          newMovieYear: this.movieYear
        });
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  updateMovieRating() {
    this.moviesService.editMovieRating(this.movieId, this.movieRating).then(
      (result: any) => {
        this.dialogRef.close({
          isSuccess: true,
          movieRatingUpdated: true,
          newMovieRating: this.movieRating
        });
      },
      (error: any) => {
        demo.showErrorNotification("An error occured: " + error);
      }
    );
  }

  updateMovieDescription() {
    this.moviesService
      .editMovieDescription(this.movieId, this.movieDescription)
      .then(
        (result: any) => {
          this.dialogRef.close({
            isSuccess: true,
            movieDescriptionUpdated: true,
            newMovieDescription: this.movieDescription
          });
        },
        (error: any) => {
          demo.showErrorNotification("An error occured: " + error);
        }
      );
  }

  updateMovieVideo() {
    const movie = (<HTMLInputElement>document.getElementById("movie")).files[0];
    if (!movie) {
      demo.showWarningNotification("Please select a video file to upload.");
      return;
    }

    const videoUploadPath = `/Movies/${this.movieName}/movieVideo`;

    this.firebaseStorage
      .uploadVideo(videoUploadPath, this.movieName, this.moviePicture, movie)
      .then((uploadResult: any) => {
        uploadResult.uploadTask.then(snapshot => {
          if (snapshot.state !== "success") {
            demo.showErrorNotification("An error occured.");
            return;
          }

          snapshot.ref.getDownloadURL().then(videoDownloadURL => {
            // If upload is successful, edit the movie video
            this.moviesService.editMovieVideo(this.movieId, videoDownloadURL).then(
              (result: any) => {
                this.spinner.hide();
                this.showProgress = false;
              },
              (error: any) => {
                this.spinner.hide();
                this.showProgress = false;

                demo.showErrorNotification("An error occured: " + error);
              }
            );
          });
        });
      });

    this.spinner.hide();
    this.dialogRef.close();
  }

  closeEditor() {
    this.dialogRef.close({
      isSuccess: false
    });
  }
}
