import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getFirestore,
  doc,
  deleteDoc,
  setDoc,
  getDocs,
  collection,
  onSnapshot
} from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useLikeCommentStore = defineStore("likeComment", () => {
  //realtime likes
  function listenForLikes(postID, likeID, like) {
    const db = getFirestore(firebase);

    const likeRef = doc(db, "posts", postID, "likes", likeID);
    onSnapshot(likeRef, (doc) => {
      like.push(doc.data());
    });
  }

  async function likePost(postID, user) {
    const db = getFirestore(firebase);

    const likeID = Math.random().toString(16).slice(2);
    const likeRef = doc(db, "posts", postID, "likes", likeID);
    await setDoc(likeRef, {
      user,
      likeID
    });

    return likeID;
  }

  async function unlikePost(postID, likeID) {
    const db = getFirestore(firebase);

    const likeRef = doc(db, "posts", postID, "likes", likeID);
    await deleteDoc(likeRef);
  }

  // realtime comment
  function listenForComments(postID, commentID, comment) {
    const db = getFirestore(firebase);
    const commentRef = doc(db, "posts", postID, "comments", commentID);
    onSnapshot(commentRef, (doc) => {
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

  async function getLikes(postID, likes) {
    const db = getFirestore(firebase);

    const likesRef = collection(db, "posts", postID, "likes");

    const snapshot = await getDocs(likesRef);

    snapshot.forEach((doc) => likes.push(doc.data()));
  }

  return {
    likePost,
    unlikePost,
    postComment,
    getComments,
    getLikes,
    listenForComments,
    listenForLikes
  };
});
