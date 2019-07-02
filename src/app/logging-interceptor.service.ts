import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export class LoggingInterceptorService implements HttpInterceptor {
    intercept(req:HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('@LoggingInterceptorService) req url: ', req.url);
        console.log('@LoggingInterceptorService) req header: ', req.headers);
        return next.handle(req).pipe(
            tap( event => {
                if(event.type === HttpEventType.Response) {
                    console.log('@LoggingInterceptorService) response Body: ', event.body)
                }
            })
        );
    }
    
}