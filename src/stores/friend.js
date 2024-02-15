import { defineStore } from "pinia";
import { getFirestore, setDoc, doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useFriendStore = defineStore("friends", {
  state: () => ({
    discoverFriends: [],
    requests: [],
    requestsData: [],
    userFriendsArr: [],
    ids: [],
    show: true,
    loaded: false
  }),

  actions: {
    async sendFriendReq(friend, userStore, req) {
      const db = getFirestore(firebase);

      await setDoc(doc(db, "users", friend.user_id, "friendReq", userStore.uid), {
        user_id: userStore.user.user_id,
        profile_id: userStore.user.profile_id
      });

      const notificationID = Math.random().toString(16).slice(2);
      const notificationDate = new Date();

      await setDoc(doc(db, "users", friend.user_id, "notifications", notificationID), {
        message: `${userStore.user.firstName} ${userStore.user.surname} wants to be your friend`,
        user_id: userStore.user.user_id,
        profile_id: userStore.user.profile_id,
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
        .filter((doc) => doc.user_id === userStore.uid);
    },

    async acceptFriend(friendReq, confirm, userStore) {
      const db = getFirestore(firebase);

      // delete request sender from user friendReq storage
      await deleteDoc(doc(db, "users", userStore.uid, "friendReq", friendReq.user_id));

      // to current user friends
      const user = doc(db, "users", userStore.uid, "friends", friendReq.user_id);
      await setDoc(user, {
        user_id: friendReq.user_id,
        profile_id: friendReq.profile_id
      });

      // add current user to request sender friends
      const currentUser = doc(db, "users", friendReq.user_id, "friends", userStore.uid);
      await setDoc(currentUser, {
        user_id: userStore.user.user_id,
        profile_id: userStore.user.profile_id
      });

      // send notification to request sender
      const notificationID = Math.random().toString(16).slice(2);
      const notificationDate = new Date();
      await setDoc(doc(db, "users", friendReq.user_id, "notifications", notificationID), {
        message: `${userStore.user.firstName} ${userStore.user.surname} accepted your friend request`,
        user_id: userStore.user.user_id,
        profile_id: userStore.user.profile_id,
        id: notificationID,
        date: notificationDate.toLocaleDateString(),
        time: notificationDate.toLocaleTimeString(),
        read: false
      });

      confirm.value = true;
    },

    async cancelFriendReq(friend, userStore) {
      const db = getFirestore(firebase);

      await deleteDoc(doc(db, "users", friend.user_id, "friendReq", userStore.uid));
    },

    async deleteFriendReq(friend, userStore) {
      const db = getFirestore(firebase);

      await deleteDoc(doc(db, "users", userStore.uid, "friendReq", friend.user_id));
    },

    async userFriends(userStore, friends) {
      const db = getFirestore(firebase);

      const ref = collection(db, "users", userStore.uid, "friends");

      const snapshot = await getDocs(ref);

      for (let doc of snapshot.docs) {
        const document = doc.data();
        friends.value.push(document.user_id);
      }
    },

    async newFriends(userStore) {
      this.show = false;
      const db = getFirestore(firebase);
      const usersRef = collection(db, "users");

      await userStore.userDocument();

      //get user friends
      const userFriendsRef = collection(db, "users", userStore.uid, "friends");

      const userFriendsSnapshot = await getDocs(userFriendsRef);

      for (let doc of userFriendsSnapshot.docs) {
        const document = doc.data();
        this.userFriendsArr.push(document.user_id);
      }

      // fetch users
      const usersSnapshot = await getDocs(usersRef);

      for (let doc of usersSnapshot.docs) {
        //check if current user has friend request
        if (doc.id === userStore.uid) {
          const requestsRef = collection(db, "users", userStore.uid, "friendReq");

          const reqSnapshot = await getDocs(requestsRef);

          for (let doc of reqSnapshot.docs) {
            const document = doc.data();
            this.requests.push(document);
            this.ids.push(document.user_id);
          }
          this.show = true;
        }

        // check if user is not in friend request and add to discover friends
        this.discoverFriends = usersSnapshot.docs
          .map((doc) => doc.data())
          .filter((friend) => {
            return (
              friend.user_id !== userStore.uid &&
              !this.ids.includes(friend.user_id) &&
              !this.userFriendsArr.includes(friend.user_id)
            );
          });
      }
    }
  }
});
