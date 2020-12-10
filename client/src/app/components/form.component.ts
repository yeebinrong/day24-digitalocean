import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form:FormGroup
  constructor(private fb: FormBuilder, private apiSvc: ApiService) { }

  ngOnInit(): void {
    this.createForm()
  }

  onSubmit () {
    console.info(this.form.value)
    this.apiSvc.upload(this.form.value)
  }

  private createForm () {
    this.form = this.fb.group({
      image_file: this.fb.control('', [Validators.required]),
      uploadedby: this.fb.control('', [Validators.required]),
      notes: this.fb.control('', [Validators.required])
    })
  }
}
