import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // TODO: Inject the HttpClient dependency
  private http = inject(HttpClient);
  
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  // TODO: Implement getPosts() to return an Observable of Post[] from the apiUrl
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }
}
