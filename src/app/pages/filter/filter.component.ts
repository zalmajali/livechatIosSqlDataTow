import { Component, OnInit,Input } from '@angular/core';
import {AlertController,LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import {DatepickerComponent} from "../datepicker/datepicker.component";
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
   standalone: false,
})
export class FilterComponent  implements OnInit {
public dir: any;
public filter_date_one: any;
public filter_date_tow: any;
public filter_date_three: any;
public filter_date_fore: any;
public filter_date_five: any;
public filter_date_six: any;
public filter_date_seven: any;
public filter_Apply: any;
public from_date: any;
public to_date: any;
public first_dir:any;
public last_dir:any;
public selectedOption:any ;
public showInput:any = 0;
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
public showPassword: boolean = false;
constructor(private alertController:AlertController,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
  this.platform.backButton.subscribeWithPriority(10, () => {
    this.modalController.dismiss({})
  });
}
async selectFilter(event:any){
  this.selectedOption = event;
  if(this.selectedOption == 7)
    this.showInput = 1;
  else{
     this.showInput = 0;
    this.modalController.dismiss({
      "option":this.selectedOption
    })
  }
}
filter(){
  let fromDate ="";
  let toDate ="";
  if(this.selectedOption==7){
    if(this.from_date!="" && this.from_date!=null && this.from_date!=undefined && this.to_date!="" && this.to_date!=null  && this.to_date!=undefined ){
      this.selectedOption = 7;
      let from_parts = this.from_date.split('/');
      let to_parts = this.to_date.split('/');
      fromDate = `${from_parts[2]}${from_parts[1]}${from_parts[0]}`;
      toDate = `${to_parts[2]}${to_parts[1]}${to_parts[0]}`;
    }else{
      this.selectedOption = 1;
    }
  }
  this.modalController.dismiss({
    "option":this.selectedOption,
    "fromDate":fromDate,
    "toDate":toDate
  })
}
async initialiseTranslation(){
  this.translate.get('menuDirection').subscribe((res: string) => {
    this.menuDirection = res;
  });
  this.translate.get('menuDirectionTow').subscribe((res: string) => {
    this.menuDirectionTow = res;
  });
  this.translate.get('filter_date_one').subscribe((res: string) => {
    this.filter_date_one = res;
  });
  this.translate.get('filter_date_tow').subscribe((res: string) => {
    this.filter_date_tow = res;
  });
  this.translate.get('filter_date_three').subscribe((res: string) => {
    this.filter_date_three = res;
  });
  this.translate.get('filter_date_fore').subscribe((res: string) => {
    this.filter_date_fore = res;
  });
  this.translate.get('filter_date_five').subscribe((res: string) => {
    this.filter_date_five = res;
  });
  this.translate.get('filter_date_six').subscribe((res: string) => {
    this.filter_date_six = res;
  });
  this.translate.get('filter_date_seven').subscribe((res: string) => {
    this.filter_date_seven = res;
  });
  this.translate.get('filter_Apply').subscribe((res: string) => {
    this.filter_Apply = res;
  });
  this.translate.get('first_dir').subscribe((res: string) => {
      this.first_dir = res;
    });
    this.translate.get('last_dir').subscribe((res: string) => {
      this.last_dir = res;
    });
}
  async functionFilterPickerStart(){
    let model = await this.modalController.create({
      component:DatepickerComponent,
      animated:true,
      componentProps:{type:1,number:1,userNameThisConv:1},
      cssClass:"my-custom-modal-filter"
    });
    model.onDidDismiss().then((data):any=>{
     this.from_date = data.data.time
    });
    await model.present();
  }
  async functionFilterPickerEnd(){
    let model = await this.modalController.create({
      component:DatepickerComponent,
      animated:true,
      componentProps:{type:1,number:1,userNameThisConv:1},
      cssClass:"my-custom-modal-filter"
    });
    model.onDidDismiss().then((data):any=>{
      this.to_date = data.data.time
    });
    await model.present();
  }
async ngOnInit() {
  let selectedTime= await this.storage.get('selectTime');
  if(selectedTime != null && selectedTime!=undefined && selectedTime!=""){
  this.selectedOption = selectedTime;
    if(this.selectedOption == 7){
        let fromData = await this.storage.get('fromDataSelected');
        let toData = await this.storage.get('toDataSelected');
        if(fromData == null || fromData==undefined || fromData=="" || toData == null || toData==undefined || toData==""){
          this.selectedOption = 1;
          this.showInput = 0;
        }else{
          let yearf = fromData.substring(0, 4);
          let monthf = fromData.substring(4, 6);
          let dayf = fromData.substring(6, 8);
          this.from_date = `${dayf}/${monthf}/${yearf}`;
          let yeart = fromData.substring(0, 4);
          let montht = fromData.substring(4, 6);
          let dayt = fromData.substring(6, 8);
          this.to_date = `${dayt}/${montht}/${yeart}`;
          this.showInput = 1;
        }
    }
  }
  await this.getDeviceLanguage();
  await this.checkLoginUser();
  let currentDate = new Date();
  this.year = currentDate.getFullYear();
  this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
  this.day = currentDate.getDate();
  if(this.month<10)
    this.month = '0'+ this.month;
  if(this.day<10)
    this.day = '0'+ this.day;
  this.genaratedDate = this.year+""+this.month+""+this.day;
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
 async functionClosePage(){
  let selectedTime= await this.storage.get('selectTime');
  if(selectedTime != null && selectedTime!=undefined && selectedTime!=""){
  this.selectedOption = selectedTime;
    if(this.selectedOption == 7){
        let fromData = await this.storage.get('fromDataSelected');
        let toData = await this.storage.get('toDataSelected');
        if(fromData == null || fromData==undefined || fromData=="" || toData == null || toData==undefined || toData==""){
          this.selectedOption = 1;
          this.showInput = 0;
        }else{
          let yearf = fromData.substring(0, 4);
          let monthf = fromData.substring(4, 6);
          let dayf = fromData.substring(6, 8);
          this.from_date = `${dayf}/${monthf}/${yearf}`;
          let yeart = fromData.substring(0, 4);
          let montht = fromData.substring(4, 6);
          let dayt = fromData.substring(6, 8);
          this.to_date = `${dayt}/${montht}/${yeart}`;
          this.showInput = 1;
        }
    }
  }
    this.modalController.dismiss({
      "option":this.selectedOption
    })
  }
  async displayResult(message:any){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 4500,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
  }
}
