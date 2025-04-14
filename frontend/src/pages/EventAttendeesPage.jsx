"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getEventById } from "../slices/eventSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const EventAttendeesPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAttendees, setFilteredAttendees] = useState([])

  const { loading, error, event } = useSelector((state) => state.events)

  useEffect(() => {
    dispatch(getEventById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (event && event.attendees) {
      setFilteredAttendees(
        event.attendees.filter(
          (attendee) =>
            attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendee.email.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [event, searchTerm])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Function to export attendees to CSV
  const exportToCSV = () => {
    if (!event || !event.attendees || event.attendees.length === 0) return

    const headers = ["Name", "Email", "Registration Date"]

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...event.attendees.map((attendee) => {
        const registrationDate = new Date(attendee.createdAt || Date.now()).toLocaleDateString()
        return [
          attendee.name.replace(/,/g, " "), // Replace commas to avoid CSV issues
          attendee.email,
          registrationDate,
        ].join(",")
      }),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${event.title.replace(/\s+/g, "-")}-attendees.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Attendees</h1>
        <Link
          to={`/events/${id}`}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Event
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error">{error}</Message>
      ) : event ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-gray-600">
                  {event.attendees?.length || 0} attendees
                  {event.maxAttendees > 0 && ` / ${event.maxAttendees} max`}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  disabled={!event.attendees || event.attendees.length === 0}
                >
                  Export to CSV
                </button>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {filteredAttendees && filteredAttendees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendees.map((attendee) => (
                      <tr key={attendee._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 overflow-hidden">
                              {attendee.profilePicture ? (
                                <img
                                  src={attendee.profilePicture || "/placeholder.svg"}
                                  alt={attendee.name}
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <span className="text-gray-500">👤</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{attendee.name}</div>
                              {attendee._id === event.creator._id && (
                                <span className="text-xs text-green-600">Event Creator</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendee.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Registered
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                {searchTerm ? "No attendees match your search." : "No attendees found."}
              </p>
            )}
          </div>
        </div>
      ) : (
        <Message variant="error">Event not found</Message>
      )}
    </div>
  )
}

export default EventAttendeesPage
