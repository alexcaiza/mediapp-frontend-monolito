import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { concatMap, NEVER, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { PatientService } from 'src/app/service/patient.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VitalSignService } from 'src/app/service/vital-sign.service';

@Component({
  selector: 'app-vital-signs-patient',
  templateUrl: './vital-signs-patient.component.html',
  styleUrls: ['./vital-signs-patient.component.css']
})
export class VitalSignsPatientComponent implements OnInit {

  patient: Patient;

  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Patient,
    private dialogRef: MatDialogRef<VitalSignsPatientComponent>,
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private vitalsignService: VitalSignService,
  ) { }

  ngOnInit(): void {
    this.patient = { ...this.data };

    this.form = new FormGroup({
      'idPatient': new FormControl(0),
      'firstName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'lastName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'dni': new FormControl('', [Validators.required, Validators.maxLength(8)]),
      'address': new FormControl(''),
      'phone': new FormControl('', [Validators.required, Validators.minLength(9)]),
      'email': new FormControl('', [Validators.required, Validators.email])
    });
  }

  get f() {
    return this.form.controls;
  }

  operate1() {
    if(this.patient != null && this.patient.idPatient >0 ){
      //UPDATE
      this.patientService.update(this.patient).pipe(switchMap(()=>{
        return this.patientService.findAll();
      }))
      .subscribe(data => {
        this.patientService.patientChange.next(data);
        this.patientService.setMessageChange('UPDATED!');
      });
    }else{
      //SAVE
      this.patientService.save(this.patient).pipe(switchMap(()=>{
        return this.patientService.findAll();
      }))
      .subscribe(data => {
        this.patientService.patientChange.next(data);
        this.patientService.setMessageChange('CREATED!');
      });
    }
    this.close();
  }

  operate() {
    if (this.form.invalid) { return; }

    let patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    console.log('patient: ', patient);

    this.patientService.save(patient).subscribe(data=>{
      console.log('data1: ', data);
      if (data) {
        this.vitalsignService.setNewPatientChange(<Patient>data);
        this.vitalsignService.setMessageChange("CREATED PATIENT!");
        this.close();
      } else {
        this.vitalsignService.setMessageChange("ERROR CREATED PATIENT!")
      }
    });

    /*
    this.patientService.save(patient).pipe(concatMap((data)=>{
      console.log('data1: ', data);
      return this.patientService.findById(1);
    }))
    .subscribe(data => {
      console.log('data2: ', data);
      this.vitalsignService.setNewPatientChange(data);
      this.vitalsignService.setMessageChange("CREATED!")
    });
    */

    this.close();
  }

  close() {
    this.dialogRef.close();
  }

}
