"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { createGroup, getCommunities } from "../slices/communitySlice"
import Message from "../components/Message"

const GroupCreatePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Get communityId from query params if available
  const queryParams = new URLSearchParams(location.search)
  const communityIdFromQuery = queryParams.get("community")

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedCommunityId, setSelectedCommunityId] = useState(communityIdFromQuery || "")

  const { loading, error, communities, success } = useSelector((state) => state.communities)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getCommunities())
  }, [dispatch])

  useEffect(() => {
    if (success && success.message === "Group created successfully") {
      if (selectedCommunityId) {
        navigate(`/communities/${selectedCommunityId}`)
      } else {
        navigate("/community-manager")
      }
    }
  }, [success, navigate, selectedCommunityId])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedCommunityId) {
      return
    }

    dispatch(
      createGroup({
        name,
        description,
        image,
        isPrivate,
        community: selectedCommunityId,
      }),
    )
  }

  // Filter communities that the user can manage
  const managedCommunities = communities?.filter(
    (community) => community.managers && community.managers.some((manager) => manager._id === userInfo._id),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Create New Group</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {error && <Message variant="error">{error}</Message>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
                Select Community
              </label>
              <select
                id="community"
                value={selectedCommunityId}
                onChange={(e) => setSelectedCommunityId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select a community</option>
                {managedCommunities?.map((community) => (
                  <option key={community._id} value={community._id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Group Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(!isPrivate)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="ml-2 text-gray-700">Private Group</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Private groups are only visible to community members and require approval to join.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                disabled={loading || !selectedCommunityId}
              >
                {loading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GroupCreatePage
