import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import {LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import {ChatService} from "../../service/chat.service";
import {DatabaseService} from "../../service/database.service";
import * as CryptoJS from 'crypto-js';
import { ActivatedRoute,Router } from '@angular/router';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { PopoverController } from '@ionic/angular';
import { PopovercontentComponent } from '../popovercontent/popovercontent.component';
import { FastresponseComponent } from '../fastresponse/fastresponse.component';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';
import {SubmenuComponent} from "../submenu/submenu.component";
import {ShowimageComponent} from "../showimage/showimage.component";
import {TemplateComponent} from "../template/template.component";
import 'emoji-picker-element';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
import { VideoEditor } from '@awesome-cordova-plugins/video-editor/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
declare var resolveLocalFileSystemURL: any;
interface ConvertedAudio {
  link: string;
}
@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
  standalone:false
})
export class ChatsPage implements OnInit {
@ViewChild('chatList', { read: ElementRef }) private chatList: ElementRef  | any;
public downloadProgress = 0;
public arrow_back:any;
public arrow_go:any;
public floatD:any;
public returnResultData:any;
public returnChatArray:any = [];
public returnArrayChatFromServer:any;
public returnResultDataByNumber:any;
public returnArrayChatDataByNumberFromServer:any;
public send_image:any;
public isDisabled:any= false;
public selectNumber:any;
public chatSessionId:any;
public returnResultDataBySession:any;
public returnResultConvert:any;
public returnArrayChatSessionFromServer:any;
public counter:any;
public returnDataFromPop:any;
public view_contact:any;
public close_chat:any;
public assign_to:any;
public archives:any;
public mute_chat:any;
public span_menue:any;
public showSendMessage: any=2;
public no_chat_for_this_number:any;

public returnResultDataOld:any;
public returnArrayChatFromServerOld:any;
public returnResultDataBySessionOld:any;
public returnArrayChatSessionFromServerOld:any;
public allMassegesOld:any=[];
public allMassegesOldVal:any=[];
public showLoadeMore: any=1;
public chatVal:any = 2;
public arrow_back_men:any;
public popoverMen_men:any;
//message
public toggled = false;
public allMasseges:any=[];
public onMessage:any="";
public chat_class_one:any;
public chat_class_tow:any;
public chat_class_three:any;
public chat_class_fore:any;
public chat_class_five:any;
public chat_class_six:any;
public chat_class_seven:any;
public message_text:any;
public filedata:any;
public backUrl: any;
public nameUseId: any;
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
public timeoutOne:any;
public timeoutTow:any;
public isScroolTo:any=2;
public countOfNewMsg:any=0;
public loade_more:any;
public userNameThisConv:any="";
//page setting
public checkLanguage: any=0;
public language: any;
public menuDirection: any;
public menuDirectionTow: any;
public showPassword: boolean = false;
public dbInstance!: SQLiteObject;
public checkDataConvert: any=0;
public allMassegesCheckData: Set<any> = new Set();
public chat_class_fore_priv: any;
public send_note: any;
public imageSelect: any = "../../assets/images/sendNoteH.png";
public sendMsgType: any = 0;
public send_note_msg: any;
public send_note_class: any;
public showSend: any=0;
public error_size_of_file: any;
public fileUrl: any;
public error_downloade_file_one:any;
public error_downloade_file_tow:any;
  constructor( private socialSharing: SocialSharing,private videoEditor: VideoEditor,private device: Device,private filePath: FilePath,private androidPermissions: AndroidPermissions,private sanitizer: DomSanitizer,private transfer: FileTransfer,private camera: Camera,private http: HttpClient,private chooser: Chooser,private popoverCtrl: PopoverController,private file: File,private activaterouter : ActivatedRoute,private databaseService: DatabaseService,private router: Router,private chatService: ChatService,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/home");
    });
    this.menu.enable(false,"sideMenu");
    setTimeout(() => {
      const chatListElement = this.chatList.nativeElement as HTMLElement;
      const shouldScroll = chatListElement.scrollHeight > chatListElement.clientHeight;
      if (shouldScroll) {
        chatListElement.scrollTop = chatListElement.scrollHeight;
      }
    }, 0);
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
    this.translate.get('chat_class_one').subscribe((res: string) => {
      this.chat_class_one = res;
    });
    this.translate.get('chat_class_tow').subscribe((res: string) => {
      this.chat_class_tow = res;
    });
    this.translate.get('chat_class_three').subscribe((res: string) => {
      this.chat_class_three = res;
    });
    this.translate.get('chat_class_fore').subscribe((res: string) => {
      this.chat_class_fore = res;
    });
    this.translate.get('chat_class_five').subscribe((res: string) => {
      this.chat_class_five = res;
    });
    this.translate.get('chat_class_six').subscribe((res: string) => {
      this.chat_class_six = res;
    });
    this.translate.get('chat_class_seven').subscribe((res: string) => {
      this.chat_class_seven = res;
    });
    this.translate.get('send_image').subscribe((res: string) => {
      this.send_image = res;
    });
    this.translate.get('message_text').subscribe((res: string) => {
      this.message_text = res;
    });

    this.translate.get('view_contact').subscribe((res: string) => {
      this.view_contact = res;
    });
    this.translate.get('close_chat').subscribe((res: string) => {
      this.close_chat = res;
    });
    this.translate.get('assign_to').subscribe((res: string) => {
      this.assign_to = res;
    });
    this.translate.get('archives').subscribe((res: string) => {
      this.archives = res;
    });
    this.translate.get('mute_chat').subscribe((res: string) => {
      this.mute_chat = res;
    });
    this.translate.get('span_menue').subscribe((res: string) => {
      this.span_menue = res;
    });
    this.translate.get('no_chat_for_this_number').subscribe((res: string) => {
      this.no_chat_for_this_number = res;
    });
     this.translate.get('loade_more').subscribe((res: string) => {
      this.loade_more = res;
    });
    this.translate.get('chat_class_fore_priv').subscribe((res: string) => {
      this.chat_class_fore_priv = res;
    });
    this.translate.get('send_note').subscribe((res: string) => {
      this.send_note = res;
    });
     this.translate.get('send_note_msg').subscribe((res: string) => {
      this.send_note_msg = res;
    });
     this.translate.get('send_note_class').subscribe((res: string) => {
      this.send_note_class = res;
    });
    this.translate.get('error_size_of_file').subscribe((res: string) => {
      this.error_size_of_file = res;
    });
     this.translate.get('arrow_back_men').subscribe((res: string) => {
      this.arrow_back_men = res;
    });
     this.translate.get('popoverMen_men').subscribe((res: string) => {
      this.popoverMen_men = res;
    });
    this.translate.get('error_downloade_file_one').subscribe((res: string) => {
      this.error_downloade_file_one = res;
    });
     this.translate.get('error_downloade_file_tow').subscribe((res: string) => {
      this.error_downloade_file_tow = res;
    });
  }
 ngAfterViewChecked() {
    const chatEl = this.chatList.nativeElement as HTMLElement;
    // فرق صغير عشان الصور أو محتوى ديناميكي
    const atBottom = Math.abs(chatEl.scrollHeight - chatEl.scrollTop - chatEl.clientHeight) < 5;
    this.isScroolTo = atBottom ? 1 : 0;
  }
  formatDate(date: Date): string {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}${month}${day}`;
  }
  async ngOnInit() {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    endDate   = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const from = this.formatDate(startDate);
    const to   = this.formatDate(endDate);
    const selectedDateRange = `${from}-${to}`;
    await this.storage.set('valdateSelect',selectedDateRange);
    await this.getDeviceLanguage();
    await this.checkLoginUser();
     const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 1500,
    });
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
    this.password = await this.storage.get('password');
    this.apiKey = await this.storage.get('apiKey');
    this.sessionLogin = await this.storage.get('sessionLogin');
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
    this.genaratedDate = this.year+""+this.month+""+this.day;
    this.genaratedFullDate = this.year+""+this.month+""+this.day+this.hour+this.minutes+this.seconds; 
    await this.activaterouter.params.subscribe(async (params:any) => {
      if(params['number']!="" && params['number']!=null && params['number']!=undefined && params['number']!=0){
        this.selectNumber = params['number'];
        await this.storage.set('selectedNumber',this.selectNumber);
      }
      if(params['chatSessionId']!="" && params['chatSessionId']!=null && params['chatSessionId']!=undefined && params['chatSessionId']!=0){
        this.chatSessionId = params['chatSessionId'];
        await this.storage.set('selectedChatSessionId',this.chatSessionId);
      }
      if(params['name']!="" && params['name']!=null && params['name']!=undefined && params['name']!=0){
        this.nameUseId = params['name'];
      }
      if(params['backUrl']!="" && params['backUrl']!=null && params['backUrl']!=undefined && params['backUrl']!=0){
        this.backUrl = params['backUrl'];
      }
      if(params['showSend']!="" && params['showSend']!=null && params['showSend']!=undefined && params['showSend']!=0){
        this.showSend = params['showSend'];
      }
      if(params['userNameUsed']!="" && params['userNameUsed']!=null && params['userNameUsed']!=undefined && params['userNameUsed']!=0){
         let userName = params['userNameUsed'].toLowerCase();
        this.userNameThisConv = userName;
         let userNamekey = this.userName.toLowerCase();
         if(userName == userNamekey){
          this.showSendMessage = 1;
         }else{
          if(this.showSend == 1)
            this.showSendMessage = 1;
          else{
            this.showSendMessage = 0;
            this.displayResult(this.no_chat_for_this_number);
          }
         }
      }else{
        if(this.showSend == 1)
          this.showSendMessage = 1;
        else{
           this.showSendMessage = 0;
           this.displayResult(this.no_chat_for_this_number);
        }
      }
      await this.functionFeachData(this.selectNumber,this.chatSessionId);
      await this.functionChatSeen(this.selectNumber);
    });
    await loading.present();
    // Load initial messages if any
  }
  async loadeMoreData(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: '',
      duration: 1500,
    });
    await loading.present();
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
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'sessionLogin':this.sessionLogin,'dataSearch':this.selectNumber};
     this.allMassegesOld = [];
    await this.chatService.chatSearch(sendValues).then(async data=>{
      this.returnResultDataOld = data;
      let errorData = this.returnResultDataOld.messageId;
      if(errorData == 1){
        if(typeof this.returnResultDataOld.data.searchList!== 'undefined'){
        let counterData = 0;
        this.returnArrayChatFromServerOld = this.returnResultDataOld.data.searchList[0].chatHistory;
        for(let i = 0; i < this.returnArrayChatFromServerOld.length;i++) {
        let chatSessionId= this.returnArrayChatFromServerOld[i]['chatSessionId'];
        if(chatSessionId == this.chatSessionId)
            continue;
        if(counterData >= 3)
          break;
         this.allMassegesOld[counterData]=[]; 
         this.allMassegesOld[counterData]['date'] = this.returnArrayChatFromServerOld[i]['date'];
        let sendValuesD = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.selectNumber,'sessionLogin':this.sessionLogin,'chatSessionId':chatSessionId};
          await this.chatService.chatGetDataByNumber(sendValuesD).then(async dataHist=>{
          this.returnResultDataBySessionOld = dataHist;
          let errorDataSession = this.returnResultDataBySessionOld.messageId;
          if(errorDataSession == 1){
            this.returnArrayChatSessionFromServerOld = this.returnResultDataBySessionOld.data.process;
            this.counter = 0;
            this.allMassegesOld[counterData]['data']= []
            if(typeof this.returnArrayChatSessionFromServerOld[0].chatBot!== 'undefined'){
              let chatBot = this.returnArrayChatSessionFromServerOld[0].chatBot;
              for(let j = 0; j < chatBot.length;j++) {
                this.allMassegesOldVal = [];
                let msgIdid = chatBot[j].id;
                this.allMassegesCheckData.add(msgIdid);
                let numberSR = this.selectNumber;
                let msg = chatBot[j].txt;
                if(msg=="userChat")
                  continue;
                let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
                if (chatBot[j].txt.includes(string)) {
                  msg = chatBot[j].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
                } 
                let Txt = "Txt[(RT)]";
                let Txt2 = "Btn";
                let Txt3 = "BS";
                let Txt4 = "<audio";
                let Txt6 = "<video"; 
                let Txt7 = "<img";
                let Txt8 = "href=https://livechat.taqnyat.sa/";
                let Txt5 = 'src="https://livechat.taqnyat.sa/';
                let checkAudio = 0;
                let checkImage = 0;
                let image = "";
                let doneReadAudio = 1;
                if (chatBot[j].txt.includes(Txt2) || chatBot[j].txt.includes(Txt3)) {
                  msg = await this.parseResponse(chatBot[j].txt);
                }
                else if(chatBot[j].txt.includes(Txt)) {
                  msg = chatBot[j].txt.replace(Txt, "");  
                }else if(chatBot[j].txt.includes(Txt4)) {
                  checkAudio = 1;
                  doneReadAudio = 0;
                  msg =  msg+ '<div class="loading">Loading...</div>';
                }else if(chatBot[j].txt.includes(Txt5)) {
                    checkImage = 1;
                    const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"]/i;
                    const match = chatBot[j].txt.match(regex);
                    if (match) {
                        image = match[1];
                        const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(image);
                        if (isImage) {
                            msg = chatBot[j].txt.replace('onclick="return fullImg(this)"', "");
                        }
                    }
                }
                msg = msg.replace(/\r\n/g, "<br>");
                if(!checkAudio)
                  msg = this.sanitizer.bypassSecurityTrustHtml(msg);
                let time = chatBot[j].time;
                let date = chatBot[j].date;
                let dateId = chatBot[j].dateId;
                let from = chatBot[j].support;
                let msgFail = chatBot[j].msgFail;
                let filePath = 0;
                let msg_status = 0;
                let session_id = chatSessionId;
                let private_note = 0;
                this.fileUrl = "";
                let showVal = 0;
                if (chatBot[j].txt.includes(Txt4) || chatBot[j].txt.includes(Txt6) || chatBot[j].txt.includes(Txt7) || chatBot[j].txt.includes(Txt8)) {
                  this.fileUrl = await this.extractFileUrl(chatBot[j].txt);
                  showVal = 1;
                }
                ++this.counter;
                await this.allMassegesOldVal.push({
                        msgId: msgIdid,
                        checkAudio: checkAudio,
                        image: image,
                        checkImage: checkImage,
                        doneReadAudio: doneReadAudio,
                        number: numberSR,
                        msgFail: msgFail,
                        msg: msg,
                        fileUrl: this.fileUrl,
                        showVal: showVal,
                        time: time,
                        date: date,
                        dateId: dateId,
                        from: from,
                        filePath: filePath,
                        msg_status: msg_status,
                        session_id: session_id,
                        private_note: private_note
                });
                  this.allMassegesOld[counterData]['data'].push(...this.allMassegesOldVal);
              }
            }
            if(typeof this.returnArrayChatSessionFromServerOld[0].chat!== 'undefined'){
              let chat = this.returnArrayChatSessionFromServerOld[0].chat;
              for(let jj = 0; jj < chat.length;jj++) {
                this.allMassegesOldVal = [];
                let msgIdid = chat[jj].id;
                this.allMassegesCheckData.add(msgIdid);
                let numberSR = this.selectNumber;
                let msg = chat[jj].txt;
                let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
                if (chat[jj].txt.includes(string)) {
                  msg = chat[jj].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
                }
                let Txt = "Txt[(RT)]";
                let Txt2 = "Btn";
                let Txt3 = "BS";
                 let Txt4 = "<audio";
                let Txt6 = "<video"; 
                let Txt7 = "<img";
                let Txt8 = "href=https://livechat.taqnyat.sa/";
                let Txt5 = 'src="https://livechat.taqnyat.sa/';
                let checkImage = 0;
                let checkAudio = 0;
                let image = "";
                let doneReadAudio = 1;
                if (chat[jj].txt.includes(Txt2) || chat[jj].txt.includes(Txt3)) {
                  msg = await this.parseResponse(chat[jj].txt);
                } 
                else if(chat[jj].txt.includes(Txt)) {
                  msg = chat[jj].txt;
                }else if(chat[jj].txt.includes(Txt4)) {
                  checkAudio = 1;
                  doneReadAudio = 0;
                  msg =  msg+ '<div class="loading">Loading...</div>';
                }else if(chat[jj].txt.includes(Txt5)) {
                  checkImage = 1;
                    const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"]/i;
                    const match = chat[jj].txt.match(regex);
                    if (match) {
                        image = match[1];
                        const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(image);
                        if (isImage) {
                            msg = chat[jj].txt.replace('onclick="return fullImg(this)"', "");
                        }
                    }
                }
                msg = msg.replace(/\r\n/g, "<br>");
                if(!checkAudio)
                  msg = this.sanitizer.bypassSecurityTrustHtml(msg);
                let time = chat[jj].time;
                let date = chat[jj].date;
                let dateId = chat[jj].dateId;
                let from = chat[jj].support;
                let filePath = chat[jj].filePath;
                let msg_status = chat[jj].msgStatus;
                let msgFail = chat[jj].msgFail;
                let session_id = chatSessionId;
                let private_note = chat[jj].privateNote;
                this.fileUrl = "";
                let showVal = 0;
                if (chat[jj].txt.includes(Txt4) || chat[jj].txt.includes(Txt6) || chat[jj].txt.includes(Txt7) || chat[jj].txt.includes(Txt8)) {
                  this.fileUrl = await this.extractFileUrl(chat[jj].txt);
                  showVal = 1;
                }
                await this.allMassegesOldVal.push({
                  msgId: msgIdid,
                  checkAudio: checkAudio,
                  image: image,
                  checkImage: checkImage,
                  doneReadAudio: doneReadAudio,
                  number: numberSR,
                  msgFail: msgFail,
                  msg: msg,
                  time: time,
                  fileUrl: this.fileUrl,
                  showVal: showVal,
                  date: date,
                  dateId: dateId,
                  from: from,
                  filePath: filePath,
                  msg_status: msg_status,
                  session_id: session_id,
                  private_note: private_note
              });
                  this.allMassegesOld[counterData]['data'].push(...this.allMassegesOldVal);
              }
            }
          }
          });
           counterData++
          this.allMassegesOld.reverse();
          this.allMassegesOld.sort((a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          if(this.allMassegesOld.length!=0){
            this.showLoadeMore = 2;
            this.chatVal = 1
          }
        }
        }
      }else if(errorData == 2){
        this.chatVal = 0;
        this.showLoadeMore = 1;
      }else {
        this.chatVal = 0;
        this.showLoadeMore = 1;
      }
    }).catch(error=>{
      this.loadeMoreData();
    });
    await this.loading.dismiss();
 }
  getFileSize(fileUri: string): Promise<number> {
    return new Promise((resolve, reject) => {
      resolveLocalFileSystemURL(fileUri, (fileEntry:any) => {
        fileEntry.file((file:any) => {
          const sizeMB = file.size / (1024*1024); // الحجم بالميغابايت
          resolve(sizeMB);
        }, (err:any) => reject(err));
      }, (err:any) => reject(err));
    });
  }
  async functionSendFile(){
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
    let date = this.year+"/"+this.month+"/"+this.day;
    let typeTime =  this.hour >= 12 ? 'PM' : 'AM';
    let time = this.hour+":"+this.minutes+" "+typeTime;
    const fileTransfer: FileTransferObject = this.transfer.create();
     const loading = await this.loading.create({
      cssClass: 'custom-spinner',
      message: '',
      duration: 3500,
    });
    this.chooser.getFile().then(async (file:any) =>{
       await loading.present();
      this.filedata = file;
      const sizeInBytes = this.filedata.data.length;
      const sizeMB = sizeInBytes / (1024 * 1024);
      if(sizeMB > 100){
        this.filedata = "";
        this.displayResult(this.error_size_of_file)
      }
      if(this.filedata!=undefined && this.filedata!=null && this.filedata!=""){
        let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.selectNumber,'sessionLogin':this.sessionLogin};
        let options: FileUploadOptions = {
          fileKey: 'chatFile',
          fileName:this.filedata.name,
          mimeType:this.filedata.mediaType,
          chunkedMode:false,
          params: sendValues,
          headers: {}
        }
          fileTransfer.upload(this.filedata.uri, "https://api.taqnyat.sa/chatSendFile.php", options)
          .then(async(data) => {
            this.onMessage = "";
            await loading.dismiss();
          }, async (err) => {
            await loading.dismiss();
        })
      }
  })
  .catch((error: any) => {});
  this.toggled = false;
  }
  async functionSendImage() {
    let optionsD: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.platform.is('ios') ? this.camera.PictureSourceType.SAVEDPHOTOALBUM : this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.ALLMEDIA,
      encodingType: this.platform.is('android') ? this.camera.EncodingType.JPEG : undefined
    };
      this.camera.getPicture(optionsD).then(async (imageData) => {
      let imageGetTypeOFFile = imageData.split('.').pop().toLowerCase();
      let imagemimeGetTypeOFFile=0;
      if (['jpg','jpeg','png','gif'].includes(imageGetTypeOFFile)) {
        imagemimeGetTypeOFFile = 1;
      } else if (['mp4','mov','avi','mkv','3gp','m4v'].includes(imageGetTypeOFFile)) {
        imagemimeGetTypeOFFile = 2;
      }
      let isSendFile = 0;
      if(imagemimeGetTypeOFFile == 1){
        //image
        const sizeOfFile = await this.getFileSize(imageData);
        if(sizeOfFile > 5){
          imageData = "";
          this.displayResult(this.error_size_of_file)
        }
        isSendFile = 1;
      }else{
        //video
        const sizeOfFile = await this.getFileSize(imageData);
        if(sizeOfFile > 100){
          imageData = "";
          this.displayResult(this.error_size_of_file)
        }
        isSendFile = 1;
      }
      if(!isSendFile){
          imageData = "";
          this.displayResult(this.error_size_of_file)
      }else{
          this.uploadImage(imageData);
      }
    }, (err) => {
      alert("error file");
    });
    this.toggled = false;
  }
  functionChatSeen(selectNumber:any){
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.selectNumber};
    this.chatService.chatSeen(sendValues).then(async dataHist=>{
      this.returnResultDataBySession = dataHist;
      let errorDataSession = this.returnResultDataBySession.messageId;
      if(errorDataSession == 1){
        //await this.functionFeachData(this.selectNumber,this.chatSessionId);
      }
    })
  }
  async requestMediaPermission(): Promise<boolean> {
    if (!this.platform.is('android')) return true;
    const androidVersion = parseInt((navigator.userAgent.match(/Android (\d+)/) || [])[1], 10);
    if (androidVersion >= 13) {
      const perm = this.androidPermissions.PERMISSION.READ_MEDIA_IMAGES;
      const result = await this.androidPermissions.checkPermission(perm);
      if (!result.hasPermission) {
        const req = await this.androidPermissions.requestPermission(perm);
        return req.hasPermission;
      }
      return true;
    } else {
      // الأجهزة القديمة (أندرويد 9 وما أقل)
      const perms = [
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ];
      const result = await this.androidPermissions.checkPermission(perms[0]);
      if (!result.hasPermission) {
        const req = await this.androidPermissions.requestPermissions(perms);
        return req.hasPermission;
      }
      return true;
    }
  }
  async uploadImage(imageData: any) {
     const loading = await this.loading.create({
      cssClass: 'custom-spinner',
      message: '',
      duration: 3500,
    });
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
    this.genaratedFullDate = this.year+""+this.month+""+this.day;
    let key = this.mainUserName+this.userName+this.password+"(OLH)"+this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize();
    this.apiKey=this.apiKey.toString();

    const fileTransfer: FileTransferObject = this.transfer.create();
    let imageName = imageData.substring(imageData.lastIndexOf('/') + 1);
    let imageExtension = imageData.split('.').pop().toLowerCase();
    let imagemimeType: string="";
    if (['jpg','jpeg','png','gif'].includes(imageExtension)) {
      imagemimeType = `image/${imageExtension === 'jpg' ? 'jpeg' : imageExtension}`;
    } else if (['mp4','mov','avi','mkv','3gp','m4v'].includes(imageExtension)) {
      imagemimeType = `video/${imageExtension === 'mov' ? 'quicktime' : imageExtension}`;
    } else {
      alert('Unsupported file type'); 
      return;
    }
    if (imageExtension === 'mov') {
    try {
      // حذف file:// إذا موجود
      let cleanPath = imageData.replace('file://', '');
      
      imageData = await this.videoEditor.transcodeVideo({
        fileUri: cleanPath,
        outputFileName: 'converted_video_' + Date.now(),
        outputFileType: this.videoEditor.OutputFileType.MPEG4,
        optimizeForNetworkUse: this.videoEditor.OptimizeForNetworkUse.YES,
        saveToLibrary: false
      });

      // تحديث الاسم والامتداد بعد التحويل
      imageName = imageData.substring(imageData.lastIndexOf('/') + 1);
      imageExtension = 'mp4';
      imagemimeType = 'video/mp4';
    } catch (err) {
      console.error('Video conversion error:', err);
      alert('Failed to convert MOV to MP4');
      return;
    }
  }

    if(imageData!=undefined && imageData!=null && imageData!=""){
       await loading.present();
      let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.selectNumber,'sessionLogin':this.sessionLogin};
      const jsonData = JSON.stringify(sendValues);
      let options: FileUploadOptions = {
        fileKey: 'chatFile',
        fileName:imageName,
        mimeType: imagemimeType,
        chunkedMode:false,
        params: sendValues,
        headers: {}
      }
        fileTransfer.upload(imageData, "https://api.taqnyat.sa/chatSendFile.php", options)
        .then(async(data) => {
          await this.functionFeachData(this.selectNumber,this.chatSessionId);
          await this.functionChatSeen(this.selectNumber);
          this.onMessage = "";
          await loading.dismiss();
        }, async (err) => {
         await loading.dismiss();
      })
    }
  }
  getMimeType(extension: string): string {
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      default:
        return ''; // يمكنك إضافة المزيد من الأنواع حسب الحاجة
    }
  }
  functionSelectEmoji(event:any){
    this.onMessage += ' ' + event.emoji.unicode;
  }
  async extractAudioSrc(html: any) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sourceElement = doc.querySelector('audio source');
    if (sourceElement) {
      const data = sourceElement.getAttribute('src');
      if (data && data.endsWith('.ogg')) {
        try {
          let updatedHtml = "";
          const dataHist = await this.chatService.convertData({'link': data, 'user': this.userName});
          this.returnResultConvert = dataHist;
          sourceElement.setAttribute('src', this.returnResultConvert.link);
          updatedHtml = doc.body.innerHTML;
          updatedHtml = updatedHtml.replace(/&nbsp;/g, '').replace(/<br>/g, '');
          return updatedHtml;
        } catch (error) {
          return "error";
        }
      }
      return "error";
    }
    return null;
  }
 async showImage(image:any){
  alert(image)
    this.modalController.dismiss({});
    let model = await this.modalController.create({
      component:ShowimageComponent,
      animated:true,
      componentProps:{image:image},
      cssClass:"my-custom-modal-temp"
    });
    model.onDidDismiss().then((data):any=>{
    });
    await model.present();
  }
  async functionFeachData(numberUser:any,chatSessionId:any){
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
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':numberUser,'sessionLogin':this.sessionLogin,'chatSessionId':chatSessionId};
    await this.chatService.chatGetDataByNumber(sendValues).then(async dataHist=>{
      this.returnResultDataBySession = dataHist;
      let errorDataSession = this.returnResultDataBySession.messageId;
      if(errorDataSession == 1){
        this.allMasseges = [];
        this.returnArrayChatSessionFromServer = this.returnResultDataBySession.data.process;
        this.counter = 0;
        if(typeof this.returnArrayChatSessionFromServer[0].chatBot!== 'undefined'){
          let chatBot = this.returnArrayChatSessionFromServer[0].chatBot;
          for(let j = 0; j < chatBot.length;j++) {
            let msgIdid = chatBot[j].id;
            this.allMassegesCheckData.add(msgIdid);
            let numberSR = numberUser;
            let msg = chatBot[j].txt;
            if(msg=="userChat")
              continue;
            let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
            if (chatBot[j].txt.includes(string)) {
              msg = chatBot[j].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
            } 
            let Txt = "Txt[(RT)]";
            let Txt2 = "Btn";
            let Txt3 = "BS";
            let Txt4 = "<audio";
            let Txt6 = "<video"; 
            let Txt7 = "<img";
            let Txt8 = "href=https://livechat.taqnyat.sa/";
            let Txt5 = 'src="https://livechat.taqnyat.sa/';
            let checkAudio = 0;
            let checkImage = 0;
            let image = "";
            let doneReadAudio = 1;
            alert(chatBot[j])
            if (chatBot[j].txt.includes(Txt2) || chatBot[j].txt.includes(Txt3)) {
              msg = await this.parseResponse(chatBot[j].txt);
            }
            else if(chatBot[j].txt.includes(Txt)) {
              msg = chatBot[j].txt.replace(Txt, "");  
            }else if(chatBot[j].txt.includes(Txt4)) {
              checkAudio = 1;
              doneReadAudio = 0;
              msg =  msg+ '<div class="loading">Loading...</div>';
            }else if(chatBot[j].txt.includes(Txt5)) {
                checkImage = 1;
                const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"]/i;
                const match = chatBot[j].txt.match(regex);
                if (match) {
                    image = match[1];
                    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(image);
                    if (isImage) {
                        msg = chatBot[j].txt.replace('onclick="return fullImg(this)"', "");
                    }
                }
            }
            alert(image)
            msg = msg.replace(/\r\n/g, "<br>");
            if(!checkAudio)
              msg = this.sanitizer.bypassSecurityTrustHtml(msg);
            let time = chatBot[j].time;
            let date = chatBot[j].date;
            let dateId = chatBot[j].dateId;
            let from = chatBot[j].support;
            let msgFail = chatBot[j].msgFail;
            let filePath = 0;
            let msg_status = 0;
            let session_id = chatSessionId;
            let private_note = 0;
            this.fileUrl = "";
            let showVal = 0;
            if (chatBot[j].txt.includes(Txt4) || chatBot[j].txt.includes(Txt6) || chatBot[j].txt.includes(Txt7) || chatBot[j].txt.includes(Txt8)) {
               this.fileUrl = await this.extractFileUrl(chatBot[j].txt);
               showVal = 1;
            }
            ++this.counter;
            await this.allMasseges.push({
                    msgId: msgIdid,
                    checkAudio: checkAudio,
                    checkImage: checkImage,
                    image: image,
                    doneReadAudio: doneReadAudio,
                    number: numberSR,
                    msgFail: msgFail,
                    msg: msg,
                    time: time,
                    fileUrl: this.fileUrl,
                    showVal: showVal,
                    date: date,
                    dateId: dateId,
                    from: from,
                    filePath: filePath,
                    msg_status: msg_status,
                    session_id: session_id,
                    private_note: private_note
            });
          }
        }
        if(typeof this.returnArrayChatSessionFromServer[0].chat!== 'undefined'){
          let chat = this.returnArrayChatSessionFromServer[0].chat;
          for(let jj = 0; jj < chat.length;jj++) {
            let msgIdid = chat[jj].id;
            this.allMassegesCheckData.add(msgIdid);
            let numberSR = numberUser;
            let msg = chat[jj].txt;
            let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
            if (chat[jj].txt.includes(string)) {
              msg = chat[jj].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
            }
            let Txt = "Txt[(RT)]";
            let Txt2 = "Btn";
            let Txt3 = "BS";
           let Txt4 = "<audio";
            let Txt6 = "<video"; 
            let Txt7 = "<img";
            let Txt8 = "href=https://livechat.taqnyat.sa/";
            let Txt5 = 'src="https://livechat.taqnyat.sa/';
            let checkAudio = 0;
            let checkImage = 0;
            let image = "";
            let doneReadAudio = 1;
            alert(chat[jj])
            if (chat[jj].txt.includes(Txt2) || chat[jj].txt.includes(Txt3)) {
              msg = await this.parseResponse(chat[jj].txt);
            } 
            else if(chat[jj].txt.includes(Txt)) {
              msg = chat[jj].txt;
            }else if(chat[jj].txt.includes(Txt4)) {
              checkAudio = 1;
              doneReadAudio = 0;
              msg =  msg+ '<div class="loading">Loading...</div>';
            }else if(chat[jj].txt.includes(Txt5)) {
               checkImage = 1;
                const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"]/i;
                const match = chat[jj].txt.match(regex);
                if (match) {
                    image = match[1];
                    const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(image);
                    if (isImage) {
                        msg = chat[jj].txt.replace('onclick="return fullImg(this)"', "");
                    }
                }
            }
            alert(image)
            msg = msg.replace(/\r\n/g, "<br>");
            if(!checkAudio)
              msg = this.sanitizer.bypassSecurityTrustHtml(msg);
            let time = chat[jj].time;
            let date = chat[jj].date;
            let dateId = chat[jj].dateId;
            let from = chat[jj].support;
            let filePath = chat[jj].filePath;
            let msg_status = chat[jj].msgStatus;
            let session_id = chatSessionId;
            let private_note = chat[jj].privateNote;
            let msgFail = chat[jj].msgFail;
             this.fileUrl = "";
             let showVal = 0;
            if (chat[jj].txt.includes(Txt4) || chat[jj].txt.includes(Txt6) || chat[jj].txt.includes(Txt7) || chat[jj].txt.includes(Txt8)) {
               this.fileUrl = await this.extractFileUrl(chat[jj].txt);
               showVal = 1;
            }
            await this.allMasseges.push({
              msgId: msgIdid,
              checkAudio: checkAudio,
              image: image,
              checkImage: checkImage,
              doneReadAudio: doneReadAudio,
              number: numberSR,
              msgFail: msgFail,
              msg: msg,
              time: time,
              date: date,
              dateId: dateId,
              fileUrl: this.fileUrl,
              showVal: showVal,
              from: from,
              filePath: filePath,
              msg_status: msg_status,
              session_id: session_id,
              private_note: private_note
           });
          }
        }
      }
      setTimeout(() => {
        const chatListElement = this.chatList.nativeElement as HTMLElement;
        chatListElement.scrollTop = chatListElement.scrollHeight;
        this.isScroolTo=1;
        this.countOfNewMsg = 0;
      }, 0); 
    })
    await this.convertAudioFilesInBackground();
    await this.functionFeachDataEverySe(numberUser,chatSessionId);
    await this.functionFeachDataEveryStatuse(numberUser,chatSessionId);
  }
  async convertAudioFilesInBackground() {
    for (let i = 0; i < this.allMasseges.length; i++) {
      if (this.allMasseges[i].checkAudio && !this.allMasseges[i].doneReadAudio) {
        let updatedHtml = await this.extractAudioSrc(this.allMasseges[i].msg);
        if (updatedHtml) {
          this.allMasseges[i].msg = updatedHtml;
          this.allMasseges[i].doneReadAudio = 1;
          this.allMasseges[i].msg = await this.allMasseges[i].msg.replace('<div class="loading">Loading...</div>', "");
          this.allMasseges[i].msg = await this.sanitizer.bypassSecurityTrustHtml(this.allMasseges[i].msg);
        }else
          continue;
      }
    }
  }
  async functionFeachDataEverySe(numberUser:any,chatSessionId:any){
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
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'onliceData':2,'dateSelect':this.genaratedFullDate,'sessionLogin':this.sessionLogin,"mobileSelect":numberUser};
    this.checkDataConvert=0;
    await this.chatService.chatGetData(sendValues).then(async dataHist=>{
      this.returnResultDataBySession = dataHist;
      let errorDataSession = this.returnResultDataBySession.messageId;
      if(errorDataSession == 1){
        this.returnArrayChatSessionFromServer = this.returnResultDataBySession.data.process;
        Object.keys(this.returnArrayChatSessionFromServer).forEach(async key => {
          if(this.returnArrayChatSessionFromServer[key].mobile == numberUser){
            if(typeof this.returnArrayChatSessionFromServer[key].chat!== 'undefined'){
              let chat = this.returnArrayChatSessionFromServer[key].chat;
              Object.keys(chat).forEach(async keyChat => {
                let msgIdid = chat[keyChat].id;
                if (!this.allMassegesCheckData.has(msgIdid)) {
                  this.allMassegesCheckData.add(msgIdid);
                  ++this.checkDataConvert;
                  let numberSR = numberUser;
                  let msg = chat[keyChat].txt;
                  let string = "<i class='material-icons medium'       style=cursor:default;color:#000000;>insert_drive_file </i>";
                  if (chat[keyChat].txt.includes(string)) {
                    msg = chat[keyChat].txt.replace(string, "<img src=\"../../assets/images/file.png\">");
                  } 
                  let Txt = "Txt[(RT)]";
                  let Txt2 = "Btn";
                  let Txt3 = "BS";
                  let Txt4 = "<audio";
                  let Txt6 = "<video"; 
                  let Txt7 = "<img";
                  let Txt8 = "href=https://livechat.taqnyat.sa/";
                  let Txt5 = 'src="https://livechat.taqnyat.sa/';
                  let checkAudio = 0;
                  let image = "";
                  let checkImage = 0;
                  let doneReadAudio = 1;
                  alert(chat[keyChat])
                  if (chat[keyChat].txt.includes(Txt2) || chat[keyChat].txt.includes(Txt3)) {
                    msg = await this.parseResponse(chat[keyChat].txt);
                  } 
                  else if(chat[keyChat].txt.includes(Txt)) {
                    msg = chat[keyChat].txt;
                  }else if(chat[keyChat].txt.includes(Txt4)) {
                    checkAudio = 1;
                    doneReadAudio = 0;
                    msg =  msg+ '<div class="loading">Loading...</div>';
                  }else if(chat[keyChat].txt.includes(Txt5)) {
                       checkImage = 1;
                      const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"]/i;
                      const match = chat[keyChat].txt.match(regex);
                      if (match) {
                          image = match[1];
                          const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(image);
                          if (isImage) {
                              msg = chat[keyChat].txt.replace('onclick="return fullImg(this)"', "");
                          }
                      }
                  }
                  alert(image)
                  msg = msg.replace(/\r\n/g, "<br>");
                  if(!checkAudio)
                    msg = this.sanitizer.bypassSecurityTrustHtml(msg);
                  let time = chat[keyChat].time;
                  let date = chat[keyChat].date;
                  let dateId = chat[keyChat].dateId;
                  let from = chat[keyChat].support;
                  let filePath = chat[keyChat].filePath;
                  let msg_status = chat[keyChat].msgStatus;
                  let session_id = chatSessionId;
                  let private_note = chat[keyChat].privateNote;
                  let msgFail = chat[keyChat].msgFail;
                  this.fileUrl = "";
                  let showVal = 0;
                  if (chat[keyChat].txt.includes(Txt4) || chat[keyChat].txt.includes(Txt6) || chat[keyChat].txt.includes(Txt7) || chat[keyChat].txt.includes(Txt8)) {
                    this.fileUrl = await this.extractFileUrl(chat[keyChat].txt);
                     showVal = 1;
                  }
                  await this.allMasseges.push({
                    msgId: msgIdid,
                    checkAudio: checkAudio,
                    image: image,
                    checkImage: checkImage,
                    doneReadAudio: doneReadAudio,
                    number: numberSR,
                    msgFail: msgFail,
                    msg: msg,
                    time: time,
                    date: date,
                    fileUrl: this.fileUrl,
                    showVal: showVal,
                    dateId: dateId,
                    from: from,
                    filePath: filePath,
                    msg_status: msg_status,
                    session_id: session_id,
                    private_note: private_note
                });
                if(this.isScroolTo==1){
                  setTimeout(() => {
                    const chatListElement = this.chatList.nativeElement as HTMLElement;
                    chatListElement.scrollTop = chatListElement.scrollHeight;
                    this.countOfNewMsg=0;
                    this.isScroolTo=1;
                  }, 0); 
                }else{
                  this.countOfNewMsg++;
                }
                }
              })
            }
          }
        });
      }
    });
    if(this.checkDataConvert!=0){
      await this.convertAudioFilesInBackground();
    }
    this.timeoutOne = setTimeout(() => {
      this.functionFeachDataEverySe(numberUser, chatSessionId);
    }, 1000);
  }
  extractFileUrl(html: string): string | null {
    if (!html) return null;
    const hrefMatch = html.match(/href=["']?([^"'\s>]+)/i);
    if (hrefMatch && hrefMatch[1]) {
      return hrefMatch[1];
    }
    const srcMatch = html.match(/src=["']?([^"'\s>]+)/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
    return null;
  }
    parseResponse(response: string): string {
    let html = '';
    let match;
    const welcomeRegex = /\[\(extraBtn\)\](.*?)(?=<br>|\z)/s;
    const welcomeMatch = response.match(welcomeRegex);
    if (welcomeMatch) {
      let welcomeText = welcomeMatch[1].trim();
      welcomeText = welcomeText.replace(/\[\(SB\)\]/g, '<br>');
      html += `<div>${welcomeText}</div><br>`;
    }
    const buttonRegex = /Btn\[\(RT\)\](.*?)(\[\(BS\)\]|$)/g;
    const buttonsSet = new Set<string>();
    while ((match = buttonRegex.exec(response)) !== null) {
      const text = match[1].trim();
      if (text && !buttonsSet.has(text)) {
        buttonsSet.add(text);
        html += `<ion-button class="buttonFromTaqnyat" mode="ios">${text}</ion-button><br>`;
      }
    }
    const textRegex = /Txt\[\(BS\)\](.*?)(\[\(BS\)\]|$)/g;
    while ((match = textRegex.exec(response)) !== null) {
      let text = match[1].trim();
      text = text.replace(/\[\(SB\)\]/g, '<br>');
      if (text && !buttonsSet.has(text)) {
        html += `<ion-button class="buttonFromTaqnyat" mode="ios">${text}</ion-button><br>`;
      }
    }
    const sbRegex = /\[\(SB\)\](.*?)(\[\(SB\)\]|$)/gs;
    while ((match = sbRegex.exec(response)) !== null) {
      const sbText = match[1].trim();
      if (sbText) {
        html += `<div>${sbText}</div>`;
      }
    }
    return html;
  }
  async functionFeachDataEveryStatuse(numberUser:any,chatSessionId:any){
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
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':numberUser,'sessionLogin':this.sessionLogin,'chatSessionId':chatSessionId};
    this.chatService.chatGetDataByNumber(sendValues).then(async dataHist=>{
      this.returnResultDataBySession = dataHist;
      let errorDataSession = this.returnResultDataBySession.messageId;
      if(errorDataSession == 1){
        this.returnArrayChatSessionFromServer = this.returnResultDataBySession.data.process;
        this.counter = 0;
        if(typeof this.returnArrayChatSessionFromServer[0].chatBot!== 'undefined'){
          let chatBot = this.returnArrayChatSessionFromServer[0].chatBot;
          for(let j = 0; j < chatBot.length;j++) {
            this.allMasseges.forEach((item: any) => {
              if (item.msgId === chatBot[j].id) {
                  item.msg_status = chatBot[j].msgStatus;
              }
          });
          }
        }
        if(typeof this.returnArrayChatSessionFromServer[0].chat!== 'undefined'){
          let chat = this.returnArrayChatSessionFromServer[0].chat;
          for(let jj = 0; jj < chat.length;jj++) {
            this.allMasseges.forEach((item: any) => {
              if (item.msgId === chat[jj].id) {
                  item.msg_status = chat[jj].msgStatus;
              }
          });
        }
        }
      }
    })
    this.timeoutTow = setTimeout(() => {
      this.functionFeachDataEveryStatuse(numberUser,chatSessionId);
    }, 1000);
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
 functionBackHome(){
    //from queued back url = 3
    //from home backurl = 1
    //from chatbot backurl = 2
    //from archive backurl = 1 
    if(this.backUrl == 1 || this.backUrl == 3)
       this.navCtrl.navigateRoot(['/home', {backUrl:this.backUrl}]);
    else if(this.backUrl == 2)
      this.navCtrl.navigateRoot('chatbot');
  }
  async displayError(message:any){
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 4500,
      position: 'bottom',
      cssClass:"toastStyle",
      color:""
    });
    await toast.present();
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
  scrollToBottom() {
    setTimeout(() => {
        const chatListElement = this.chatList.nativeElement as HTMLElement;
        chatListElement.scrollTop = chatListElement.scrollHeight;
        this.countOfNewMsg=0;
        this.isScroolTo=1;
    }, 50);
  }
  async ionViewWillLeave(){
    await clearTimeout(this.timeoutOne);
    await clearTimeout(this.timeoutTow);
    await this.functionChatSeen(this.selectNumber);
  }
  changeTypeSend(sendType:any=0){
    if(this.sendMsgType == 0){
      this.sendMsgType = 1;
      this.imageSelect = "../../assets/images/sendNote.png";
      this.displayResult(this.send_note_msg);
    }else{
       this.sendMsgType = 0;
      this.imageSelect = "../../assets/images/sendNoteH.png";
    }
  }
  async addMessage(typeMsg:any=0) { 
    this.isDisabled = true;
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
    let date = this.year+"/"+this.month+"/"+this.day;
    let typeTime =  this.hour >= 12 ? 'PM' : 'AM';
    let time = this.hour+":"+this.minutes+" "+typeTime;
    if (this.onMessage.trim()) {
      if(typeMsg == 1)
          this.onMessage = this.userName+":"+this.onMessage
      let sendValues = {'privateNote':typeMsg,'mainUserName':this.mainUserName,'userName':this.userName,'password':this.password,'apiKey':this.apiKey,'mobile':this.selectNumber,'sessionLogin':this.sessionLogin,'chatTxt':this.onMessage};
      this.chatService.sendMessage(sendValues).then(async dataHist=>{
        this.returnResultDataBySession = dataHist;
        let errorDataSession = this.returnResultDataBySession.messageId;
        if(errorDataSession == 1){
          this.isDisabled = false;
          this.onMessage = "";
        }
        setTimeout(() => {
          this.isDisabled = false;
          const chatListElement = this.chatList.nativeElement as HTMLElement;
          chatListElement.scrollTop = chatListElement.scrollHeight;
        }, 0); 
      })
    }
    setTimeout(() => {
      const chatListElement = this.chatList.nativeElement as HTMLElement;
      chatListElement.scrollTop = chatListElement.scrollHeight;
    }, 0);
    this.toggled = false;
  }
  functionGoToButtom(){
    setTimeout(() => {
      const chatListElement = this.chatList.nativeElement as HTMLElement;
      chatListElement.scrollTop = chatListElement.scrollHeight;
    }, 50); 
  }
  onScroll(event:any){
    const scrollElement = event.target as HTMLElement;
    if (scrollElement.scrollTop) {
     this.isScroolTo = 0;
    }
    const scrollHeight = Math.ceil(scrollElement.scrollHeight);
    const scrollTop = scrollElement.scrollTop;
    const offsetHeight = scrollElement.offsetHeight;
    const scrollendPage = Math.ceil(scrollTop + offsetHeight);
    if (scrollendPage >= scrollHeight) {
      this.isScroolTo = 1;
      this.countOfNewMsg=0;
    }
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: PopovercontentComponent,
      event: ev,
      animated:true,
      translucent: true,
      showBackdrop:false,
    });
    await popover.present();
    this.returnDataFromPop = await popover.onWillDismiss();
    if(this.returnDataFromPop!=undefined && this.returnDataFromPop!=0 && this.returnDataFromPop!=null){
      let data = this.returnDataFromPop.data;
      if(data == 1){
        this.functionSendFile();
      }else if(data == 2){
        this.functionSendImage();
      }else if(data == 3){
        this.functionSendFile();
      }else if(data == 4){
        this.functionMenueTemp();
      }else if(data == 5){
        this.fastresponse(ev);
      }
    }
  }
  async fastresponse(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: FastresponseComponent,
      event: ev,
      animated:true,
      translucent: true,
      showBackdrop:false,
    });
    await popover.present();
    this.returnDataFromPop = await popover.onWillDismiss();
    if(this.returnDataFromPop!=undefined && this.returnDataFromPop!=0 && this.returnDataFromPop!=null){
      let data = this.returnDataFromPop.data;
      this.onMessage = data;
    }
  }
  functionContact(){
    this.navCtrl.navigateRoot('contacts');
  }
  functionArchive(number:any,chatSessionId:any,nameUseId:any){
    this.navCtrl.navigateRoot(['/archive', {number:number,chatSessionId:chatSessionId,name:nameUseId,type:1,userNameThisConv:this.userNameThisConv}]);
  }
  async functionMenueformation(type:any){
    this.modalController.dismiss({});
    let model = await this.modalController.create({
      component:SubmenuComponent,
      animated:true,
      componentProps:{type:type,number:this.selectNumber,userNameThisConv:this.userNameThisConv},
      cssClass:"my-custom-modal"
    });
    model.onDidDismiss().then((data):any=>{
    });
    await model.present();
  }
  async functionMenueTemp(){
    this.modalController.dismiss({});
    let model = await this.modalController.create({
      component:TemplateComponent,
      animated:true,
      componentProps:{number:this.selectNumber},
      cssClass:"my-custom-modal-temp"
    });
    model.onDidDismiss().then((data):any=>{
      //this.functionFeachData(this.selectNumber,this.chatSessionId);
      //this.functionChatSeen(this.selectNumber);
    });
    await model.present();
  }
  functionCloseMenu(){
    this.modalController.dismiss({});
  }
  async downloadFile(message: any) {
    await this.platform.ready();
    const fileUrlD = message.fileUrl;
    const originalName = fileUrlD.substring(fileUrlD.lastIndexOf('/') + 1);
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${originalName}`;
    const folderName = 'Taqnyatlivechat';
    // تحديد المسار حسب المنصة
    const basePath = this.file.documentsDirectory
    const targetFolder = basePath + folderName + '/';
    const targetPath = targetFolder + fileName;

    // التأكد من وجود المجلد
    try {
      await this.file.checkDir(basePath, folderName);
    } catch (err: any) {
      if (err.code === 1 || err.code === 5) {
        try {
          await this.file.createDir(basePath, folderName, false);
        } catch (createErr) {
         await this.displayResult(this.error_downloade_file_tow)
          return;
        }
      } else {
        await this.displayResult(this.error_downloade_file_tow)
        return;
      }
    }
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.onProgress(progressEvent => {
      if (progressEvent.lengthComputable) {
        message.downloadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      } else {
        message.downloadProgress = 50;
      }
    });
    fileTransfer.download(fileUrlD, targetPath, true).then(
      async entry => {
        message.downloadProgress = 100;
        try {
          await this.socialSharing.share(
            'Here is your file',
            fileName,
            entry.toURL()
          );
        } catch (shareErr) {
         await this.displayResult(this.error_downloade_file_tow)
        }
      },
      async error => {
        message.downloadProgress = 0;
       await this.displayResult(this.error_downloade_file_tow)
      }
    );
  }
}