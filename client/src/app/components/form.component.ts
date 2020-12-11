import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  key = '';
  imageURL = '';
  form:FormGroup
  constructor(private fb: FormBuilder, private apiSvc: ApiService) { }

  ngOnInit(): void {
    this.createForm()
  }

  onSubmit () {
    console.info(this.form.value)
    this.apiSvc.upload(this.form.value)
    .then (k => {
      this.key = k;
      this.getImage(k)
    })
  }

  async getImage(k: string) {
    // this.imageURL = await this.apiSvc.download(k)
    this.apiSvc.download(k)
    .then (data => {
      this.imageURL = "data:image/png;base64," + data;
    })
  }

  private createForm () {
    this.form = this.fb.group({
      image_file: this.fb.control('', [Validators.required]),
      uploadedby: this.fb.control('', [Validators.required]),
      notes: this.fb.control('', [Validators.required])
    })
  }
}
