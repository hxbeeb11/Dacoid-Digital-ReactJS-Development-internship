'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Event {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

interface EventFormProps {
  event?: Event | null;
  onSave: (event: Event) => void;
  onCancel: () => void;
}

export default function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || '');
  const [start, setStart] = useState(event?.start || new Date());
  const [end, setEnd] = useState(event?.end || new Date());
  const [description, setDescription] = useState(event?.description || '');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      const newStart = new Date(date);
      newStart.setHours(start.getHours(), start.getMinutes());
      setStart(newStart);
      setShowStartDatePicker(false);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      const newEnd = new Date(date);
      newEnd.setHours(end.getHours(), end.getMinutes());
      setEnd(newEnd);
      setShowEndDatePicker(false);
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newStart = new Date(start);
    newStart.setHours(hours, minutes);
    setStart(newStart);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    const newEnd = new Date(end);
    newEnd.setHours(hours, minutes);
    setEnd(newEnd);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: event?.id,
      title,
      start,
      end,
      description,
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Start Date and Time</Label>
            <div className="flex space-x-2">
              <Popover open={showStartDatePicker} onOpenChange={setShowStartDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(start, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={start}
                    onSelect={handleStartDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={format(start, "HH:mm")}
                onChange={handleStartTimeChange}
                className="w-[120px]"
              />
            </div>
          </div>
          <div>
            <Label>End Date and Time</Label>
            <div className="flex space-x-2">
              <Popover open={showEndDatePicker} onOpenChange={setShowEndDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(end, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={end}
                    onSelect={handleEndDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={format(end, "HH:mm")}
                onChange={handleEndTimeChange}
                className="w-[120px]"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onCancel} variant="outline">Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

