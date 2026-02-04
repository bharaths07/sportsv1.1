import { FeedItem } from '../domain/feed';

export const MOCK_FEED: FeedItem[] = [
  {
    id: 'f1',
    type: 'match_update',
    title: 'Match Started',
    content: 'The match between Royal Strikers and Thunder 11 has started!',
    publishedAt: '2023-11-20T10:05:00Z',
    visibility: 'public',
    relatedEntityId: 'm1'
  },
  {
    id: 'f2',
    type: 'achievement',
    title: 'New Record!',
    content: 'Rahul Kumar just scored his 5th century of the season.',
    publishedAt: '2023-11-19T16:30:00Z',
    visibility: 'public',
    relatedEntityId: 'p1'
  },
  {
    id: 'f3',
    type: 'announcement',
    title: 'Summer Tournament Registration',
    content: 'Registration for the annual Summer Cricket Cup is now open for all college teams.',
    publishedAt: '2023-11-18T09:00:00Z',
    visibility: 'public'
  },
  {
    id: 'f4',
    type: 'news',
    title: 'United FC Wins Regional',
    content: 'United FC has qualified for the state level championship after a stunning victory.',
    publishedAt: '2023-11-15T18:45:00Z',
    visibility: 'public',
    relatedEntityId: 't3'
  }
];
