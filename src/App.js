import "./App.css";
import React, { Suspense } from "react";

import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useRecoilState,
  useRecoilValueLoadable,
} from "recoil";
import axios from "axios";

const currentUserIDState = atom({
  key: "CurrentUserID",
  default: 0,
});

const userInfo = selectorFamily({
  key: "userInfo",
  get: (ID) => async () => {
    const res = await axios.get("http://localhost:3001/users/" + ID);

    if (res.error) {
      throw res.error;
    }
    return res.data;
  },
});

const currentUserInfoQuery = selector({
  key: "currentUserInfoQuery",
  get: ({ get }) => {
    const info = get(userInfo(get(currentUserIDState)));
    return info;
  },
});

const friendsQuery = selector({
  key: "friendsQuery",
  get: ({ get }) => {
    const { friends } = get(currentUserInfoQuery);
    const list = friends.map((friendID) => get(userInfo(friendID)));
    return list;
  },
});

function CurrentUserInfo() {
  const userStatus = useRecoilValueLoadable(currentUserInfoQuery);
  const listStatus = useRecoilValueLoadable(friendsQuery);
  const [, setId] = useRecoilState(currentUserIDState);
  if (userStatus.state === "hasValue" && listStatus.state === "hasValue") {
    const { name } = userStatus.contents;
    const friends = listStatus.contents;

    return (
      <div>
        current:{name}
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} onClick={() => setId(friend.id)}>
              {friend.name}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <div>loading</div>;
  }
}

function App() {
  return (
    <div className="App">
      <CurrentUserInfo />
    </div>
  );
}

export default App;
