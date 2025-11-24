export type EventItem = {
      image: string;
    title: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}


export const events: EventItem[] = [
  {
    image: '/images/event1.png',
    title: 'Sochi Jazz Festival 2024',
    slug: 'sochi-jazz-festival-2024',
    location: 'Sochi, Russia',
    date: 'April 20, 2024',
    time: '7:00 PM'
  },
  {
    image: '/images/event2.png',
    title: 'Tuapse Spring Marathon',
    slug: 'tuapse-spring-marathon',
    location: 'Tuapse, Russia',
    date: 'May 10, 2024',
    time: '9:00 AM'
  },
  {
    image: '/images/event3.png',
    title: 'Black Sea Food Fest',
    slug: 'black-sea-food-fest',
    location: 'Gelendzhik, Russia',
    date: 'June 5, 2024',
    time: '12:00 PM'
  },
  {
    image: '/images/event4.png',
    title: 'Ski Resort Opening Party',
    slug: 'ski-resort-opening-party',
    location: 'Krasnaya Polyana, Russia',
    date: 'December 1, 2023',
    time: '6:00 PM'
  },
  {
    image: '/images/event5.png',
    title: 'Sochi Art Exhibition',
    slug: 'sochi-art-exhibition',
    location: 'Sochi, Russia',
    date: 'March 12, 2024',
    time: '10:00 AM'
  }
]
