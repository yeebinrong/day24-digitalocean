import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  upload (formVal):any {
    let key = ''
    const formData:FormData = new FormData()
    formData.set('uploadedBy', formVal.uploadedby)
    formData.set('notes', formVal.notes)
    formData.set('image_file', (<HTMLInputElement>document.getElementById("image_file")).files[0])
    this.http.post('http://localhost:3000/upload', formData)
      .pipe(take(1)).toPromise()
      .then ((result) => {
        return this.download(result['key'])
      })
      .catch ((e) => {
        console.error("Error : ", e)
      })
  }

  download (key:string) {
    // this.http.get(`http://localhost:3000/download/${key}`).toPromise()
    // .then (result => {
    //   console.info(result)
    //   // var blob = new Blob([result.buffer.blob()], {type: 'application/pdf'});
    //   //           var filename = 'file.pdf';
    //   //           saveAs(blob, filename);
    // })
  }
}
