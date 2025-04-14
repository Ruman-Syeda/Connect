import { Link } from "react-router-dom"
import { formatDate } from "../utils/formatDate"
import "../styles/components/EventCard.css"

const EventCard = ({ event }) => {
  const isPastEvent = new Date(event.date) < new Date()

  // Check if event is today
  const isToday = () => {
    const today = new Date()
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    )
  }

  const getEventStatus = () => {
    if (isPastEvent) return "Past"
    if (isToday()) return "Today"
    return "Upcoming"
  }

  const getStatusClass = () => {
    if (isPastEvent) return "event-status-past"
    if (isToday()) return "event-status-today"
    return "event-status-upcoming"
  }

  // Format time from date
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="event-card hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {event.image ? (
          <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-image" />
        ) : (
          <div className="event-image-placeholder bg-gradient-to-r from-green-500 to-green-700">
            <span className="text-white text-xl font-semibold">{event.title.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
          {getEventStatus()}
        </span>
      </div>

      <div className="event-body">
        <div className="event-header">
          <h3 className="event-title text-xl font-bold text-gray-800 hover:text-green-600 transition-colors">
            <Link to={`/events/${event._id}`}>{event.title}</Link>
          </h3>
        </div>

        <div className="event-details mt-3 space-y-2">
          <div className="event-detail flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="event-detail-icon text-green-600"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="ml-2">{formatDate(event.date)}</span>
          </div>
          <div className="event-detail flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="event-detail-icon text-green-600"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-2">{formatTime(event.date)}</span>
          </div>
          <div className="event-detail flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="event-detail-icon text-green-600"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="ml-2">{event.location}</span>
          </div>
          {event.community && (
            <div className="event-detail flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="event-detail-icon text-green-600"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="ml-2">
                <Link to={`/communities/${event.community._id}`} className="text-green-600 hover:underline">
                  {event.community.name}
                </Link>
              </span>
            </div>
          )}
        </div>

        <div className="event-footer mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="event-attendees text-sm text-gray-600">
            {event.attendees?.length || 0} attendee(s)
            {event.maxAttendees > 0 && ` / ${event.maxAttendees}`}
          </span>
          <Link
            to={`/events/${event._id}`}
            className="event-link bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard
