import { ActivatedRoute } from "@angular/router";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageUsersComponent } from "./manage-users.component";

describe("ManageUsersComponent", () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      /* Add mock properties here */
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    });

    await TestBed.configureTestingModule({
      imports: [ManageUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
