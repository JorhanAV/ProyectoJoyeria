import { Component, NgZone } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductoService } from '../../share/services/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResenaModel } from '../../share/models/ResenaModel';
import { ResenaService } from '../../share/services/resena.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-producto-detail',
  standalone: false,
  templateUrl: './producto-detail.html',
  styleUrl: './producto-detail.css',
})
export class ProductoDetail {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  imagenActiva: string = '';
  promedioValoracion: number = 0;
  estrellas: number[] = [1, 2, 3, 4, 5];
  precioAnterior: number = 0;
  precioFinal: number = 0;
  tipoDescuento: string | null = null;
  valorDescuento: number | null = null;
  fechaActual: Date = new Date();

  usuarioAutenticado = { id: 1 };

  // --- Relativo al formulario ---
  resenaForm!: FormGroup;
  number4digits = /^\d{4}$/;
  number2decimals = /^[0-9]+[.,]{1,1}[0-9]{2,2}$/;

  constructor(
    private prodService: ProductoService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private zone: NgZone
  ) {
    let id = this.activeRoute.snapshot.paramMap.get('id');
    if (!isNaN(Number(id))) this.obtenerProducto(Number(id));
  }
  obtenerProducto(id: any) {
    this.prodService
      .getById(id)
      .pipe(takeUntil(this.destroy$)) // Operador de RxJS para desuscribirse automáticamente
      .subscribe((data: any) => {
        this.datos = { ...data };
        console.log(data);
        const hoy = new Date();

        this.datos = data;
        const promociones = this.datos.promociones || [];
        let mejorPromocion: any = null;
        let mayorDescuento = 0;
        this.precioAnterior = this.datos.precio_base;
        this.precioFinal = this.precioAnterior;
        this.tipoDescuento = null;
        this.valorDescuento = null;
        this.imagenActiva = this.datos.imagenes[0]?.url || '';

        promociones.forEach((promo: any) => {
          const inicio = new Date(promo.fecha_inicio);
          const fin = new Date(promo.fecha_fin);
          const vigente = hoy >= inicio && hoy <= fin;
          // console.log(promo);
          if (!vigente) return;

          let descuentoActual = 0;

          if (promo.tipo === 'Porcentaje') {
            descuentoActual = this.precioAnterior * (promo.valor / 100);
          } else if (promo.tipo === 'Cantidad') {
            descuentoActual = promo.valor;
          }

          if (descuentoActual > mayorDescuento) {
            mayorDescuento = descuentoActual;
            mejorPromocion = promo;
            // console.log('Mejor promoción encontrada:', mejorPromocion);
          }
        });

        if (mejorPromocion) {
          this.tipoDescuento = mejorPromocion.tipo;
          this.valorDescuento = mejorPromocion.valor;
          this.precioFinal =
            mejorPromocion.tipo === 'Porcentaje'
              ? this.precioAnterior * (1 - mejorPromocion.valor / 100)
              : this.precioAnterior - mejorPromocion.valor;
        }

        // Calcular promedio basado en las reseñas visibles
        const resenas =
          this.datos.resenas?.filter((r: ResenaModel) => r.visible !== false) ||
          [];
        const total = resenas.reduce(
          (acc: number, r: ResenaModel) => acc + r.valoracion,
          0
        );
        this.promedioValoracion = resenas.length ? total / resenas.length : 0;
      });
  }
  goBack(): void {
    this.router.navigate(['/productos']);
  }
  //Hook del ciclo de vida de Angular: se ejecuta cuando el componente va a ser destruido
  ngOnDestroy() {
    this.destroy$.next(true); // Emite un valor para notificar a 'takeUntil'
    this.destroy$.unsubscribe(); // Completa el Subject 'destroy$' para liberar recursos
  }
  cambiarImagen(nombre: string) {
    this.imagenActiva = nombre;
  }

  mostrarFormularioResena = false;

  resenaRegistrada(res: ResenaModel) {
    this.datos.resenas = [...this.datos.resenas, res];

    console.log('Reseña registrada:', res);
    this.obtenerProducto(this.datos.id); // 👈 vuelve a consultar el producto

    this.mostrarFormularioResena = false;
  }
}
