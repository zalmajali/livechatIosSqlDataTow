import { Component, OnInit,Input } from '@angular/core';
import {AlertController,LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-showimage',
  templateUrl: './showimage.component.html',
  styleUrls: ['./showimage.component.scss'],
})
export class ShowimageComponent  implements OnInit {
@Input() image: string | any;
  constructor(private modalController: ModalController) { }

ngOnInit() {}
 close(){
    this.modalController.dismiss({
    })
  }
}
