import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  getDocs,
  collection
} from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useLikeCommentStore = defineStore("likeComment", () => {
  async function likePost(postLikes, postID, user) {
    const db = getFirestore(firebase);

    const postRef = doc(db, "posts", postID);

    if (postLikes.indexOf(user) != -1) {
      //remove like
      postLikes.splice(postLikes.indexOf(user), 1);
      await updateDoc(postRef, {
        likes: arrayRemove(user)
      });
    } else {
      //add like
      postLikes.push(user);
      await updateDoc(postRef, {
        likes: arrayUnion(user)
      });
    }
  }

  async function postComment(commentInput, post_id, user) {
    const db = getFirestore(firebase);

    const commentID = Math.random().toString(16).slice(2);
    await setDoc(doc(db, "posts", post_id, "comments", commentID), {
      comment: commentInput,
      commentID,
      user
    });
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
    getComments
  };
});
