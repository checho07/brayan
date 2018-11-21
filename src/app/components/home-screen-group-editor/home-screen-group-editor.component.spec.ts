import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HomeScreenGroupEditorComponent } from "./home-screen-group-editor.component";

describe("HomeScreenGroupEditorComponent", () => {
  let component: HomeScreenGroupEditorComponent;
  let fixture: ComponentFixture<HomeScreenGroupEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeScreenGroupEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeScreenGroupEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
