import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { calendar } from '../css/styles.css';
import { ModalDayMemo } from './ModalDayMemo';
import { ModalAIStory } from './ModalAIStory';
import { llmStory } from '../lib/LLMStory';
import { firestore, auth } from '../firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { DropdownButton, Dropdown } from 'react-bootstrap';

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
  const [user, setUser] = useState<User | null>(null);
  const [selectedOption, setSelectedOption] = useState('写実'); // 選択されたオプションを保持する状態
  const [selectedOptionNumber, setSelectedOptionNumber] = useState<number>(1);
  const calendarRef = useRef<FullCalendar>(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        fetchEvents(authUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchEvents = async (userId: string) => {
    const snapshot = await getDocs(collection(firestore, `users/${userId}/events`));
    const fetchedEvents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as EventInput));
    setEvents(fetchedEvents);
  };

  const showModal = () => setShow(true);
  const closeModal = () => {
    setShow(false);
    setSelectedEvent(null);
    setClickDate('');
  };

  const showAIModal = () => setAIModalShow(true);
  const closeAIModal = () => setAIModalShow(false);

  const removeEvent = async () => {
    if (user && selectedEvent) {
      await deleteDoc(doc(firestore, `users/${user.uid}/events`, selectedEvent.id));
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
    if (user) {
      if (selectedEvent) {
        const updatedEvent = {
          ...selectedEvent,
          title: title,
          memo: memo,
        };
        await updateDoc(doc(firestore, `users/${user.uid}/events`, selectedEvent.id), updatedEvent);
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
        const newDocRef = await addDoc(collection(firestore, `users/${user.uid}/events`), newEvent);
        newEvent.id = newDocRef.id;
        setEvents([...events, newEvent as EventInput]);
      }
      closeModal();
    }
  }

  async function saveAIStoryToFirestore(userId: string, story: string, selectedDate: SelectDate | null) {
    if (selectedDate) {
        const aiStoryData = {
            story: story,
            startDate: selectedDate.start,
            endDate: selectedDate.end,
            timestamp: new Date(),
        };

        try {
            await addDoc(collection(firestore, `users/${userId}/aiStories`), aiStoryData);
            console.log("AIストーリーが保存されました");
        } catch (error) {
            console.error("AIストーリーの保存中にエラーが発生しました:", error);
        }
    }
  }

  // オプションの設定
  const options: Record<string, string> = {
    '1': '写実',
    '2': '三人称',
    '3': 'SF',
    '4': '童話',
    '5': 'コミカル',
    '6': '当事者',
    '7': '人物関係',
    '8': '別世界', // ここは空文字ではなく、適切なラベルを入れるべきです
  };

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedOption(options[eventKey]); // 選択肢のタイトルを設定
      setSelectedOptionNumber(Number(eventKey)); // 選択肢の番号を設定
    }
  };

  const customDropdown = () => {
    return (
      <div className="dropdownContainer">
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedOption}
          variant="success"
          onSelect={handleSelect}
        >
          <Dropdown.Item eventKey="1">写実</Dropdown.Item>
          <Dropdown.Item eventKey="2">三人称</Dropdown.Item>
          <Dropdown.Item eventKey="3">SF</Dropdown.Item>
          <Dropdown.Item eventKey="4">童話</Dropdown.Item>
          <Dropdown.Item eventKey="5">コミカル</Dropdown.Item>
          <Dropdown.Item eventKey="6">当事者</Dropdown.Item>
          <Dropdown.Item eventKey="7">人物関係</Dropdown.Item>
          <Dropdown.Item eventKey="8">別世界</Dropdown.Item>
        </DropdownButton>
      </div>
    );
  };

  return (
    <div className={calendar}>
      <FullCalendar
      ref={calendarRef}
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
                
                llmStory(eventsData, selectedOptionNumber).then(story => {
                  setAIStory(story);
                  showAIModal();
                  // firestoreに保存
                  if (user) {
                    saveAIStoryToFirestore(user.uid, story, selectedDate);
                  }
                }).catch(error => {
                  console.error('Error generating AI story:', error);
                });
              }
            }
          },
        }}
        headerToolbar={{
          left: 'prev,next myCustomButton',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek',
        }}
        titleFormat={{ year: 'numeric', month: 'short' }}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        selectable={true}
        selectMirror={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
      />
      <div className="dropdownContainer">
        {customDropdown()}
      </div>
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