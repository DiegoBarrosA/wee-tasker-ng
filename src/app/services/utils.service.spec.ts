import { TestBed } from "@angular/core/testing";
import { UtilsService } from "./utils.service";
describe("UtilsService", () => {
  let service: UtilsService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });
  beforeEach(() => {
    localStorage.clear();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  describe("getActiveUser", () => {
    it("should return null if no user is stored in localStorage", () => {
      spyOn(localStorage, "getItem").and.returnValue(null);
      const result = service.getActiveUser();
      expect(result).toBeNull();
    });
    it("should return a user object if valid user data is stored in localStorage", () => {
      const user = {
        id: 1,
        email: "test@example.com",
        password: "password123",
        username: "testuser",
        birthdate: "1990-01-01T00:00:00Z",
        type: { id: 1, name: "Admin" },
      };
      spyOn(localStorage, "getItem").and.returnValue(JSON.stringify(user));
      const result = service.getActiveUser();
      expect(result).toEqual(jasmine.objectContaining(user));
      expect(result?.username).toBe("testuser");
    });
  });
});
