import { Component, OnInit,Input } from '@angular/core';
import {AlertController,LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import {ChatService} from "../../service/chat.service";
import {Storage} from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss'],
  standalone: false,
})
export class VersionComponent  implements OnInit {
  //check login
  public genaratedFullDate:any;
  public genaratedDate:any;
  public year:any;
  public month:any;
  public day:any;
  public hour:any;
  public minutes:any;
  public seconds:any;
  public mainUserName:any;
  public userName:any;
  public password:any;
  public apiKey:any;
  public sessionLogin:any;
  public department:any;
  public supervisor:any;
  public name:any;
  public isScroolTo:any=2;
  public countOfNewMsg:any=0;

  public update_ver_one: any;
  public update_ver_tow: any;
  public update_ver_three: any;
  public update_ver_for: any;

  //page setting
  public checkLanguage: any=0;
  public language: any;
  public menuDirection: any;
  public menuDirectionTow: any;
  public showPassword: boolean = false;

  constructor(private chatService: ChatService,private alertController:AlertController,private storage: Storage,private navCtrl: NavController,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private platform: Platform) {
  this.platform.backButton.subscribeWithPriority(10, () => {
    this.modalController.dismiss({
    })
  });
}
  functionClosePage(){
    this.modalController.dismiss({})
  }
  async initialiseTranslation(){
    this.translate.get('menuDirection').subscribe((res: string) => {
      this.menuDirection = res;
    });
    this.translate.get('menuDirectionTow').subscribe((res: string) => {
      this.menuDirectionTow = res;
    });
     this.translate.get('update_ver_one').subscribe((res: string) => {
      this.update_ver_one = res;
    });
     this.translate.get('update_ver_tow').subscribe((res: string) => {
      this.update_ver_tow = res;
    });
     this.translate.get('update_ver_three').subscribe((res: string) => {
      this.update_ver_three = res;
    });
     this.translate.get('update_ver_for').subscribe((res: string) => {
      this.update_ver_for = res;
    });
  }
  goTosend(){
    window.location.href = 'https://apps.apple.com/us/app/taqnyat-livechat/id6741383240';
  }
  async ngOnInit() {
    await this.getDeviceLanguage();
    await this.checkLoginUser();
  }
  async checkLoginUser(){
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
    this.password = await this.storage.get('password');
    this.apiKey = await this.storage.get('apiKey');
    this.sessionLogin = await this.storage.get('sessionLogin');
    this.department = await this.storage.get('department');
    this.supervisor = await this.storage.get('supervisor');
    this.name = await this.storage.get('name');
    if(this.mainUserName == null || this.userName == null || this.password == null || this.apiKey == null || this.sessionLogin == null || this.department == null || this.supervisor == null || this.name == null){
      this.storage.remove('mainUserName');
      this.storage.remove('userName');
      this.storage.remove('password');
      this.storage.remove('apiKey');
      this.storage.remove('sessionLogin');
      this.storage.remove('department');
      this.storage.remove('supervisor');
      this.storage.remove('name');
      this.navCtrl.navigateRoot('login');
    }
  }

  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async checkLanguage=>{
      this.checkLanguage = checkLanguage
    });
    if(this.checkLanguage){
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      this.initialiseTranslation();
    }else{
      if (window.Intl && typeof window.Intl === 'object') {
        let Val  = navigator.language.split("-");
        this.translate.setDefaultLang(Val[0]);
        if (Val[0] == "ar" || Val[0] == "en")
          this.language = Val[0];
        else
          this.language = 'en';
        this.translate.use(this.language);
        this.initialiseTranslation();
      }
      else{
        this.globalization.getPreferredLanguage().then(res => {
          let Val  = res.value.split("-");
          this.translate.setDefaultLang(Val[0]);
          if (Val[0] == "ar" || Val[0] == "en")
            this.language = Val[0];
          else
            this.language = 'en';
          this.translate.use(this.language);
          this.initialiseTranslation();
        }).catch(e => {console.log(e);});
      }
    }
  }
}
