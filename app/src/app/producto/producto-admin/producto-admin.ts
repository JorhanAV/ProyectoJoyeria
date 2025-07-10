import { Component } from '@angular/core';
import { ProductoService } from '../../share/services/producto.service';
import { NotificationService } from '../../share/notification-service';
import { Router } from '@angular/router';
import { ProductoModel } from '../../share/models/ProductoModel';
import { Subject, takeUntil } from 'rxjs';
import { ResenaModel } from '../../share/models/ResenaModel';

@Component({
  selector: 'app-producto-admin',
  standalone: false,
  templateUrl: './producto-admin.html',
  styleUrl: './producto-admin.css',
})
export class ProductoAdmin {
  datos: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  promedioValoracion: number = 0;

  constructor(
    private prodService: ProductoService,
    private noti: NotificationService,
    private router: Router
  ) {
    this.listProductos();
  }

  listProductos() {
    this.prodService.get().subscribe((respuesta: ProductoModel[]) => {
      this.datos = respuesta;
    });
  }
  obtenerProducto(id: any) {
    this.prodService
      .getById(id)
      .pipe(takeUntil(this.destroy$)) // Operador de RxJS para desuscribirse automáticamente
      .subscribe((data: any) => {
        this.datos = { ...data };
        console.log(data);
        const hoy = new Date();

        //this.imagenActiva = this.datos.imagenes[0]?.url || '';

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

    return this.datos;
  }

  verDetalle(id: number) {
    this.router.navigate(['/productos/detalle-admin', id]); // 🧭 Ruta de vista detalle para admins
  }

  editar(id: number) {
    this.router.navigate(['/producto/update', id]); // 📝 Reutilizar el formulario con ID
  }

  crearProducto() {
    this.router.navigate(['/producto/create']); // 🆕 Formulario sin ID para creación
  }

  productoActivo: ProductoModel | null = null;

  /*  mostrarDetalle(producto: ProductoModel) {
   
    this.productoActivo = this.obtenerProducto(producto.id);
    console.log('Producto activo:', this.productoActivo);
  } */
 mostrarDetalle(producto: ProductoModel) {
  this.prodService.getById(producto.id).subscribe((res: ProductoModel) => {
    this.productoActivo = res;
    console.log('Producto activo cargado:', res);

    const resenas = res.resenas?.filter((r: ResenaModel) => r.visible !== false) || [];
    const total = resenas.reduce((acc: number, r: ResenaModel) => acc + r.valoracion, 0);
    this.promedioValoracion = resenas.length ? total / resenas.length : 0;
  });
}


  cerrarDetalle() {
    this.productoActivo = null;
  }
}
