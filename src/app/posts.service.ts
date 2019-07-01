import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class PostsService {
    errorSubject = new Subject<string>();
    constructor(private http: HttpClient){}

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content};
        this.http.post<{name: string}>(
            'https://ng-http-c780a.firebaseio.com/posts.json',
             postData
             ).subscribe(responseData => {
              console.log('Recived From Server: ', responseData);
             }, error => {
                 this.errorSubject.next(error.message);
             });
    }
    deletePosts() {
        return this.http.delete('https://ng-http-c780a.firebaseio.com/posts.json');
    }

    fetchPosts() {
        return this.http
            .get<{ [key: string]: Post }>('https://ng-http-c780a.firebaseio.com/posts.json')
            .pipe(map(responseData => {
                const postArray: Post[] = [];
                for (const key in responseData) {
                    if (responseData.hasOwnProperty(key)) {
                        postArray.push({ ...responseData[key], id: key });
                    }
                }
                return postArray;
            }));
    }   
}