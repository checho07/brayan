import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HomeScreenGroupItemsComponent } from "./home-screen-group-items.component";

describe("HomeScreenGroupItemsComponent", () => {
  let component: HomeScreenGroupItemsComponent;
  let fixture: ComponentFixture<HomeScreenGroupItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeScreenGroupItemsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeScreenGroupItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
