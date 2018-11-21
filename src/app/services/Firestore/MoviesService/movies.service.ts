import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { Movie } from "../../../models/Movie";

@Injectable({
  providedIn: "root"
})
export class MoviesService {
  constructor() {}

  getMoviesCount() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .get()
        .then(moviesSnapshot => {
          resolve({ count: moviesSnapshot.size });
        });
    });

    return promise;
  }

  getMovies() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .orderBy("addedAt", "desc")
        .get()
        .then(moviesSnapshot => {
          const movies = [];

          moviesSnapshot.forEach(doc => {
            const movie = new Movie();

            movie.movieId = doc.id;
            movie.name = doc.data().name;
            movie.picture = doc.data().picture;
            movie.detailsPicture = doc.data().detailsPicture;
            movie.releaseYear = doc.data().releaseYear;
            movie.rating = doc.data().rating;
            movie.description = doc.data().description;
            movie.videoUrl = doc.data().videoUrl;

            movies.push(movie);
          });

          resolve({ movies: movies });
        });
    });

    return promise;
  }

  deleteMovie(movie: Movie) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .doc(movie.movieId)
        .delete()
        .then(() => {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  addNewMovie(newMovie: Movie) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .add({
          name: newMovie.name,
          picture: newMovie.picture,
          detailsPicture: newMovie.detailsPicture,
          releaseYear: newMovie.releaseYear,
          rating: newMovie.rating,
          description: newMovie.description,
          videoUrl: newMovie.videoUrl,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newMovieId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editMovieName(movieId: string, movieName: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .doc(movieId)
        .set(
          {
            name: movieName
          },
          { merge: true }
        )
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editHomeScreenPicture(movieId: string, moviePicture: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .doc(movieId)
        .set(
          {
            picture: moviePicture
          },
          { merge: true }
        )
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editDetailsPicture(movieId: string, detailsPicture: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .doc(movieId)
        .set(
          {
            detailsPicture: detailsPicture
          },
          { merge: true }
        )
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editMovieReleaseYear(movieId: string, movieYear: number) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .doc(movieId)
        .set(
          {
            releaseYear: movieYear
          },
          { merge: true }
        )
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editMovieRating(movieId: string, movieRating: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .doc(movieId)
        .set(
          {
            rating: movieRating
          },
          { merge: true }
        )
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editMovieDescription(movieId: string, movieDescription: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .doc(movieId)
        .set(
          {
            description: movieDescription
          },
          { merge: true }
        )
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editMovieVideo(movieId: string, movieVideoUrl: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("movies")
        .doc(movieId)
        .set(
          {
            videoUrl: movieVideoUrl
          },
          { merge: true }
        )
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }
}
