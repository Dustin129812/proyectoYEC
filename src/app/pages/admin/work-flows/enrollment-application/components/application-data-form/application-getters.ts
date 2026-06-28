import { FieldTree } from "@angular/forms/signals";
import { ApplicationData } from "../../enrollment-application.state";


export abstract class ApplicationDataGetters {
    protected abstract formData: FieldTree<ApplicationData>;

    get studentField (){
        return this.formData.student;
    }

    get careerField(){
        return this.formData.career;
    }

    get academicPeriodField(){
        return this.formData.academicPeriod;
    }

    get parallelField (){
        return this.formData.parallel;
    }

    get schoolPeriodField (){
        return this.formData.schoolPeriod;
    }

    get workdayField (){
        return this.formData.workday;
    }

    get enrollmentDetailsField (){
        return this.formData.enrollmentDetails;
    }


}
