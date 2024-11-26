import { ActivatedRoute } from "@angular/router";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UpdateProfileComponent } from "./update-profile.component";

describe("UpdateProfileComponent", () => {
  let component: UpdateProfileComponent;
  let fixture: ComponentFixture<UpdateProfileComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      /* Add mock properties here */
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    });
    await TestBed.configureTestingModule({
      imports: [UpdateProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
