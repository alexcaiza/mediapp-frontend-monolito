import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Patient } from '../model/patient';
import { VitalSign } from '../model/vitalSign';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class VitalSignService extends GenericService<VitalSign>{

  patientChange = new Subject<VitalSign[]>;

  private newPatientChange = new Subject<Patient>;

  private messageChange = new Subject<string>;

  constructor(protected override http: HttpClient) {
    super(
      http,
      `${environment.HOST}/vitalsigns`
      );
  }

  listPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  //private url: string = `${environment.HOST}/patients`;

  /*constructor(private http: HttpClient) { }

  findAll(){
    return this.http.get<Patient[]>(this.url);
  }

  findById(idPatient: number){
    return this.http.get<Patient>(`${this.url}/${idPatient}`)
  }

  save(patient: Patient){
    return this.http.post(this.url, patient);
  }

  update(patient: Patient){
    return this.http.put(this.url, patient);
  }

  delete(idPatient: number){
    return this.http.delete(`${this.url}/${idPatient}`)
  }*/

  ///////////////////////
  setMessageChange(message: string){
    this.messageChange.next(message);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }

  setNewPatientChange(patient: Patient){
    this.newPatientChange.next(patient);
  }

  getNewPatientChange(){
    return this.newPatientChange.asObservable();
  }
}
