import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from './post.model'

import { WebService } from '../web.service';
import { SocketService } from '../socket.service';
import { AuthService } from '../auth.service';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private socket;

  constructor(private webService: WebService, private socketService: SocketService) {
    this.socket = socketService.getSocket('',{})
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
