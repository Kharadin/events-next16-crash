import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
 import { events } from "@/lib/constants" // no longer needed

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const Page = async () => {
  'use cache'
  cacheLife("minutes")
  // let events = [];
  // try {
  //   const response = await fetch(`${BASE_URL}/api/events`, {
  //     next: { revalidate: 60 }, // Revalidate every 60 seconds
  //     signal: AbortSignal.timeout(5000), // 5 second timeout
  //   });
  //   if (!response.ok) {
  //     throw new Error(`Failed to fetch events: ${response.status}`);
  //   }
  //   const data = await response.json();
  //   events = data.events || [];
  // } catch (error) {
  //   console.error('Error fetching events:', error);
  //   // events remains empty array, component will render without crashing
  // }
  return (
    <section>
      <h1 className="text-center ">Event Management Project<br /> Всегда есть куда пойти</h1>
      <p className="text-center mt-5">События, метоприятия, концерты, выступления</p>
      <ExploreBtn/>
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
            {events && events.length > 0 && events.map((event: IEvent)=> (
            <li key={event.title} className='list-none'>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page
