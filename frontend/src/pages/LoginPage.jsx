"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { login, clearError, setRole } from "../slices/authSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import "../styles/pages/LoginPage.css"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { loading, error, userInfo } = useSelector((state) => state.auth)

  const redirect = location.search ? location.search.split("=")[1] : "/"

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError())

    // If user is already logged in, redirect
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect, dispatch])

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login({ email, password, rememberMe }))
  }

  // For testing - set role manually
  const handleSetRole = (role) => {
    dispatch(setRole(role))
    window.location.reload()
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {error && <Message variant="error">{error}</Message>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="your-id@my.centennialcollege.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <Loader small /> : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>

        {/* Debug section - remove in production */}
        <div className="mt-8">
          <button onClick={() => setShowDebug(!showDebug)} className="text-xs text-gray-400 underline">
            {showDebug ? "Hide Debug" : "Show Debug"}
          </button>

          {showDebug && (
            <div className="bg-gray-100 p-3 rounded mt-2">
              <p className="text-xs mb-2">For testing - set role directly:</p>
              <div className="flex space-x-2">
                <button onClick={() => handleSetRole("user")} className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Set as User
                </button>
                <button
                  onClick={() => handleSetRole("communityManager")}
                  className="text-xs bg-gray-200 px-2  py-1 rounded"
                >
                  Set as Community Manager
                </button>
                <button onClick={() => handleSetRole("eventManager")} className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Set as Event Manager
                </button>
                <button onClick={() => handleSetRole("admin")} className="text-xs bg-gray-200 px-2 py-1 rounded">
                  Set as Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="login-image">
        <div className="login-overlay">
          <h2>Connect with the Centennial Community</h2>
          <ul>
            <li>Network with fellow students and alumni</li>
            <li>Discover events and opportunities</li>
            <li>Join communities based on your interests</li>
            <li>Share knowledge and experiences</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
