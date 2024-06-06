import { defineStore } from "pinia";
import { ref } from "vue";
import { getFirestore, setDoc, doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import firebase from "@/includes/firebase";

export const useFriendStore = defineStore("friends", () => {
  const discoverFriends = ref([]);
  const requests = ref([]);
  const requestsData = ref([]);
  const userFriendsArr = ref([]);
  const ids = ref([]);
  const show = ref(true);
  const loaded = ref(false);

  async function sendFriendReq(friend, userStore, req) {
    const db = getFirestore(firebase);

    await setDoc(doc(db, "users", friend.userID, "friendReq", userStore.uid), {
      userID: userStore.user.userID,
      profileID: userStore.user.profileID
    });

    const notificationID = Math.random().toString(16).slice(2);
    const notificationDate = new Date();

    await setDoc(doc(db, "users", friend.userID, "notifications", notificationID), {
      message: `${userStore.user.firstName} ${userStore.user.surname} wants to be your friend`,
      userID: userStore.user.userID,
      profileID: userStore.user.profileID,
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
      .filter((doc) => doc.userID === userStore.uid);
  }

  async function acceptFriend(friendReq, confirm, userStore) {
    const db = getFirestore(firebase);

    // delete request sender from user friendReq storage
    await deleteDoc(doc(db, "users", userStore.uid, "friendReq", friendReq.userID));

    // to current user friends
    const user = doc(db, "users", userStore.uid, "friends", friendReq.userID);
    await setDoc(user, {
      userID: friendReq.userID,
      profileID: friendReq.profileID
    });

    // add current user to request sender friends
    const currentUser = doc(db, "users", friendReq.userID, "friends", userStore.uid);
    await setDoc(currentUser, {
      userID: userStore.user.userID,
      profileID: userStore.user.profileID
    });

    // send notification to request sender
    const notificationID = Math.random().toString(16).slice(2);
    const notificationDate = new Date();
    await setDoc(doc(db, "users", friendReq.userID, "notifications", notificationID), {
      message: `${userStore.user.firstName} ${userStore.user.surname} accepted your friend request`,
      userID: userStore.user.userID,
      profileID: userStore.user.profileID,
      id: notificationID,
      date: notificationDate.toLocaleDateString(),
      time: notificationDate.toLocaleTimeString(),
      read: false
    });

    confirm.value = true;
  }

  async function cancelFriendReq(friend, userStore) {
    const db = getFirestore(firebase);

    await deleteDoc(doc(db, "users", friend.userID, "friendReq", userStore.uid));
  }

  async function deleteFriendReq(friend, userStore) {
    const db = getFirestore(firebase);

    await deleteDoc(doc(db, "users", userStore.uid, "friendReq", friend.userID));
  }

  async function userFriends(userStore, friends) {
    const db = getFirestore(firebase);

    const ref = collection(db, "users", userStore.uid, "friends");

    const snapshot = await getDocs(ref);

    for (let doc of snapshot.docs) {
      const document = doc.data();
      friends.value.push(document.userID);
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
      userFriendsArr.value.push(document.userID);
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
          ids.value.push(document.userID);
        }
        show.value = true;
      }

      // check if user is not in friend request and add to discover friends
      discoverFriends.value = usersSnapshot.docs
        .map((doc) => doc.data())
        .filter((friend) => {
          return (
            friend.userID !== userStore.uid &&
            !ids.value.includes(friend.userID) &&
            !userFriendsArr.value.includes(friend.userID)
          );
        });
    }
  }

  return {
    discoverFriends,
    requests,
    requestsData,
    userFriendsArr,
    ids,
    show,
    loaded,
    sendFriendReq,
    checkFriends,
    acceptFriend,
    cancelFriendReq,
    deleteFriendReq,
    userFriends,
    newFriends
  };
});
