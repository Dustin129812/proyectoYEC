import { FormRegistryService } from "@/pages/admin/services/form-registry.service";
import { PersonalData } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.state";
import { EnrollmentAplicationStore } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.store";
import { Component, inject, output, signal, untracked } from "@angular/core";
import { FieldTree, form, FormField } from "@angular/forms/signals";
import { validatePersonalData } from "../validators/validate-personal-data";
import { Checkbox } from "primeng/checkbox";
import { InputText } from "primeng/inputtext";
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { Button } from "primeng/button";
import { OriginPlace } from "../origin-place/origin-place";
import { AccordionModule } from 'primeng/accordion';


@Component({
  selector: "app-personal-data-form",
  imports: [FormField, Checkbox, InputText, FloatLabelModule, MessageModule, AccordionModule, Button],
  templateUrl: "./personal-data-form.html",
  styleUrl: "./personal-data-form.scss",
})
export class PersonalDataForm {
  private readonly formRegistryService = inject(FormRegistryService);
  private readonly enrollmentApplicationStore = inject(EnrollmentAplicationStore);
  next = output<void>();

  protected form$ = signal(
    structuredClone(
      this.enrollmentApplicationStore.formState().personalData
    )
  );

  form: FieldTree<PersonalData> = this.buildForm;

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
    if (this.form().invalid()) return;
    this.enrollmentApplicationStore.updatePersonalData(this.form$());
    console.log('personal-data', this.form().value())
    this.next.emit();
  }


}
