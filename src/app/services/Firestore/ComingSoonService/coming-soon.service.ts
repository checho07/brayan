import { Injectable } from "@angular/core";
import * as firebase from "firebase";
import { ComingSoon } from "../../../models/ComingSoon";
import { FirebaseStorageService } from "../../FirebaseStorage/firebase-storage.service";

@Injectable({
  providedIn: "root"
})
export class ComingSoonService {
  constructor(private firebaseStorage: FirebaseStorageService) {}

  getComingSoonCount() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("comingSoon")
        .get()
        .then(comingSoonSnapshot => {
          resolve({ count: comingSoonSnapshot.size });
        });
    });

    return promise;
  }

  getComingSoon() {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("comingSoon")
        .orderBy("addedAt", "desc")
        .get()
        .then(comingSoonSnapshot => {
          const comingSoonList = [];

          comingSoonSnapshot.forEach(doc => {
            const comingSoon = new ComingSoon();

            comingSoon.comingSoonId = doc.id;
            comingSoon.name = doc.data().name;
            comingSoon.picture = doc.data().picture;
            comingSoon.description = doc.data().description;
            comingSoon.releaseDate = doc.data().releaseDate;

            comingSoonList.push(comingSoon);
          });

          resolve({ comingSoonList: comingSoonList });
        });
    });

    return promise;
  }

  addNewComingSoon(newComingSoon: ComingSoon) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("comingSoon")
        .add({
          name: newComingSoon.name,
          picture: newComingSoon.picture,
          description: newComingSoon.description,
          releaseDate: newComingSoon.releaseDate,
          addedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(function(ref) {
          resolve({ newComingSoonId: ref.id });
        })
        .catch(function(error) {
          reject(error);
        });
    });

    return promise;
  }

  editComingSoonName(comingSoonId: string, comingSoonName: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("comingSoon")
        .doc(comingSoonId)
        .set(
          {
            name: comingSoonName
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

  editComingSoonPicture(comingSoonId: string, comingSoonPicture: string) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("comingSoon")
        .doc(comingSoonId)
        .set(
          {
            picture: comingSoonPicture
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

  editComingSoonDescription(
    comingSoonId: string,
    comingSoonDescription: string
  ) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("comingSoon")
        .doc(comingSoonId)
        .set(
          {
            description: comingSoonDescription
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

  editComingSoonReleaseDate(
    comingSoonId: string,
    comingSoonReleaseDate: string
  ) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("comingSoon")
        .doc(comingSoonId)
        .set(
          {
            releaseDate: comingSoonReleaseDate
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

  deleteComingSoon(comingSoon: ComingSoon) {
    const promise = new Promise((resolve, reject) => {
      const db = firebase.firestore();

      db.collection("comingSoon")
        .doc(comingSoon.comingSoonId)
        .delete()
        .then(() => {
          // Delete picture
          const deletePath = `/Coming Soon/${
            comingSoon.name
          }/comingSoonPicture`;

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
