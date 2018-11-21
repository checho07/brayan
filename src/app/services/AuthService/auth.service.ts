import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";

import * as firebase from "firebase";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth) {}

  registerUser(email, password) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(res => {})
      .catch(error => {
        throw error;
      });
  }

  signIn(email, password) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {})
      .catch(error => {
        throw error;
      });
  }

  signInWithFacebook() {
    return this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(
        res => {},
        err => {
          console.error("Error: ", err);
          throw err;
        }
      );
  }

  signInWithGoogle() {
    return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(
        res => {},
        err => {
          console.error("Error: ", err);
          throw err;
        }
      );
  }

  signInWithTwitter() {
    return this.afAuth.auth
      .signInWithPopup(new firebase.auth.TwitterAuthProvider())
      .then(
        res => {},
        err => {
          console.error("Error: ", err);
          throw err;
        }
      );
  }

  signInWithGithub() {
    return this.afAuth.auth
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then(
        res => {},
        err => {
          console.error("Error: ", err);
          throw err;
        }
      );
  }
}
