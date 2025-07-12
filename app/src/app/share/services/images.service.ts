import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private baseUrl = environment.apiURL;
  constructor(private http: HttpClient) {}

  upload(files: File[], previousImages?: string[]): Observable<string[]> {
    const formData: FormData = new FormData();

    files.forEach((file) => {
      formData.append('imagenes', file);
    });
    if (previousImages && previousImages.length > 0) {
      previousImages.forEach((prevName) => {
        formData.append('previousFileName', prevName);
      });
    }
    return this.http
      .post<any | any[]>(`${this.baseUrl}/file/upload`, formData)
      .pipe(map((res) => res.map((img: { fileName: string }) => img.fileName)));
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}file/files`);
  }
}
