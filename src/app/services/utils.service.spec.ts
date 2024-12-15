import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { JsonService } from "./json.service";

describe("JsonService", () => {
  let service: JsonService;
  let httpMock: HttpTestingController;

  const baseUrl = "https://wee-tasker-ng.s3.us-east-1.amazonaws.com/databases/";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JsonService],
    });

    service = TestBed.inject(JsonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getJsonData", () => {
    it("should retrieve JSON data for a given resource", () => {
      const mockData = { testKey: "testValue" };
      const resource = "testResource";

      service.getJsonData(resource).subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${baseUrl}${resource}.json`);
      expect(req.request.method).toBe("GET");
      req.flush(mockData);
    });
  });

  describe("updateObject", () => {
    it("should update an object for a given resource", () => {
      const resource = "testResource";
      const testObject = { id: 1, name: "Test" };
      const expectedPayload = { [resource]: testObject };

      // Spy on console.log and console.error
      spyOn(console, "log");
      spyOn(console, "error");

      service.updateObject(resource, testObject);

      const req = httpMock.expectOne(`${baseUrl}${resource}.json`);
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual(expectedPayload);

      // Simulate a successful response
      req.flush({}, { status: 200, statusText: "OK" });

      expect(console.log).toHaveBeenCalledWith(
        "Archivo JSON sobrescrito con exito",
        jasmine.anything(),
      );
    });

    it("should handle errors when updating an object", () => {
      const resource = "testResource";
      const testObject = { id: 1, name: "Test" };

      // Spy on console methods
      spyOn(console, "log");
      spyOn(console, "error");

      service.updateObject(resource, testObject);

      const req = httpMock.expectOne(`${baseUrl}${resource}.json`);
      expect(req.request.method).toBe("PUT");

      // Simulate an error response
      req.flush("Error", { status: 500, statusText: "Server Error" });

      expect(console.error).toHaveBeenCalledWith(
        "Error al sobrescribir el archivo JSON",
        jasmine.anything(),
      );
    });
  });
});
