import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

/**
 * Creates a new Event from multipart form data, uploads the provided image to Cloudinary, and stores the event in the database.
 *
 * @param req - Incoming Next.js request containing multipart form data. Expected fields:
 *   - `image`: required file to upload (image).
 *   - `tags`: JSON string representing an array of tags.
 *   - `agenda`: JSON string representing the event agenda.
 *   - other form fields are treated as event properties.
 * @returns A JSON response containing a success message and the created event with status 201 on success;
 *          a 400 JSON response when the form data is invalid or the image file is missing;
 *          a 500 JSON response with an error message on internal failure.
 */
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries());
        } catch (e) {
            return NextResponse.json({ message: 'Invalid JSON data format'}, { status: 400 })
        }

        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({ message: 'Image file is required'}, { status: 400 })
 


        let tags = JSON.parse(formData.get('tags') as string);
        let agenda = JSON.parse(formData.get('agenda') as string);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if(error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: e instanceof Error ? e.message : 'Unknown'}, { status: 500 })
    }
}

/**
 * Retrieve all events sorted by creation time in descending order.
 *
 * @returns On success, a JSON response with a `message` and an `events` array; on failure, a JSON response with a `message` and an `error` describing the failure.
 */
export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
}