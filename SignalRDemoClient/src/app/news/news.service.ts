import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HubConnection } from '@microsoft/signalr';
import { NewsItem } from './models/news-item';
import { Store } from '@ngrx/store';
import * as NewsActions from './store/news.action';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { Configuration } from 'src/app/app.constants';

@Injectable()
export class NewsService {

    private hubConnection: HubConnection | undefined;
    private actionUrl: string;
    private headers: HttpHeaders;

    constructor(
        private http: HttpClient,
        private store: Store<any>,
        private config: Configuration
    ) {
        this.init();
        this.actionUrl = `${this.config.apiUrl}api/news/`;

        this.headers = new HttpHeaders();
        this.headers = this.headers.set('Content-Type', 'application/json');
        this.headers = this.headers.set('Accept', 'application/json');
    }

    send(newsItem: NewsItem): NewsItem {
        if (this.hubConnection) {
            this.hubConnection.invoke('Send', newsItem);
        }
        return newsItem;
    }

    joinGroup(group: string): void {
        if (this.hubConnection) {
            this.hubConnection.invoke('JoinGroup', group);
        }
    }

    leaveGroup(group: string): void {
        if (this.hubConnection) {
            this.hubConnection.invoke('LeaveGroup', group);
        }
    }

    getAllGroups(): Observable<string[]> {
        return this.http.get<string[]>(this.actionUrl, { headers: this.headers });
    }

    private init(): void {

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.config.apiUrl}loopey`)
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.hubConnection.start().catch(err => console.error(err.toString()));

        this.hubConnection.on('Send', (newsItem: NewsItem) => {
            this.store.dispatch(new NewsActions.ReceivedItemAction(newsItem));
        });

        this.hubConnection.on('JoinGroup', (data: string) => {
            console.log('recieved data from the hub');
            console.log(data);
            this.store.dispatch(new NewsActions.ReceivedGroupJoinedAction(data));
        });

        this.hubConnection.on('LeaveGroup', (data: string) => {
            this.store.dispatch(new NewsActions.ReceivedGroupLeftAction(data));
        });

        this.hubConnection.on('History', (newsItems: NewsItem[]) => {
            console.log('recieved history from the hub');
            console.log(newsItems);
            this.store.dispatch(new NewsActions.ReceivedGroupHistoryAction(newsItems));
        });
    }

}
