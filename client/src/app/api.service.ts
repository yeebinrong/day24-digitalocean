import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  upload (formVal):Promise<any> {
    const formData:FormData = new FormData()
    formData.set('uploadedBy', formVal.uploadedby)
    formData.set('notes', formVal.notes)
    formData.set('image_file', (<HTMLInputElement>document.getElementById("image_file")).files[0])
    return this.http.post('http://localhost:3000/upload', formData)
      .pipe(take(1)).toPromise()
      .then ((result) => {
        console.info(result)
        const key:String = result['key']
        return key
      })
      .catch ((e) => {
        console.error("Error : ", e)
      })
  }

  download (key) {
    console.info("KEY IS ", key)
    return this.http.get(`http://localhost:3000/download/${key}`, { headers: new HttpHeaders({ 'Content-Type': 'text' }), responseType: 'text' }).toPromise()
  }
}
