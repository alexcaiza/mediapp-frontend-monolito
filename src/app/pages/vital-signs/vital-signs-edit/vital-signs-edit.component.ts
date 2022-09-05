import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/model/patient';
import { VitalSign } from 'src/app/model/vitalSign';
import { PatientService } from 'src/app/service/patient.service';
import { VitalSignService } from 'src/app/service/vital-sign.service';
import * as moment from 'moment';
import {FloatLabelType} from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VitalSignsPatientComponent } from '../vital-signs-patient/vital-signs-patient.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vital-signs-edit',
  templateUrl: './vital-signs-edit.component.html',
  styleUrls: ['./vital-signs-edit.component.css']
})
export class VitalSignsEditComponent implements OnInit {

  id: number;
  isEdit: boolean;
  form: FormGroup;

  patients: Patient[];
  patientControl: FormControl = new FormControl(null, [Validators.required]);
  patientsFiltered$: Observable<Patient[]>;

  maxDate: Date = new Date();

  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vitalSignService: VitalSignService,
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    this.vitalSignService.getNewPatientChange().subscribe(data => {
      console.log('NewPatientChange[subscribe]: ', data);
      this.loadInitialPatients(data);
    });

    this.form = new FormGroup({
      'idVitalSign': new FormControl(0),
      'temperature': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'pulse': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'rhythm': new FormControl('', [Validators.required, Validators.minLength(1)]),
      'patient' : this.patientControl,
      'vitalSignDate': new FormControl(),
    });

    this.loadInitialPatients(null);

    this.patientsFiltered$ = this.patientControl.valueChanges.pipe(map(val => this.filterPatients(val)));

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  /**
   * Inicializa la lista de pacientes con el paciente seleccionado o nuevo
   * @param patient
   */
  loadInitialPatients(patient: Patient){
    this.patientService.findAll().subscribe(data => {
        this.patients = data;
        if (patient) {
          this.patientControl.setValue(patient);
        }
    });
  }

  // val.toLowerCase is not a function
  filterPatients(val: any){
    console.log('Method filterPatients()');
    if(val?.idPatient > 0){
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase()) || el.dni.includes(val)
      )
    }else{
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
      )
    }
  }

  showPatient(val: any){
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  initForm() {
    if (this.isEdit) {

      this.vitalSignService.findById(this.id).subscribe(data => {

        this.patientControl.setValue(data.patient);

        this.form = new FormGroup({
          'idVitalSign': new FormControl(data.idVitalSign),
          'temperature': new FormControl(data.temperature, [Validators.required, Validators.minLength(1)]),
          'pulse': new FormControl(data.pulse, [Validators.required, Validators.minLength(1)]),
          'rhythm': new FormControl(data.rhythm, [Validators.required, Validators.minLength(1)]),
          'patient' : this.patientControl,
          'vitalSignDate': new FormControl(data.vitalSignDate),
        });

      });
    }
  }

  get f() {
    return this.form.controls;
  }

  operate() {
    if (this.form.invalid) { return; }

    let vitalSign = new VitalSign();
    vitalSign.idVitalSign = this.form.value['idVitalSign'];
    vitalSign.patient = this.form.value['patient'];
    vitalSign.temperature = this.form.value['temperature'];
    vitalSign.pulse = this.form.value['pulse'];
    vitalSign.rhythm = this.form.value['rhythm'];

    vitalSign.vitalSignDate = moment(this.form.value['vitalSignDate']).format('YYYY-MM-DDTHH:mm:ss');

    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN
      this.vitalSignService.update(vitalSign).subscribe(() => {
        this.vitalSignService.findAll().subscribe(data => {
          console.log('data edit: ', data);
          this.vitalSignService.patientChange.next(data);
          this.vitalSignService.setMessageChange('UPDATED!')
        });
      });
    } else {
      //INSERT
      //PRACTICA IDEAL
      this.vitalSignService.save(vitalSign).pipe(switchMap(()=>{
        return this.vitalSignService.findAll();
      }))
      .subscribe(data => {
        console.log('data save: ', data);
        this.vitalSignService.patientChange.next(data);
        this.vitalSignService.setMessageChange("CREATED!")
      });
    }
    this.router.navigate(['/pages/vital-signs']);
  }

  openDialog(vitalSign?: VitalSign){
    let patient = new Patient();
    this.dialog.open(VitalSignsPatientComponent, {
      width: '450px',
      data: patient
    });
  }
}
