"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { register, clearError } from "../slices/authSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import "../styles/pages/RegisterPage.css"

const RegisterPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("user") // Default role is user (student)
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { loading, error, userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    // Clear any previous errors
    dispatch(clearError())

    // If user is already logged in, redirect to home page
    if (userInfo) {
      navigate("/")
    }
  }, [navigate, userInfo, dispatch])

  const validateEmail = (email) => {
    // Check if email ends with @my.centennialcollege.ca
    return email.endsWith("@my.centennialcollege.ca")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate password match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      return
    }

    // Validate email domain
    if (!validateEmail(email)) {
      setMessage("You must use your Centennial College email (@my.centennialcollege.ca)")
      return
    }

    // Clear any previous messages
    setMessage(null)

    // Dispatch register action
    dispatch(register({ name, email, password, role }))
  }

  return (
    <div className="register-container">
      <div className="register-form-container">
        <h1 className="register-title">Create an Account</h1>
        <p className="register-subtitle">Join the Centennial College networking community</p>

        {message && <Message variant="error">{message}</Message>}
        {error && <Message variant="error">{error}</Message>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">College Email</label>
            <input
              type="email"
              id="email"
              placeholder="your-id@my.centennialcollege.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <small className="form-text">You must use your Centennial College email</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <div className="role-options">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                />
                <span className="role-name">Student</span>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="alumni"
                  checked={role === "alumni"}
                  onChange={() => setRole("alumni")}
                />
                <span className="role-name">Alumni</span>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="communityManager"
                  checked={role === "communityManager"}
                  onChange={() => setRole("communityManager")}
                />
                <span className="role-name">Community Manager</span>
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="eventManager"
                  checked={role === "eventManager"}
                  onChange={() => setRole("eventManager")}
                />
                <span className="role-name">Event Manager</span>
              </label>
            </div>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? <Loader small /> : "Register"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>

      <div className="register-image">
        <div className="register-overlay">
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

export default RegisterPage
