import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';


@Injectable({providedIn: 'root'})
export class PostsService {
    errorSubject = new Subject<string>();
    constructor(private http: HttpClient){}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content};
        this.http
            .post<{name: string}>(
            'https://ng-http-c780a.firebaseio.com/posts.json',
             postData,
             {
                 //default: 'body': only we get body of response
                 observe: 'response'
             }
             )
             .subscribe(responseData => {
              console.log('Recived From Server: ', responseData);
             }, error => {
                 this.errorSubject.next(error.message);
             });
    }
    deletePosts() {
        return this.http.delete(
            'https://ng-http-c780a.firebaseio.com/posts.json',
            {
                observe: 'events', //'body', 'response'
                responseType: 'text' //'blob': fiel, 'json': convert automatically, 'text': don't convert
            }
        ).pipe(tap(event => {
            console.log('event: ', event);
            if (event.type === HttpEventType.Sent) {
                //request is sent and we are waiting for response ...
                console.log('event is sent...');
            }
            if (event.type === HttpEventType.Response) {
                console.log("Event Body: ", event.body);
            }
        }));
    }

    fetchPosts() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print','pretty');
        searchParams = searchParams.append('myCustom','myKey');
        return this.http
            .get<{ [key: string]: Post }>(
                'https://ng-http-c780a.firebaseio.com/posts.json',
                {
                    headers: new HttpHeaders({"My-Custom-Header": "Hello"}),
                    // params: new HttpParams().set('print','pretty'),
                    params: searchParams,
                    responseType: 'json'
                }
            )
            .pipe(
                map(responseData => {
                const postArray: Post[] = [];
                for (const key in responseData) {
                    if (responseData.hasOwnProperty(key)) {
                        postArray.push({ ...responseData[key], id: key });
                    }
                }
                return postArray;
                }),
                catchError(errorRes => {
                    //send to analytic server
                    return throwError(errorRes);
                })
            );
    }   
}