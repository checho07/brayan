import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { TvShowsComponent } from "./components/tv-shows/tv-shows.component";
import { MoviesComponent } from "./components/movies/movies.component";
import { CategoriesComponent } from "./components/categories/categories.component";
import { ComingSoonComponent } from "./components/coming-soon/coming-soon.component";
import { HomeScreenComponent } from "./components/home-screen/home-screen.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/dashboard" },
  { path: "dashboard", component: DashboardComponent },
  { path: "tvshows", component: TvShowsComponent },
  { path: "movies", component: MoviesComponent },
  { path: "home", component: HomeScreenComponent },
  { path: "cursos", component: CategoriesComponent },
  { path: "comingSoon", component: ComingSoonComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })], // <-- debugging purposes only)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
