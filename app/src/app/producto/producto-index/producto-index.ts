import { Component } from '@angular/core';
import { NotificationService } from '../../share/notification-service';
import { ProductoService } from '../../share/services/producto.service';
import { Router } from '@angular/router';
import { ProductoModel } from '../../share/models/ProductoModel';
import { MatDialog } from '@angular/material/dialog';
import { ProductoPersonalizable } from '../producto-personalizable/producto-personalizable';
import { CartService } from '../../share/cart.service';
import { ProductoPersonalizableCreateModel } from '../../share/models/ProductoPersonalizableDTO';
import { CategoriaService } from '../../share/services/categoria.service';
import { EtiquetaService } from '../../share/services/etiqueta.service';

@Component({
  selector: 'app-producto-index',
  standalone: false,
  templateUrl: './producto-index.html',
  styleUrl: './producto-index.css',
})
export class ProductoIndex {
  datos: any;
  /*   categorias: string[] = [];
  etiquetas: string[] = [];
 */

  categorias = ['Anillos','Collares','Pulseras'];
  etiquetas = ['Exclusivo','Nuevo'];

  filtros = {
    categoria: null as string | null,
    etiqueta: [] as string[],
  };

  productosFiltrados: ProductoModel[] = [];

  constructor(
    private prodService: ProductoService,
    private noti: NotificationService,
    private router: Router,
    private dialog: MatDialog,
    private cartService: CartService,
    private categoriaService: CategoriaService,
    private etiquetaService: EtiquetaService
  ) {
    this.listProductos();
    this.listCategorias();
    this.listEtiquetas();
  }

  ngOnInit() {
    this.listCategorias();
    this.listEtiquetas();
  }

  listCategorias() {
    this.categoriaService.get().subscribe((res: any[]) => {
      console.log(this.categorias);
      this.categorias = res.map((c) => c.nombre);
    });
  }
  listEtiquetas() {
    this.etiquetaService.get().subscribe((res: any[]) => {
      this.etiquetas = res.map((c) => c.nombre);
    });
  }

  aplicarFiltros() {
    this.productosFiltrados = this.datos.filter((producto: ProductoModel) => {
      const coincideCategoria =
        !this.filtros.categoria ||
        producto.categoria.nombre === this.filtros.categoria;

      const nombresEtiquetas =
        producto.etiquetas?.map((e) => e.etiqueta.nombre) || [];

      const coincideEtiquetas =
        this.filtros.etiqueta.length === 0 ||
        this.filtros.etiqueta.every((etiqueta) =>
          nombresEtiquetas.includes(etiqueta)
        );

      return coincideCategoria && coincideEtiquetas;
    });
  }

  toggleCategoria(nombre: string) {
    this.filtros.categoria = this.filtros.categoria === nombre ? null : nombre;
    this.aplicarFiltros();
  }

  toggleEtiqueta(nombre: string) {
    const index = this.filtros.etiqueta.indexOf(nombre);
    if (index === -1) {
      this.filtros.etiqueta.push(nombre);
    } else {
      this.filtros.etiqueta.splice(index, 1);
    }
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtros = {
      categoria: null,
      etiqueta: [],
    };
    this.aplicarFiltros();
  }

  //Listar todos los productos del API
  listProductos() {
    this.prodService.get().subscribe((respuesta: ProductoModel[]) => {
      const hoy = new Date();
      console.log(respuesta);
      this.datos = respuesta.map((producto) => {
        // Establece la imagen por defecto
        producto.imagenActual = producto.imagenes[0]?.url;

        // Encuentra promociones vigentes
        const promocionesVigentes = producto.promociones.filter((promo) => {
          const inicio = new Date(promo.fecha_inicio);
          const fin = new Date(promo.fecha_fin);
          return hoy >= inicio && hoy <= fin;
        });

        // Aplica la mejor promoción disponible
        let mejorDescuento = 0;
        let tipoDescuento: 'Porcentaje' | 'CantidadFija' | null = null;

        promocionesVigentes.forEach((promo) => {
          const aplicaPorProducto =
            promo.referencia_id_producto === producto.id;
          const aplicaPorCategoria =
            promo.referencia_id_categoria === producto.categoria_id;

          if (aplicaPorProducto || aplicaPorCategoria) {
            if (promo.tipo === 'Porcentaje') {
              if (
                promo.valor > mejorDescuento ||
                tipoDescuento !== 'Porcentaje'
              ) {
                mejorDescuento = promo.valor;
                tipoDescuento = 'Porcentaje';
              }
            } else if (promo.tipo === 'CantidadFija') {
              const descuentoTotal = promo.valor;
              const precioConDescuento = producto.precio_base - descuentoTotal;

              const descuentoPrevio =
                tipoDescuento === 'Porcentaje'
                  ? producto.precio_base * (mejorDescuento / 100)
                  : mejorDescuento;

              if (descuentoTotal > descuentoPrevio || tipoDescuento === null) {
                mejorDescuento = descuentoTotal;
                tipoDescuento = 'CantidadFija';
              }
            }
          }
        });

        if (tipoDescuento === 'Porcentaje') {
          producto.precioFinal =
            producto.precio_base * (1 - mejorDescuento / 100);
          producto.tienePromocion = true;
        } else if (tipoDescuento === 'CantidadFija') {
          producto.precioFinal = producto.precio_base - mejorDescuento;
          producto.tienePromocion = true;
        } else {
          producto.precioFinal = producto.precio_base;
          producto.tienePromocion = false;
        }

        return producto;
      });
      this.aplicarFiltros();
    });
  }
  agregarAlCarrito(producto?: ProductoModel): void {
    this.cartService.addToCart(producto);
  }
  agregarAlCarritoPPersonalizado(
    productoPersonalizado?: ProductoPersonalizableCreateModel
  ): void {
    this.cartService.addToCartPersonalized(productoPersonalizado);
  }
  detalle(id: Number) {
    this.router.navigate(['/producto', id]);
  }
  comprar(producto?: ProductoModel) {
    if (producto?.personalizable) {
      const dialogRef = this.dialog.open(ProductoPersonalizable, {
        width: '1000px',
        maxWidth: '95vw',
        data: producto,
      });
      dialogRef.afterClosed().subscribe((productoPersonalizado) => {
        if (productoPersonalizado) {
          this.agregarAlCarritoPPersonalizado(productoPersonalizado);
          // Aquí podrías agregar el producto al carrito con las opciones
          this.noti.success(
            'Personalización',
            'Producto personalizado agregado al carrito',
            3000
          );
          console.log('Producto Index:', productoPersonalizado);
        }
      });
    } else {
      if (producto) {
        this.agregarAlCarrito(producto);
        this.noti.success(
          'Compra',
          'Producto agregado: ' + producto?.nombre,
          3000
        );
      }
    }
  }
  cambiarImagen(producto: any, hover: boolean) {
    producto.imagenActual = hover
      ? producto.imagenes[1]?.url || producto.imagenes[0]?.url
      : producto.imagenes[0]?.url;
  }

  obtenerCategoria() {}
}
