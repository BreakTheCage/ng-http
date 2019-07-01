import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
        //req.url ...
        console.log('Request is on its way; req: ', req);
        //req is immutable; for modefying req:
        const modifiedRequest = req.clone({
            //url: 'some-new-url',
            headers: req.headers.append("Auth", 'xyz')
        });
        return next.handle(modifiedRequest);
    }

}