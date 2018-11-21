import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ComingSoonEditorComponent } from "./coming-soon-editor.component";

describe("ComingSoonEditorComponent", () => {
  let component: ComingSoonEditorComponent;
  let fixture: ComponentFixture<ComingSoonEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComingSoonEditorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComingSoonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
