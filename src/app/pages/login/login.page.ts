import { Component, OnInit } from '@angular/core';
import {LoadingController, MenuController,ModalController, NavController, Platform, ToastController} from "@ionic/angular";
import {Storage} from '@ionic/storage-angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { TranslateService } from '@ngx-translate/core';
import {UserService} from "../../service/user.service";
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import {VersionComponent} from "../version/version.component";
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { ChatService } from "../../service/chat.service";
import { AnimationController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone:false
})
export class LoginPage implements OnInit {
public pageTitle: any;
public sign_up: any;
public login_button: any;
public isdisabled:boolean=true;
public apiKey: any;
public returnResultData:any;
public login_error_one:any;
public login_error_tow:any;
public login_error_three:any;
public genaratedDate:any;
public year:any;
public month:any;
public day:any;
public contact_label:any;
public contact_link:any;
//new login
public mainUserName: any;
public userNameVal: any;
// //mainUserName
// public mainUserName: any;
// public main_user_name: any;
// public errorMainUserName:any="";
// public isErrorMainUserName:any = 1;
// public main_user_name_error:any;

//UserName
public userName: any;
public user_name: any;
public errorUserName:any="";
public isErrorUserName:any = 1;
public isErrorUserNameTow:any = 1;
public user_name_error:any;

//password
public password: any;
public user_password: any;
public errorUserPassword:any="";
public isErrorUserPassword:any = 1;
public user_Password_error:any;

//page setting
public checkLanguage: any=0;
public language: any;
public menuDirection: any;
public menuDirectionTow: any;
public showPassword: boolean = false;
public login_note: any;
public login_error_userN_format: any;
public version: any;
  constructor(private animationCtrl: AnimationController,private chatService: ChatService,private router: Router,private appVersion: AppVersion,private userService: UserService,private globalization: Globalization, private translate: TranslateService,private modalController: ModalController,private network:Network,private menu:MenuController,private storage: Storage,private platform: Platform,private navCtrl: NavController,private toastCtrl: ToastController,private loading: LoadingController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navCtrl.navigateRoot("/login");
    });
    this.menu.enable(false,"sideMenu");
     this.platform.ready().then(async () => {
      this.getAppInfo();
    });
  }
  async getAppInfo() {
      this.version = await this.appVersion.getVersionNumber();
      this.chatService.version().then(async data => {
        this.returnResultData = data;
        let errorData = this.returnResultData.status;
        if (errorData == 1) {
          let returnData = await this.compareVersions(this.version, this.returnResultData.ios);
          if(returnData){
            this.getAnimation();
          }
        }
      });
  }
  async getAnimation(){
     // دالة custom enter animation
        const enterAnimation = (baseEl: HTMLElement) => {
          const root = baseEl.shadowRoot;
          const backdropAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('ion-backdrop')!)
            .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
          const wrapperAnimation = this.animationCtrl
            .create()
            .addElement(root!.querySelector('.modal-wrapper')!)
            .keyframes([
              { offset: 0, opacity: '0', transform: 'translateY(100%)' },
              { offset: 1, opacity: '0.99', transform: 'translateY(0)' }
            ]);

          return this.animationCtrl
            .create()
            .addElement(baseEl)
            .easing('cubic-bezier(0.36,0.66,0.04,1)')
            .duration(800) // هنا التحكم في الوقت! غيّر الرقم زي ما تحب (بالمللي ثانية)
            .addAnimation([backdropAnimation, wrapperAnimation]);
        };

        // leave animation عكس الـ enter
        const leaveAnimation = (baseEl: HTMLElement) => {
          return enterAnimation(baseEl).direction('reverse');
        };

        const modal = await this.modalController.create({
          component: VersionComponent,
          animated: true,
          cssClass: "my-custom-modal-temp",
          enterAnimation: enterAnimation,
          leaveAnimation: leaveAnimation
        });

        modal.onDidDismiss().then((data: any) => {
          console.log('Modal dismissed with data:', data.data);
          // هنا ممكن تعمل حاجة بعد الإغلاق، زي إعادة فحص الإصدار أو أي شيء
        });
        await modal.present();
  }
  compareVersions(current: string, latest: string): boolean {
    const curr = current.split('.').map(Number);
    const last = latest.split('.').map(Number);
    for (let i = 0; i < Math.max(curr.length, last.length); i++) {
      const c = curr[i] || 0;
      const l = last[i] || 0;
      if (c < l) return true;   // في تحديث
      if (c > l) return false;  // نسختك أحدث
    }
    return false; // نفس النسخة
  }
  initialiseTranslation(){
    this.translate.get('menuDirection').subscribe((res: string) => {
      this.menuDirection = res;
    });
    this.translate.get('menuDirectionTow').subscribe((res: string) => {
      this.menuDirectionTow = res;
    });
    this.translate.get('login_title').subscribe((res: string) => {
      this.pageTitle = res;
    });
    this.translate.get('sign_up').subscribe((res: string) => {
      this.sign_up = res;
    });
    this.translate.get('login_button').subscribe((res: string) => {
      this.login_button = res;
    });
    // this.translate.get('main_user_name').subscribe((res: string) => {
    //   this.main_user_name = res;
    // });
    // this.translate.get('main_user_name_error').subscribe((res: string) => {
    //   this.main_user_name_error = res;
    // });
    this.translate.get('user_name').subscribe((res: string) => {
      this.user_name = res;
    });
    this.translate.get('user_name_error').subscribe((res: string) => {
      this.user_name_error = res;
    });
    this.translate.get('user_password').subscribe((res: string) => {
      this.user_password = res;
    });
    this.translate.get('user_Password_error').subscribe((res: string) => {
      this.user_Password_error = res;
    });
    this.translate.get('login_error_one').subscribe((res: string) => {
      this.login_error_one = res;
    });
    this.translate.get('login_error_tow').subscribe((res: string) => {
      this.login_error_tow = res;
    });
    this.translate.get('login_error_three').subscribe((res: string) => {
      this.login_error_three = res;
    });
    this.translate.get('contact_link').subscribe((res: string) => {
      this.contact_link = res;
    });
    this.translate.get('contact_label').subscribe((res: string) => {
      this.contact_label = res;
    });
     this.translate.get('login_note').subscribe((res: string) => {
      this.login_note = res;
    });
    this.translate.get('login_error_userN_format').subscribe((res: string) => {
      this.login_error_userN_format = res;
    });
  }
  // checkMainUserName(event:any){
  //   this.mainUserName = event.target.value;
  //   this.errorMainUserName = "ionItemStyleSuccess";
  //   this.isErrorMainUserName = 1;
  //   if(this.mainUserName == "" || this.mainUserName == undefined){
  //     this.errorMainUserName = "ionItemStyleError";
  //     this.isErrorMainUserName = 0;
  //   }else{
  //     this.isdisabled = true;
  //   }
  // }
  checkUserName(event:any){
    this.errorUserName = "ionItemStyleSuccess";
    this.isErrorUserName = 1;
    this.isErrorUserNameTow = 1;
    this.userName = event.target.value;
    if(this.userName == "" || this.userName == undefined){
      this.errorUserName = "ionItemStyleError";
      this.isErrorUserName = 0;
    }else{
      this.isdisabled = true;
    }
  }
  checkPassword(event:any){
    this.errorUserPassword = "ionItemStyleSuccess";
    this.isErrorUserPassword = 1;
    this.password = event.target.value;
    if(this.password == "" || this.password == undefined){
      this.errorUserPassword = "ionItemStyleError";
      this.isErrorUserPassword = 0;
    }else{
      this.isdisabled = true;
    }
  }
  async ngOnInit() {
    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
    this.day = currentDate.getDate();
    if(this.month<10)
      this.month = '0'+ this.month;
    if(this.day<10)
      this.day = '0'+ this.day;
    this.genaratedDate = this.year+""+this.month+""+this.day;
    await this.getDeviceLanguage();
  }
  async checkUser(){
      let valcheckV = 0;
      await this.chatService.version().then(async data => {
        this.returnResultData = data;
        let errorData = this.returnResultData.status;
        if (errorData == 1) {
          let returnData = await this.compareVersions(this.version, this.returnResultData.ios);
          if(returnData){
            this.getAnimation();
            valcheckV = 1;
          }
        }
      });
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      //this.navCtrl.navigateRoot("/login");
      return false;
    });
    if(valcheckV==1){
      return false;
    }
    //(this.mainUserName == undefined || this.mainUserName == "") && 
    if((this.userName == undefined || this.userName == "") && (this.password == undefined || this.password == "")){
      //this.errorMainUserName = "ionItemStyleError";
      //this.isErrorMainUserName = 0;
      this.errorUserName = "ionItemStyleError";
      this.isErrorUserName = 0;
      this.errorUserPassword = "ionItemStyleError";
      this.isErrorUserPassword = 0;
      this.isdisabled = false;
      return false;
    }
    // if(this.errorMainUserName == undefined || this.errorMainUserName == ""){
    //   this.errorMainUserName = "ionItemStyleError";
    //   this.isErrorMainUserName = 0;
    //   this.isdisabled = false;
    //   return false;
    // }
    if(this.userName == undefined || this.userName == ""){
      this.errorUserName = "ionItemStyleError";
      this.isErrorUserName = 0;
      this.isdisabled = false;
      return false;
    }
    if(this.password == undefined || this.password == ""){
      this.errorUserPassword = "ionItemStyleError";
      this.isErrorUserPassword = 0;
      this.isdisabled = false;
      return false;

    }
    if (this.userName.includes("@")) {
      [this.userNameVal, this.mainUserName] = this.userName.split("@");
    }else{
      this.isErrorUserNameTow = 0;
      this.userNameVal = ""; 
      this.mainUserName = "";
      this.isdisabled = false;
      return false;
    }
    let key = this.mainUserName+this.userNameVal+this.password+"(OLH)"+this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKey = md5Hash.finalize();
    this.apiKey=this.apiKey.toString();
    let sendValues = {'mainUserName':this.mainUserName,'userName':this.userNameVal,'password':this.password,'apiKey':this.apiKey};
    const loading = await this.loading.create({
      cssClass: 'custom-spinner',
      message: '',
      duration: 1500,
    });
    this.userService.login(sendValues).then(async data=>{
      this.returnResultData = data;
      let errorData = this.returnResultData.messageId;
      if(errorData == 1){
        await this.storage.set('mainUserName',this.mainUserName);
        await this.storage.set('userName',this.userNameVal);
        await this.storage.set('password',this.password);
        await this.storage.set('apiKey',this.apiKey);
        await this.storage.set('sessionLogin',this.returnResultData.sessionLogin);
        await this.storage.set('department',this.returnResultData.department);
        await this.storage.set('supervisor',this.returnResultData.supervisor);
        await this.storage.set('name',this.returnResultData.name);
        this.displayResult(this.login_error_one);
        this.navCtrl.navigateRoot("/home");
        await loading.present();
      }else if(errorData == 2){
        this.displayResult(this.login_error_tow);
        await loading.present();
      }else {
        this.displayResult(this.login_error_three);
        await loading.present();
      }
    }).catch(async error=>{
      this.displayResult(this.login_error_three);
      await loading.present();
    });
    this.isdisabled = true;
    return true;
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
        if (Val[0] == "ar" || Val[0] == "en" || Val[0] == "ur")
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
          if (Val[0] == "ar" || Val[0] == "en" || Val[0] == "ur")
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
      duration: 4000,
      position: 'bottom',
      cssClass:"toastStyle",
    });
    await toast.present();
  }
  changeInputType(){
    this.showPassword = !this.showPassword;
  }
}
