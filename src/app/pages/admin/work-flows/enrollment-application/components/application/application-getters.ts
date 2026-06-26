import { FieldTree } from "@angular/forms/signals";
import { ApplicationData } from "../../work-flow/enrollment-application.state";


export abstract class ApplicationDataGetters {
    protected abstract formData: FieldTree<ApplicationData>;

    get student (){
        return this.formData.student;
    }

    get career(){
        return this.formData.career;
    }

    get academicPeriod(){
        return this.formData.academicPeriod;
    }

    get parallel (){
        return this.formData.parallel;
    }

    get schoolPeriod (){
        return this.formData.schoolPeriod;
    }

    get workday (){
        return this.formData.workday;
    }

    get enrollmentDetails (){
        return this.formData.enrollmentDetails;
    }


}
