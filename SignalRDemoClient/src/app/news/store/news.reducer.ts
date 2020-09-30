import { NewsState } from './news.state';
import * as newsAction from './news.action';
import { NewsItem } from 'src/app/news/models/news-item';

export const initialState: NewsState = {
    news: {
        newsItems: [],
        groups: ['IT', 'global', 'sport'],
        currentGroup: null
    },
};

export function newsReducer(state = initialState, action: newsAction.Actions): NewsState {
    switch (action.type) {

        case newsAction.RECEIVED_GROUP_JOINED:
            return Object.assign({}, state, {
                news: {
                    newsItems: state.news.newsItems,
                    groups: (state.news.groups.indexOf(action.group) > -1) ? state.news.groups : state.news.groups.concat(action.group),
                    currentGroup: action.group
                },
            });

        case newsAction.RECEIVED_NEWS_ITEM:
            return Object.assign({}, state, {
                news: {
                    newsItems: state.news.newsItems.concat(action.newsItem),
                    groups: state.news.groups,
                    currentGroup: state.news.currentGroup
                }
            });

        case newsAction.RECEIVED_GROUP_HISTORY:
          const newsItems = state.news.newsItems.concat(action.newsItems);
          const uniqueNewsItems = Array.from(new Set(newsItems.map(s => `${s.newsGroup}${s.newsText}`))).map(
            key => newsItems.find(s => key === `${s.newsGroup}${s.newsText}`)
          );
          return Object.assign({}, state, {
              news: {
                  newsItems: uniqueNewsItems,
                  groups: state.news.groups,
                  currentGroup: state.news.currentGroup
              }
          });

        case newsAction.RECEIVED_GROUP_LEFT:
            // const data = [];
            // for (const entry of state.news.groups) {
            //     if (entry !== action.group) {
            //         data.push(entry);
            //     }
            // }
            // console.log(data);
            return Object.assign({}, state, {
                news: {
                    newsItems: state.news.newsItems,
                    // groups: data,
                    groups: state.news.groups,
                    currentGroup: null
                },
            });

        case newsAction.SELECTALL_GROUPS_COMPLETE:
            return Object.assign({}, state, {
                news: {
                    newsItems: state.news.newsItems,
                    groups: action.groups,
                    currentGroup: state.news.currentGroup
                }
            });

        default:
            return state;

    }
}
