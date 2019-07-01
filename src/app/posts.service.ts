import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
                observe: 'events' //'body', 'response'
            }
        ).pipe(tap(event => {
            
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
                    params: searchParams
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