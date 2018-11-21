import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TvShowSeasonsComponent } from "./tv-show-seasons.component";

describe("TvShowSeasonsComponent", () => {
  let component: TvShowSeasonsComponent;
  let fixture: ComponentFixture<TvShowSeasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TvShowSeasonsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvShowSeasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
