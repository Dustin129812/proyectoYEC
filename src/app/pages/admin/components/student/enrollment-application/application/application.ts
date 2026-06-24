import { Component, computed, effect, inject, signal, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FieldTree, form, FormField } from "@angular/forms/signals";
import { PrimeIcons } from "primeng/api";
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { FormRegistryService } from "@/pages/admin/services/form-registry.service";
import { ApplicationData } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.state";
import { EnrollmentAplicationStore } from "@/pages/admin/work-flows/enrollment-application/enrollment-application.store";
import { validateApplicationData } from "../validators/validate-application-data";

@Component({
  selector: "app-application",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormField,
    Button,
    TableModule,
    SelectModule,
    ToolbarModule,
    TooltipModule,
    InputTextModule
  ],
  templateUrl: "./application.html",
  styleUrl: "./application.scss",
})
export class Application implements OnInit, OnDestroy {
  private readonly enrollmentApplication = inject(EnrollmentAplicationStore);
  private readonly formRegistryService = inject(FormRegistryService);

  PrimeIcons = PrimeIcons;


  academicPeriods: any[] = [];
  careers: any[] = [];
  curriculums: any[] = [];
  subjects: any[] = [];
  columns: any[] = [
    { field: 'code', header: 'Código' },
    { field: 'name', header: 'Asignatura' }
  ];

  careerParallels: {
    academicPeriodId: number;
    workday: { id: string, name: string };
    parallel: { id: string, name: string };
  }[] = [];

  selectedItems: any[] = [];
  selectedCurriculum = signal<any>(null);

  protected form$ = signal(
    structuredClone(
      this.enrollmentApplication.application()
    )
  );

  protected form: FieldTree<ApplicationData> = this.buildForm;

  get buildForm() {
    return form(this.form$, (schema) => {
      validateApplicationData(schema);
    });
  }

  protected workdays = computed(() => {
    const academicPeriod = this.form.academicPeriod().value();
    if (!academicPeriod) return [];

    const unique = new Map<string, { name: string; id: string }>();

    this.careerParallels.forEach(cp => {
      if (cp.academicPeriodId === Number(academicPeriod)) {
        unique.set(cp.workday.id, {
          name: cp.workday.name,
          id: cp.workday.id
        });
      }
    });

    return Array.from(unique.values());
  });

  protected parallels = computed(() => {
    const academicPeriod = this.form.academicPeriod().value();
    const workday = this.form.workday().value();

    if (!academicPeriod || !workday) return [];

    return this.careerParallels
      .filter(cp =>
        cp.academicPeriodId === Number(academicPeriod) &&
        cp.workday.id === workday
      )
      .map(cp => ({
        name: cp.parallel.name,
        id: cp.parallel.id
      }));
  });

  ngOnInit(): void {
    this.formRegistryService.register(
      'personal-data',
      this.form,
      this.form$()
    );
    const data = this.enrollmentApplication.application();
    this.enrollmentApplication.updateApplication(data);
    this.selectedItems = [...(data.enrollmentDetails || [])];

    // TODO: Aquí deberías cargar los datos reales desde tus servicios
    this.academicPeriods = [
      { name: '2025-A', id: '1' },
      { name: '2025-B', id: '2' },
      { name: '2026-A', id: '3' }
    ];

    this.careers = [
      { name: 'Desarrollo de Software', id: '1' },
      { name: 'Redes y Telecomunicaciones', id: '2' },
      { name: 'Diseño Gráfico', id: '3' },
      { name: 'Marketing Digital', id: '4' }
    ];

    this.curriculums = [
      { name: 'Malla 2023', id: '1' },
      { name: 'Malla 2024', id: '2' },
      { name: 'Malla 2025', id: '3' }
    ];

    this.subjects = [
      {
        id: '1',
        code: 'DSW101',
        name: 'Programación I'
      },
      {
        id: '2',
        code: 'DSW102',
        name: 'Base de Datos I'
      },
      {
        id: '3',
        code: 'DSW103',
        name: 'Programación Web'
      },
      {
        id: '4',
        code: 'DSW104',
        name: 'Arquitectura de Software'
      },
      {
        id: '5',
        code: 'DSW105',
        name: 'Estructura de Datos'
      },
      {
        id: '6',
        code: 'DSW106',
        name: 'Ingeniería de Software'
      },
      {
        id: '7',
        code: 'DSW107',
        name: 'Desarrollo Móvil'
      }
    ];

    this.careerParallels = [
      {
        academicPeriodId: 1,
        workday: { id: 'MAT', name: 'Matutina' },
        parallel: { id: 'A', name: 'Paralelo A' }
      },
      {
        academicPeriodId: 1,
        workday: { id: 'MAT', name: 'Matutina' },
        parallel: { id: 'B', name: 'Paralelo B' }
      },
      {
        academicPeriodId: 1,
        workday: { id: 'NOC', name: 'Nocturna' },
        parallel: { id: 'A', name: 'Paralelo A' }
      },
      {
        academicPeriodId: 2,
        workday: { id: 'VES', name: 'Vespertina' },
        parallel: { id: 'A', name: 'Paralelo A' }
      },
      {
        academicPeriodId: 2,
        workday: { id: 'VES', name: 'Vespertina' },
        parallel: { id: 'B', name: 'Paralelo B' }
      }
    ];
  }

  ngOnDestroy(): void {
    this.formRegistryService.unregister('application');
  }

  constructor() {
    effect(() => {
      const academicPeriod = this.form.academicPeriod().value();
      if (!academicPeriod) return;
      console.log('1effect:', this.form.academicPeriod().value());
      this.form.workday().reset();
      this.form.parallel().reset();
    });
    effect(() => {
      console.log('Periodo:', this.form.academicPeriod().value());
    });
    effect(() => {
      const workday = this.form.workday().value;
      if (!workday) return;
      this.form.parallel().reset();
      console.log('workday:', this.form.academicPeriod());
    });
  }

  onCurriculumChange(curriculum: any) {
    this.selectedCurriculum.set(curriculum);
    this.loadCareerParallels();
  }

  loadCareerParallels(): void {
    return;
  }


  previous() {
    this.enrollmentApplication.setStep(1);
    console.log('regresando ....')
  }

  onSubmit() {
    if (this.form().valid()) {
      const data: ApplicationData = {
        ...this.form().value(),
        enrollmentDetails: this.selectedItems
      };
      this.enrollmentApplication.updateApplication(data);
      console.log('aplication: ', data)
      const aplic = this.enrollmentApplication.application()
      console.log('aplication:signal -> ', aplic)
    } else {
      // const data: ApplicationData = {
      //   ...this.form().value(),
      //   enrollmentDetails: this.selectedItems
      // };
      // console.log('aplication: ',data)
      // this.enrollmentApplication.updateApplication(data);
      // const aplic=this.enrollmentApplication.application()
      // console.log('aplication:signal -> ',aplic)
      console.log(this.form().errors());
    }
  }
}