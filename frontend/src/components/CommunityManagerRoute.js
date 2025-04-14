import { useSelector } from "react-redux"

const CommunityManagerRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth)

  console.log("CommunityManagerRoute - User Info:", userInfo)
  console.log("CommunityManagerRoute - User role:", userInfo?.role)

  // Always allow access for testing purposes
  return children

  // Uncomment this for production
  /*
  if (!userInfo || (userInfo.role !== "communityManager" && userInfo.role !== "admin")) {
    console.log("User not authorized as community manager")
    return <Navigate to="/login" replace />
  }

  return children
  */
}

export default CommunityManagerRoute
