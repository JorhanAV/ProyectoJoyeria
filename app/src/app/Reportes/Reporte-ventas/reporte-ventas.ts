import { Component, OnInit } from '@angular/core';
import { NameValue, ReporteService } from '../../share/services/reporte.service';

type EstadoPedido = 'PendienteDePago' | 'Pagado' | 'EnPreparacion' | 'Entregado';

@Component({
  selector: 'app-dashboard',
  templateUrl: './reporte-ventas.html',
  styleUrls: ['./reporte-ventas.css'],
  standalone: false
})
export class ReporteVentas implements OnInit {
  // Fechas y filtros
  hoy = new Date();
  anioActual = this.hoy.getFullYear();
  mesActual = this.hoy.getMonth() + 1;
  estadoDefault: EstadoPedido = 'Pagado';

  fechaInicio: string = '';
  fechaFin: string = '';
  anio: number = this.anioActual;
  mes: number = this.mesActual;
  estado: EstadoPedido = this.estadoDefault;

  // Datos
  ventasDia: NameValue[] = [];
  ventasMes: NameValue[] = [];
  pedidosEstado: NameValue[] = [];
  topProductos: NameValue[] = [];
  ultimasResenas: any[] = [];

  // KPIs
  kpi = {
    totalItemsEnRango: 0,
    promedioDiario: 0,
    totalMensual: 0,
    estadoSeleccionadoTotal: 0,
    porcentajeEstadoVsTotal: 0,
    totalPedidos: 0,
  };

  // Charts
  chartVentasDia: any;
  chartVentasMes: any;
  chartPedidosEstado: any;

  estados: EstadoPedido[] = ['PendienteDePago', 'Pagado', 'EnPreparacion', 'Entregado'];
  meses = [
    { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Setiembre' },
    { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
  ];

  constructor(private api: ReporteService) {}

  ngOnInit(): void {
    this.fechaInicio = this.getStartOfDay(this.hoy);
    this.fechaFin = this.getEndOfDay(this.hoy);
    this.cargarTodo();
  }

  // --- Cargar datos ---
  cargarTodo(): void {
    this.cargarVentasDia();
    this.cargarVentasMes();
    this.cargarPedidosEstado();
    this.cargarTopProductos();
    this.cargarUltimasResenas();
  }

  cargarVentasDia(): void {
    this.api.getVentasPorDia({ fechaInicio: this.fechaInicio, fechaFin: this.fechaFin })
      .subscribe(data => {
        this.ventasDia = (data ?? []).map(d => ({
          name: d.name,
          value: typeof d.value === 'string' ? parseFloat(d.value) : d.value,
        }));
        this.calcularKPIsVentasDia();
        this.armarChartVentasDia();
      });
  }

  cargarVentasMes(): void {
    this.api.getVentasPorMes({ anio: this.anio, mes: this.mes })
      .subscribe(data => {
        this.ventasMes = (data ?? []).map(d => ({
          name: d.name,
          value: typeof d.value === 'string' ? parseFloat(d.value) : d.value,
        }));
        this.kpi.totalMensual = this.sumValues(this.ventasMes);
        this.armarChartVentasMes();
      });
  }

  cargarPedidosEstado(): void {
    this.api.getPedidosPorEstado({ anio: this.anio, mes: this.mes, estado: this.estado })
      .subscribe(data => {
        this.pedidosEstado = (data ?? []).map(d => ({
          name: d.name,
          value: typeof d.value === 'string' ? parseFloat(d.value) : d.value,
        }));
        this.calcularKPIsPedidosEstado();
        this.armarChartPedidosEstado();
      });
  }

  cargarTopProductos(): void {
    this.api.getTopProductos({ anio: this.anio, mes: this.mes })
      .subscribe(data => {
        this.topProductos = (data ?? []).map(d => ({
          name: d.name,
          value: typeof d.value === 'string' ? parseFloat(d.value) : d.value,
        }));
      });
  }

  cargarUltimasResenas(): void {
    this.api.getUltimasResenas()
      .subscribe(data => this.ultimasResenas = data ?? []);
  }

  // --- KPIs ---
  calcularKPIsVentasDia(): void {
    const total = this.sumValues(this.ventasDia);
    this.kpi.totalItemsEnRango = total;
    const dias = this.ventasDia.length || 1;
    this.kpi.promedioDiario = total / dias;
  }

  calcularKPIsPedidosEstado(): void {
    const totalGeneral = this.pedidosEstado.reduce((acc, x) => acc + (x.value || 0), 0);
    const actual = this.pedidosEstado.find(x => x.name === this.estado)?.value ?? 0;
    this.kpi.totalPedidos = totalGeneral;
    this.kpi.estadoSeleccionadoTotal = actual;
    this.kpi.porcentajeEstadoVsTotal = totalGeneral > 0 ? (actual / totalGeneral) * 100 : 0;
  }

  sumValues(arr: NameValue[]): number {
    return arr.reduce((acc, x) => acc + (x.value || 0), 0);
  }

  getPorcentajeProducto(p: any): number {
    if (!this.topProductos || this.topProductos.length === 0) return 0;
    const total = this.topProductos.reduce((a, b) => a + (b.value || 0), 0);
    return total > 0 ? (p.value / total) * 100 : 0;
  }

  // --- Charts ---
  armarChartVentasDia(): void {
    this.chartVentasDia = {
      title: { text: 'Ventas por día (items)' },
      data: this.ventasDia,
      series: [{
        type: 'line',
        xKey: 'name',
        yKey: 'value',
        yName: 'Cantidad',
        marker: { enabled: true, shape: 'circle', size: 6 },
        strokeWidth: 3
      }],
      axes: [
        { type: 'category', position: 'bottom' },
        { type: 'number', position: 'left' },
      ],
      legend: { enabled: false },
    };
  }

  armarChartVentasMes(): void {
    this.chartVentasMes = {
      title: { text: 'Ventas por mes (items)' },
      data: this.ventasMes,
      series: [{
        type: 'bar',
        xKey: 'name',
        yKey: 'value',
        yName: 'Cantidad',
        marker: { enabled: true, shape: 'circle', size: 6 },
        strokeWidth: 3
      }],
      axes: [
  { type: 'category', position: 'bottom', title: { text: 'Mes' } },
  { type: 'number', position: 'left', title: { text: 'Cantidad' } },
],
      legend: { enabled: false },
    };
  }

  armarChartPedidosEstado(): void {
    this.chartPedidosEstado = {
      title: { text: 'Pedidos por estado' },
      data: this.pedidosEstado,
      series: [{
        type: 'pie',
        angleKey: 'value',
        calloutLabelKey: 'name',
        innerRadiusRatio: 0.6
      }],
      legend: { enabled: true },
    };
  }

  // --- Handlers UI ---
  onAplicarFiltrosRango(): void {
    this.cargarVentasDia();
  }

  onAplicarFiltrosMes(): void {
    this.cargarVentasMes();
    this.cargarPedidosEstado();
    this.cargarTopProductos();
  }

  // --- Fechas Helpers ---
  private getStartOfDay(d: Date): string {
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())} 00:00:00`;
  }

  private getEndOfDay(d: Date): string {
    return `${d.getFullYear()}-${this.pad(d.getMonth() + 1)}-${this.pad(d.getDate())} 23:59:59`;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }
}
