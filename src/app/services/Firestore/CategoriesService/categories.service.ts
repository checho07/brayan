import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { CategoriesHelper } from "../../../models/CategoriesHelper";
import { Category } from "../../../models/Category";
import { Movie } from "../../../models/Movie";
import { TvShow } from "../../../models/TvShow";

@Injectable({
  providedIn: "root"
}) 
export class CategoriesService {
  constructor() {}

  getCategoriesCount() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("cursos")
        .get()
        .then(categoriesSnapshot => {
          resolve({ count: categoriesSnapshot.size });
        });
    });

    return promise;
  }

  initialiseCategories() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      CategoriesHelper.categories.forEach(category => {
        db.collection("categories")
          .add({
            name: category.name
          })
          .then(function(ref) {
            resolve();
          })
          .catch(function(error) {
            reject(error);
          });

        resolve();
      });
    });

    return promise;
  }

  getCategories() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("cursos")
        .get()
        .then(categoriesSnapshot => {
          const categories = [];

          categoriesSnapshot.forEach(doc => {
            const category = new Category(doc.data().name);
            category.categoryId = doc.id;

            categories.push(category);
          });

          resolve({ categories: categories });
        });
    });

    return promise;
  }

  addMovieToCategory(movie: Movie, category: Category) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("categories")
        .doc(category.categoryId)
        .collection("movies")
        .add({
          movieId: movie.movieId,
          name: movie.name,
          picture: movie.picture,
          releaseYear: movie.releaseYear,
          rating: movie.rating,
          description: movie.description,
          videoUrl: movie.videoUrl,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newCategoryMovieId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  addTvShowToCategory(tvShow: TvShow, category: Category) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("categories")
        .doc(category.categoryId)
        .collection("tvShows")
        .add({
          tvShowId: tvShow.tvShowId,
          name: tvShow.name,
          picture: tvShow.picture,
          releaseYear: tvShow.releaseYear,
          rating: tvShow.rating,
          description: tvShow.description,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newCategoryTvShowId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  removeMovieFromCategory(movie: Movie, category: Category) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("categories")
        .doc(category.categoryId)
        .collection("movies")
        .doc(movie.categoryMovieId)
        .delete()
        .then(function(ref) {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  removeTvShowFromCategory(tvShow: TvShow, category: Category) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("categories")
        .doc(category.categoryId)
        .collection("tvShows")
        .doc(tvShow.categoryTvShowId)
        .delete()
        .then(function(ref) {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  getCategoryMovies(category: Category) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("categories")
        .doc(category.categoryId)
        .collection("movies")
        .get()
        .then(categoryMoviesSnapshot => {
          const categoryMovies = [];

          categoryMoviesSnapshot.forEach(doc => {
            const movie = new Movie();

            movie.categoryMovieId = doc.id;
            movie.movieId = doc.data().movieId;
            movie.name = doc.data().name;
            movie.picture = doc.data().picture;
            movie.releaseYear = doc.data().releaseYear;
            movie.rating = doc.data().rating;
            movie.description = doc.data().description;
            movie.videoUrl = doc.data().videoUrl;

            categoryMovies.push(movie);
          });

          resolve({ categoryMovies: categoryMovies });
        });
    });

    return promise;
  }

  getCategoryTvShows(category: Category) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("categories")
        .doc(category.categoryId)
        .collection("tvShows")
        .get()
        .then(categoryTvShowsSnapshot => {
          const categoryTvShows = [];

          categoryTvShowsSnapshot.forEach(doc => {
            const tvShow = new TvShow();

            tvShow.categoryTvShowId = doc.id;
            tvShow.tvShowId = doc.data().tvShowId;
            tvShow.name = doc.data().name;
            tvShow.picture = doc.data().picture;
            tvShow.releaseYear = doc.data().releaseYear;
            tvShow.rating = doc.data().rating;
            tvShow.description = doc.data().description;

            categoryTvShows.push(tvShow);
          });

          resolve({ categoryTvShows: categoryTvShows });
        });
    });

    return promise;
  }
}
