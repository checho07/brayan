import { Injectable } from "@angular/core";

import * as firebase from "firebase";
import { FirebaseStorageService } from "../../FirebaseStorage/firebase-storage.service";

import { TvShow } from "../../../models/TvShow";
import { SeasonsService } from "../SeasonsService/seasons-service.service";

@Injectable({
  providedIn: "root"
})
export class TvShowsService {
  constructor(
    private firebaseStorage: FirebaseStorageService,
    private seasonsService: SeasonsService
  ) {}

  getTvShowsCount() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .get()
        .then(tvShowsSnapshot => {
          resolve({ count: tvShowsSnapshot.size });
        });
    });

    return promise;
  }

  getTvShows() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .orderBy("addedAt", "desc")
        .get()
        .then(tvShowsSnapshot => {
          const tvShows = [];

          tvShowsSnapshot.forEach(doc => {
            const tvShow = new TvShow();

            tvShow.tvShowId = doc.id;
            tvShow.name = doc.data().name;
            tvShow.picture = doc.data().picture;
            tvShow.detailsPicture = doc.data().detailsPicture;
            tvShow.releaseYear = doc.data().releaseYear;
            tvShow.rating = doc.data().rating;
            tvShow.description = doc.data().description;

            tvShows.push(tvShow);
          });

          resolve({ tvShows: tvShows });
        });
    });

    return promise;
  }

  addNewTvShow(newTvShow: TvShow) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .add({
          name: newTvShow.name,
          picture: newTvShow.picture,
          detailsPicture: newTvShow.detailsPicture,
          releaseYear: newTvShow.releaseYear,
          rating: newTvShow.rating,
          description: newTvShow.description,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newTvShowId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  deleteTvShow(tvShow: TvShow) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .delete()
        .then(() => {
          // Delete TV show picture
          const deletePath = `/TV Shows/${tvShow.name}/tvShowPicture`;
          this.firebaseStorage.deleteFile(deletePath);

          this.seasonsService.getSeasons(tvShow).then((result: any) => {
            result.tvShowSeasons.forEach(season => {
              this.seasonsService.deleteSeason(tvShow, season);
            });

            resolve();
          });

          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editTvShowName(tvShowId: string, tvShowName: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShowId)
        .set(
          {
            name: tvShowName
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

  editTvShowPicture(tvShowId: string, tvShowPicture: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShowId)
        .set(
          {
            picture: tvShowPicture
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

  editDetailsPicture(tvShowId: string, detailsPicture: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShowId)
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

  editTvReleaseYear(tvShowId: string, tvShowYear: number) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShowId)
        .set(
          {
            releaseYear: tvShowYear
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

  editTvRating(tvShowId: string, tvShowRating: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShowId)
        .set(
          {
            rating: tvShowRating
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
  
  editTvDescription(tvShowId: string, tvShowDescription: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShowId)
        .set(
          {
            description: tvShowDescription
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
