"use client";
import { useState } from "react";
import styles from "./Comments.module.css";
import { User } from "lucide-react";

export default function Comments() {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Jane Smith",
      text: "This is a highly insightful piece. The shifts in the technological landscape are truly unprecedented and I'm eager to see how it affects global markets in the next quarter.",
      date: "2 hours ago"
    },
    {
      id: 2,
      author: "Alex Johnson",
      text: "I completely agree with the points made here. However, I think the regulatory aspect will be the biggest hurdle moving forward before we see mass adoption.",
      date: "5 hours ago"
    }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: "Guest User",
      text: newComment,
      date: "Just now"
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className={styles.commentsContainer}>
      <h3 className={styles.title}>Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.textarea}
            placeholder="Share your thoughts on this article..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Post Comment
        </button>
      </form>

      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentItem}>
            <div className={styles.avatar}>
              {comment.author.charAt(0)}
            </div>
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <span className={styles.authorName}>{comment.author}</span>
                <span className={styles.commentDate}>{comment.date}</span>
              </div>
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
