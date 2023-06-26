import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');

  //add new item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/item', { item: itemText, itemStatus: false })
      setListItems(prev => [...prev, res.data])
      setItemText('');
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
      const res = await axios.delete('http://localhost:5500/api/items', {
        params: {
          itemStatus: true
        }
      });
      // Cập nhật danh sách mục
      const updatedListItems = listItems.filter(item => !item.itemStatus);
      setListItems(updatedListItems);
    } catch (error) {
      console.log(error);
    }
  };

  


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

export default App;
