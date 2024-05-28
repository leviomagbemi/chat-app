import { defineStore } from "pinia";
import { ref } from "vue";
import { getFirestore, setDoc, doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useFriendStore = defineStore("friends", () => {
  const discoverFriends = ref([]);
  const requests = ref([]);
  const userFriendsArr = ref([]);
  const ids = ref([]);
  const show = ref(true);

  async function sendFriendReq(friend, userStore, req) {
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
  }

  async function checkFriends(userID, isFriend, userStore) {
    const db = getFirestore(firebase);
    const ref = collection(db, "users", userID, "friends");

    const snapshot = await getDocs(ref);

    isFriend.value = snapshot.docs
      .map((doc) => doc.data())
      .filter((doc) => doc.user_id === userStore.uid);
  }

  async function acceptFriend(friendReq, confirm, userStore) {
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
  }

  async function cancelFriendReq(friend, userStore) {
    const db = getFirestore(firebase);

    await deleteDoc(doc(db, "users", friend.user_id, "friendReq", userStore.uid));
  }

  async function deleteFriendReq(friend, userStore) {
    const db = getFirestore(firebase);

    await deleteDoc(doc(db, "users", userStore.uid, "friendReq", friend.user_id));
  }

  async function userFriends(userStore, friends) {
    const db = getFirestore(firebase);

    const ref = collection(db, "users", userStore.uid, "friends");

    const snapshot = await getDocs(ref);

    for (let doc of snapshot.docs) {
      const document = doc.data();
      friends.value.push(document.user_id);
    }
  }

  async function newFriends(userStore) {
    show.value = false;
    const db = getFirestore(firebase);
    const usersRef = collection(db, "users");

    await userStore.userDocument();

    //get user friends
    const userFriendsRef = collection(db, "users", userStore.uid, "friends");

    const userFriendsSnapshot = await getDocs(userFriendsRef);

    for (let doc of userFriendsSnapshot.docs) {
      const document = doc.data();
      userFriendsArr.value.push(document.user_id);
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
          requests.value.push(document);
          ids.value.push(document.user_id);
        }
        show.value = true;
      }

      // check if user is not in friend request and add to discover friends
      discoverFriends.value = usersSnapshot.docs
        .map((doc) => doc.data())
        .filter((friend) => {
          return (
            friend.user_id !== userStore.uid &&
            !ids.value.includes(friend.user_id) &&
            !userFriendsArr.value.includes(friend.user_id)
          );
        });
    }
  }

  return {
    discoverFriends,
    requests,
    userFriendsArr,
    ids,
    show,
    sendFriendReq,
    checkFriends,
    acceptFriend,
    cancelFriendReq,
    deleteFriendReq,
    userFriends,
    newFriends
  };
});
