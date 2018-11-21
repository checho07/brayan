import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SeasonEpisodePlayerComponent } from "./season-episode-player.component";

describe("SeasonEpisodePlayerComponent", () => {
  let component: SeasonEpisodePlayerComponent;
  let fixture: ComponentFixture<SeasonEpisodePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeasonEpisodePlayerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonEpisodePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
