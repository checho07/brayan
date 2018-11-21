import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TvShowEditorComponent } from "./tv-show-editor.component";

describe("TvShowEditorComponent", () => {
  let component: TvShowEditorComponent;
  let fixture: ComponentFixture<TvShowEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TvShowEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvShowEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
