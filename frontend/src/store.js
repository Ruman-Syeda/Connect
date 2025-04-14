import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import eventReducer from "./slices/eventSlice"
import communityReducer from "./slices/communitySlice"
import postReducer from "./slices/postSlice"
import notificationReducer from "./slices/notificationSlice"
import adminReducer from "./slices/adminSlice"
import searchReducer from "./slices/searchSlice"
import analyticsReducer from "./slices/analyticsSlice"
import settingsReducer from "./slices/settingsSlice"
import reportReducer from "./slices/reportSlice"
import feedbackReducer from "./slices/feedbackSlice"
import jobReducer from "./slices/jobSlice"
import messageReducer from "./slices/messageSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    communities: communityReducer,
    posts: postReducer,
    notifications: notificationReducer,
    admin: adminReducer,
    search: searchReducer,
    analytics: analyticsReducer,
    settings: settingsReducer,
    reports: reportReducer,
    feedback: feedbackReducer,
    jobs: jobReducer,
    messages: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export default store
