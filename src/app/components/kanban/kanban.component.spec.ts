import { ActivatedRoute } from "@angular/router";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { KanbanComponent } from "./kanban.component";

describe("KanbanComponent", () => {
  let component: KanbanComponent;
  let fixture: ComponentFixture<KanbanComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      /* Add mock properties here */
    };

    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    });
    await TestBed.configureTestingModule({
      imports: [KanbanComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
