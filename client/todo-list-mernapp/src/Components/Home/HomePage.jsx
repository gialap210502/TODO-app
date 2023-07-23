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


const HomePage = () => {
    const [listItems, setListItems] = useState([]);
    const [itemText, setItemText] = useState('');
    const [itemUser, setItemUser] = useState('');
    const [itemStatus, setItemStatus] = useState('');
    const [isUpdating, setIsUpdating] = useState('');
    const [updateItemText, setUpdateItemText] = useState('');
    const [userData, setUserData] = useState([]);

    const user = useSelector((state) => state.auth.login?.currentUser);
    // const userList = useSelector((state) => state.users.users?.allUsers);
    const taskList = useSelector((state) => state.tasks.tasks?.allTasks)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let axiosJWT = axios.create();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
        getAllListById(user?.accesstoken, dispatch, user?._id);
    }, [])
    const handleDelete = (id) => {
        deleteUser(user?.accessToken, dispatch, id);
    };
    const refreshToken = async () => {
        try {
            const res = await axios.post('http://localhost:5500/api/users/refresh', {
                withCredentials: true,
                Token: user?.accessToken
            });
            return res.data;
        } catch (error) {
            console.log('lỗi ở 45');
        }
    }
    axiosJWT.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwt_decode(user?.accesstoken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken();
                const refreshUser = {
                    ...user,
                    accesstoken: data.accesstoken,
                    refreshToken: data.refreshToken
                };
                dispatch(loginSuccess(refreshUser));
                config.headers["token"] = "Bearer " + data.accesstoken;
            }
            return config;
        },
        (err) => {
            return Promise.reject('lỗi dòng 65');
        }
    );
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
            addTaskById(Task, user?.accesstoken, dispatch, user?._id, axiosJWT)
            getAllListById(user?.accesstoken, dispatch, user?._id);
            setItemText('');
            setItemUser('');
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
            getAllListById(user?.accesstoken, dispatch, user?._id);
        } catch (error) {
            console.log(error);

        }
    };
    const deleteAllItemsWithStatus = async () => {
        try {
            deleteAllItemsWithStatusTrue(user?.accesstoken, dispatch, user?._id);
            // Cập nhật danh sách mục
            getAllListById(user?.accesstoken, dispatch, user?._id);
        } catch (error) {
            console.log(error);
        }
    };
    //delete item when click delete button
    const handleDeleteItem = async (id, userId) => {
        try {
            deleteItem(user?.accesstoken, dispatch, id, userId);
            // Cập nhật danh sách mục
            getAllListById(user?.accesstoken, dispatch, user?._id);
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