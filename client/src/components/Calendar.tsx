import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { calendar } from '../css/styles.css';
import { ModalDayMemo } from './ModalDayMemo.tsx';
import { ModalAIStory } from './ModalAIStory';
import { llmStory } from '../lib/LLMStory';
import { firestore } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

type EventInput = {
  id: string;
  title: string;
  start: string;
  memo: string;
};

export type SelectDate = {
  start: Date;
  end: Date;
};

export function Calendar() {
  const [show, setShow] = useState(false);
  const [AIModalShow, setAIModalShow] = useState(false);
  const [clickDate, setClickDate] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [selectedDate, setSelectedDate] = useState<SelectDate | null>(null);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [AIStory, setAIStory] = useState('AIストーリーが表示されます');

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(firestore, 'events'));
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as EventInput));
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  const showModal = () => setShow(true);
  const closeModal = () => {
    setShow(false);
    setSelectedEvent(null);
    setClickDate('');
  };

  const showAIModal = () => setAIModalShow(true);
  const closeAIModal = () => setAIModalShow(false);

  const removeEvent = async () => {
    if (selectedEvent) {
      await deleteDoc(doc(firestore, 'events', selectedEvent.id));
      const newEvents = events.filter(event => event.id !== selectedEvent.id);
      setEvents(newEvents);
    }
    closeModal();
  };

  function handleDateClick(date: DateClickArg) {
    setClickDate(date.dateStr);
    setSelectedEvent(null);
    showModal();
  }

  function handleDateSelect(date: DateSelectArg) {
    setSelectedDate({
      start: date.start,
      end: date.end,
    });
    const selectedEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= date.start && eventDate < date.end;
    });
    console.log("Selected Events:", selectedEvents);
  }

  function handleEventClick(clickEvent: EventClickArg) {
    setSelectedEvent({
      id: clickEvent.event.id || String(events.length + 1),
      title: clickEvent.event.title || '',
      start: clickEvent.event.startStr,
      memo: clickEvent.event.extendedProps.memo || '',
    });
    showModal();
  }

  async function registerSchedule(title: string, memo: string) {
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        title: title,
        memo: memo,
      };
      await updateDoc(doc(firestore, 'events', selectedEvent.id), updatedEvent);
      const updatedEvents = events.map(event =>
        event.id === selectedEvent.id ? updatedEvent : event
      );
      setEvents(updatedEvents);
    } else {
      const newEvent = {
        id: String(events.length + 1),
        title: title,
        start: clickDate,
        memo: memo,
      };
      const newDocRef = await addDoc(collection(firestore, 'events'), newEvent);
      newEvent.id = newDocRef.id;
      setEvents([...events, newEvent as EventInput]);
    }
    closeModal();
  }

  return (
      <div className={calendar}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          customButtons={{
            myCustomButton: {
              text: 'AI出力',
              click: function() {
                if (selectedDate) {
                  const selectedEvents = events.filter(event => {
                    const eventDate = new Date(event.start);
                    return eventDate >= selectedDate.start && eventDate < selectedDate.end;
                  });
                  const eventsData = selectedEvents.map(event => ({
                    date: event.start,
                    memo: event.memo,
                  }));
                  
                  llmStory(eventsData, 4).then(story => {
                    setAIStory(story);
                    showAIModal();
                  }).catch(error => {
                    console.error('Error generating AI story:', error);
                  });
                }
              }
            }
          }}
          headerToolbar={{
            left: 'prev,next, myCustomButton',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek',
          }}
          initialView="dayGridMonth"
        //   contentHeight={'auto'}
          events={events}
          dateClick={handleDateClick}
          selectable={true}
          selectMirror={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
        <ModalDayMemo
          title="出来事を追加"
          show={show}
          closeModal={closeModal}
          registerSchedule={registerSchedule}
          removeEvent={removeEvent}
          event={selectedEvent}
          clickDate={clickDate}
        />
        <ModalAIStory
          show={AIModalShow}
          closeModal={closeAIModal}
          selectedDate={selectedDate}
          AIStory={AIStory}
        />
      </div>
  );
}