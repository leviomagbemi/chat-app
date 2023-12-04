import { defineStore } from "pinia";
import { getFirestore, setDoc, doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useFriendStore = defineStore("friends", {
  state: () => ({
    discoverFriends: [],
    requests: [],
    userFriendsArr: [],
    ids: [],
    show: true,
    loaded: false
  }),

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
    },

    async userFriends(userStore, friends) {
      const db = getFirestore(firebase);

      const ref = collection(db, "users", userStore.uid, "friends");

      const snapshot = await getDocs(ref);

      for (let doc of snapshot.docs) {
        const document = doc.data();
        friends.value.push(document);
        console.log(document);
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
        this.userFriendsArr.push(document.friend.user);
        console.log(document);
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
            this.ids.push(document.user.user);
          }
          this.show = true;
        }

        // check if user is not in friend request and add to discover friends
        this.discoverFriends = usersSnapshot.docs
          .map((doc) => doc.data())
          .filter((friend) => {
            return (
              friend.user !== userStore.uid &&
              !this.ids.includes(friend.user) &&
              !this.userFriendsArr.includes(friend.user)
            );
          });
      }
    }
  }
});
