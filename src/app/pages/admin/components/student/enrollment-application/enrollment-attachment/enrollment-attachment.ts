import { Component, signal } from '@angular/core';
import { FileUpload, FileSelectEvent } from 'primeng/fileupload';

@Component({
  selector: "app-enrollment-attachment",
  imports: [FileUpload],
  templateUrl: "./enrollment-attachment.html",
  styleUrl: "./enrollment-attachment.scss",
})
export class EnrollmentAttachment {

  files = signal<File[]>([]);

  onSelect(event: FileSelectEvent) {
    this.files.set(event.files);
    console.log(this.files());
  }
}
