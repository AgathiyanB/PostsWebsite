import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditDialogComponent } from './dialogs/edit-dialog/edit-dialog.component';
import { DeleteDialogComponent } from './dialogs/delete-dialog/delete-dialog.component';
import { PostService } from './posts/post.service';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Agi\'s first website'

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
