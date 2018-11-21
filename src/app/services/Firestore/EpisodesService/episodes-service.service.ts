import { Injectable } from "@angular/core";

import * as firebase from "firebase";

import { FirebaseStorageService } from "../../FirebaseStorage/firebase-storage.service";

import { TvShow } from "../../../models/TvShow";
import { Season } from "../../../models/Season";
import { Episode } from "../../../models/Episode";

@Injectable({
  providedIn: "root"
})
export class EpisodesService {
  constructor(private firebaseStorage: FirebaseStorageService) {}

  getEpisodes(tvShow: TvShow, season: Season) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .doc(season.seasonId)
        .collection("episodes")
        .orderBy("addedAt", "asc")
        .get()
        .then(episodesSnapshot => {
          const seasonEpisodes = [];

          episodesSnapshot.forEach(doc => {
            const episode = new Episode();

            episode.episodeId = doc.id;
            episode.name = doc.data().name;
            episode.description = doc.data().description;
            episode.picture = doc.data().picture;
            episode.seasonId = doc.data().seasonId;
            episode.seasonName = doc.data().seasonName;
            episode.tvShowId = doc.data().tvShowId;
            episode.tvShowName = doc.data().tvShowName;
            episode.videoUrl = doc.data().videoUrl;

            seasonEpisodes.push(episode);
          });

          resolve({ seasonEpisodes: seasonEpisodes });
        });
    });

    return promise;
  }

  addNewEpisode(tvShow: TvShow, season: Season, newEpisode: Episode) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .doc(season.seasonId)
        .collection("episodes")
        .add({
          name: newEpisode.name,
          description: newEpisode.description,
          picture: newEpisode.picture,
          seasonId: newEpisode.seasonId,
          seasonName: newEpisode.seasonName,
          tvShowId: newEpisode.tvShowId,
          tvShowName: newEpisode.tvShowName,
          videoUrl: newEpisode.videoUrl,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newEpisodeId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editEpisodeName(
    tvShow: TvShow,
    season: Season,
    episodeId: string,
    episodeName: string
  ) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .doc(season.seasonId)
        .collection("episodes")
        .doc(episodeId)
        .set(
          {
            name: episodeName
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

  editEpisodeDescription(
    tvShow: TvShow,
    season: Season,
    episodeId: string,
    episodeDescription: string
  ) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .doc(season.seasonId)
        .collection("episodes")
        .doc(episodeId)
        .set(
          {
            description: episodeDescription
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

  editEpisodePicture(
    tvShow: TvShow,
    season: Season,
    episodeId: string,
    episodePicture: string
  ) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .doc(season.seasonId)
        .collection("episodes")
        .doc(episodeId)
        .set(
          {
            picture: episodePicture
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

  deleteEpisode(tvShow: TvShow, season: Season, episode: Episode) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .doc(season.seasonId)
        .collection("episodes")
        .doc(episode.episodeId)
        .delete()
        .then(() => {
          // Delete picture
          const deletePath = `/TV Shows/${tvShow.name}/${season.name}/${
            episode.name
          }/episodePicture`;

          this.firebaseStorage.deleteFile(deletePath);

          resolve();
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }
}
