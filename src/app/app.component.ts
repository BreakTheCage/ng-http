import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    console.log('Posted To Server: ', postData);
    this.http.post(
        'https://ng-http-c780a.firebaseio.com/posts.json',
         postData
         ).subscribe(responseData => {
          console.log('Recived From Server: ', responseData);
         });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    this.http
      .get<{[key: string]: Post }>('https://ng-http-c780a.firebaseio.com/posts.json')
      .pipe(map(responseData  => {
        const postArray: Post[] = [];
        console.log('original response data: ',responseData);
        for(const key in responseData) {
          console.log('key: ',key);
          if(responseData.hasOwnProperty(key)) {
            console.log('responseData[key]: ',responseData[key]);
            postArray.push({...responseData[key], id: key});
          }
        }
        return postArray;
      }))
      .subscribe(posts => {
        console.log('Fetche Posts:', posts);
    })
  }
}
