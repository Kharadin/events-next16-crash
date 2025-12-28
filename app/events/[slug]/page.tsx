import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { IEvent } from "@/database";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set')
}
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
 

const EventDetailsPage = async ({params}: {params: Promise<{slug: string}>}) => {
  //improved to catch fetching etc errors:
  // const slug = params.then((p) => p.slug);
  // const paramsPromise = params
  const {slug} = await params; 
  
  let event;
  // adding try-catch block to ... 
  try {
    const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
        next: {revalidate: 60}
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
    console.error("Error fetching event", error)
 
     return notFound();
   }  




  // const {event: {description, image, overview, date, time, location, mode, agenda, audience, tags, organizer}} = await request.json(); 
    // udp:  destructuring the event object from the received object and creating vars form it's keys with respected names.(immediately destructuring the data of that event)

  const {description, image, overview, date, time, location, mode, agenda, audience, tags, organizer} = event
  
  if (!description) return notFound() // It's a Next Method

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
  // console.log({similarEvents})

  console.log(agenda)
  return ( 
    <section id="event">
      {/* <h1>Event Details: <br />{slug}</h1>? */}
      <div className="header">
        <h1>Event Description</h1>
        <p> {description}</p>
      </div>
      <div className="details">
          {/* Left side - Event Content */}
            <div className="content">
              <Image src={image} alt="Event Banner" width={800} height={800} className='banner'  />
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
                {/* the data is coming stringified (json string in an array) , so we JSON.parse it, converting into object (array) */}
              <EventAgenda agendaItems={agenda}/>
                  {/* deleted the parsing  deleted agenda[0]*/}
              <section className="flex-col-gap-2" >
                <h2>About the Organizer</h2>
                <p>{organizer}</p>
              </section>

              {/* <EventTags tags={JSON.parse(tags[0])} /> */}
                {tags?.[0] && (
                <EventTags tags={tags} />
                // deleted the parsing, deleted tags[0], just tags, now it's a proper object(array)
              )}

            </div>
          {/* Right side - Event Booking Form */}
          <aside className="booking">
            {/* <p className="text-lg font-semibold">Book Event</p> */}
            <div className="signup-card">
              <h2>Book Your Spot</h2>
                {bookings > 0 ? (
                  <p className="text-sm"> Join {bookings} people who have already booked their spot.</p> ): (
                    <p className="text-sm">Be the first to book your spot</p>
                  )}
                <BookEvent />
            </div>
          </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2 >Similar Events</h2>
        <div className='events'>

        {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent ) => (
          <EventCard {...similarEvent} key={similarEvent._id.toString()} />
          // или применить slug
        ))
      }
        </div>
      </div>            
    </section>
  )
}

export default EventDetailsPage