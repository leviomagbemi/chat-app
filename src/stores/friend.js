import { defineStore } from "pinia";
import { getFirestore, setDoc, doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useFriendStore = defineStore("sendFriendReq", {
  state: () => ({}),

  actions: {
    async sendFriendReq(friend, userStore, req) {
      const db = getFirestore(firebase);

      await setDoc(doc(db, "users", friend.user, "friendReq", userStore.uid), {
        user: userStore.user
      });

      const notificationID = Math.random().toString(16).slice(2);
      const notificationDate = new Date();

      await setDoc(doc(db, "users", friend.user, "notifications", notificationID), {
        message: `${userStore.user.firstName} ${userStore.user.surname} wants to be your friend`,
        user: userStore.user,
        id: notificationID,
        date: notificationDate.toLocaleDateString(),
        time: notificationDate.toLocaleTimeString(),
        read: false
      });

      req.value = true;
    },

    async checkFriends(userID, isFriend, userStore) {
      const db = getFirestore(firebase);
      const ref = collection(db, "users", userID, "friends");

      const snapshot = await getDocs(ref);

      isFriend.value = snapshot.docs
        .map((doc) => doc.data())
        .filter((doc) => doc.friend.user === userStore.uid);
    },

    async acceptFriend(friendReq, confirm, userStore) {
      const db = getFirestore(firebase);

      // delete request sender from user friendReq storage
      await deleteDoc(doc(db, "users", userStore.uid, "friendReq", friendReq.user));

      // to current user friends
      const user = doc(db, "users", userStore.uid, "friends", friendReq.user);
      await setDoc(user, {
        friend: friendReq
      });

      // add current user to request sender friends
      await setDoc(doc(db, "users", friendReq.user, "friends", userStore.uid), {
        friend: userStore.user
      });

      // send notification to request sender
      const notificationID = Math.random().toString(16).slice(2);
      const notificationDate = new Date();
      await setDoc(doc(db, "users", friendReq.user, "notifications", notificationID), {
        message: `${userStore.user.firstName} ${userStore.user.surname} accepted your friend request`,
        user: userStore.user,
        id: notificationID,
        date: notificationDate.toLocaleDateString(),
        time: notificationDate.toLocaleTimeString(),
        read: false
      });

      confirm.value = true;
    },

    async cancelFriendReq(friend, userStore) {
      const db = getFirestore(firebase);

      await deleteDoc(doc(db, "users", friend.user, "friendReq", userStore.uid));
    },

    async deleteFriendReq(friend, userStore) {
      const db = getFirestore(firebase);

      await deleteDoc(doc(db, "users", userStore.uid, "friendReq", friend.user));
    }
  }
});
