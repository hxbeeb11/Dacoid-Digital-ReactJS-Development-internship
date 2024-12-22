'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventForm from './components/EventForm';
import EventList from './components/EventList';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}



export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: Event) => ({
        ...event,
        start: new Date(event.start),  
        end: new Date(event.end),      
      }));
      setEvents(parsedEvents);
    } else {
      setEvents(events);
    }
  }, []);

  // Save events to localStorage whenever events are updated
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('events', JSON.stringify(events));
    }
  }, [events]);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(filter.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedDate(slotInfo.start);
    setEditingEvent({
      id: '',
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      description: '',
    });
    setShowEventForm(true);
  }, []);

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedDate(event.start);
    setEditingEvent(event);
    setShowEventForm(true);
  }, []);

  const handleSaveEvent = useCallback((event: Event) => {
    setEvents(prevEvents => {
      const updatedEvents = event.id
        ? prevEvents.map(e => e.id === event.id ? event : e) // Edit existing event
        : [...prevEvents, { ...event, id: Date.now().toString() }]; // Add new event

      localStorage.setItem('events', JSON.stringify(updatedEvents)); // Save updated events to localStorage
      return updatedEvents;
    });
    setShowEventForm(false);
    setEditingEvent(null);
  }, []);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents(prevEvents => {
      const updatedEvents = prevEvents.filter(event => event.id !== eventId);
      localStorage.setItem('events', JSON.stringify(updatedEvents)); // Save updated events to localStorage
      return updatedEvents;
    });
  }, []);

  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = e.target.value;
    setFilter(newFilter);

    if (newFilter) {
      const matchingEvent = events.find(event =>
        event.title.toLowerCase().includes(newFilter.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(newFilter.toLowerCase()))
      );
      if (matchingEvent) {
        setSelectedDate(matchingEvent.start);
      }
    }
  }, [events]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dynamic Event Calendar</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Filter events..."
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        date={selectedDate}
        onNavigate={date => setSelectedDate(date)}
      />
      <Button onClick={() => setShowEventForm(true)} className="mt-4">Add Event</Button>
      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
        />
      )}
      <EventList
        events={filteredEvents.filter(event =>
          startOfDay(event.start).toDateString() === startOfDay(selectedDate).toDateString() // Fix date comparison
        )}
        selectedDate={selectedDate}
        onEdit={handleSelectEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}