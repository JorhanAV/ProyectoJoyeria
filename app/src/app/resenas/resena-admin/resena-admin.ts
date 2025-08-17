import { Component } from '@angular/core';
import { ResenaModel } from '../../share/models/ResenaModel';
import { ReporteResenaModel } from '../../share/models/ReporteResenaModel';
import { ResenaService } from '../../share/services/resena.service';
import { ReporteResenaService } from '../../share/services/reporteResena.service';
import { ListadoResenas } from './listado-resenas/listado-resenas';
import { ListadoReportadas } from './listado-reportadas/listado-reportadas';

@Component({
  selector: 'app-resena-admin',
  standalone: false,
  templateUrl: './resena-admin.html',
  styleUrl: './resena-admin.css',
  
})
export class ResenaAdmin {
  constructor(
    private resenaService: ResenaService,
    private reporteResenaService: ReporteResenaService
  ){}

  vista: 'todas' | 'reportadas' = 'todas';
  resenas: ResenaModel[] = [];
  resenasReportadas: ReporteResenaModel[] = [];

  ngOnInit(): void {
    this.resenaService.get().subscribe((data) => (this.resenas = data));
    this.reporteResenaService.get().subscribe((data) => (this.resenasReportadas = data));
    console.log(this.resenasReportadas)
  }

  setVista(v: 'todas' | 'reportadas') {
  this.vista = v;
}
}
