import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MoviesEditorComponent } from "./movies-editor.component";

describe("MoviesEditorComponent", () => {
  let component: MoviesEditorComponent;
  let fixture: ComponentFixture<MoviesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoviesEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
