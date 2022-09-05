import { Patient } from "./patient";

export class VitalSign{
    idVitalSign: number;
    patient: Patient;
    vitalSignDate: string;
    temperature: string;
    pulse: string;
    rhythm: string;

    get firstName(): string {
      return (this.patient) ? this.patient.firstName : "";
    }

    get lastName(): string {
      return (this.patient) ? this.patient.lastName : "";
    }
}
