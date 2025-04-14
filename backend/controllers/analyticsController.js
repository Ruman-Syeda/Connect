import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import Community from "../models/communityModel.js"
import Event from "../models/eventModel.js"
import Group from "../models/groupModel.js"

// @desc    Get platform overview
// @route   GET /api/analytics/platform-overview
// @access  Private/Admin
const getPlatformOverview = asyncHandler(async (req, res) => {
  // Get total counts
  const userCount = await User.countDocuments()
  const postCount = await Post.countDocuments()
  const communityCount = await Community.countDocuments()
  const eventCount = await Event.countDocuments()
  const groupCount = await Group.countDocuments()

  // Get active users in last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const activeUsers = await User.countDocuments({
    lastActive: { $gte: thirtyDaysAgo },
  })

  const activeUserPercentage = Math.round((activeUsers / userCount) * 100) || 0

  res.json({
    userCount,
    postCount,
    communityCount,
    eventCount,
    groupCount,
    activeUsers,
    activeUserPercentage,
  })
})

// @desc    Get user analytics
// @route   GET /api/analytics/user-analytics
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
  // Get user roles distribution
  const userRoles = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ])

  // Get new users per month for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const newUsersPerMonth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ])

  // Get active users
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const activeUsers = await User.countDocuments({
    lastActive: { $gte: thirtyDaysAgo },
  })

  const totalUsers = await User.countDocuments()
  const activeUserPercentage = Math.round((activeUsers / totalUsers) * 100) || 0

  res.json({
    userRoles,
    newUsersPerMonth,
    activeUsers,
    totalUsers,
    activeUserPercentage,
  })
})

// @desc    Get community analytics
// @route   GET /api/analytics/community-analytics
// @access  Private/Admin
const getCommunityAnalytics = asyncHandler(async (req, res) => {
  // Get communities by category
  const communitiesByCategory = await Community.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ])

  // Get new communities per month for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const newCommunitiesPerMonth = await Community.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ])

  // Get top communities by member count
  const topCommunities = await Community.find()
    .sort({ memberCount: -1 })
    .limit(5)
    .select("name description memberCount")

  res.json({
    communitiesByCategory,
    newCommunitiesPerMonth,
    topCommunities,
  })
})

// @desc    Get event analytics
// @route   GET /api/analytics/event-analytics
// @access  Private/Admin
const getEventAnalytics = asyncHandler(async (req, res) => {
  // Get events by category
  const eventsByCategory = await Event.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ])

  // Get new events per month for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const newEventsPerMonth = await Event.aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ])

  // Get upcoming events
  const now = new Date()
  const upcomingEvents = await Event.find({
    startDate: { $gte: now },
  })
    .sort({ startDate: 1 })
    .limit(5)
    .select("title description startDate location")

  // Get event attendance stats
  const eventAttendanceStats = await Event.aggregate([
    {
      $match: {
        endDate: { $lt: now },
      },
    },
    {
      $group: {
        _id: null,
        totalEvents: { $sum: 1 },
        totalAttendees: { $sum: "$attendeeCount" },
        avgAttendees: { $avg: "$attendeeCount" },
      },
    },
  ])

  res.json({
    eventsByCategory,
    newEventsPerMonth,
    upcomingEvents,
    eventAttendanceStats: eventAttendanceStats[0] || {
      totalEvents: 0,
      totalAttendees: 0,
      avgAttendees: 0,
    },
  })
})

export { getPlatformOverview, getUserAnalytics, getCommunityAnalytics, getEventAnalytics }
