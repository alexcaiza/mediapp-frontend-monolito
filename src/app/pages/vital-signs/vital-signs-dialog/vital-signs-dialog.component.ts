import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VitalSign } from 'src/app/model/vitalSign';

@Component({
  selector: 'app-vital-signs-dialog',
  templateUrl: './vital-signs-dialog.component.html',
  styleUrls: ['./vital-signs-dialog.component.css']
})
export class VitalSignsDialogComponent implements OnInit {

  message: string = '';

  constructor(
    public dialogo: MatDialogRef<VitalSignsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VitalSign
  ) { }

  ngOnInit(): void {
    this.message = `You want to remove the vital signs of ${this.data.patient.firstName} ${this.data.patient.lastName}`;
  }

  cerrarDialogo(): void {
    this.dialogo.close(false);
  }

  confirmado(): void {
    this.dialogo.close(true);
  }

}
