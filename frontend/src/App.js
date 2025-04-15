import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import store from "./store"
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import EventsPage from "./pages/EventsPage"
import EventDetailsPage from "./pages/EventDetailsPage"
import CommunitiesPage from "./pages/CommunitiesPage"
import CommunityDetailsPage from "./pages/CommunityDetailsPage"
import GroupDetailsPage from "./pages/GroupDetailsPage"
import DiscussionsPage from "./pages/DiscussionsPage"
import PostDetailsPage from "./pages/PostDetailsPage"
import SearchPage from "./pages/SearchPage"
import NotificationsPage from "./pages/NotificationsPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import CommunityManagerPage from "./pages/CommunityManagerPage"
import EventManagerPage from "./pages/EventManagerPage"
import SettingsPage from "./pages/SettingsPage"
import ReportsPage from "./pages/ReportsPage"
import FeedbackPage from "./pages/FeedbackPage"
import MessagesPage from "./pages/MessagesPage"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
import CommunityManagerRoute from "./components/CommunityManagerRoute"
import EventManagerRoute from "./components/EventManagerRoute"
import EventEditPage from "./pages/EventEditPage"
import EventAttendeesPage from "./pages/EventAttendeesPage"
import EventCreatePage from "./pages/EventCreatePage"
import CommunityEditPage from "./pages/CommunityEditPage"
import CommunityManagersPage from "./pages/CommunityManagersPage"
import GroupCreatePage from "./pages/GroupCreatePage"
import JobsPage from "./pages/JobsPage"
import JobDetailsPage from "./pages/JobDetailsPage"

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/communities"
                element={
                  <PrivateRoute>
                    <CommunitiesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/communities/:id"
                element={
                  <PrivateRoute>
                    <CommunityDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/groups/:id"
                element={
                  <PrivateRoute>
                    <GroupDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/discussions"
                element={
                  <PrivateRoute>
                    <DiscussionsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <PrivateRoute>
                    <PostDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <NotificationsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <PrivateRoute>
                    <MessagesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <PrivateRoute>
                    <JobsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <PrivateRoute>
                    <JobDetailsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute>
                    <SettingsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminRoute>
                    <ReportsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/feedback"
                element={
                  <AdminRoute>
                    <FeedbackPage />
                  </AdminRoute>
                }
              />

              {/* Community Manager routes */}
              <Route
                path="/community-manager"
                element={
                  <CommunityManagerRoute>
                    <CommunityManagerPage />
                  </CommunityManagerRoute>
                }
              />
              <Route
                path="/community-manager/edit/:id"
                element={
                  <CommunityManagerRoute>
                    <CommunityEditPage />
                  </CommunityManagerRoute>
                }
              />
              <Route
                path="/community-manager/managers/:id"
                element={
                  <CommunityManagerRoute>
                    <CommunityManagersPage />
                  </CommunityManagerRoute>
                }
              />
              <Route
                path="/community-manager/groups/create"
                element={
                  <CommunityManagerRoute>
                    <GroupCreatePage />
                  </CommunityManagerRoute>
                }
              />

              {/* Event Manager routes */}
              <Route
                path="/event-manager"
                element={
                  <EventManagerRoute>
                    <EventManagerPage />
                  </EventManagerRoute>
                }
              />
              <Route
                path="/event-manager/edit/:id"
                element={
                  <EventManagerRoute>
                    <EventEditPage />
                  </EventManagerRoute>
                }
              />
              <Route
                path="/event-manager/attendees/:id"
                element={
                  <EventManagerRoute>
                    <EventAttendeesPage />
                  </EventManagerRoute>
                }
              />
              <Route
                path="/event-manager/create"
                element={
                  <EventManagerRoute>
                    <EventCreatePage />
                  </EventManagerRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  )
}

export default App
