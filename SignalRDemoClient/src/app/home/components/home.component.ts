import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { Configuration } from 'src/app/app.constants';

@Component({
    selector: 'app-home-component',
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
    private hubConnection: HubConnection | undefined;
    public async: any;
    message = '';
    messages: string[] = [];
    userName = 'Anonymous';

    constructor(
      private config: Configuration
    ) {
    }

    public sendMessage(): void {
        const data = `${this.userName}: ${this.message}`;

        if (this.hubConnection) {
            this.hubConnection.invoke('Send', data);
        }
        this.messages.push(data);
    }

    ngOnInit(): void {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${this.config.apiUrl}loopy`)
            .configureLogging(signalR.LogLevel.Trace)
            .build();

        this.hubConnection.start().catch(err => console.error(err.toString()));

        this.hubConnection.on('Send', (data: any) => {
            const received = `${data}`;
            this.messages.push(received);
        });
    }

}
