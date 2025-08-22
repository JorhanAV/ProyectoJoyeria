import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  LOCALE_ID,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';
import { UserModule } from './user/user-module';
import { ProductoModule } from './producto/producto-module';
import { OrdenModule } from './orden/orden-module';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  HttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';

import { PromocionesModule } from './promociones/promociones-module';
import { PedidosModule } from './pedidos/pedidos-module';
import { ResenasModule } from './resenas/resenas-module';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpAuthInterceptorService } from './share/http-auth-interceptor.service';

import { PagoModalComponent } from './pedidos/Carrito-Component/ProcesoPago/pago-modal';
import { ReporteRoutingModule } from './Reportes/reporte-routing-module';
import { ReporteModule } from './Reportes/reporte-module';
import { PersonalizacionIndex } from './personalizacion/personalizacion-index/personalizacion-index';
import { PersonalizacionForm } from './personalizacion/personalizacion-form/personalizacion-form';
import { PersonalizacionAdmin } from './personalizacion/personalizacion-admin/personalizacion-admin';
import { PersonalizacionModule } from './personalizacion/personalizacion-module';
import { etiquetasModule } from './etiquetas/etiquetas-module';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/i18n/', '.json');
}

@NgModule({
  declarations: [App],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    CoreModule,
    ShareModule,
    HomeModule,
    UserModule,
    ProductoModule,
    OrdenModule,
    PromocionesModule,
    PedidosModule,
    ResenasModule,
    PersonalizacionModule,
    etiquetasModule,
    ReporteModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    //provideAnimations(),
    { provide: LOCALE_ID, useValue: 'es' }, // Configura el idioma por defecto a español
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
