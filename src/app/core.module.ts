import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  // don't need to export services since they are automatically injected at the root level
  // providers has all services (can also use @Injectable{providedIn: 'root'} for the service)
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {} // core module is for all services
