import { TestBed, inject } from "@angular/core/testing";

import { ComingSoonService } from "./coming-soon.service";

describe("ComingSoonService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComingSoonService]
    });
  });

  it("should be created", inject(
    [ComingSoonService],
    (service: ComingSoonService) => {
      expect(service).toBeTruthy();
    }
  ));
});
