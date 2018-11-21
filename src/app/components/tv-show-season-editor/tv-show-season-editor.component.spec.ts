import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TvShowSeasonEditorComponent } from "./tv-show-season-editor.component";

describe("TvShowSeasonEditorComponent", () => {
  let component: TvShowSeasonEditorComponent;
  let fixture: ComponentFixture<TvShowSeasonEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TvShowSeasonEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvShowSeasonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
