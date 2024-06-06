import { defineStore } from "pinia";
import { ref } from "vue";
import { getFirestore, doc, setDoc, getDocs, collection, onSnapshot } from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useLikeCommentStore = defineStore("likeComment", () => {
  async function likePost(postID, user) {
    const db = getFirestore(firebase);

    const likeRef = doc(db, "posts", postID, "likes", user.userID);
    await setDoc(likeRef, {
      user
    });
  }

  // realtime comment
  function listenForComments(postID, commentID, comment) {
    const db = getFirestore(firebase);
    const commentsRef = doc(db, "posts", postID, "comments", commentID);
    onSnapshot(commentsRef, (doc) => {
      comment.push(doc.data());
    });
  }

  async function postComment(commentInput, postID, user) {
    const db = getFirestore(firebase);

    const commentID = Math.random().toString(16).slice(2);
    await setDoc(doc(db, "posts", postID, "comments", commentID), {
      comment: commentInput,
      commentID,
      user
    });

    return commentID;
  }

  async function getComments(postID, comments) {
    const db = getFirestore(firebase);

    const commentsRef = collection(db, "posts", postID, "comments");
    const snapshot = await getDocs(commentsRef);

    snapshot.forEach((doc) => comments.push(doc.data()));
  }

  return {
    likePost,
    postComment,
    getComments,
    listenForComments
  };
});
