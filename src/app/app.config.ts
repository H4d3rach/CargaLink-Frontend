import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { InterceptorService } from './servicios/autenticacion/interceptor.service';
import { InterceptorErrorService } from './servicios/autenticacion/interceptor-error.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptorsFromDi()), //Declaramos el uso de routes y provider http client
    {provide:HTTP_INTERCEPTORS,useClass:InterceptorService,multi:true}, //Declaramos el uso de interceptores
    {provide:HTTP_INTERCEPTORS,useClass:InterceptorErrorService, multi:true} //Declaramos el uso de interceptores
  ]
};

