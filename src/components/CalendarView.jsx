import React, { useState, useMemo } from "react";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Calendar,
  Users,
  Cake,
  Briefcase,
  Clock,
  MapPin,
} from "lucide-react";

const CalendarView = ({ users = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Process user events (birthdays, join dates)
  const eventsByDate = useMemo(() => {
    const events = {};

    users.forEach(user => {
      // Add birthday events
      if (user.dateOfBirth) {
        const birthDate = new Date(user.dateOfBirth);
        const eventKey = `${birthDate.getMonth() + 1}-${birthDate.getDate()}`;

        if (!events[eventKey]) {
          events[eventKey] = [];
        }

        events[eventKey].push({
          type: 'birthday',
          user: user,
          title: `${user.name}'s Birthday`,
          date: birthDate,
          icon: Cake,
          color: 'pink'
        });
      }

      // Add join date events
      if (user.joinDate) {
        const joinDate = new Date(user.joinDate);
        const eventKey = `${joinDate.getMonth() + 1}-${joinDate.getDate()}`;

        if (!events[eventKey]) {
          events[eventKey] = [];
        }

        events[eventKey].push({
          type: 'join',
          user: user,
          title: `${user.name} joined`,
          date: joinDate,
          icon: Briefcase,
          color: 'blue'
        });
      }
    });

    return events;
  }, [users]);

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    const key = `${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    return eventsByDate[key] || [];
  }, [selectedDate, eventsByDate]);

  // Get dates that have events for calendar highlighting
  const datesWithEvents = useMemo(() => {
    return Object.keys(eventsByDate).map(key => {
      const [month, day] = key.split('-').map(Number);
      return { month: month - 1, day };
    });
  }, [eventsByDate]);

  // Check if a date has events
  const hasEvents = (date) => {
    const key = `${date.getMonth() + 1}-${date.getDate()}`;
    return eventsByDate[key] && eventsByDate[key].length > 0;
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'birthday': return 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30';
      case 'join': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'birthday': return Cake;
      case 'join': return Briefcase;
      default: return Users;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Calendar className="h-5 w-5" />
              User Events Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* Events for Selected Date */}
      <div>
        <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Clock className="h-5 w-5" />
              Events for {selectedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event, index) => {
                  const IconComponent = event.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10"
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full bg-${event.color}-500/20 flex items-center justify-center`}>
                          <IconComponent className={`h-4 w-4 text-${event.color}-500/70`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getEventColor(event.type)}`}>
                            {event.type}
                          </Badge>
                          <span className="text-xs text-blue-500/60">
                            {event.user.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-blue-500/60" />
                          <span className="text-xs text-blue-500/60">
                            {event.user.department}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-blue-500/30 mx-auto mb-3" />
                <p className="text-blue-500/60">No events on this date</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events Preview */}
        <Card className="bg-white/50 dark:bg-gray-800/30 border-blue-500/20 backdrop-blur-sm mt-4">
          <CardHeader>
            <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(eventsByDate)
                .slice(0, 5)
                .map(([dateKey, events]) => {
                  const [month, day] = dateKey.split('-').map(Number);
                  const eventDate = new Date(selectedDate.getFullYear(), month - 1, day);
                  const isPast = eventDate < new Date() && eventDate.toDateString() !== new Date().toDateString();

                  return (
                    <div key={dateKey} className="flex items-center justify-between text-xs">
                      <span className={`text-blue-600/80 ${isPast ? 'line-through opacity-50' : ''}`}>
                        {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <Badge className="text-xs bg-blue-500/20 text-blue-700 dark:text-blue-300">
                        {events.length} event{events.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;