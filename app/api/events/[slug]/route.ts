import { NextRequest, NextResponse } from "next/server";
import { Event } from "@/database";
import type { IEvent } from "@/database";
import connectDB from "@/lib/mongodb";

type RouteParams = {
  // Next.js 16 route handler params are delivered as a Promise.
  params: Promise<{
    slug: string;
  }>;
};
// GET api/events/[slug]
// Fetches a single event by its slug. 
/**
 * Validates an event slug.
 * We keep this intentionally strict because slugs are user-facing identifiers.
 */
// function isValidSlug(slug: string): boolean {
//   // Matches the app's slug generator: lowercase, numbers, and hyphen-separated words.
//   return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
/**
   * Handle GET requests to fetch a single event by its slug.
   *
   * Validates and sanitizes the slug from route params, ensures a database connection,
   * and returns an HTTP response with the event when found or an appropriate error status.
   *
   * @param params - An object (promise-resolved) that provides a `slug` string from the route.
   * @returns A NextResponse containing a `message` and, on success, the `event` object; responses use status codes 200 (found), 400 (invalid slug), 404 (not found), or 500 (server error).
   */

export async function GET ( req:NextRequest, {params}: RouteParams): Promise<NextResponse>{
    try {
      // connect to database
      await connectDB();

      //Await and extract slug from params
      const {slug} = await params;
      
      // Validate stup parameter
      if (!slug || typeof slug !== 'string' || slug.trim() === '') {
        return NextResponse.json(
          {message: 'Invalid or missing slug parameter'},
          {status: 400}
        )
      } 
      
      // Sanitize slug (remove any potential malicious input)
      const sanitizedSlug = slug.trim().toLowerCase();

      // Query event by slug:

      const event: IEvent | null = await Event.findOne({slug: sanitizedSlug}).lean();

      // Handle event not found
      if (!event) {
        return NextResponse.json(
          {message: `Event with slug '${sanitizedSlug}' not found`},
          {status: 404}
        );
      }
      // Return successfull responce with event data
      return NextResponse.json(
        {message: 'Event fetched sucecssfully', event},
        {status: 200}
      )

    } catch (error) {
      //Log error for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching by slug:', error
        )
      }

      //handle specific  error types
      if (error instanceof Error){
        //Handle database  connection errors 
        if (error.message.includes('MONGODB_URI')) {
          return NextResponse.json(
            {message: 'Database configuration error'},
            {status: 500}
          );
        }

        // Return generic error with error message
        return NextResponse.json(
          {message: 'Failed to fetch events', error: error.message},
          {status: 500}
        )
      }
    
     // Handle unknown errors
     return NextResponse.json(
      {message: 'An unexpected error occurred'},
      {status: 500}
     )
    }
  }    