import { required } from "@angular/forms/signals"

export function validateApplicationData(schema:any){
required(schema.student,{
    message:'El estudiante es necesario'
})
required(schema.career,{
    message:'La carrera es necesaria'
})
required(schema.schoolPeriod,{
    message:'El periodo ecolar es necesario'
})
required(schema.academicPeriod,{
    message:'El periodo lectivo es necesario'
})
required(schema.workday,{
    message:'El workday es necesario'
})
required(schema.parallel,{
    message:'El paralelo es necesario'
})
required(schema.enrollmentDetails,{
    message:'El enrollmentDetails es necesario'
})
}