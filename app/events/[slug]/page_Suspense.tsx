import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";


// let's get the base url from the environment variable
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set');
  }


// --- Helper Sub-Components ---
const EventDetailItem = ({icon, alt, label} : {icon: string; alt: string; label: string; })=> (
  <div className="flex flex-row gap-2 items-center"> 
    <Image src={icon} alt={alt} width={17} height={17}/>
    <p>{label}</p>
  </div>
)  

 const EventAgenda =({agendaItems}: {agendaItems: string[]}) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item)=> (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
 )

  const EventTags =({tags}: {tags: string[]})=> (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag)=> (
      <div className='pill' key={tag}>{tag}</div>
        ))}
  </div>
 )
 
// ---- Main Components ----

async function EventMainContent({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  // 1. Wait for the slug
  const { slug } = await slugPromise;

  let event;
  // adding try-catch block to ... 
  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: { revalidate: 60 }
    });

    if (!request.ok) {
      if (request.status === 404) {
        return notFound();
      }
        throw new Error(`Failed to fetch event: ${request.statusText}`)
    }
    const response= await request.json()
    event = response.event
    
    if (!event) {

      return notFound();
    }
  
   
  } catch (error) {
    console.error("Error fetching event", error);
    return notFound();
  }

  const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

  if(!description)  return notFound();
  

  return (
      <section id="event">
      {/* <h1>Event Details: <br />{slug}</h1>? */}

        <div className="header">
          <h1>Event Description</h1>
          <p>{description}</p>
        </div>
       <div className="details">
         {/* Left side - Event Content */}
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className='banner' />
          
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem icon="/icons/calendar.svg" label={date} alt="calendar" />
            <EventDetailItem icon="/icons/clock.svg" label={time} alt="time" />
            <EventDetailItem icon="/icons/pin.svg" label={location} alt="location" />
            <EventDetailItem icon="/icons/mode.svg" label={mode} alt="mode" />
            <EventDetailItem icon="/icons/audience.svg" label={audience} alt="audience" />
          </section>

          <EventAgenda agendaItems={agenda}/>

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          {/* Your original check: Only render if there is at least one tag */}
          {tags?.[0] && <EventTags tags={tags} />}
        </div>
          <aside className="booking">
            <div className="signup-card">
              <h2>Book Your Spot</h2>
              <BookEvent eventId={event._id} slug={event.slug}/>
            </div>
          </aside>
       </div>
      </section>
    );


}

async function SimilarEventsList({ slugPromise }: { slugPromise: Promise<{ slug: string }> }) {
  const { slug } = await slugPromise;
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <div className="flex w-full flex-col gap-4 pt-20">
      <h2>Similar Events</h2>
      <div className='events'>
        {similarEvents.length > 0 ? (
          similarEvents.map((event: IEvent) => <EventCard {...event} key={event._id.toString()} />)
        ) : (
          <p>No similar events found.</p>
        )}
      </div>
    </div>
  );
}

// --- Main Page Component ---

const EventDetailsPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
     <section id='event'>
        <Suspense fallback={<div className="header"><h1>Loading event details...</h1></div>}>
          <EventMainContent slugPromise={params} />
        </Suspense>

        {/* <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            <BookEvent />
          </div>
        </aside> */}

      <Suspense fallback={<div>Finding similar events...</div>}>
        <SimilarEventsList slugPromise={params} />
      </Suspense>
  </section>
  );
};

export default EventDetailsPage;
