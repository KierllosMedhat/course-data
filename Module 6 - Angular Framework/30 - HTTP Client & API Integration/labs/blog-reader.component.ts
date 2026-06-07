import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { PostService } from './post.service';

@Component({
  selector: 'app-blog-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-reader.component.html',
  styleUrls: ['./blog-reader.component.css']
})
export class BlogReaderComponent {
  private postService = inject(PostService);

  // TODO: Use the rxResource API to load the posts using the postService.getPosts() method.
  // This will expose signals: postsResource.isLoading(), postsResource.value(), and postsResource.error()
  postsResource = rxResource({
    loader: () => this.postService.getPosts()
  });
}
