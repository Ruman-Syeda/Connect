"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, Link } from "react-router-dom"
import { Container, Row, Col, Card, Button, Tabs, Tab, Form, ListGroup, Badge } from "react-bootstrap"
import { getGroupDetails } from "../slices/communitySlice"
import { getPosts, createPost } from "../slices/postSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import PostCard from "../components/PostCard"

const GroupDetailsPage = () => {
  const dispatch = useDispatch()
  const { id } = useParams()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [showPostForm, setShowPostForm] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")

  const { userInfo } = useSelector((state) => state.auth)
  const { group, loading: groupLoading, error: groupError } = useSelector((state) => state.communities)
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    success: postCreateSuccess,
  } = useSelector((state) => state.posts)

  useEffect(() => {
    dispatch(getGroupDetails(id))
    dispatch(getPosts({ groupId: id }))
  }, [dispatch, id])

  useEffect(() => {
    if (postCreateSuccess) {
      setTitle("")
      setContent("")
      setShowPostForm(false)
      dispatch(getPosts({ groupId: id }))
    }
  }, [postCreateSuccess, dispatch, id])

  const handleCreatePost = (e) => {
    e.preventDefault()
    dispatch(
      createPost({
        title,
        content,
        group: id,
      }),
    )
  }

  const isGroupMember = group?.members?.some((member) => member._id === userInfo?._id)
  const isGroupManager = group?.managers?.some((manager) => manager._id === userInfo?._id)
  const isCommunityManager = group?.community?.managers?.some((manager) => manager._id === userInfo?._id)
  const canCreatePost = isGroupMember || isGroupManager || isCommunityManager || userInfo?.isAdmin

  return (
    <Container className="py-4">
      {groupLoading ? (
        <Loader />
      ) : groupError ? (
        <Message variant="danger">{groupError}</Message>
      ) : group ? (
        <>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="text-green-700">{group.name}</h1>
                {(isGroupManager || isCommunityManager || userInfo?.isAdmin) && (
                  <Link to={`/community-manager/groups/edit/${group._id}`} className="btn btn-outline-success">
                    Edit Group
                  </Link>
                )}
              </div>
              <p className="text-muted mb-3">
                Part of <Link to={`/communities/${group.community?._id}`}>{group.community?.name}</Link> community
              </p>
              <p>{group.description}</p>
              <div className="d-flex justify-content-between">
                <div>
                  <small className="text-muted">
                    {group.members?.length} {group.members?.length === 1 ? "member" : "members"}
                  </small>
                </div>
                {!isGroupMember && !isGroupManager && !isCommunityManager && !userInfo?.isAdmin && (
                  <Button variant="success" size="sm">
                    Join Group
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="posts" title="Posts">
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <h2 className="text-green-700">Posts</h2>
                {canCreatePost && (
                  <Button variant="success" onClick={() => setShowPostForm(!showPostForm)}>
                    {showPostForm ? "Cancel" : "Create Post"}
                  </Button>
                )}
              </div>

              {showPostForm && (
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <h3 className="mb-3">Create New Post</h3>
                    <Form onSubmit={handleCreatePost}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button variant="success" type="submit">
                        Submit
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}

              {postsLoading ? (
                <Loader />
              ) : postsError ? (
                <Message variant="danger">{postsError}</Message>
              ) : posts?.length > 0 ? (
                <Row>
                  {posts.map((post) => (
                    <Col key={post._id} md={12} className="mb-4">
                      <PostCard post={post} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Message variant="info">No posts found in this group.</Message>
              )}
            </Tab>
            <Tab eventKey="announcements" title="Announcements">
              <div className="mb-4">
                <h2 className="text-green-700">Announcements</h2>
                {(isGroupManager || isCommunityManager || userInfo?.isAdmin) && (
                  <Button
                    variant="success"
                    className="mt-2"
                    onClick={() => {
                      setShowPostForm(!showPostForm)
                      setActiveTab("posts")
                    }}
                  >
                    Create Announcement
                  </Button>
                )}
              </div>
              <Message variant="info">No announcements yet.</Message>
            </Tab>
            <Tab eventKey="members" title="Members">
              <h2 className="text-green-700 mb-4">Members</h2>
              <Card>
                <ListGroup variant="flush">
                  {group.members?.map((member) => (
                    <ListGroup.Item key={member._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <Link to={`/profile/${member._id}`}>{member.name}</Link>
                        {group.managers?.some((manager) => manager._id === member._id) && (
                          <Badge bg="success" className="ms-2">
                            Manager
                          </Badge>
                        )}
                      </div>
                      {(isGroupManager || isCommunityManager || userInfo?.isAdmin) && (
                        <div>
                          <Button variant="outline-success" size="sm" className="me-2">
                            Make Manager
                          </Button>
                          <Button variant="outline-danger" size="sm">
                            Remove
                          </Button>
                        </div>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Tab>
          </Tabs>
        </>
      ) : (
        <Message variant="danger">Group not found</Message>
      )}
    </Container>
  )
}

export default GroupDetailsPage
