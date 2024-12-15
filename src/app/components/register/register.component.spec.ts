import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterComponent } from "./register.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { UtilsService } from "../../services/utils.service";
import { CommonModule } from "@angular/common";
describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj("Router", ["navigate"]);
    const utilsSpyObj = jasmine.createSpyObj("UtilsService", [
      "getActiveUser",
      "setActiveUser",
    ]);
    const activatedRouteSpy = jasmine.createSpyObj("ActivatedRoute", [], {
      snapshot: {},
    });
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, RegisterComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpyObj },
        { provide: UtilsService, useValue: utilsSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    utilsServiceSpy = TestBed.inject(
      UtilsService,
    ) as jasmine.SpyObj<UtilsService>;
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should initialize the form with empty fields", () => {
    expect(component.registerForm.get("email")?.value).toBe("");
    expect(component.registerForm.get("password")?.value).toBe("");
    expect(component.registerForm.get("repeat_password")?.value).toBe("");
    expect(component.registerForm.get("username")?.value).toBe("");
    expect(component.registerForm.get("birthdate")?.value).toBe("");
  });
  it("should validate required fields", () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();
    form.controls["email"].setValue("test@test.com");
    form.controls["password"].setValue("Test123!");
    form.controls["repeat_password"].setValue("Test123!");
    form.controls["username"].setValue("testuser");
    form.controls["birthdate"].setValue("2000-01-01");
    expect(form.valid).toBeTruthy();
  });
  it("should validate password complexity", () => {
    const passwordControl = component.registerForm.controls["password"];
    passwordControl.setValue("weakpass");
    expect(passwordControl.errors?.["passwordComplexity"]).toBeTruthy();
    passwordControl.setValue("Test123!");
    expect(passwordControl.errors).toBeNull();
  });
  it("should validate password match", () => {
    const form = component.registerForm;
    form.controls["password"].setValue("Test123!");
    form.controls["repeat_password"].setValue("Test123");
    expect(form.errors?.["mismatch"]).toBeTruthy();
    form.controls["repeat_password"].setValue("Test123!");
    expect(form.errors).toBeNull();
  });
  it("should not navigate to kanban when no active user", () => {
    utilsServiceSpy.getActiveUser.and.returnValue(null);
    component.goToKanban();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
  it("should return correct error messages", () => {
    const emailControl = component.registerForm.controls["email"];
    emailControl.setErrors({ required: true });
    expect(component.getErrorMessage("email")).toBe("email is required");
    emailControl.setErrors({ email: true });
    expect(component.getErrorMessage("email")).toBe("Invalid email format");
    const passwordControl = component.registerForm.controls["password"];
    passwordControl.setErrors({
      passwordComplexity: true,
      requirements: { upperCase: true, number: true, specialChar: false },
    });
    expect(component.getErrorMessage("password")).toContain("must contain");
  });
});
