import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model'
import { WebService } from '../web.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private socket;

  constructor(private webService: WebService) {
    this.socket = io(environment.apiURL)
    this.socket.on('posts-updated', () => {
      this._updatePostsList()
    })
  }

  _updatePostsList() {
    this.webService.get<Post[]>("posts").subscribe((posts) => {
      this.posts = posts
      this.postsUpdated.next(posts)
    })
  }

  getPosts() {
    this._updatePostsList()
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    this.webService.post('posts',{ _id:"1", title: title, content: content }).subscribe();
  }

  getPostObservable(postId: string) {
    return this.webService.get<Post>(`posts/${postId}`)
  }

  deletePost(postId: string) {
    this.webService.delete(`posts/${postId}`).subscribe();
  }

  editPost(postId: string, data: Object) {
    this.webService.put(`posts/${postId}`, data).subscribe();
  }
}
