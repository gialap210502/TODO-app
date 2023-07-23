import '../../App.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { getAllUser, getAllListById, deleteUser, addTaskById, deleteAllItemsWithStatusTrue } from '../../redux/apiRequest';
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

    const refreshToken = async (token) => {
        try {
            const res = await axios.post('http://localhost:5500/api/users/refresh', {
                token: token
            });
            return res.data;
        } catch (error) {
            console.log('lỗi ở 45');
        }
    }

    axiosJWT.interceptors.request.use(
        async (config) => {
            let date = new Date();
            console.log(user?.accesstoken)
            const decodedToken = jwt_decode(user?.accesstoken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken(user?.refreshToken);
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

    // const getItemList = async () => {
    //     try {
    //         const res = await axios.get(`http://localhost:5500/api/users/${userData._id}/items`)
    //         setListItems(res.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // getItemList();
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
    //add new item to database
    const addItem = async (e) => {
        e.preventDefault();
        try {
            const Task = { user: user?._id, item: itemText, itemStatus: false };
            addTaskById(Task, user?.accesstoken, dispatch, user?._id)
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
            console.log("loi 122");
        }
    };

    //delete item when click delete button
    const deleteItem = async (id, userId) => {
        try {
            await axios.delete(`http://localhost:5500/api/item/${id}`, {
                id: userId
            });
            getAllListById(user?.accesstoken, dispatch, user?._id);
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
                                // <><p className="item-Content">{item.username}</p>
                                //     <button className="deleteItem" onClick={() => { handleDelete(item._id); }}>Delete</button></>
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
                                        <button className="deleteItem" onClick={() => { deleteItem(item._id, user?._id) }}>Delete</button>
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