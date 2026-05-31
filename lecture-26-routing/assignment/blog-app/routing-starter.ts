// app.routes.ts
import { Routes } from '@angular/router';

// TODO: Define the routes for your blog application.
// You need paths for:
// 1. Home ('') -> load HomeComponent
// 2. Blog List ('posts') -> load PostListComponent
// 3. Blog Post Details ('posts/:id') -> load PostDetailComponent
// 4. Wildcard ('**') -> load NotFoundComponent

export const routes: Routes = [
  // ... add routes here
];


// app.component.ts
import { Component } from '@angular/core';
// import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [/* TODO: Import routing directives */],
  template: `
    <header>
      <h1>My Tech Blog</h1>
      <nav>
        <!-- TODO: Add a link to Home ('/') using routerLink -->
        <!-- TODO: Add a link to Posts ('/posts') using routerLink -->
      </nav>
    </header>

    <main>
      <!-- TODO: Add the router-outlet where the routed components will render -->
    </main>
  `
})
export class AppComponent {}


// post-detail.component.ts
import { Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  template: `
    <article>
      <h2>Post Details</h2>
      <p>Currently viewing post ID: {{ postId }}</p>
    </article>
  `
})
export class PostDetailComponent implements OnInit {
  // TODO: Inject ActivatedRoute
  // private route = inject(...);

  postId: string | null = null;

  ngOnInit() {
    // TODO: Subscribe to route.paramMap to get the 'id' parameter and assign it to this.postId
  }
}
