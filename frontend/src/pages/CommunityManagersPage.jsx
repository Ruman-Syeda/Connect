"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getCommunityById, addCommunityManager, removeCommunityManager } from "../slices/communitySlice"
import { searchUsers } from "../slices/searchSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const CommunityManagersPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showSearchResults, setShowSearchResults] = useState(false)

  const { loading, error, community } = useSelector((state) => state.communities)
  const { loading: searchLoading, users: searchResults } = useSelector((state) => state.search)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCommunityById(id))
  }, [dispatch, id])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      dispatch(searchUsers(searchTerm))
      setShowSearchResults(true)
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setShowSearchResults(false)
  }

  const handleAddManager = () => {
    if (selectedUser) {
      dispatch(addCommunityManager({ communityId: id, userId: selectedUser._id }))
      setSelectedUser(null)
      setSearchTerm("")
    }
  }

  const handleRemoveManager = (userId) => {
    dispatch(removeCommunityManager({ communityId: id, userId }))
  }

  // Check if user is authorized to manage this community
  const isAuthorized = () => {
    if (!userInfo || !community) return false
    return (
      userInfo.role === "admin" ||
      (community.managers && community.managers.some((manager) => manager._id === userInfo._id))
    )
  }

  if (loading) return <Loader />
  if (error) return <Message variant="error">{error}</Message>
  if (!community) return <Message variant="error">Community not found</Message>
  if (!isAuthorized()) return <Message variant="error">You are not authorized to manage this community</Message>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Manage Community Members</h1>
          <button
            onClick={() => navigate(`/communities/${id}`)}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Community
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Community Managers</h2>

          {community.managers && community.managers.length > 0 ? (
            <div className="space-y-4">
              {community.managers.map((manager) => (
                <div key={manager._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    {manager.profilePicture ? (
                      <img
                        src={manager.profilePicture || "/placeholder.svg"}
                        alt={manager.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        <span className="text-gray-600">👤</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{manager.name}</p>
                      <p className="text-sm text-gray-500">{manager.email}</p>
                    </div>
                  </div>

                  {/* Don't allow removing the last manager or yourself if you're not an admin */}
                  {(community.managers.length > 1 || userInfo.role === "admin") &&
                    (manager._id !== userInfo._id || userInfo.role === "admin") && (
                      <button
                        onClick={() => handleRemoveManager(manager._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <Message variant="info">No managers found for this community.</Message>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Manager</h2>

          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name or email"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Search Results */}
          {showSearchResults && searchLoading && <Loader />}
          {showSearchResults && !searchLoading && searchResults && searchResults.length > 0 && (
            <div className="border rounded-md mb-4 max-h-60 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture || "/placeholder.svg"}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        <span className="text-gray-600">👤</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showSearchResults && !searchLoading && (!searchResults || searchResults.length === 0) && (
            <Message variant="info">No users found matching your search.</Message>
          )}

          {/* Selected User */}
          {selectedUser && (
            <div className="mb-4">
              <h3 className="text-md font-medium mb-2">Selected User:</h3>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  {selectedUser.profilePicture ? (
                    <img
                      src={selectedUser.profilePicture || "/placeholder.svg"}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                      <span className="text-gray-600">👤</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddManager}
                  className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                >
                  Add as Manager
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-md font-medium mb-2">Community Members</h3>
            {community.members && community.members.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {community.members
                  .filter((member) => !community.managers.some((manager) => manager._id === member._id))
                  .map((member) => (
                    <div key={member._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        {member.profilePicture ? (
                          <img
                            src={member.profilePicture || "/placeholder.svg"}
                            alt={member.name}
                            className="w-8 h-8 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                            <span className="text-gray-600">👤</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddManager(member._id)}
                        className="bg-green-600 text-white py-1 px-3 rounded-md text-sm hover:bg-green-700 transition-colors"
                      >
                        Make Manager
                      </button>
                    </div>
                  ))}
              </div>
            ) : (
              <Message variant="info">No regular members in this community.</Message>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityManagersPage
