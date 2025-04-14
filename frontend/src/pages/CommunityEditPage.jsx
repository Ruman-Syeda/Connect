"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getCommunityById, updateCommunity } from "../slices/communitySlice"
import Loader from "../components/Loader"
import Message from "../components/Message"

const CommunityEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [category, setCategory] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [message, setMessage] = useState("")

  const { loading, error, community, success } = useSelector((state) => state.communities)
  const { userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!community || community._id !== id) {
      dispatch(getCommunityById(id))
    } else {
      setName(community.name || "")
      setDescription(community.description || "")
      setImage(community.image || "")
      setCategory(community.category || "")
      setIsPrivate(community.isPrivate || false)
    }

    if (success) {
      navigate(`/communities/${id}`)
    }
  }, [dispatch, id, community, success, navigate])

  // Check if user is authorized to edit this community
  const isAuthorized = () => {
    if (!userInfo || !community) return false
    return (
      userInfo.role === "admin" ||
      (community.managers && community.managers.some((manager) => manager._id === userInfo._id))
    )
  }

  const submitHandler = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setMessage("Community name is required")
      return
    }

    dispatch(
      updateCommunity({
        id,
        name,
        description,
        image,
        category,
        isPrivate,
      }),
    )
  }

  if (loading) return <Loader />
  if (error) return <Message variant="error">{error}</Message>
  if (!community) return <Message variant="error">Community not found</Message>
  if (!isAuthorized()) return <Message variant="error">You are not authorized to edit this community</Message>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Edit Community</h1>
          <button
            onClick={() => navigate(`/communities/${id}`)}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Community
          </button>
        </div>

        {message && <Message variant="error">{message}</Message>}

        <form onSubmit={submitHandler} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Community Name*
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
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
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
                  alt="Community preview"
                  className="h-32 w-32 object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg"
                  }}
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a category</option>
              <option value="Academic">Academic</option>
              <option value="Social">Social</option>
              <option value="Professional">Professional</option>
              <option value="Interest">Interest</option>
              <option value="Support">Support</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
                Private Community (Only members can see content)
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Community"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CommunityEditPage
