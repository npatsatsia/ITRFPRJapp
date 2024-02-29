import React, { useEffect, useState } from 'react';
import { Modal, Checkbox, Image } from 'antd';
import './index.css'
import { io } from 'socket.io-client';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
// import { useSearchParams } from 'react-router-dom';


const socket = io('http://localhost:3500', {
  reconnection: true
})


const SingleItemModal = ({
    collection,
    singleItem, 
    showItem, 
    setShowItem, 
    setAllComments,
    allComments,
    // allowedToEdit
  }) => {
    const [commentValue, setCommentValue] = useState('')
    const [commentsRealTime, setCommentsRealTime] = useState([])
    const [commentAdded, setCommentAdded] = useState(false)

    const axiosPrivate = useAxiosPrivate()

    
    
    const handleAddComment = async (e) => {
      e.preventDefault()
      try{
        const response = await axiosPrivate.put(`/comments/${singleItem.id}`, {commentText: commentValue});
        if (response.statusText === "OK"){
          console.log(response.data)
          setCommentValue('')
          socket.broadcast.emit('comment', response.data)
          setCommentAdded(!commentAdded)
        }
      }catch(error) {
        console.log(error)
        console.error(error)
      }
    }

    useEffect(() => {
      const commentListener = (newComment) => {
        console.log(newComment)
        setCommentsRealTime(newComment)
        setAllComments(prev => [...prev, newComment])
      };
    
      socket.on('comment', commentListener)
    
      return () => {
        socket.off('comment', commentListener);
      };
      
    }, [commentAdded]);



  const handleCancel = () => {
  //   setSearchParams({
  //     item: ''
  // })
    setShowItem(false);
  };

  return (
      <Modal width={1200} open={showItem} onOk={() => setShowItem(false)} onCancel={handleCancel}>
        <div className="single-item-container">
          <div className="item-image-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Image
              width={300}
              src={singleItem.imageUrl}
              placeholder={
                <Image
                  preview={false}
                  src={`${singleItem.imageUrl}?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200`}
                  width={200}
                />
              }
            />
          </div>
          <div className="item-fields-container">
            {singleItem?.fields &&
              Object.entries(singleItem.fields).map(([key, value]) => (
                <div key={key} className="field" style={value.length > 20 ? { display: "flex", flexDirection: "column" } : {}} >
                  <b className="field-key">{typeof(value) === "boolean" ? key : key + ": "}</b>
                  <span className="field-value">{value} {typeof(value) === "boolean" && <Checkbox checked/>}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="comments-section">
          <h2>Comments</h2>
          <div className="comments-list">
            {allComments && Array.isArray(allComments) && allComments?.length > 0 ? (
              allComments.map((data, index) => (
                <div key={index} className="comment">
                  <p>{data?.comment}</p>
                  <div className="user-first-letter">{data?.author.charAt(0).toUpperCase()}</div>
                </div>
              ))
            ) : (
              <div>No comments yet</div>
            )}
          </div>
          <form onSubmit={handleAddComment}>
            <input
              type="text"
              className="comment-input"
              value={commentValue}
              onChange={e => setCommentValue(e.target.value)}
              placeholder="Add a comment"
            />
            <button type="submit" className="submit-button">Add Comment</button>
          </form>
        </div>
      </Modal>
  );
};
export default SingleItemModal;
