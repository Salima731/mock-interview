import React, { useEffect } from 'react'
import { Container, Table } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import useToasterAndNavigate from '../hooks/useToasterAndNavigate';
import { deleteUser, getAllUsers, updateUserRole, updateUserStatus } from '../redux/usersSlice';

const UserMangement = () => {



    const dispatch = useDispatch();
    const toaster = useToasterAndNavigate();
    const { users } = useSelector((state) => state.usersState);
    console.log("userssss", users);

    useEffect(() => {

        dispatch(getAllUsers())
            .unwrap().then((data) => {
                toaster.success(data?.success, data?.message)
            }).catch((err) => {
                toaster(err.message);
            })

    }, [dispatch,users]);


    const handleDeleteUser = (userId) => {
        dispatch(deleteUser(userId))
            .unwrap().then((data) => {
                toaster(data?.success, data?.message);
            })
            .catch((err) => {
                toaster(false, err?.message);
            })
    }

    const handleStatusUpdate = (userId, newStatus) =>{
        console.log("newStatus", newStatus);
        
        dispatch(updateUserStatus({id: userId, status: newStatus}))
        .unwrap()
        .then((data) => {
            toaster(data?.success, data?.message);
        })
        .catch((err) => {
            toaster(false, err.message);
        })
    }

    const handleRoleUpdate = (userId, newRole) =>{
        dispatch(updateUserRole({id: userId, role: newRole}))
        .unwrap()
        .then((data) => {
            toaster(data?.success, data?.message);
        })
        .catch((err) => {
            toaster(false, err.message);
        })
    }




    return (
        <Container>
            <Table striped bordered hover className='mt-3'>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>User Role</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.status}
                                    onChange={(e) => handleStatusUpdate(user._id, e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="suspended">Inactive</option>
                                </select>
                            </td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="seller">Seller</option>
                                </select>
                            </td>
                            <td>
                                <Link onClick={() => { handleDeleteUser(user._id) }}><Trash /></Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default UserMangement;