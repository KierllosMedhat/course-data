// app.config.ts (How to provide HttpClient in Angular v15+)
/*
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
*/

// ==========================================
// 1. HTTP SERVICE
// ==========================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  createPost(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }
}

// ==========================================
// 2. FUNCTIONAL INTERCEPTOR
// ==========================================
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from storage (mocked here)
  const authToken = 'MY_FAKE_JWT_TOKEN';

  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  // Pass the cloned request to the next handler
  return next(authReq);
};

// ==========================================
// 3. COMPONENT USING THE SERVICE
// ==========================================
import { Component, OnInit } from '@angular/core';
// import { PostService, Post } from './post.service';

@Component({
  selector: 'app-post-list',
  standalone: true,
  template: `
    <div class="container p-4">
      <h2>Posts from API</h2>
      
      @if (loading) {
        <div class="spinner-border" role="status"></div>
      }

      @if (error) {
        <div class="alert alert-danger">{{ error }}</div>
      }

      <ul class="list-group mt-3">
        @for (post of posts; track post.id) {
          <li class="list-group-item">
            <strong>{{ post.title }}</strong>
            <p class="mb-0 text-muted">{{ post.body }}</p>
          </li>
        }
      </ul>
    </div>
  `
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  
  posts: Post[] = [];
  loading = false;
  error = '';

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.loading = true;
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load posts.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
