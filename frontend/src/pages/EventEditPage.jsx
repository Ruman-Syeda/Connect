"use client"

import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getEventById, updateEvent } from "../slices/eventSlice"
import { getCommunities } from "../slices/communitySlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const EventEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [image, setImage] = useState("")
  const [maxAttendees, setMaxAttendees] = useState(0)
  const [isPrivate, setIsPrivate] = useState(false)
  const [communityId, setCommunityId] = useState("")

  const { loading, error, event, success } = useSelector((state) => state.events)
  const { communities } = useSelector((state) => state.communities)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!userInfo || (userInfo.role !== "eventManager" && userInfo.role !== "admin")) {
      navigate("/login")
      return
    }

    dispatch(getCommunities())

    if (!event || event._id !== id) {
      dispatch(getEventById(id))
    } else {
      setTitle(event.title)
      setDescription(event.description)

      // Format date and time
      const eventDate = new Date(event.date)
      setDate(eventDate.toISOString().split("T")[0])
      setTime(eventDate.toTimeString().split(":").slice(0, 2).join(":"))

      setLocation(event.location)
      setImage(event.image)
      setMaxAttendees(event.maxAttendees || 0)
      setIsPrivate(event.isPrivate || false)
      setCommunityId(event.community?._id || "")
    }
  }, [dispatch, id, event, userInfo, navigate])

  useEffect(() => {
    if (success) {
      navigate(`/events/${id}`)
    }
  }, [success, navigate, id])

  const submitHandler = (e) => {
    e.preventDefault()

    // Combine date and time
    const combinedDate = new Date(`${date}T${time}:00`)

    dispatch(
      updateEvent({
        id,
        title,
        description,
        date: combinedDate.toISOString(),
        location,
        image,
        maxAttendees: Number.parseInt(maxAttendees),
        isPrivate,
        community: communityId || undefined,
      }),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Event</h1>
        <Link
          to={`/events/${id}`}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={submitHandler} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="text"
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {image && (
                  <div className="mt-2">
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Event preview"
                      className="h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Attendees (0 for unlimited)
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
                  Community (optional)
                </label>
                <select
                  id="community"
                  value={communityId}
                  onChange={(e) => setCommunityId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">None</option>
                  {communities &&
                    communities.map((community) => (
                      <option key={community._id} value={community._id}>
                        {community.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                    Private event (only visible to invited users)
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Update Event
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default EventEditPage
