import { Component } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import * as firebase from "firebase";

import { AuthService } from "./services/AuthService/auth.service";
import { MatDialog } from "@angular/material";
import { LoginModalComponent } from "./components/login-modal/login-modal.component";
import { FirebaseStorageService } from "./services/FirebaseStorage/firebase-storage.service";
import { CategoriesService } from "./services/Firestore/CategoriesService/categories.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "Dashboard";

  constructor(
    private router: Router,
    public storageService: FirebaseStorageService,
    private authService: AuthService,
    private dialog: MatDialog,
    private categoriesService: CategoriesService
  ) {
    this.checkAuth();

    // this.initialiseCategories();

    router.events.subscribe((val: NavigationEnd) => {
      const elements = document.getElementsByClassName("active");

      Array.prototype.forEach.call(elements, function(element) {
        element.classList.remove("active");
      });

      switch (val.urlAfterRedirects) {
        case "/dashboard":
          const dashboardMenuItem = document.getElementById(
            "dashboardMenuItem"
          );
          dashboardMenuItem.classList.add("active");
          this.title = "Dashboard";
          break;

        case "/cursos":
          const cursosMenuItem = document.getElementById("cursosMenuItem");
          cursosMenuItem.classList.add("active");
          this.title = "Cursos";
          break;

        case "/movies":
          const moviesMenuItem = document.getElementById("moviesMenuItem");
          moviesMenuItem.classList.add("active");
          this.title = "Movies";
          break;

        case "/home":
          const homeMenuItem = document.getElementById("homeMenuItem");
          homeMenuItem.classList.add("active");
          this.title = "Home Screen";
          break;

        case "/categories":
          const categoriesMenuItem = document.getElementById(
            "categoriesMenuItem"
          );
          categoriesMenuItem.classList.add("active");
          this.title = "Categories";
          break;

        case "/comingSoon":
          const comingSoonMenuItem = document.getElementById(
            "comingSoonMenuItem"
          );
          comingSoonMenuItem.classList.add("active");
          this.title = "Coming Soon";
          break;
      }
    });
  }

  checkAuth() {
    this.authService.afAuth.authState.subscribe((user: firebase.User) => {
      if (!user) {
        const dialogRef = this.dialog.open(LoginModalComponent, {
          panelClass: "my-panel"
        });

        dialogRef.afterClosed().subscribe(result => {
          if (this.authService.afAuth.auth.currentUser === null) {
            this.checkAuth();
          }
        });
      } else {
        this.dialog.closeAll();
      }
    });
  }

  // initialiseCategories() {
  //   this.categoriesService.getCategories().then((result: any) => {
  //     if (result.categories.length <= 0) {
  //       this.categoriesService.initialiseCategories();
  //     }
  //   });
  // }

  signOut() {
    setTimeout(() => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.router.navigate(["login"]);
        });
    }, 500);
  }
}
