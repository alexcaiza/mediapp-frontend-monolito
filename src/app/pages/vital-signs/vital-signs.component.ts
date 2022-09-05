import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { mergeMap, switchMap } from 'rxjs';
import { VitalSignService } from 'src/app/service/vital-sign.service';
import { ActivatedRoute } from '@angular/router';
import { VitalSign } from 'src/app/model/vitalSign';
import { MatDialog } from "@angular/material/dialog";
import { VitalSignsDialogComponent } from './vital-signs-dialog/vital-signs-dialog.component';

@Component({
  selector: 'app-vital-signs',
  templateUrl: './vital-signs.component.html',
  styleUrls: ['./vital-signs.component.css']
})
export class VitalSignsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'temperature', 'pulse', 'rhythm', 'vitalSignDate', 'actions'];
  dataSource: MatTableDataSource<VitalSign>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  totalElements: number;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private vitalsignService: VitalSignService,
    public dialogo: MatDialog
  ) { }

  ngOnInit(): void {
    this.vitalsignService.patientChange.subscribe(data => {
      console.log('patientChange[subscribe]: ', data);
      //this.createTable(data);
      this.initTable();
    });

    this.vitalsignService.getMessageChange().subscribe(data => {
      console.log('getMessageChange[subscribe]: ', data);
      this.snackBar.open(data, 'INFO', { duration: 3000, verticalPosition: "bottom", horizontalPosition: "center" });
    });


    this.initTable();


    /*this.vitalsignService.findAll().subscribe(data => {
      console.log('data: ', data);
      this.createTable(data);
    });*/

  }

  initTable() {
    this.vitalsignService.listPageable(0, 10).subscribe(data => {
      this.createTable(data);
    });
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(idVitalSign: number){
    this.vitalsignService.delete(idVitalSign).pipe(switchMap( ()=> {
      return this.vitalsignService.findAll();
    }))
    .subscribe(data => {
      this.vitalsignService.patientChange.next(data);
      this.vitalsignService.setMessageChange('DELETED!');
    })
    ;
  }

  /**
   * Create table list on vital signs
   * @param patients
   */
  createTable(page: any){
    this.dataSource = new MatTableDataSource(page.content);
    this.totalElements = page.totalElements;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    this.initFilterPredicate();
  }

  /**
   * Filter predicate for filter search
   */
  initFilterPredicate() {
    this.dataSource.filterPredicate = function (record,filter) {
      let band: boolean =
        record.patient.firstName.toLowerCase().includes(filter.toLowerCase())
        || record.patient.lastName.toLowerCase().includes(filter.toLowerCase())
        || record.temperature.toLowerCase().includes(filter.toLowerCase())
        || record.rhythm.toLowerCase().includes(filter.toLowerCase())
        || record.vitalSignDate.toLowerCase().includes(filter.toLowerCase())
        ;
      return band;
    }
  }

  showMore(e: any){
    this.vitalsignService.listPageable(e.pageIndex, e.pageSize).subscribe(data => this.createTable(data));
  }

  checkChildren(): boolean{
    //console.log('checkChildren: ' + this.route.children.length);
    return this.route.children.length != 0;
  }

  showDialogDelete(vitalSign: VitalSign): void {
    this.dialogo
      .open(VitalSignsDialogComponent, {
        data: vitalSign
      })
      .afterClosed()
      .subscribe((confirmed: Boolean) => {
        if (confirmed) {
          this.vitalsignService.delete(vitalSign.idVitalSign)
          .pipe(
            switchMap(()=>{
              return this.vitalsignService.listPageable(0, 10);
            })
          )
          .subscribe(data=>{
            this.createTable(data);
            this.vitalsignService.setMessageChange('DELETED!');
          });
        }
      });
  }

}
