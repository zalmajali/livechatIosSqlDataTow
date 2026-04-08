import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import {LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import {ChatService} from "../../service/chat.service";
import {DatabaseService} from "../../service/database.service";
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import {FilterComponent} from "../filter/filter.component";
@Component({
  selector: 'app-archivenumber',
  templateUrl: './archivenumber.page.html',
  styleUrls: ['./archivenumber.page.scss'],
  standalone:false
})
export class ArchivenumberPage implements OnInit {
  @ViewChild('scrollableDiv', { static: false }) scrollableDiv!: ElementRef;
 public arrow_back:any;
  public arrow_go:any;
  public floatD:any;
  public menue_up_one:any;
  public menue_up_tow:any;
  public menue_up_Three:any;
  public menue_down_on:any;
  public menue_down_tow:any;
  public menue_down_Three:any;
  public menue_down_four:any;
  public returnResultData:any;
  public returnChatArray:any = [];
  public returnChatSearchArray:any = [];
  public returnArrayChatFromServer:any;
  public returnResultDataByNumber:any;
  public returnArrayChatDataByNumberFromServer:any;
  public chatVal:any = 2;
  public noExisting:any;
  public searchData:any;
  public msg_count:any;
  public showSearch:boolean = false;
  public showSearchs:boolean = true;
  public search:any;
  public showCloseSearch:any=0;
  public timeCheck:any;
  public searchType:any=0;
  public searchChatVal:any = 2;
  public selectTime:any=1;
  public selectedDateRange:any;
  public fromData:any="";
  public toData:any="";
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
  public page:number=1;
  public search_no_data:any;
  //page setting
  public checkLanguage: any=0;
  public language: any;
  public menuDirection: any;
  public menuDirectionTow: any;
  public showPassword: boolean = false;
  constructor(private databaseService: DatabaseService,private router: Router,private chatService: ChatService,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
    this.menu.enable(false,"sideMenu");
  }
  initialiseTranslation(){
    this.translate.get('menuDirection').subscribe((res: string) => {
      this.menuDirection = res;
    });
    this.translate.get('menuDirectionTow').subscribe((res: string) => {
      this.menuDirectionTow = res;
    });
    this.translate.get('floatD').subscribe((res: string) => {
      this.floatD = res;
    });
    this.translate.get('arrow_back').subscribe((res: string) => {
      this.arrow_back = res;
    });
    this.translate.get('arrow_go').subscribe((res: string) => {
      this.arrow_go = res;
    });
    this.translate.get('menue_up_one').subscribe((res: string) => {
      this.menue_up_one = res;
    });
    this.translate.get('menue_up_tow').subscribe((res: string) => {
      this.menue_up_tow = res;
    });
    this.translate.get('menue_up_Three').subscribe((res: string) => {
      this.menue_up_Three = res;
    });
    this.translate.get('menue_down_on').subscribe((res: string) => {
      this.menue_down_on = res;
    });
    this.translate.get('menue_down_tow').subscribe((res: string) => {
      this.menue_down_tow = res;
    });
    this.translate.get('menue_down_Three').subscribe((res: string) => {
      this.menue_down_Three = res;
    });
    this.translate.get('menue_down_four').subscribe((res: string) => {
      this.menue_down_four = res;
    });
    this.translate.get('noExistingChat').subscribe((res: string) => {
      this.noExisting = res;
    });
     this.translate.get('search_no_data').subscribe((res: string) => {
      this.search_no_data = res;
    });
    this.translate.get('msg_count').subscribe((res: string) => {
      this.msg_count = res;
    });
    this.translate.get('search').subscribe((res: string) => {
      this.search = res;
    });
  }
   ngOnInit() {
    // خليه فاضي أو أشياء ثابتة فقط
  }
async ionViewWillEnter() {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
    });
    await loading.present(); // ✅ اعرضه مباشرة
    try {
      await this.getDeviceLanguage();
      await this.checkLoginUser();
      this.mainUserName = await this.storage.get('mainUserName');
      this.userName = await this.storage.get('userName');
      this.password = await this.storage.get('password');
      this.apiKey = await this.storage.get('apiKey');
      this.sessionLogin = await this.storage.get('sessionLogin');
      let selectedTime= await this.storage.get('selectTime');
      if(selectedTime != null && selectedTime!=undefined && selectedTime!=""){
        this.selectTime = selectedTime;
        if(this.selectTime == 7){
           this.fromData = await this.storage.get('fromDataSelected');
           this.toData = await this.storage.get('toDataSelected');
           if(this.fromData == null || this.fromData==undefined || this.fromData=="" || this.toData == null || this.toData==undefined || this.toData==""){
            this.selectTime = 1
           }
        }
      }
      const currentDate = new Date();
      this.year = currentDate.getFullYear();
      this.month = currentDate.getMonth() + 1;
      this.day = currentDate.getDate();
      this.hour = currentDate.getHours();
      this.minutes = currentDate.getMinutes();
      this.seconds = currentDate.getSeconds();
      if (this.month < 10) this.month = '0' + this.month;
      if (this.day < 10) this.day = '0' + this.day;
      if (this.hour < 10) this.hour = '0' + this.hour;
      if (this.minutes < 10) this.minutes = '0' + this.minutes;
      if (this.seconds < 10) this.seconds = '0' + this.seconds;
      this.genaratedDate = `${this.year}${this.month}${this.day}`;
      this.genaratedFullDate = `${this.year}${this.month}${this.day}${this.hour}${this.minutes}${this.seconds}`;
      await this.functionReturnData();
    } finally {
      await loading.dismiss(); // ✅ ينسكر مهما صار
    }
  }
  async functionFilterformation(){
    let model = await this.modalController.create({
      component:FilterComponent,
      animated:true,
      componentProps:{type:1,number:1,userNameThisConv:1},
      cssClass:"my-custom-modal-filter"
    });
    model.onDidDismiss().then(async (data)=>{
       const loading = await this.loading.create({
          cssClass: 'my-custom-class',
          message: '',
        });
      try{
        await loading.present();
        this.selectTime = data.data.option;
        if(this.selectTime == 7){
          this.fromData = data.data.fromDate;
          this.toData = data.data.toDate;
        }
        await this.functionReturnData();
      }finally {
        await loading.dismiss(); // ✅ ينسكر مهما صار
      }
    });
    await model.present();
  }
  formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}${month}${day}`;
  }
  async selectFilter(type: number,fromDataS:any,todataS:any) {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;
    switch (type) {
      case 1: // اليوم
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate   = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 2: // أمس
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        endDate   = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        break;
       case 3: // آخر 7 أيام (مع اليوم)
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
        endDate   = today;
        break;
       case 4: // آخر 30 يوم (مع اليوم)
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
        endDate   = today;
        break;
        case 5: // الشهر الماضي (يشتغل حتى لو يناير)
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          endDate   = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
        case 6: // هذا الشهر
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          endDate   = today;
        break;
        case 7: // هذا الشهر
          startDate = fromDataS;
          endDate   = todataS;
        break;
        default:
          startDate = today;
          endDate   = today;
        break;
    }
    if(type!=7){
      const from = this.formatDate(startDate);
      const to   = this.formatDate(endDate);
      return this.selectedDateRange = `${from}-${to}`;
    }else{
      return this.selectedDateRange = `${fromDataS}-${todataS}`;
    }
  }
  
async functionReturnData() {
  let valdateSelect = await this.selectFilter(this.selectTime,this.fromData,this.toData);
  await this.storage.set('valdateSelect',valdateSelect);
  await this.storage.set('selectTime',this.selectTime);
  await this.storage.set('fromDataSelected',this.fromData);
  await this.storage.set('toDataSelected',this.toData);
  return new Promise<void>((resolve, reject) => {
    let key = this.mainUserName + this.userName + this.password + "(OLH)" + this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize().toString();

    let sendValues = {
      mainUserName: this.mainUserName,
      userName: this.userName,
      password: this.password,
      apiKey: this.apiKey,
      onliceData: 2,
      date: valdateSelect,
      page: `${this.page}`
    };

    this.chatService.chatGetHistoryUser(sendValues)
      .then(data => {
        this.returnResultData = data;
        if (this.returnResultData.message === 'ok') {
          let mobiles = this.returnResultData.data;
          let namesArray = this.returnResultData.name;
          let lastSendArray = this.returnResultData.lastSend;
          let merged = Object.keys(mobiles).map(key => ({
            mobile: mobiles[key],
            name: (namesArray[key] && namesArray[key] !== null) ? namesArray[key] : mobiles[key],
            lastSend: lastSendArray[key]
          }));
          merged.sort((a, b) => b.lastSend.localeCompare(a.lastSend));
          this.returnChatArray = merged.map(item => ({
            mobile: item.mobile,
            name: item.name
          }));
          this.chatVal = this.returnChatArray.length > 0 ? 1 : 0;
        } else {
          this.chatVal = 0;
        }
        resolve(); // ✅ خلص التحميل
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });

  });
}
  async loadeMore(event:any){
    let div = event.target;
    if (div.scrollTop + div.clientHeight >= div.scrollHeight - 10) {
      this.page+=1;
      await this.functionReturnData();
    }
  }
  functionSearch(event:any){
    this.searchData = event.target.value;
    if(this.searchData == "" || this.searchData == undefined){
      this.showCloseSearch = 0;
      this.searchType = 0; 
       this.searchChatVal = 2;     
    }else{
      this.searchType = 1; 
      this.searchChatVal = 0;
      this.showCloseSearch = 1;
        let data = this.returnChatArray.filter((item:any) => item.mobile.includes(this.searchData));
        if(typeof data!== 'undefined'){
          this.returnChatSearchArray = [];
          if(data.length>0){
            this.searchChatVal = 1;
            for(let i = 0; i < data.length;i++) {
              this.returnChatSearchArray[i]=[];
              this.returnChatSearchArray[i]['mobile'] = data[i].mobile;
            }
          }else{
            this.searchChatVal = 0;
          }
        }else{
          this.searchType = 0;   
        }
    }
  }
  //pages
  async functionSetting(){
    await this.storage.remove('selectTime');
    await this.storage.remove('fromDataSelected');
    await this.storage.remove('toDataSelected');
    this.navCtrl.navigateRoot('settings');
  }
  async functionContact(){
    await this.storage.remove('selectTime');
    await this.storage.remove('fromDataSelected');
    await this.storage.remove('toDataSelected');
    this.navCtrl.navigateRoot('contacts');
  }
  async functionChatbot(){
    await this.storage.remove('selectTime');
    await this.storage.remove('fromDataSelected');
    await this.storage.remove('toDataSelected');
    this.navCtrl.navigateRoot('chatbot');
  }
  functionArchive(number:any,name:any){
    this.navCtrl.navigateRoot(['/archive', {number:number,name:name,chatSessionId:"",type:2}]);
  }
  async functionQueued(){
    await this.storage.remove('selectTime');
    await this.storage.remove('fromDataSelected');
    await this.storage.remove('toDataSelected');
    this.navCtrl.navigateRoot('queued');
  }
  async functionUnassigned(){
    await this.storage.remove('selectTime');
    await this.storage.remove('fromDataSelected');
    await this.storage.remove('toDataSelected');
    this.navCtrl.navigateRoot('unassigned');
  }

  async functionHome(){
    await this.storage.remove('selectTime');
    await this.storage.remove('fromDataSelected');
    await this.storage.remove('toDataSelected');
    this.navCtrl.navigateRoot('home');
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
        if (Val[0] == "ar" ||  Val[0] == "en")
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
