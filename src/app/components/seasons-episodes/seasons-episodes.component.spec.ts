import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SeasonsEpisodesComponent } from "./seasons-episodes.component";

describe("SeasonsEpisodesComponent", () => {
  let component: SeasonsEpisodesComponent;
  let fixture: ComponentFixture<SeasonsEpisodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SeasonsEpisodesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonsEpisodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
