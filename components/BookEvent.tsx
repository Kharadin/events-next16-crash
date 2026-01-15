'use client'

import { createBooking } from "@/lib/actions/booking.actions"
// import posthog from "posthog-js";
import { usePostHog } from 'posthog-js/react'
import  { useState } from "react"

const BookEvent = ({eventId, slug }: {eventId: string; slug: string}) => {
    const posthog = usePostHog() // Use this instead of the global import
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
                        // added async since we are added await
     const handleSubmit = async  (e: React.FormEvent) => {
        e.preventDefault();
        const {success} = await createBooking({eventId, slug, email})
        console.log('PostHog loaded:', posthog.__loaded)
        console.log('PostHog key:', process.env.NEXT_PUBLIC_POSTHOG_KEY)
        console.log('PostHog host:', process.env.NEXT_PUBLIC_POSTHOG_HOST)
        if (success) {
          // 1. Ensure posthog is ready
          if (posthog) {
            posthog.capture('event_booked', 
              { eventId, slug, email }, 
              { send_instantly: true }
            );  
            console.log('Posthog -booked')
            // 2. Add a tiny delay if you find the request is being cancelled
            await new Promise(r => setTimeout(r, 100)); 
          
          }
          setSubmitted(true)
          
        } else {
          console.error('Booking creation failed')
          posthog.captureException('Booking creation failed' )
            console.log('Posthog -booking failed')
        }
      
     }    

  // we actually want to submit the form, so commenting this out
  // we are in fact submitting it with the server action above: createBooking
  //   e.preventDefault()

  //   setTimeout(() => {
  //     setSubmitted(true)
  //   }, 1000)
  // }
  return (
    <div id='book-event'>
      {submitted ? (
        <p className="text-sm"> Thank you for booking.</p>

      ) :
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email Address</label>
          <input type="email" 
              id="email" 
              name="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your Email"
              />
        </div>
         <button type='submit' className="button-submit" >Submit</button>
      </form>}   
      </div>
  )
}


export default BookEvent;

