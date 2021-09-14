import { Component, Output, OnDestroy, EventEmitter } from "@angular/core";
import { OnInit } from '@angular/core'
import { Subscription } from "rxjs";

import { PostService } from "../post.service";

import { Post } from '../post.model'

@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls:['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  @Output() editRequest = new EventEmitter<string>()
  @Output() deleteRequest = new EventEmitter<string>()

  posts : Post[] = [];
  private postsSub: Subscription;


  constructor(public PostService: PostService) {
    this.postsSub = this.PostService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts
      });
  }

  deletePost(postId: string) {
    this.deleteRequest.emit(postId)
  }

  editPost(postId: string) {
    this.editRequest.emit(postId)
  }

  ngOnInit() {
    this.posts = this.PostService.getPosts()
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
