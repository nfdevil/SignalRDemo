import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

import { ImageMessage } from '../imagemessage';
import { Configuration } from 'src/app/app.constants';

@Component({
    selector: 'app-images-component',
    templateUrl: './images.component.html'
})

export class ImagesComponent implements OnInit {
    private hubConnection: HubConnection | undefined;
    public async: any;
    message = '';
    messages: string[] = [];

    images: ImageMessage[] = [];

    constructor(
      private config: Configuration
    ) {
    }

    ngOnInit(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.config.apiUrl}zub`)
            .configureLogging(signalR.LogLevel.Trace)
            .build();

        this.hubConnection.stop();

        this.hubConnection.start().catch(err => {
            console.error(err.toString());
        });

        this.hubConnection.on('ImageMessage', (data: any) => {
            console.log(data);
            this.images.push(data);
        });
    }
}
