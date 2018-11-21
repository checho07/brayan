import { Injectable } from "@angular/core";

import * as firebase from "firebase";

import { EpisodesService } from "../EpisodesService/episodes-service.service";

import { TvShow } from "../../../models/TvShow";
import { Season } from "../../../models/Season";

@Injectable({
  providedIn: "root"
})
export class SeasonsService {
  constructor(private episodesService: EpisodesService) {}

  getSeasons(tvShow: TvShow) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .orderBy("addedAt", "asc")
        .get()
        .then(tvShowSeasonsSnapshot => {
          const tvShowSeasons = [];

          tvShowSeasonsSnapshot.forEach(doc => {
            const season = new Season();

            season.seasonId = doc.id;
            season.name = doc.data().name;
            season.tvShowId = doc.data().tvShowId;
            season.tvShowName = doc.data().tvShowName;

            tvShowSeasons.push(season);
          });

          resolve({ tvShowSeasons: tvShowSeasons });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  addNewSeason(tvShow: TvShow, season: Season) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .add({
          name: season.name,
          tvShowId: season.tvShowId,
          tvShowName: season.tvShowName,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newSeasonId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  deleteSeason(tvShow: TvShow, season: Season) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .doc(season.seasonId)
        .delete()
        .then(() => {
          this.episodesService.getEpisodes(tvShow, season).then((result: any) => {
            result.seasonEpisodes.forEach(episode => {
              this.episodesService.deleteEpisode(tvShow, season, episode);
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

  editSeasonName(tvShow: TvShow, seasonId: string, seasonName: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("tvShows")
        .doc(tvShow.tvShowId)
        .collection("seasons")
        .doc(seasonId)
        .set(
          {
            name: seasonName
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
