import { NgModule, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { ShareModule } from './share/share-module';
import { HomeModule } from './home/home-module';
import { UserModule } from './user/user-module';
import { ProductoModule } from './producto/producto-module';
import { OrdenModule } from './orden/orden-module';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { HttpErrorInterceptorService } from './share/http-error-interceptor.service';

import { PromocionesModule } from './promociones/promociones-module';
import { PedidosModule } from './pedidos/pedidos-module';
import { ResenasModule } from './resenas/resenas-module';

//import { provideAnimations } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ShareModule,
    HomeModule,
    UserModule,
    ProductoModule,
    OrdenModule,

    PromocionesModule,
    PedidosModule,
    ResenasModule,

    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    //provideAnimations(),
    { provide: LOCALE_ID, useValue: 'es' }, // Configura el idioma por defecto a español
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [App]
})
export class AppModule { }
