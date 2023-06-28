import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { C } from 'jssip';

function App() {
  const [itemText, setItemText] = useState('');
  const [itemUser, setItemUser] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [uname, setUname] = useState('');
  const [pass, setPass] = useState('');
  const [unamel, setUnamel] = useState('');
  const [passl, setPassl] = useState('');
  const [repass, setRepass] = useState('');
  const [isSignInClicked, setIsSignInClicked] = useState(false);
  const [isReClicked, setIsReClicked] = useState(false);


  //add new item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5500/api/users/649ab1b7d00dfff8fb50855c/items`, {user: itemUser, item: itemText, itemStatus: false })
      setListItems(prev => [...prev, res.data])
      setItemText('');
      setItemUser('');
    } catch (error) {
      console.log(error);
    }
  }

  //add new user to database
  const addUser = async (e) => {
    e.preventDefault();
    try {
      if (pass == repass) {
        const res = await axios.post('http://localhost:5500/api/users', { username: uname, password: pass })
        setListItems(prev => [...prev, res.data])
        setItemText('');
      } else {
        console.log("password not match")
      }

    } catch (error) {
      console.log(error);
    }
  }

  //function to fetch all items from database -- use useEffect hook
  useEffect(() => {
    const getItemList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items')
        setListItems(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getItemList();
  }, []);

  //delete item when click delete button
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`);
      const newListItem = listItems.filter(item => item._id !== id);
      setListItems(newListItem);
    } catch (error) {
      console.log(error);
    }
  }

  //update item when click update button

  //Render update form
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => { updateItem(e) }} >
      <input className="update-new-input" type="text" placeholder="New Item" onChange={e => { setUpdateItemText(e.target.value) }} value={updateItemText} />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )

  //update function
  const updateItem = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, { item: updateItemText })
      console.log(res.data)
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
      const updatedItem = listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  }

  const handleItemStatusChange = async (itemId, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5500/api/item/${itemId}`, { itemStatus: newStatus });
      // Cập nhật danh sách mục
      const updatedListItems = listItems.map(item => {
        if (item._id === itemId) {
          return { ...item, itemStatus: newStatus };
        }
        return item;
      });
      setListItems(updatedListItems);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteAllItemsWithStatus = async () => {
    try {
      const res = await axios.delete('http://localhost:5500/api/users/649ab1b7d00dfff8fb50855c/items', {
        params: {
          itemStatus: true
        }
      });
      // Cập nhật danh sách mục
      const updatedListItems = listItems.filter(item => !item.itemStatus, item =>  item.user == "649ab1b7d00dfff8fb50855c", );
      setListItems(updatedListItems);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignInClick = () => {
    setIsSignInClicked(true);
    setIsReClicked(false);
  };
  const handleReClick = () => {
    setIsReClicked(true);
    setIsSignInClicked(false);
  };

const a = 0;

  if (a == 1) {
    return (
      <div className="App">
        <h1>To Do List</h1>
        <form className="form" onSubmit={e => addItem(e)}>
          <input type="text" placeholder="Add Todo Items" onChange={e => { setItemText(e.target.value) }} value={itemText} />
          <button type="submit">Add</button>
        </form>
        <button className="deleteAllItems" onClick={deleteAllItemsWithStatus}>Delete Completed Items</button>
        <div className="todo-listItems">
          {
            listItems.map(item => (
              <div className="todo-item">
                {
                  isUpdating === item._id
                    ? renderUpdateForm(item)
                    : <>
                      <p className="item-Content">{item.item}</p>
                      <input
                        type="checkbox"
                        checked={item.itemStatus}
                        onChange={() => handleItemStatusChange(item._id, !item.itemStatus)}
                      />
                      <button className="updateItem" onClick={() => { setIsUpdating(item._id) }}>Update</button>
                      <button className="deleteItem" onClick={() => { deleteItem(item._id) }}>Delete</button>
                    </>
                }
              </div>
            ))
          }
        </div>
      </div>
    );

  }
   else if (isSignInClicked) {
    return (
      <div className="App">
        <h1>Login</h1>
        <hr />
        <form onSubmit={e => (e)}>
          <label id="lb"><b>Username</b></label><br />
          <input type="text" placeholder="Enter Email" name="email" id="email" required onChange={e => { setUnamel(e.target.value) }} value={unamel}></input>
          <label id="lb"><b>Password</b></label><br />
          <input type="password" placeholder="Enter Password" name="psw" id="psw" required onChange={e => { setPassl(e.target.value) }} value={passl}></input>
          <button type="submit" class="registerbtn">Login</button>
        </form>
        <div >
          <p>Don't have an account? <a onClick={handleReClick}>Login</a></p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <h1>Register</h1>
        <hr />
        <form onSubmit={e => addUser(e)}>
          <label id="lb"><b>Username</b></label><br />
          <input type="text" placeholder="Enter Email" name="email" id="email" required onChange={e => { setUname(e.target.value) }} value={uname}></input>
          <label id="lb"><b>Password</b></label><br />
          <input type="password" placeholder="Enter Password" name="psw" id="psw" required onChange={e => { setPass(e.target.value) }} value={pass}></input>
          <label id="lb"><b>Confirm Password</b></label><br />
          <input type="password" placeholder="Repeat Password" name="psw-repeat" id="psw-repeat" required onChange={e => { setRepass(e.target.value) }} value={repass}></input>
          <button type="submit" className="registerbtn">Register</button>
        </form>
        <div >
          <p>Already have an account? <a onClick={handleSignInClick}>Sign in</a>.</p>
        </div>
      </div>
    );
  }
}

export default App;