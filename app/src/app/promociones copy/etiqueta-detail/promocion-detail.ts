import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromocionService } from '../../share/services/promocion.service';
import { NumericLiteral } from 'typescript';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-promocion-detail',
  standalone: false,
  templateUrl: './promocion-detail.html',
  styleUrl: './promocion-detail.css',
})
export class PromocionDetail implements OnInit {
  idPromocion!: number;
  productos: any[] = [];
  promo: any;
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private promoService: PromocionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idPromocion = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(Number(this.idPromocion))) this.obtenerPromo(Number(this.idPromocion));
    this.cargarProductosConPromo();
  }

  cargarProductosConPromo() {
    this.promoService.getAllProductsWithPromo(this.idPromocion).subscribe({
      next: (data) => (this.productos = data),
      error: (err) => console.error(err),
    });
  }
  verDetalleProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }
  getImagenPrincipal(producto: any): string {
    if (producto.imagenes && producto.imagenes.length > 0) {
      return producto.imagenes[0].url;
    }
    return 'https://via.placeholder.com/250'; // Imagen por defecto
  }
  obtenerPromo(id: number) {
    this.promoService
      .getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        console.log(data);
        this.datos = data;
      });
  }
  goback() {
    this.router.navigate(['/promocion']);
  }

  ngOnDestroy() {
    this.destroy$.next(true); 
    this.destroy$.unsubscribe();
  }
}
