'use server'    
import Booking from '@/database/booking.model'
import connectDB from '@/lib/mongodb'

    
    export const createBooking = async ({eventId, slug, email }: {eventId: string; slug: string; email: string})=> {
        try {
            await connectDB();
            // const booking= (await Booking.create({eventId, slug, email})).lean();
            await Booking.create({eventId, slug, email})
            // lean makes it a js object, not a Mongo document anlso had to wrap() from before await
            // alternatively, one could return ..booking.stringify beow
            return {success: true}
        } catch (e) {
            console.error('create booking failed', e)
            return {success: false}
        }
    }