import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Nav } from 'react-bootstrap';
import Axios from 'axios';
import ShowReplies from './ShowReplies';
import { useLocation } from 'react-router-dom';

function Forums(props) {
  const isLoggedIn = props.status === 'logged in';
  const user = props.userName;
  const [postsArray, setPostsArray] = useState([]);
  // const [sameUser, setSameUser] = useState();
  //object needed
  const [replyState, setReplyState] = useState({});
  const [replyFormState, setReplyFormState] = useState({});
  const [addForm, setAddForm] = useState(false);
  const [replyForm, setReplyForm] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [replyText, setReplyText] = useState('');
  const navigate = useLocation();
  const [postId, setPostId] = useState('');

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/getForumPosts`).then((response) => {
      setPostsArray(response.data);
    });
  }, []);

  const addPost = () => {
    Axios.post('http://localhost:3001/api/addForumPost', {
      user,
      title,
      text,
    });
    navigate('/forums');
  };

  const addReply = () => {
    // console.log('postId: ', postId);
    // console.log('user: ', user);
    // console.log('replyText: ', replyText);
    Axios.post(`http://localhost:3001/api/addForumReply`, {
      postId,
      user,
      replyText,
    });
    navigate('/forums');
  };

  return (
    <div className="main-body-dark">
      <div className="heroForums">
        <h1 class="display-4"> Forums </h1>
        <hr class="my-4"></hr>
        {isLoggedIn && !addForm && (
          <>
            <br></br>
            <br></br>
            <a
              class="btn-trans-main"
              width="100px"
              role="button"
              onClick={() => {
                setAddForm(true);
              }}
            >
              Add Post
            </a>
          </>
        )}
        {!isLoggedIn && (
          <>
            <br></br>
            <br></br>
            <br></br>
            <h5>
              <Link to={`../Login`}>Sign in</Link> or{' '}
              <Link to={`../Register`}>register</Link> to participate in forums
            </h5>
          </>
        )}
      </div>

      {addForm && (
        <>
          <div className="dark-form">
            <Card.Body>
              <div align="center">
                <h5 className="text-titles">Add a Post</h5>
              </div>
              <form>
                <div class="form-group">
                  <input
                    type="title"
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder="A title for your post..."
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>
                <br></br>
                <div class="form-group">
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    placeholder="Post content...."
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div align="right">
                  <button onClick={addPost} type="submit" class="btn-add-post">
                    Submit Post
                  </button>
                </div>
              </form>
            </Card.Body>
          </div>
        </>
      )}

      {postsArray.map((post) => {
        return (
          <>
            <Card className="my-card-2">
              <Card.Body>
                <Nav.Link
                  as={Link}
                  className="ms-auto"
                  to={`/profile/${post.username}`}
                >
                  <Card.Title>
                    <div className="inline-container">
                      <img class="profile-image-forum" src={post.photo}></img>
                      <div>&nbsp;{post.username}</div>
                    </div>
                  </Card.Title>
                </Nav.Link>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>
                  <em> {post.message} </em>
                </Card.Text>
                {isLoggedIn && !replyForm && (
                  <div align="right">
                    <a
                      class="btn-add-reply"
                      role="button"
                      onClick={() => {
                        setPostId(post.id);
                        setReplyForm(true);
                        //if replyState[post.id] exists, return the opposite boolean
                        //if not then its the first time its been clicked, so it is true
                        setReplyFormState({
                          ...replyFormState,
                          [post.id]: replyFormState[post.id]
                            ? !replyFormState[post.id]
                            : true,
                        });
                      }}
                    >
                      Add Reply
                    </a>
                  </div>
                )}
                {replyFormState[post.id] && (
                  <>
                    <div className="dark-form">
                      <Card.Body>
                        <div align="center">
                          <h5 className="text-titles">Add a Reply</h5>
                        </div>
                        <form>
                          <div class="form-group">
                            <textarea
                              class="form-control"
                              id="exampleFormControlTextarea1"
                              rows="3"
                              placeholder="your reply here..."
                              onChange={(e) => {
                                setReplyText(e.target.value);
                              }}
                            ></textarea>
                          </div>
                          <div align="right">
                            <button
                              onClick={addReply}
                              type="submit"
                              class="btn-add-post"
                            >
                              Submit Reply
                            </button>
                          </div>
                        </form>
                      </Card.Body>
                    </div>
                  </>
                )}
                <details>
                  <summary
                    onClick={() =>
                      setReplyState({
                        ...replyState,
                        [post.id]: replyState[post.id]
                          ? !replyState[post.id]
                          : true,
                      })
                    }
                  >
                    <span>View Replies</span>
                    {replyState[post.id] && <ShowReplies id={post.id} />}
                  </summary>
                </details>
              </Card.Body>
            </Card>
          </>
        );
      })}
      <br></br>
    </div>
  );
}

export default Forums;
