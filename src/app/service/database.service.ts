import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders } from "@angular/common/http";
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public result:any;
  private db!: SQLiteObject;
  private conversations$ = new BehaviorSubject<any[]>([]);
  constructor(private sqlite: SQLite,private platform: Platform) { 
  }

async initDb() {
    await this.platform.ready();

    this.db = await this.sqlite.create({
      name: 'conversations.db',
      location: 'default'
    });

    await this.db.executeSql(`
    CREATE TABLE IF NOT EXISTS chat_get_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chatSession_id TEXT UNIQUE,
        mobile TEXT,
        user_name TEXT,
        name TEXT,
        badge TEXT,
        count_msg INTEGER DEFAULT 0,
        last_message TEXT,
        updated_at TEXT,
        type INTEGER
    )
    `, []);

    await this.loadAllConversations();
  }
  async saveConversations(apiResponse: any) {
    const process = apiResponse?.data?.process;
    const queue = apiResponse?.data?.queue;
    const bot = apiResponse?.data?.bot;
    const processArr = Array.isArray(process) ? process : Object.values(process || {});
    const queueArr = Array.isArray(queue) ? queue : Object.values(queue || {});
    const botArr = Array.isArray(bot) ? bot : Object.values(bot || {});
    // 🧠 حالة messageId = 2 (sync partial delete)
    if (apiResponse.messageId === 2) {
      if (processArr.length === 0) {
        await this.db.executeSql(
          `DELETE FROM chat_get_data WHERE type = 1`,
          []
        );
      }

      if (queueArr.length === 0) {
        await this.db.executeSql(
          `DELETE FROM chat_get_data WHERE type = 2`,
          []
        );
      }
      if (botArr.length === 0) {
        await this.db.executeSql(
          `DELETE FROM chat_get_data WHERE type = 3`,
          []
        );
      }
      await this.loadAllConversations();
      return;
    }
    const now = new Date().toISOString();
    const batch: any[] = [];
    for (const conv of processArr) {
      const chatSessionId = conv?.chatSessionId || conv?.id || Date.now().toString();
      const name = conv?.name || conv?.mobile || '';
      const countMsg =
        conv?.badge && conv.badge != 0
          ? (conv?.countMsg || 0)
          : 0;
      const lastMessage =
        conv?.lastMessage ||
        conv?.message ||
        '';
      batch.push([
        `INSERT OR REPLACE INTO chat_get_data 
        (chatSession_id, mobile, user_name, name, badge, count_msg, last_message, updated_at, type) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          chatSessionId,
          conv?.mobile || '',
          conv?.userName || '',
          name,
          conv?.badge || 0,
          countMsg,
          lastMessage,
          now,
          1
        ]
      ]);
    }
    for (const conv of queueArr) {
      const chatSessionId = conv?.chatSessionId || conv?.id || Date.now().toString();
      const name = conv?.name || conv?.mobile || '';
      const countMsg =
        conv?.badge && conv.badge != 0
          ? (conv?.countMsg || 0)
          : 0;
      const lastMessage =
        conv?.lastMessage ||
        conv?.message ||
        '';
      batch.push([
        `INSERT OR REPLACE INTO chat_get_data 
        (chatSession_id, mobile, user_name, name, badge, count_msg, last_message, updated_at, type) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          chatSessionId,
          conv?.mobile || '',
          conv?.userName || '',
          name,
          conv?.badge || 0,
          countMsg,
          lastMessage,
          now,
          2
        ]
      ]);
    }
    for (const conv of botArr) {
      const chatSessionId = conv?.chatSessionId || conv?.id || Date.now().toString();
      const name = conv?.name || conv?.mobile || '';
      const countMsg =
        conv?.badge && conv.badge != 0
          ? (conv?.countMsg || 0)
          : 0;

      const lastMessage =
        conv?.lastMessage ||
        conv?.message ||
        '';
      if(conv.userName == "bot"){
          batch.push([
          `INSERT OR REPLACE INTO chat_get_data 
          (chatSession_id, mobile, user_name, name, badge, count_msg, last_message, updated_at, type) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            chatSessionId,
            conv?.mobile || '',
            conv?.userName || '',
            name,
            conv?.badge || 0,
            countMsg,
            lastMessage,
            now,
            3
          ]
        ]);
      }
    }
    try {
      // 🔥 حذف المحادثات القديمة غير الموجودة في API
      const newIds = [...processArr, ...queueArr, ...botArr]
        .map(conv => conv?.chatSessionId || conv?.id)
        .filter(Boolean);
      if (newIds.length > 0) {
        const placeholders = newIds.map(() => '?').join(',');
        await this.db.executeSql(
          `DELETE FROM chat_get_data 
          WHERE chatSession_id NOT IN (${placeholders})`,
          newIds
        );
      } else {
        await this.db.executeSql(`DELETE FROM chat_get_data`, []);
      }
      if (batch.length > 0) {
        try {
            await this.db.sqlBatch(batch);
          } catch (error) {
          }
      }
      await this.loadAllConversations();
    } catch (error) {
    }
  }

  private async loadAllConversations() {
    try {
      const res = await this.db.executeSql(
        `SELECT * FROM chat_get_data 
         ORDER BY updated_at DESC, count_msg DESC`, 
        []
      );
      const data = res.rows.length 
        ? Array.from({ length: res.rows.length }, (_, i) => res.rows.item(i)) 
        : [];

      this.conversations$.next(data);
    } catch (error) {
    }
  }

  getConversations() {
    return this.conversations$.asObservable();
  }
  async clearDatabase() {
    try {
      await this.db.executeSql(`DELETE FROM chat_get_data`, []);
      this.conversations$.next([]);
    } catch (error) {
    }
  }
 }
