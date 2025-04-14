"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getEvents } from "../slices/eventSlice"
import EventCard from "../components/EventCard"
import Loader from "../components/Loader"
import Message from "../components/Message"

const EventsPage = () => {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const { loading, error, events } = useSelector((state) => state.events)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getEvents())
  }, [dispatch])

  // Filter events based on selected filter
  const filteredEvents = events
    ? events.filter((event) => {
        // Apply date filter
        if (filter === "upcoming") {
          return new Date(event.date) >= new Date()
        } else if (filter === "past") {
          return new Date(event.date) < new Date()
        } else if (filter === "today") {
          const today = new Date()
          const eventDate = new Date(event.date)
          return (
            eventDate.getDate() === today.getDate() &&
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
          )
        } else if (filter === "registered" && userInfo) {
          return event.attendees.some((attendee) => attendee === userInfo._id || attendee._id === userInfo._id)
        }
        return true
      })
    : []

  // Apply search filter
  const searchedEvents = searchTerm
    ? filteredEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : filteredEvents

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Featured Events</h1>

        {/* Create Event Button for Event Managers and Admins */}
        {userInfo && (userInfo.role === "eventManager" || userInfo.role === "admin") && (
          <Link
            to="/event-manager"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Create Event
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md ${
                filter === "all" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-md ${
                filter === "upcoming" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("today")}
              className={`px-4 py-2 rounded-md ${
                filter === "today" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-4 py-2 rounded-md ${
                filter === "past" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Past
            </button>
            {userInfo && (
              <button
                onClick={() => setFilter("registered")}
                className={`px-4 py-2 rounded-md ${
                  filter === "registered" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Registered
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : searchedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchedEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <Message variant="info">
          {searchTerm
            ? "No events found matching your search."
            : filter === "registered"
              ? "You haven't registered for any events yet."
              : filter === "upcoming"
                ? "No upcoming events found."
                : filter === "today"
                  ? "No events happening today."
                  : filter === "past"
                    ? "No past events found."
                    : "No events found."}
        </Message>
      )}
    </div>
  )
}

export default EventsPage
