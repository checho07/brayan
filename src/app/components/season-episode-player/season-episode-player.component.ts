import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Episode } from "../../models/Episode";

@Component({
  selector: "app-season-episode-player",
  templateUrl: "./season-episode-player.component.html",
  styleUrls: ["./season-episode-player.component.css"]
})
export class SeasonEpisodePlayerComponent implements OnInit {
  episode: Episode;
  
  constructor(
    public dialogRef: MatDialogRef<SeasonEpisodePlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.episode = data.episode;
  }

  ngOnInit() {}
}
