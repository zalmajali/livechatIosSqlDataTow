import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import {ChatService} from "../../service/chat.service";
import {DatabaseService} from "../../service/database.service";
import * as CryptoJS from 'crypto-js';
import { Router,ActivatedRoute } from '@angular/router';
import { FirebaseMessaging } from '@awesome-cordova-plugins/firebase-messaging/ngx';
import {UserService} from "../../service/user.service";
import { firstValueFrom } from 'rxjs';
import { Subscription } from 'rxjs';
declare var cordova: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone:false
})
export class HomePage implements OnInit {
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
  public chatValQue:any = 2;
  public noExisting:any;
  public search_no_data:any;
  public searchData:any;
  public msg_count:any;
  public showSearch:boolean = false;
  public showSearchs:boolean = true;
  public search:any;
  public showCloseSearch:any=0;
  public timeCheck:any;
  public searchType:any=0;
  public searchChatVal:any = 2;
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
  //page setting
  public checkLanguage: any=0;
  public language: any;
  public menuDirection: any;
  public menuDirectionTow: any;
  public showPassword: boolean = false;

  public conversations: any[] = [];
  public isLoading = false;
  private pollingSub!: Subscription;
  public selectTypeShow: any=1;
  public selectTypeOne: any=1;
  public selectTypeTow: any=0;


  public returnResultDataQue:any;
  public returnChatArrayQue:any =  [];
  public returnArrayChatFromServerQue:any;
  public returnChatArrayAll: Set<any> = new Set();
  public returnChatArrayAllQue: Set<any> = new Set();
  public returnResultDataQueSizeAll:any = 0;
  public returnResultDataQueSize:any = 0;
  public returnResultDataSizeAll:any = 0;
  public returnChatSearchArrayQue:any = [];


  
  constructor(private activaterouter : ActivatedRoute,private dbService: DatabaseService,private userService: UserService,private firebaseMessaging : FirebaseMessaging,private databaseService: DatabaseService,private router: Router,private chatService: ChatService,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
    this.menu.enable(false,"sideMenu");
     this.checkLoginDataUser();
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
async ngOnInit() {
  await this.platform.ready();
  await this.dbService.initDb();
  await this.getDeviceLanguage();
  await this.checkLoginUser();
  this.mainUserName = await this.storage.get('mainUserName');
  this.userName = await this.storage.get('userName');
  this.password = await this.storage.get('password');
  this.apiKey = await this.storage.get('apiKey');
  this.sessionLogin = await this.storage.get('sessionLogin');
  this.activaterouter.params.subscribe((params: any) => {
    if (params['backUrl'] != "" && params['backUrl'] != null && params['backUrl'] != undefined && params['backUrl'] != 0) {
      if (params['backUrl'] == 3) {
        this.selectTypeShow = 2;
        this.selectTypeOne = 0;
        this.selectTypeTow = 1;
      } else {
        this.selectTypeShow = 1;
        this.selectTypeOne = 1;
        this.selectTypeTow = 0;
      }
    }
  });
  this.generateDates();
  await this.dbService.getConversations().subscribe(data => {
    this.conversations = data || [];
    this.functionReturnData();
    this.functionReturnDataQue();
  });
  await this.loadFromApi();
  await this.startPolling();
   await this.checkLoginDataUser();
  let showLoading = await this.storage.get('showLoading');
  if (showLoading == 0) {
    await this.storage.set('showLoading', '1');
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 1500,
    });
    await loading.present();
  }
}

private generateDates() {
  const currentDate = new Date();
  this.year = currentDate.getFullYear();
  this.month = String(currentDate.getMonth() + 1).padStart(2, '0');
  this.day = String(currentDate.getDate()).padStart(2, '0');
  this.hour = String(currentDate.getHours()).padStart(2, '0');
  this.minutes = String(currentDate.getMinutes()).padStart(2, '0');
  this.seconds = String(currentDate.getSeconds()).padStart(2, '0');
  this.genaratedDate = `${this.year}${this.month}${this.day}`;
  this.genaratedFullDate = `${this.year}${this.month}${this.day}${this.hour}${this.minutes}${this.seconds}`;
}
private startPolling() {
  let key = this.mainUserName + this.userName + this.password + "(OLH)" + this.genaratedDate;
  const md5Hash = CryptoJS.algo.MD5.create();
  md5Hash.update(key);
  this.apiKey = md5Hash.finalize().toString();
  const sendValues = {
    mainUserName: this.mainUserName,
    userName: this.userName,
    password: this.password,
    apiKey: this.apiKey,
    onliceData: 2,
    dateSelect: this.genaratedFullDate,
    sessionLogin: this.sessionLogin
  };
  this.chatService.startPolling(sendValues);
}
  private async loadFromApi() {
    try {
      let key = this.mainUserName+this.userName+this.password+"(OLH)"+this.genaratedDate;
      const md5Hash = CryptoJS.algo.MD5.create();
      md5Hash.update(key);
      this.apiKey = md5Hash.finalize();
      this.apiKey=this.apiKey.toString();
      let currentDate = new Date();
      this.year = currentDate.getFullYear();
      this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
      this.day = currentDate.getDate();
      this.hour = currentDate.getHours();
      this.minutes  = currentDate.getMinutes();
      this.seconds = currentDate.getSeconds();
      if(this.month<10)
        this.month = '0'+ this.month;
      if(this.day<10) 
        this.day = '0'+ this.day;
      if(this.hour<10) 
        this.hour = '0'+ this.hour;
      if(this.minutes<10) 
        this.minutes = '0'+ this.minutes;
      if(this.seconds<10) 
        this.seconds = '0'+ this.seconds;
      this.genaratedFullDate = this.year+""+this.month+""+this.day+this.hour+this.minutes+this.seconds;
      let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'onliceData':2,'dateSelect':this.genaratedFullDate,'sessionLogin':this.sessionLogin};
      this.isLoading = true;
      const data = await firstValueFrom(this.chatService.chatGetDataTow(sendValues));
      const conversations = data ? Object.values(data) : [];
      if (data && conversations.length > 0) {
        await this.dbService.saveConversations(data);
      }
    } catch (error) {
    } finally {
      this.isLoading = false;
    }
  }
  ngOnDestroy() {
    this.pollingSub?.unsubscribe();
  }
  async checkLoginDataUser(){
    this.department = await this.storage.get('department');
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
      this.firebaseMessaging.requestPermission({forceShow: false}).then(function() {
     });
     let topic = this.mainUserName+this.department;
     await this.firebaseMessaging.subscribe(topic);
     await this.firebaseMessaging.onMessage().subscribe(async (data:any)=>{
     })
    await this.firebaseMessaging.onBackgroundMessage().subscribe(async (data:any)=>{
      if (data.chatSessionId && data.number && data.userName) {
        const contacts = await this.functionChatGetMobileInfo(data.number);
         let fullName = contacts+' & '+data.userName;
         this.navCtrl.navigateRoot(['/chats', {number:data.number,chatSessionId:data.chatSessionId,userNameUsed:data.userName,backUrl:1,name:fullName,showSend:1}]);
      }
    })
    let token = await this.firebaseMessaging.getToken();
    let sendValues = {'mainUser':this.mainUserName,'userName':this.userName,'dep':this.department,'token':token};
     this.userService.loginDataUser(sendValues).then(async data=>{
    }).catch(error=>{
      this.checkLoginDataUser();
    });
  }
    async functionChatGetMobileInfo(number:any): Promise<any[]> {
      let key = this.mainUserName + this.userName + this.password + "(OLH)" + this.genaratedDate;
      const md5Hash = CryptoJS.algo.MD5.create();
      md5Hash.update(key);
      this.apiKey = md5Hash.finalize().toString();
      let sendValues = {
        mainUserName: this.mainUserName,
        userName: this.userName,
        password: this.password,
        apiKey: this.apiKey
      };
     
    try {
      const data: any = await this.userService.chatGetMobileInfo(sendValues);
      if (data.messageId == 1) {
        const matchedContact = data.info.find((item:any) =>
          item.number == number
        );
        return matchedContact ? matchedContact.name : number;
      }
      return number;
    } catch (error) {
      return number;
    }
  }
  functionRemoveSearch(){
    this.searchData = "";
    this.showCloseSearch = 0;
    this.searchType = 0;
    this.searchChatVal = 2;
  }
  toggleSearch() {
    this.showSearch = !this.showSearch;
    this.showSearchs = !this.showSearchs;
    this.searchType = 0;
    this.searchData = "";
    this.showCloseSearch = 0;
    this.searchChatVal = 2;
  }
  changeTypeShow(type:any){
      this.showCloseSearch = 0;
      this.searchType = 0;
      this.searchChatVal = 2; 
      this.searchData = "";  
      this.showSearch = false;
      this.showSearchs = true;
      this.selectTypeShow=type;
      if(type == 1){
        this.selectTypeOne=1;
        this.selectTypeTow=0;
      }else{
        this.selectTypeOne=0;
        this.selectTypeTow=1;
      }
  }
  async functionReturnData(){
   const processChats = this.conversations.filter(c => c.type == 1);
   this.returnChatArrayAll.clear();
   this.returnChatArray = [];
    this.returnResultDataSizeAll = 0;
     processChats.forEach((chat, index) => {
      this.returnChatArrayAll.add(chat.mobile); 
      this.returnChatArray[index] = {};
      this.returnChatArray[index]['mobile'] = chat.mobile;
      this.returnChatArray[index]['userName'] = chat.user_name;
      this.returnChatArray[index]['chatSessionId'] = chat.chatSession_id;
      this.returnChatArray[index]['badge'] = chat.badge;
      this.returnChatArray[index]['name'] = chat.name || chat.mobile;
      this.returnChatArray[index]['countMsg'] =
        chat.badge != 0 ? this.msg_count : 0;
    });
    this.chatVal = processChats.length > 0 ? 1 : 0;
    this.returnResultDataSizeAll = this.returnChatArrayAll.size
  }
  async functionReturnDataQue(){
   const processChats = this.conversations.filter(c => c.type == 2);
   this.returnChatArrayAllQue.clear();
   this.returnChatArrayQue = [];
    this.returnResultDataQueSizeAll = 0;
     processChats.forEach((chat, index) => {
      this.returnChatArrayAllQue.add(chat.mobile); 
      this.returnChatArrayQue[index] = {};
      this.returnChatArrayQue[index]['mobile'] = chat.mobile;
      this.returnChatArrayQue[index]['userName'] = chat.user_name;
      this.returnChatArrayQue[index]['chatSessionId'] = chat.chatSession_id;
      this.returnChatArrayQue[index]['badge'] = chat.badge;
      this.returnChatArrayQue[index]['name'] = chat.name || chat.mobile;
      this.returnChatArrayQue[index]['countMsg'] = chat.badge != 0 ? this.msg_count : 0;
    });
    this.chatValQue = processChats.length > 0 ? 1 : 0;
    this.returnResultDataQueSizeAll = this.returnChatArrayAllQue.size
  }
  functionSearch(event:any){
    this.searchData = event.target.value;
    if(this.searchData == "" || this.searchData == undefined){
      this.showCloseSearch = 0;
      this.searchType = 0;
      this.searchChatVal = 2;      
    }else{
      this.searchType = 1; 
      this.showCloseSearch = 1;
      this.searchChatVal = 0;
      if(this.selectTypeShow == 1){
      let data = this.returnChatArray.filter((item: any) => { const term = this.searchData?.toString().toLowerCase() || ''; return item.mobile?.toString().toLowerCase().includes(term) || item.name?.toString().toLowerCase().includes(term); });
        if(typeof data!== 'undefined'){
          this.returnChatSearchArray = [];
          if(data.length>0){
            this.searchChatVal = 1;
            for(let i = 0; i < data.length;i++) {
             this.returnChatSearchArray[i]=[];
              this.returnChatSearchArray[i]['mobile'] = data[i].mobile;
              this.returnChatSearchArray[i]['userName'] = data[i].userName;
              this.returnChatSearchArray[i]['chatSessionId'] = data[i].chatSessionId;
              this.returnChatSearchArray[i]['badge'] = data[i].badge;
              this.returnChatSearchArray[i]['name'] = data[i].name;
              if(this.returnChatSearchArray[i]['name']=="" || this.returnChatSearchArray[i]['name']==undefined)
                  this.returnChatSearchArray[i]['name'] = data[i].mobile;
              if(this.returnChatSearchArray[i]['badge']!=0){
                  this.returnChatSearchArray[i]['countMsg'] = this.msg_count;
              }else{
                this.returnChatSearchArray[i]['countMsg']=0;
              }
            }
          }else{
            this.searchChatVal = 0;
          }
        }else{
          this.searchType = 0;   
        }
      }else{
      let data = this.returnChatArrayQue.filter((item: any) => { const term = this.searchData?.toString().toLowerCase() || ''; return item.mobile?.toString().toLowerCase().includes(term) || item.name?.toString().toLowerCase().includes(term); });
        if(typeof data!== 'undefined'){
          this.returnChatSearchArrayQue = [];
          if(data.length>0){
            this.searchChatVal = 1;
            for(let i = 0; i < data.length;i++) {
             this.returnChatSearchArrayQue[i]=[];
              this.returnChatSearchArrayQue[i]['mobile'] = data[i].mobile;
              this.returnChatSearchArrayQue[i]['userName'] = data[i].userName;
              this.returnChatSearchArrayQue[i]['chatSessionId'] = data[i].chatSessionId;
              this.returnChatSearchArrayQue[i]['badge'] = data[i].badge;
              this.returnChatSearchArrayQue[i]['name'] = data[i].name;
              if(this.returnChatSearchArrayQue[i]['name']=="" || this.returnChatSearchArrayQue[i]['name']==undefined)
                  this.returnChatSearchArrayQue[i]['name'] = data[i].mobile;
              if(this.returnChatSearchArrayQue[i]['badge']!=0){
                  this.returnChatSearchArrayQue[i]['countMsg'] = this.msg_count;
              }else{
                this.returnChatSearchArrayQue[i]['countMsg']=0;
              }
            }
          }else{
            this.searchChatVal = 0;
          }
        }else{
          this.searchType = 0;   
        }
      }
    }
  }
  //pages
  functionSetting(){
    this.navCtrl.navigateRoot('settings');
  }
  functionContact(){
    this.navCtrl.navigateRoot(['/contacts', {backUrl:1}]);
  }
  functionChatbot(){
    this.navCtrl.navigateForward('chatbot');
  }
  functionArchive(){
    this.navCtrl.navigateRoot('archivenumber');
  }
  functionQueued(){
    this.navCtrl.navigateRoot('queued');
  }
  functionUnassigned(){
    this.navCtrl.navigateRoot('unassigned');
  }
   functionChats(number:any,chatSessionId:any,userName:any,name:any){
    let fullName = name+' & '+userName;
    this.navCtrl.navigateRoot(['/chats', {number:number,chatSessionId:chatSessionId,userNameUsed:userName,backUrl:1,name:fullName,showSend:1}]);
  }
  functionChatsQue(number:any,chatSessionId:any,userName:any,name:any){
    this.navCtrl.navigateRoot(['/chats', {number:number,chatSessionId:chatSessionId,userNameUsed:userName,backUrl:3,name:name,showSend:1}]);
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
