import { Component, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
    selector: 'app-loading',
    imports: [ProgressSpinnerModule],
    templateUrl: './loading.html',
})
export class Loading {
    message = input('Cargando...') ;
}
