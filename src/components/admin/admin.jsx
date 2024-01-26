import React, { useEffect, useState } from "react"
import './index.css'
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Tabs, Modal, List, Space } from 'antd';
import ReactMarkdown from 'react-markdown';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import UsersData from "./UsersData";
import api from '../../api/axios'

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

const Admin = () => {
    // const [searchValue, setSearchValue] = useState('')
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [image, setImage] = useState({})
    const [allCollectionsData, setAllCollectionsData] = useState([])
    const [reqData, setReqData] = useState({
        name: '',
        description: '',
        topic: '',
        customFields: {
            author: '',
            synopsis: '',
            publicationYear: '',
        },
        image,
        tags: [],
    });

    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        const getCollections = async () => {
            try {
                const response = await axiosPrivate.get('/collections/admin')
                setAllCollectionsData(response.data)    
            } catch (error) {
                console.error('Error fetching collections:', error);
            }
        };
        getCollections()
    }, [axiosPrivate]);
    
    
      const handleOk = async (e) => {
        e.preventDefault()

         await api.post('http://itrabackend-0a797af92f8e.herokuapp.com/collections/options', reqData)
        .then(response => console.log(response.data))
        .catch(error => console.error(error));

        setConfirmLoading(true);
        setTimeout(() => {
          setOpen(false);
          setConfirmLoading(false);
        }, 2000);
      };
    
      const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
      };


        const onChange = (key) => {
        console.log(key);
        };

        const handleInputChange = (field, value) => {
            setReqData({
                ...reqData,
                [field]: value,
            });
        };
    
        const handleCustomFieldChange = (field, value) => {
            setReqData({
                ...reqData,
                customFields: {
                    ...reqData.customFields,
                    [field]: value,
                },
            });
        };
        
        const handleImageUpload = (e) => {
            e.preventDefault()

            const headers = {
                'Content-Type': 'image/png',
                'Content-Disposition': `attachment; filename="${image.name}"`,
                'X-Image-Caption': 'Static Caption',
            };

            fetch('http://itrabackend-0a797af92f8e.herokuapp.com/collections/upload', {
            method: 'POST',
            headers,
            body: image,
            })
            .then(response => response.json())
            .then(data => setReqData({
                ...reqData,
                image: data.imageUrl,
            }))
            .catch(error => console.error(error));
          };

    const adminContents = [
    {
      key: '2',
      label: 'Collections',
      children: <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 3,
      }}
      dataSource={allCollectionsData}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          actions={[
            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
            <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
          ]}
          extra={
            <img
              width={100}
              alt="logo"
              src={item.image}
            />
          }
        >
          <List.Item.Meta
            title={<a href={item.href}>{item.name}</a>}
            description={item.description}
          />
          {item.description}
        </List.Item>
      )}
    />
    },
    {
      key: '3',
      label: 'All Users',
      children: <UsersData />,
    },
    {
      key: '4',
      label: 'Profile',
      children: <h1>Profile</h1>,
    },
    {
      key: '5',
      label: 'Settings',
      children: <h1>Settings</h1>,
    },
    ];


    return (
        <div className="admin-container">
            <Modal
                width="880"
                title="Create Collection"
                open={open}
                onOk={handleOk}
                okText={"Submit"}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <form className="collection-form">
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            id="name"
                            type="text"
                            className="form-control"
                            value={reqData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            className="form-control"
                            value={reqData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                        <ReactMarkdown>{reqData.description}</ReactMarkdown>
                    </div>

                    <div className="form-group">
                        <label htmlFor="topic">Topic:</label>
                        <select
                            id="topic"
                            className="form-control"
                            value={reqData.topic}
                            onChange={(e) => handleInputChange('topic', e.target.value)}
                        >
                            <option value="Books">Books</option>
                            <option value="Signs">Signs</option>
                            {/* Add other predefined topics */}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="author">Author:</label>
                        <input
                            id="author"
                            type="text"
                            className="form-control"
                            value={reqData.customFields.author}
                            onChange={(e) => handleCustomFieldChange('author', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="synopsis">Synopsis:</label>
                        <textarea
                            id="synopsis"
                            className="form-control"
                            value={reqData.customFields.synopsis}
                            onChange={(e) => handleCustomFieldChange('synopsis', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="publicationYear">Publication Year:</label>
                        <input
                            id="publicationYear"
                            type="number"
                            className="form-control"
                            value={reqData.customFields.publicationYear}
                            onChange={(e) => handleCustomFieldChange('publicationYear', e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Image:</label>
                        <input
                            id="image"
                            type="file"
                            className="form-control"
                            onChange={e => setImage(e.target.files[0])}
                            accept="image/*"
                            multiple
                        />
                        <button onClick={handleImageUpload}>upload</button>
                    </div>

                    {/* <div className="form-group">
                        <label htmlFor="tags">Tags (comma-separated):</label>
                        <input
                            id="tags"
                            type="text"
                            className="form-control"
                            value={reqData.tags.join(',')}
                        />
                    </div> */}
                </form>
            </Modal>
            <Tabs defaultActiveKey="1" items={adminContents} onChange={onChange} />
        </div>
    )
}

export default Admin