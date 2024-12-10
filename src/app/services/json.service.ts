import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class JsonService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  private base_url =
    "https://wee-tasker-ng.s3.us-east-1.amazonaws.com/databases/";
  constructor(private http: HttpClient) {}
  getJsonData(resource: String): Observable<any> {
    return this.http.get(this.base_url + resource + ".json");
  }
  updateObject(resource: string, object: any) {
    console.log(object);
    let newObj = { [resource]: object };
    this.http
      .put(this.base_url + resource + ".json", newObj, this.httpOptions)
      .subscribe({
        next: (response) => {
          console.log("Archivo JSON sobrescrito con exito", response);
        },
        error: (error) => {
          console.error("Error al sobrescribir el archivo JSON", error);
        },
      });
  }
}
