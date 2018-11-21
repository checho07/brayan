import { Component, OnInit, Inject } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";

import { CategoriesService } from "../../services/Firestore/CategoriesService/categories.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MAT_DIALOG_DATA } from "@angular/material";

import { Category } from "../../models/Category";
import { Movie } from "../../models/Movie";
import { TvShow } from "../../models/TvShow";

@Component({
  selector: "app-categories-editor",
  templateUrl: "./categories-editor.component.html",
  styleUrls: ["./categories-editor.component.css"]
})
export class CategoriesEditorComponent implements OnInit {
  isCategoryEditing = false;
  category: Category;
  categoryMovies: Movie[] = [];
  categoryTvShows: TvShow[] = [];

  constructor(
    private categoriesService: CategoriesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService
  ) {
    this.category = data.category;
  }

  ngOnInit() {
    this.isCategoryEditing = true;
    this.getCategoryMovies();
    this.getCategoryTvShows();
  }

  getCategoryMovies() {
    this.spinner.show();

    this.categoriesService.getCategoryMovies(this.category).then((result: any) => {
      this.categoryMovies = result.categoryMovies;
      this.spinner.hide();
    });
  }

  getCategoryTvShows() {
    this.spinner.show();

    this.categoriesService.getCategoryTvShows(this.category).then((result: any) => {
      this.categoryTvShows = result.categoryTvShows;
      this.spinner.hide();
    });
  }
}
