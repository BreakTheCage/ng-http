import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
        //req is immutable; for modefying req:
        const modifiedRequest = req.clone({
            //url: 'some-new-url',
            headers: req.headers.append("Auth", 'xyz')
        });
        return next.handle(modifiedRequest);
    }

}