import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SeasonEpisodeEditorComponent } from "./season-episode-editor.component";

describe("SeasonEpisodeEditorComponent", () => {
  let component: SeasonEpisodeEditorComponent;
  let fixture: ComponentFixture<SeasonEpisodeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeasonEpisodeEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonEpisodeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
