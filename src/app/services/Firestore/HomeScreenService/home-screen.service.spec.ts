import { TestBed, inject } from "@angular/core/testing";

import { HomeScreenService } from "./home-screen.service";

describe("HomeScreenService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeScreenService]
    });
  });

  it("should be created", inject(
    [HomeScreenService],
    (service: HomeScreenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
