import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Space, Table, Tag } from 'antd';

const UsersData = () => {
    // const [searchValue, setSearchValue] = useState('')
    const [users, setUsers] = useState([])
    // const [reload, setReload] = useState(false)

    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()

    useEffect(() => {
        const getAllUsers = async () => {
            try{
                const response = await axiosPrivate.get('/users')
                setUsers(response.data)
            }catch(error){
                console.error(error)
            }
        }
        getAllUsers()
    }, [axiosPrivate])

    // useEffect(() => {
    //     navigate(0)
    // }, [reload])
    
    const handleBlock = async (userId) => {
        try{
            const response = await axiosPrivate.put('/users/block', {userId})
            if(response.status === 200) {
                navigate(0)
            }
        }catch(error){
            console.error(error)
        }
    }
    const handleUnBlock = async (userId) => {
        try{
            const response = await axiosPrivate.put('/users/unblock', {userId})
            if(response.status === 200) {
                navigate(0)
            }
        }catch(error){
            console.error(error)
        }
        
    }
    const handleMakeAdmin = async (userId) => {
        try{
            const response = await axiosPrivate.put('/users/makeadmin', {userId})
            if(response.status === 200) {
                navigate(0)
            }
        }catch(error){
            console.error(error)
        }
    }

    const handleRemoveAdmin = async (userId) => {
        try{
            const response = await axiosPrivate.put('/users/removeadmin', {userId})
            if(response.status === 200) {
                navigate(0)
            }
        }catch(error){
            console.error(error)
        }
    }
    const handleDeleteUser = async (userId) => {
        try{
            const response = await axiosPrivate.delete(`/users/${userId}`)
            if(response.status === 200) {
                navigate(0)
            }
        }catch(error){
            console.error(error)
        }
    }

    const columns = [
        {
            title: 'Name/Username',
            dataIndex: 'username',
            key: 'ame/Username',
            render: (text) => <div>{text}</div>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'user_id',
        },
        {
            title: 'Roles',
            key: 'roles',
            dataIndex: 'role',
            render: (roles, _, index) => (
                <>
                {typeof(roles) === "object" ? roles.map((role) => {
                    let color
                if (role === '2001') {
                    color = 'yellow';
                }else if(role === "5150"){
                    color = 'blue';
                }
                return (
                    <Tag color={color} key={index + parseInt(role) + 1235234523}>
                        {role === "5150"? "ADMIN" : "USER"}
                    </Tag>
                );
                })
            : 
            <Tag color={"yellow"} key={1235231234523}>
                USER
            </Tag>
            } 
            </>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'active',
            render: (status, index) => (
                <Tag color={status? "green" : "volcano"}>
                    {status ? "ACTIVE" : "BLOCKED"}
                </Tag>
    
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
            <Space size="middle">
                <div onClick={record.active? () => handleBlock(record.userId) : () => handleUnBlock(record.userId)} style={{cursor: "pointer", fontWeight: "600", color: 'lightBlue'}}>
                    {record.active? "Block" : "Unblock"}
                </div>
                <div onClick={record.role.includes("5150")? () => handleRemoveAdmin(record.userId) : () => handleMakeAdmin(record.userId)} style={{cursor: "pointer", fontWeight: "600", color: 'lightBlue'}}>
                    {record.role.includes("5150") ? "Remove Admin" : "Make Admin"}
                </div>
                <div onClick={() => handleDeleteUser(record.userId)} style={{cursor: "pointer", fontWeight: "600", color: 'tomato'}}>Delete</div>
            </Space>
            ),
        },
        ];


    return (
    <Table columns={columns} dataSource={users} />
    )
}


export default UsersData;

