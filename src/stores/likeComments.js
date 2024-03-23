import { defineStore } from "pinia";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  where,
  query,
  collection
} from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useLikeCommentStore = defineStore("likeComment", {
  state: () => ({}),

  actions: {
    async likePost(postLikes, post_id, user) {
      const db = getFirestore(firebase);

      const postRef = doc(db, "posts", post_id);

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
    },

    async postComment(commentsList, post_id, user, comment, modifiedComments) {
      const db = getFirestore(firebase);

      const postRef = doc(db, "posts", post_id);
      const commentID = Math.random().toString(16).slice(2);

      const userComment = {
        user: user,
        comment: comment.value,
        commentID: commentID,
        postID: post_id
      };

      //add comment

      commentsList.push(userComment);
      await updateDoc(postRef, {
        comments: arrayUnion(userComment)
      });

      const userRef = doc(db, "users", user);

      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        modifiedComments.value = { comment: comment.value, user: docSnap.data() };
      }

      comment.value = "";
    }
  }
});
