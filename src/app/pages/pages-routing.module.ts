import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../service/guard.service';
import { ConsultAutocompleteComponent } from './consult-autocomplete/consult-autocomplete.component';
import { ConsultWizardComponent } from './consult-wizard/consult-wizard.component';
import { ConsultComponent } from './consult/consult.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamEditComponent } from './exam/exam-edit/exam-edit.component';
import { ExamComponent } from './exam/exam.component';
import { MedicComponent } from './medic/medic.component';
import { Not403Component } from './not403/not403.component';
import { PatientEditComponent } from './patient/patient-edit/patient-edit.component';
import { PatientComponent } from './patient/patient.component';
import { ReportComponent } from './report/report.component';
import { SearchComponent } from './search/search.component';
import { SpecialtyEditComponent } from './specialty/specialty-edit/specialty-edit.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { VitalSignsEditComponent } from './vital-signs/vital-signs-edit/vital-signs-edit.component';
import { VitalSignsComponent } from './vital-signs/vital-signs.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'patient', component: PatientComponent, children: [
      { path: 'new', component: PatientEditComponent },
      { path: 'edit/:id', component: PatientEditComponent }
    ], canActivate: [GuardService]
  },
  {
    path: 'exam', component: ExamComponent, children: [
      { path: 'new', component: ExamEditComponent },
      { path: 'edit/:id', component: ExamEditComponent }
    ], canActivate: [GuardService]
  },
  {
    path: 'specialty', component: SpecialtyComponent, children: [
      { path: 'new', component: SpecialtyEditComponent },
      { path: 'edit/:id', component: SpecialtyEditComponent }
    ], canActivate: [GuardService]
  },
  { path: 'medic', component: MedicComponent, canActivate: [GuardService] },
  { path: 'consult', component: ConsultComponent, canActivate: [GuardService] },
  { path: 'consult-autocomplete', component: ConsultAutocompleteComponent, canActivate: [GuardService] },
  { path: 'consult-wizard', component: ConsultWizardComponent, canActivate: [GuardService] },
  { path: 'search', component: SearchComponent, canActivate: [GuardService] },
  { path: 'report', component: ReportComponent, canActivate: [GuardService] },
  { path: 'not-403', component: Not403Component},
  {
    path: 'vital-signs', component: VitalSignsComponent, children: [
      { path: 'new', component: VitalSignsEditComponent },
      { path: 'edit/:id', component: VitalSignsEditComponent }
    ], canActivate: [GuardService]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
