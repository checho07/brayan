import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CategoriesService } from "../../services/Firestore/CategoriesService/categories.service";
import { Category } from "../../models/Category";
import { MatDialog } from "@angular/material";
import { CategoriesEditorComponent } from "../categories-editor/categories-editor.component";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.css"]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories() {
    this.spinner.show();

    this.categoriesService.getCategories().then((result: any) => {
      this.categories = result.categories;
      this.spinner.hide();
    });
  }

  openCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoriesEditorComponent, {
      data: {
        category: category
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
