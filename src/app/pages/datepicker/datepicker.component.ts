import { Component, OnInit,Input } from '@angular/core';
import {AlertController,LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  standalone: false,
})
export class DatepickerComponent  implements OnInit {
  public selectTime: any;
  public selectedTime: any;
  public ok: any;
  public cancel: any;
  //check login
public genaratedDate:any;
public year:any;
public month:any;
public day:any;
public mainUserName:any;
public userName:any;
public password:any;
public apiKey:any;
public sessionLogin:any;
public department:any;
public supervisor:any;
public name:any;
//page setting
public checkLanguage: any=0;
public language: any;
public menuDirection: any;
public menuDirectionTow: any;
constructor(private alertController:AlertController,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
  this.platform.backButton.subscribeWithPriority(10, () => {
    this.modalController.dismiss({})
  });
}
async initialiseTranslation(){
  this.translate.get('menuDirection').subscribe((res: string) => {
    this.menuDirection = res;
  });
  this.translate.get('menuDirectionTow').subscribe((res: string) => {
    this.menuDirectionTow = res;
  });
    this.translate.get('ok').subscribe((res: string) => {
      this.ok = res;
    });
    this.translate.get('cancel').subscribe((res: string) => {
      this.cancel = res;
    });
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
 functionClosePage(){
    this.modalController.dismiss({
      "time":""
    })
  }
    selectDate(event:any){
    if(event.target.value!=undefined){
      this.selectTime = event.target.value;
      let checkVal = this.selectTime.split('T');
        let dateOnly = checkVal[0];
         let parts = dateOnly.split('-'); 
        this.selectedTime = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    this.modalController.dismiss({
      "time":this.selectedTime
    })
  }
}
