import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const App = () => {

  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);

  const [selectedFriend, setSelectedFriend] = useState(null);
  // const [showSplitBill, setShowSplitBill] = useState(false)

  const handleShowAddFriend = () => {
    // console.log("hello") 
    setShowAddFriend((show) => !show)
  }

  const handleAddFriend = (friend) => {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false)
  }

  const handleSelectedFriend = (friend) => {
    setSelectedFriend(curr => curr?.id === friend.id ? null : friend)
    // setShowSplitBill(selectedFriend !== friend)
    setShowAddFriend(false)
  }

  const handleSplitBill = (value) => {
    setFriends(friends => friends.map(friend => 
      friend.id === selectedFriend.id
      ? {...friend, balance: friend.balance + value} 
      : friend));
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList 
          friends={friends} 
          onSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && 
          <FormAddFriend 
            onAddFriends={handleAddFriend} 
            onShowAddFriend={handleShowAddFriend}
          />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend" }
        </Button>
      </div>
      
      {selectedFriend && 
        <FormSplitBill 
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      }

    </div>
  )
}

const FriendList = ({friends, onSelectedFriend, selectedFriend}) => {

  return (
    <ul>
      {friends.map(friend => 
        <Friend 
          friend={friend} 
          key={friend.id}
          onSelectedFriend={onSelectedFriend}
          selectedFriend={selectedFriend}
        />)}
    </ul>
  )
}

const Friend = ({ friend, onSelectedFriend, selectedFriend }) => {

  const isSelected = selectedFriend?.id === friend.id

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}€</p> }
      {friend.balance > 0 && <p className="green">{friend.name} owes you {Math.abs(friend.balance)}€</p> }
      {friend.balance === 0 && <p>{friend.name} and you are even</p> }
      <Button 
        onClick={() => onSelectedFriend(friend)}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  )
}

const FormAddFriend = ({onAddFriends, onShowAddFriend}) => {

  const [name, setName] = useState("");
  const [img, setImg] = useState('https://i.pravatar.cc/48')

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !img ) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${img}?=${id}`,
      balance: 0,
      id: id,
    }

    setName("");
    setImg('https://i.pravatar.cc/48')

    onAddFriends(newFriend)

    console.log({newFriend})

  }

  return (
    <form 
      className="form-add-friend"
      onSubmit={handleSubmit}  
    >
      <label>👫 Friend name</label>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼 Image URL</label>
      <input 
        type="text" 
        value={img} 
        onChange={(e) => setImg(e.target.value)} 
      />
      <Button>Add</Button>
    </form>
  )
}

const Button = ({onClick, children}) => {
  return <button onClick={onClick} className="button">{children}</button>
}

const FormSplitBill = ({selectedFriend, onSplitBill}) => {

  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  const paidByFriend = bill ? bill - paidByUser : "";

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser );

  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input 
        type="text" 
        value={bill} 
        onChange={e => setBill(Number(e.target.value))}
      />

      <label>🕺 Your expense</label>
      <input 
        type="text" 
        value={paidByUser} 
        onChange={e => setPaidByUser(Number(e.target.value) > bill 
        ? paidByUser
        : Number(e.target.value))}
      />

      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend}/>

      <label>🤑 Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={e => setWhoIsPaying(e.target.Value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>

    </form>
    
  )
}

export default App;