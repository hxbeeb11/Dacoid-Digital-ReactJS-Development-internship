'use client'

import React from 'react';
import { Button } from "@/components/ui/button"
import { format, isValid } from 'date-fns'

interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

interface EventListProps {
  events: Event[];
  selectedDate: Date;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export default function EventList({ events, selectedDate, onEdit, onDelete }: EventListProps) {
  const formatDate = (date: Date) => {
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid Date';
  };

  const formatTime = (date: Date) => {
    return isValid(date) ? format(date, 'h:mm a') : 'Invalid Time';
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Events for {formatDate(selectedDate)}</h2>
      {events.length === 0 ? (
        <p>No events for this day.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <h3 className="font-bold">{event.title}</h3>
                <p>{formatTime(event.start)} - {formatTime(event.end)}</p>
                {event.description && <p>{event.description}</p>}
              </div>
              <div>
                <Button onClick={() => onEdit(event)} className="mr-2">Edit</Button>
                <Button onClick={() => onDelete(event.id || '')} variant="destructive">Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

