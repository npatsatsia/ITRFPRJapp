import React, { useEffect, useState } from "react"
import './index.css'
import AddCollectionModal from "./addCollectionModal";
import { AiOutlineSearch } from "react-icons/ai";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import api from '../../api/axios'
import noImage from '../../static/images/no-image.avif'
import { List, Space } from 'antd';

    
  const IconText = ({ icon, text }) => (
    <Space>
    {React.createElement(icon)}
    {text}
  </Space>
  );
  
const User = () => {

  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([])
  const [categories, setCategories] = useState([])
  
  const axiosPrivate = useAxiosPrivate()

  const showModal = () => {
      setOpen(true);
    };

  useEffect(() => {
      const getCollections = async () => {
          try {
              const response = await axiosPrivate.get('/collections');
              setCollections(response.data)    
          } catch (error) {
              console.error('Error fetching collections:', error);
          }
      };
      const getCategories = async () => {
          try {
              const response = await api.get('/categories');
              setCategories(response.data)    
          } catch (error) {
              console.error('Error fetching categories:', error);
          }
      };
      getCollections()
      getCategories()
  }, [axiosPrivate]);
    
    return (
        <>
          <div className="admin-collections-filters">
              <div className="search-container">
                  <AiOutlineSearch/> 
                  <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
              </div>
              <div className="filters">
                  <div className="category-dropdown">Categories</div>
                  <div className="features">features</div>
              </div>
              <button onClick={showModal} className="create-collection-button">Create</button>
          </div>
          <div className="user-collections-container">
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={collections}
              renderItem={(collection) => (
              <List.Item
                key={collection.id}
                actions={[
                  <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                  <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                  <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                ]}
                extra={
                  <img
                    width={100}
                    alt="collection"
                    src={collection.image? collection.image : noImage}
                  />
                }
              >
                <List.Item.Meta
                  title={<a href={`https://itrabackend-0a797af92f8e.herokuapp.com/collection/${collection.id}`}>{collection.name}</a>}
                  description={collection.description}
                />{collection.description}
              </List.Item>)}
            />
            <div className="add-collection-modal-container">
                <AddCollectionModal open={open} setOpen={setOpen} categories={categories}/>
            </div>
            
          </div>
        </>
    )
}

export default User