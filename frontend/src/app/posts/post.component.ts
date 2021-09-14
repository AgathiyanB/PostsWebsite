import { Component } from '@angular/core';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { EditDialogComponent } from '../dialogs/edit-dialog/edit-dialog.component';
import { Post } from './post.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PostService } from './post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent{

  constructor(public dialog: MatDialog,public PostService: PostService) {
  }

  onDeleteRequest(postId: string) {
    const dialogRef = this.dialog.open(DeleteDialogComponent)
    dialogRef.afterClosed().subscribe((del) => {
      if(del) {
        this.PostService.deletePost(postId)
      }
    })
  }

  onEditRequest(postId: string) {
    this.PostService.getPostObservable(postId).subscribe((post: Post) => {
      const dialogRef = this.dialog.open(EditDialogComponent, {
        width: '300px',
        data: post.content
      })

      dialogRef.afterClosed().subscribe(data => {
        this.PostService.editPost(postId, data)
      });
    })
  }
}
