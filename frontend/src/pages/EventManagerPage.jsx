"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getEvents } from "../slices/eventSlice"
import { getCommunities } from "../slices/communitySlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import EventCard from "../components/EventCard"

const EventManagerPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [filter, setFilter] = useState("upcoming")
  const [communityFilter, setCommunityFilter] = useState("")

  const { loading, error, events } = useSelector((state) => state.events)
  const { communities } = useSelector((state) => state.communities)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!userInfo || (userInfo.role !== "eventManager" && userInfo.role !== "admin")) {
      navigate("/login")
      return
    }

    dispatch(getEvents())
    dispatch(getCommunities())
  }, [dispatch, userInfo, navigate])

  // Filter events based on selected filters with null checks
  const filteredEvents = events
    ? events.filter((event) => {
        if (!event) return false

        const today = new Date()
        const eventDate = new Date(event.date || Date.now())

        // Filter by date
        if (filter === "upcoming" && eventDate < today) return false
        if (filter === "past" && eventDate >= today) return false

        // Filter by community (with null check)
        if (communityFilter && event.community && event.community._id !== communityFilter) return false
        if (communityFilter && !event.community) return false

        // Filter by creator (only show events created by this user) (with null check)
        if (userInfo && userInfo.role !== "admin" && event.creator && event.creator._id !== userInfo._id) return false
        if (userInfo && userInfo.role !== "admin" && !event.creator) return false

        return true
      })
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Manager</h1>
        <Link
          to="/event-manager/create"
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Create New Event
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Your Events</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Time Filter
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming Events</option>
                <option value="past">Past Events</option>
              </select>
            </div>

            <div>
              <label htmlFor="communityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Community Filter
              </label>
              <select
                id="communityFilter"
                value={communityFilter}
                onChange={(e) => setCommunityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Communities</option>
                {communities &&
                  communities.map(
                    (community) =>
                      community && (
                        <option key={community._id} value={community._id}>
                          {community.name}
                        </option>
                      ),
                  )}
              </select>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => event && <EventCard key={event._id} event={event} />)}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No events found matching your criteria.</p>
              <Link
                to="/event-manager/create"
                className="inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Create Your First Event
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventManagerPage
