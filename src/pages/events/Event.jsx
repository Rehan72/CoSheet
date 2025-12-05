import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Plus, Calendar, Clock, CheckCircle, Users, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Note: SVG imports might need adjustment depending on how your build system handles them

// Icon component for different event types (defined outside render)
const EventTypeIcon = ({ type, className = "h-6 w-6" }) => {
  const iconProps = { className };
  
  switch (type) {
    case 'total':
      return <Calendar {...iconProps} className="text-blue-500" />;
    case 'ongoing':
      return <Clock {...iconProps} className="text-green-500" />;
    case 'upcoming':
      return <Calendar {...iconProps} className="text-yellow-500" />;
    case 'completed':
      return <CheckCircle {...iconProps} className="text-purple-500" />;
    default:
      return <Calendar {...iconProps} />;
  }
};

function Event() {
  const navigate=useNavigate()
  // Mock event data with different categories
  const [events] = useState([
    {
      id: 1,
      title: "Team Building Workshop",
      date: "2025-01-15",
      status: "upcoming",
      attendees: 25,
      type: "workshop"
    },
    {
      id: 2,
      title: "Product Launch Event",
      date: "2025-01-20",
      status: "ongoing",
      attendees: 150,
      type: "launch"
    },
    {
      id: 3,
      title: "Company Anniversary",
      date: "2025-12-01",
      status: "completed",
      attendees: 300,
      type: "celebration"
    },
    {
      id: 4,
      title: "Quarterly Review Meeting",
      date: "2025-01-10",
      status: "completed",
      attendees: 45,
      type: "meeting"
    },
    {
      id: 5,
      title: "Training Session",
      date: "2025-01-25",
      status: "upcoming",
      attendees: 30,
      type: "training"
    },
    {
      id: 6,
      title: "Hackathon 2025",
      date: "2025-02-01",
      status: "upcoming",
      attendees: 80,
      type: "competition"
    },
    {
      id: 7,
      title: "Client Presentation",
      date: "2025-01-18",
      status: "ongoing",
      attendees: 20,
      type: "presentation"
    },
    {
      id: 8,
      title: "Year-end Party",
      date: "2024-12-31",
      status: "completed",
      attendees: 200,
      type: "party"
    }
  ]);



  // Calculate event statistics
  const eventStats = {
    total: events.length,
    upcoming: events.filter(event => event.status === "upcoming").length,
    ongoing: events.filter(event => event.status === "ongoing").length,
    completed: events.filter(event => event.status === "completed").length
  };

  const handleCreateEvent = () => {
    // Navigate to create event page
    navigate('/event/create')
    console.log("Navigate to create event");
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300">
              Event Management
            </h1>
            <p className="text-blue-500/80 mt-1">
              Manage and organize your events and activities
            </p>
          </div>
          <Button
            onClick={handleCreateEvent}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Event Stats Cards with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Events */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 text-center backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <EventTypeIcon type="total" className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold text-blue-500/90 mb-1">
              {eventStats.total}
            </div>
            <div className="text-sm text-blue-500/80 font-medium">
              Total Events
            </div>
          </div>

          {/* Ongoing Events */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 text-center backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <EventTypeIcon type="ongoing" className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold text-green-500/90 mb-1">
              {eventStats.ongoing}
            </div>
            <div className="text-sm text-green-500/80 font-medium">
              Ongoing Events
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-6 text-center backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <EventTypeIcon type="upcoming" className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold text-yellow-500/90 mb-1">
              {eventStats.upcoming}
            </div>
            <div className="text-sm text-yellow-500/80 font-medium">
              Upcoming Events
            </div>
          </div>

          {/* Completed Events */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6 text-center backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center mb-3">
              <EventTypeIcon type="completed" className="h-8 w-8" />
            </div>
            <div className="text-3xl font-bold text-purple-500/90 mb-1">
              {eventStats.completed}
            </div>
            <div className="text-sm text-purple-500/80 font-medium">
              Completed Events
            </div>
          </div>
        </div>

        {/* Event List Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event List
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Event Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Attendees</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{event.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{event.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.status === "completed"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                              : event.status === "ongoing"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{event.type}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Users className="h-4 w-4" />
                          {event.attendees}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analytical Report */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytical Report
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Event Types Table */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Event Types</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-200 dark:border-blue-700">
                        <th className="text-left py-2 text-sm font-medium text-blue-700 dark:text-blue-300">Type</th>
                        <th className="text-right py-2 text-sm font-medium text-blue-700 dark:text-blue-300">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blue-100 dark:border-blue-800/50">
                        <td className="py-2 text-sm text-blue-700 dark:text-blue-300">Workshops</td>
                        <td className="py-2 text-sm text-right font-medium text-blue-600 dark:text-blue-400">
                          {events.filter(e => e.type === "workshop").length}
                        </td>
                      </tr>
                      <tr className="border-b border-blue-100 dark:border-blue-800/50">
                        <td className="py-2 text-sm text-blue-700 dark:text-blue-300">Meetings</td>
                        <td className="py-2 text-sm text-right font-medium text-blue-600 dark:text-blue-400">
                          {events.filter(e => e.type === "meeting").length}
                        </td>
                      </tr>
                      <tr className="border-b border-blue-100 dark:border-blue-800/50">
                        <td className="py-2 text-sm text-blue-700 dark:text-blue-300">Launches</td>
                        <td className="py-2 text-sm text-right font-medium text-blue-600 dark:text-blue-400">
                          {events.filter(e => e.type === "launch").length}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-blue-700 dark:text-blue-300">Celebrations</td>
                        <td className="py-2 text-sm text-right font-medium text-blue-600 dark:text-blue-400">
                          {events.filter(e => e.type === "celebration" || e.type === "party").length}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Attendance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-200 dark:border-green-700">
                        <th className="text-left py-2 text-sm font-medium text-green-700 dark:text-green-300">Metric</th>
                        <th className="text-right py-2 text-sm font-medium text-green-700 dark:text-green-300">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-green-100 dark:border-green-800/50">
                        <td className="py-2 text-sm text-green-700 dark:text-green-300">Total Attendees</td>
                        <td className="py-2 text-sm text-right font-medium text-green-600 dark:text-green-400">
                          {events.reduce((sum, event) => sum + event.attendees, 0)}
                        </td>
                      </tr>
                      <tr className="border-b border-green-100 dark:border-green-800/50">
                        <td className="py-2 text-sm text-green-700 dark:text-green-300">Avg per Event</td>
                        <td className="py-2 text-sm text-right font-medium text-green-600 dark:text-green-400">
                          {Math.round(events.reduce((sum, event) => sum + event.attendees, 0) / events.length)}
                        </td>
                      </tr>
                      <tr className="border-b border-green-100 dark:border-green-800/50">
                        <td className="py-2 text-sm text-green-700 dark:text-green-300">Largest Event</td>
                        <td className="py-2 text-sm text-right font-medium text-green-600 dark:text-green-400">
                          {Math.max(...events.map(e => e.attendees))}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-green-700 dark:text-green-300">Smallest Event</td>
                        <td className="py-2 text-sm text-right font-medium text-green-600 dark:text-green-400">
                          {Math.min(...events.map(e => e.attendees))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Timeline Table */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Timeline</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-purple-200 dark:border-purple-700">
                        <th className="text-left py-2 text-sm font-medium text-purple-700 dark:text-purple-300">Period</th>
                        <th className="text-right py-2 text-sm font-medium text-purple-700 dark:text-purple-300">Events</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-purple-100 dark:border-purple-800/50">
                        <td className="py-2 text-sm text-purple-700 dark:text-purple-300">This Month</td>
                        <td className="py-2 text-sm text-right font-medium text-purple-600 dark:text-purple-400">
                          {events.filter(e => e.date.startsWith("2025-01")).length}
                        </td>
                      </tr>
                      <tr className="border-b border-purple-100 dark:border-purple-800/50">
                        <td className="py-2 text-sm text-purple-700 dark:text-purple-300">Next Month</td>
                        <td className="py-2 text-sm text-right font-medium text-purple-600 dark:text-purple-400">
                          {events.filter(e => e.date.startsWith("2025-02")).length}
                        </td>
                      </tr>
                      <tr className="border-b border-purple-100 dark:border-purple-800/50">
                        <td className="py-2 text-sm text-purple-700 dark:text-purple-300">This Year</td>
                        <td className="py-2 text-sm text-right font-medium text-purple-600 dark:text-purple-400">
                          {events.filter(e => e.date.startsWith("2025")).length}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-sm text-purple-700 dark:text-purple-300">Upcoming</td>
                        <td className="py-2 text-sm text-right font-medium text-purple-600 dark:text-purple-400">
                          {events.filter(e => e.status === "upcoming").length}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Event;
