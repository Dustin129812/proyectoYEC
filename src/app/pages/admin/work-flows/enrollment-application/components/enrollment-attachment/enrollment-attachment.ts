import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService } from '@utils/services';
import { FileUpload, FileSelectEvent } from 'primeng/fileupload';

@Component({
    selector: 'app-enrollment-attachment',
    imports: [FileUpload],
    templateUrl: './enrollment-attachment.html',
})
export class EnrollmentAttachment {
    private readonly catalogueService = inject(CatalogueService)
    protected catalog: WritableSignal<CatalogueInterface[]> = signal([]);
    files = signal<File[]>([]);

    onSelect(event: FileSelectEvent) {
        this.files.set(event.files);
        console.log(this.files());
    }

    ngOnInit() {
        this.loadCatalogue()
    }
    
    async loadCatalogue() {
        this.catalog.set(await this.catalogueService.findByTypeTest(CatalogueTypeEnum.users_enrollment_file_type))

    }
}
