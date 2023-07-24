import '../../App.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import {
    getAllUser, getAllListById, deleteUser,
    addTaskById, deleteAllItemsWithStatusTrue, deleteItem, updateItem
} from '../../redux/apiRequest';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';
import { createAxios } from '../../creatInstance';

const HomePage = () => {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const [listItems, setListItems] = useState([]);
    const [itemText, setItemText] = useState('');
    const [itemUser, setItemUser] = useState('');
    const [itemStatus, setItemStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState('');
    const [updateItemText, setUpdateItemText] = useState('');
    const [userData, setUserData] = useState([]);

    // const userList = useSelector((state) => state.users.users?.allUsers);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let taskList = useSelector((state) => state.tasks.tasks?.allTasks)

    let axiosJWT = createAxios(user, dispatch, loginSuccess);


    const handleDelete = (id) => {
        deleteUser(user?.accessToken, dispatch, id);
    };

    //update function
    const handleUpdateItem = async (e, id) => {
        e.preventDefault();
        try {
            updateItem(user?.accesstoken, dispatch, id, user?._id, updateItemText);
            const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, { item: updateItemText })
            setUpdateItemText('');
            setIsUpdating('');
        } catch (err) {
            console.log(err);
        }
    }
    //add new item to database
    const addItem = async (e) => {
        e.preventDefault();
        try {
            const Task = { user: user?._id, item: itemText, itemStatus: false };
            await addTaskById(Task, user?.accesstoken, dispatch, user?._id, axiosJWT);
            console.log('Lấy add task');
            await getAllListById(user?.accesstoken, dispatch, user?._id, axiosJWT);
            console.log('Lấy All task');
            setItemText('');
        } catch (error) {
            console.log(error);
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
            getAllListById(user?.accesstoken, dispatch, user?._id, axiosJWT);
        } catch (error) {
            console.log(error);

        }
    };
    const deleteAllItemsWithStatus = async () => {
        try {
            deleteAllItemsWithStatusTrue(user?.accesstoken, dispatch, user?._id, axiosJWT);
            // Cập nhật danh sách mục
            getAllListById(user?.accesstoken, dispatch, user?._id, axiosJWT);
        } catch (error) {
            console.log(error);
        }
    };
    //delete item when click delete button
    const handleDeleteItem = async (id, userId) => {
        try {
            await deleteItem(user?.accesstoken, dispatch, id, userId, axiosJWT);
            // Cập nhật danh sách mục
            await getAllListById(user?.accesstoken, dispatch, user?._id, axiosJWT);
        } catch (error) {
            console.log(error);
        }

    };
    //update item when click update button
    //Render update form
    const renderUpdateForm = (item) => (
        <form className="update-form" onSubmit={(e) => { handleUpdateItem(e, item._id) }} >
            <input className="update-new-input" type="text" placeholder="New Item" onChange={e => { setUpdateItemText(e.target.value) }} value={updateItemText} />
            <button className="update-new-btn" type="submit">Update</button>
        </form>
    )
    useEffect(() => {
        if (!user) {
            navigate("/");
        }
        getAllListById(user?.accesstoken, dispatch, user?._id, axiosJWT);
    }, [])
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
                    taskList?.map(item => (
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
                                        <button className="deleteItem" onClick={() => { handleDeleteItem(item._id, item.user) }}>Delete</button>
                                    </>
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default HomePage;