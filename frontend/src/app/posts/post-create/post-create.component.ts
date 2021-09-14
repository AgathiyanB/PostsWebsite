import { Component } from "@angular/core";
import { NgForm } from "@angular/forms"

import { PostService } from "../post.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = 'poop';
  enteredContent = '';

  constructor(public PostService: PostService) {

  }

  onAddPost(form : NgForm) {
    if (form.invalid) {
      return
    }
    this.PostService.addPost(form.value.title,form.value.content)
    form.resetForm()
  }
}
