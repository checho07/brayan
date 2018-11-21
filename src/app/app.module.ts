import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import * as firebase from "firebase";

import { RouterModule, Routes } from "@angular/router";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import {
  MatTabsModule,
  MatFormFieldModule,
  MatNativeDateModule,
  MatDatepickerModule
} from "@angular/material";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginModalComponent } from "./components/login-modal/login-modal.component";
import { TvShowsComponent } from "./components/tv-shows/tv-shows.component";
import { TvShowEditorComponent } from "./components/tv-show-editor/tv-show-editor.component";
import { TvShowSeasonsComponent } from "./components/tv-show-seasons/tv-show-seasons.component";
import { SeasonsEpisodesComponent } from "./components/seasons-episodes/seasons-episodes.component";
import { TvShowSeasonEditorComponent } from "./components/tv-show-season-editor/tv-show-season-editor.component";
import { SeasonEpisodeEditorComponent } from "./components/season-episode-editor/season-episode-editor.component";
import { SeasonEpisodePlayerComponent } from "./components/season-episode-player/season-episode-player.component";
import { MoviesComponent } from "./components/movies/movies.component";
import { MoviesEditorComponent } from "./components/movies-editor/movies-editor.component";
import { MoviePlayerComponent } from "./components/movie-player/movie-player.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { ComingSoonComponent } from "./components/coming-soon/coming-soon.component";
import { CategoriesEditorComponent } from "./components/categories-editor/categories-editor.component";
import { ComingSoonEditorComponent } from "./components/coming-soon-editor/coming-soon-editor.component";
import { HomeScreenComponent } from "./components/home-screen/home-screen.component";
import { HomeScreenGroupEditorComponent } from "./components/home-screen-group-editor/home-screen-group-editor.component";
import { HomeScreenGroupItemsComponent } from "./components/home-screen-group-items/home-screen-group-items.component";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBYJqPjh8Eh75E5F5TSunFqQVR-yYNDeUM",
  authDomain: "opciondegrado-a9b8a.firebaseapp.com",
  databaseURL: "https://opciondegrado-a9b8a.firebaseio.com",
  projectId: "opciondegrado-a9b8a",
  storageBucket: "opciondegrado-a9b8a.appspot.com",
  messagingSenderId: "665347110415"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginModalComponent,
    TvShowsComponent,
    TvShowEditorComponent,
    TvShowSeasonsComponent,
    SeasonsEpisodesComponent,
    TvShowSeasonEditorComponent,
    SeasonEpisodeEditorComponent,
    SeasonEpisodePlayerComponent,
    MoviesComponent,
    MoviesEditorComponent,
    MoviePlayerComponent,
    CategoriesComponent,
    ComingSoonComponent,
    CategoriesEditorComponent,
    ComingSoonEditorComponent,
    HomeScreenComponent,
    HomeScreenGroupEditorComponent,
    HomeScreenGroupItemsComponent
  ],
  entryComponents: [
    LoginModalComponent,
    TvShowEditorComponent,
    TvShowSeasonsComponent,
    TvShowSeasonEditorComponent,
    SeasonsEpisodesComponent,
    SeasonEpisodeEditorComponent,
    SeasonEpisodePlayerComponent,
    MoviesEditorComponent,
    MoviePlayerComponent,
    CategoriesEditorComponent,
    ComingSoonEditorComponent,
    HomeScreenGroupEditorComponent,
    HomeScreenGroupItemsComponent
  ],
  imports: [
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    NgxSpinnerModule,
    MatDialogModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MatTabsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
