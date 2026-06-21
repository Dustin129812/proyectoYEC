import { FormRegistryService } from "@/pages/admin/services/form-registry.service";
import { PersonalData } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.state";
import { EnrollmentAplicationStore } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.store";
import { Component, inject, signal, untracked } from "@angular/core";
import { FieldTree, form, FormField } from "@angular/forms/signals";
import { validatePersonalData } from "../validators/validate-personal-data";
import { Checkbox } from "primeng/checkbox";
import { InputText } from "primeng/inputtext";
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { Button } from "primeng/button";

@Component({
  selector: "app-personal-data-form",
  imports: [FormField, Checkbox, InputText, FloatLabelModule, MessageModule, Button],
  templateUrl: "./personal-data-form.html",
  styleUrl: "./personal-data-form.scss",
})
export class PersonalDataForm {
  private readonly formRegistryService = inject(FormRegistryService);
  private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore)

  protected form$ = signal(
    structuredClone(
      this.enrollmentApplicationStore.formState().personalData
    )
  );

  protected form: FieldTree<PersonalData> = this.buildForm;

  constructor() {

  }

  ngOnInit(): void {
    this.formRegistryService.register(
      'personal-data',
      this.form,
      this.form$()
    );
  }

  ngOnDestroy(): void {
    this.formRegistryService.unregister('personal-data');
  }
  get buildForm() {
    return form(this.form$, (schema) => {
      //Usamos untracked para obtener los valores reales sin crear el bucle infinito que causaba al enviar el signal , toca probar ahora que estan sin las condicionales en las validaciones
      const deconstrucedValues = untracked(() => this.form$());
      validatePersonalData(schema, deconstrucedValues);
    });
  }

  onSubmit() {
    if (this.form().valid()) {
      // 1. Nos aseguramos de actualizar el Store por última vez
      this.enrollmentApplicationStore.updatePersonalData(this.form$());

      // 2. Ordenamos al Store avanzar al paso 2
      this.enrollmentApplicationStore.setStep(2);
    } else {
      // Si usas el FormRegistryService para manejar errores globales:
      console.log('El formulario tiene errores:', this.form().errors());
    }
  }


}
