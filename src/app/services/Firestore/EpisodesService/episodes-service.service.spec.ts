import { TestBed, inject } from "@angular/core/testing";

import { EpisodesService } from "./episodes-service.service";

describe("EpisodesService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EpisodesService]
    });
  });

  it("should be created", inject(
    [EpisodesService],
    (service: EpisodesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
