import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Movie } from "../../models/Movie";

@Component({
  selector: "app-movie-player",
  templateUrl: "./movie-player.component.html",
  styleUrls: ["./movie-player.component.css"]
})
export class MoviePlayerComponent implements OnInit {
  movie: Movie;
  
  constructor(
    public dialogRef: MatDialogRef<MoviePlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.movie = data.movie;
  }

  ngOnInit() {}
}
