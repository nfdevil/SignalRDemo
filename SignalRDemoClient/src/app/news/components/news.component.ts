import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { NewsState } from '../store/news.state';
import * as NewsActions from '../store/news.action';
import { NewsItem } from '../models/news-item';

@Component({
    selector: 'app-news-component',
    templateUrl: './news.component.html'
})

export class NewsComponent implements OnInit {
    public async: any;
    newsItem: NewsItem;
    newsItems: NewsItem[] = [];
    group = 'IT';
    author = 'unknown';
    newsState$: Observable<NewsState>;
    groups = ['IT', 'global', 'sport'];
    currentGroup: string;

    constructor(private store: Store<any>) {

        this.newsState$ = this.store.select<NewsState>(state => state.news);

        this.store.select<NewsState>(state => state.news).subscribe((o: NewsState) => {
            this.newsItems = o.news.newsItems;
            this.currentGroup = o.news.currentGroup;
        });

        this.newsItem = new NewsItem();
        this.newsItem.AddData('', '', this.author, this.group);
    }

    public sendNewsItem(): void {
        this.newsItem.newsGroup = this.group;
        this.newsItem.author = this.author;
        this.store.dispatch(new NewsActions.SendNewsItemAction(this.newsItem));
    }

    public join(): void {
        this.store.dispatch(new NewsActions.JoinGroupAction(this.group));
    }

    public leave(): void {
        this.store.dispatch(new NewsActions.LeaveGroupAction(this.group));
    }

    ngOnInit(): void {
        console.log('go');
        this.store.dispatch(new NewsActions.SelectAllGroupsAction());
    }
}
