import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { EditComponent } from './edit/edit.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'canvas', component: CanvasComponent },
  { path: 'edit', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
