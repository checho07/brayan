import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { HomeScreenGroup } from "../../../models/HomeScreenGroup";
import { Movie } from "../../../models/Movie";
import { TvShow } from "../../../models/TvShow";

@Injectable({
  providedIn: "root"
})
export class HomeScreenService {
  constructor() {}

  getHomeScreenGroupCount() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .get()
        .then(homeScreenGroupsSnapshot => {
          resolve({ count: homeScreenGroupsSnapshot.size });
        });
    });

    return promise;
  }

  getHomeScreenGroups() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .get()
        .then(homeScreenGroupsSnapshot => {
          const homeScreenGroups = [];

          homeScreenGroupsSnapshot.forEach(doc => {
            const group = new HomeScreenGroup();

            group.groupId = doc.id;
            group.name = doc.data().name;

            homeScreenGroups.push(group);
          });

          resolve({ homeScreenGroups: homeScreenGroups });
        });
    });

    return promise;
  }

  addNewHomeScreenGroup(newHomeScreenGroup: HomeScreenGroup) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .add({
          name: newHomeScreenGroup.name,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newHomeScreenGroupId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editHomeScreenGroupName(
    homeScreenGroupId: string,
    homeScreenGroupName: string
  ) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .doc(homeScreenGroupId)
        .set(
          {
            name: homeScreenGroupName
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

  deleteHomeScreenGroup(homeScreenGroup: HomeScreenGroup) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .doc(homeScreenGroup.groupId)
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

  getHomeScreenGroupMovies(homeScreenGroup: HomeScreenGroup): any {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .doc(homeScreenGroup.groupId)
        .collection("movies")
        .get()
        .then(homeScreenGroupsMoviesSnapshot => {
          const homeScreenGroupMovies = [];

          homeScreenGroupsMoviesSnapshot.forEach(doc => {
            const movie = new Movie();

            movie.homeScreenGroupMovieId = doc.id;
            movie.movieId = doc.data().movieId;
            movie.name = doc.data().name;
            movie.picture = doc.data().picture;
            movie.releaseYear = doc.data().releaseYear;
            movie.rating = doc.data().rating;
            movie.description = doc.data().description;
            movie.videoUrl = doc.data().videoUrl;

            homeScreenGroupMovies.push(movie);
          });

          resolve({ homeScreenGroupMovies: homeScreenGroupMovies });
        });
    });

    return promise;
  }

  getHomeScreenGroupTvShows(homeScreenGroup: HomeScreenGroup): any {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .doc(homeScreenGroup.groupId)
        .collection("tvShows")
        .get()
        .then(homeScreenGroupTvShowsSnapshot => {
          const homeScreenGroupTvShows = [];

          homeScreenGroupTvShowsSnapshot.forEach(doc => {
            const tvShow = new TvShow();

            tvShow.homeScreenGroupTvShowId = doc.id;
            tvShow.tvShowId = doc.data().tvShowId;
            tvShow.name = doc.data().name;
            tvShow.picture = doc.data().picture;
            tvShow.releaseYear = doc.data().releaseYear;
            tvShow.rating = doc.data().rating;
            tvShow.description = doc.data().description;

            homeScreenGroupTvShows.push(tvShow);
          });

          resolve({ homeScreenGroupTvShows: homeScreenGroupTvShows });
        });
    });

    return promise;
  }

  addMovieToHomeScreenGroup(movie: Movie, homeScreenGroup: HomeScreenGroup) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .doc(homeScreenGroup.groupId)
        .collection("movies")
        .add({
          homeScreenGroupId: homeScreenGroup.groupId,
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
          resolve({ newHomeScreenGroupMovieId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  removeMovieFromHomeScreenGroup(
    movie: Movie,
    homeScreenGroup: HomeScreenGroup
  ) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .doc(homeScreenGroup.groupId)
        .collection("movies")
        .doc(movie.homeScreenGroupMovieId)
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

  addTvShowToHomeScreenGroup(tvShow: TvShow, homeScreenGroup: HomeScreenGroup) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .doc(homeScreenGroup.groupId)
        .collection("tvShows")
        .add({
          homeScreenGroupId: homeScreenGroup.groupId,
          tvShowId: tvShow.tvShowId,
          name: tvShow.name,
          picture: tvShow.picture,
          releaseYear: tvShow.releaseYear,
          rating: tvShow.rating,
          description: tvShow.description,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newHomeScreenGroupTvShowId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  removeTvShowFromHomeScreenGroup(
    tvShow: TvShow,
    homeScreenGroup: HomeScreenGroup
  ) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("homeScreenGroups")
        .doc(homeScreenGroup.groupId)
        .collection("tvShows")
        .doc(tvShow.homeScreenGroupTvShowId)
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
}
