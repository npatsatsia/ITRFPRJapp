import React, { useEffect, useState } from 'react'
import './index.css'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Dropdown, message, Modal, Card, Space } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import EditCollectionModal from '../editCollectionModal/editCollectionModal';
import AddItemModal from '../addItemModal/addItemModal';
import SingleItemModal from '../singleItem/singleItemModal';

const IconText = ({ icon, text }) => (
  <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "2px 4px" }}>
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  </div>
);

const SingleCollection = () => {
  const [collection, setCollection] = useState({})
  const [itemsData, setItemsData] = useState([])
  const [customFields, setCustomFields] = useState({})
  const [allowedToEdit, setAllowedToEdit] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteisLoading, setDeleteIsLoading] = useState(false)
  const [collectionImage, setCollectionImage] = useState('url')
  const [selectedTags, setSelectedTags] = useState([]);
  const [pageLoading, setPageLoading] = useState(false)
  const [itemsLoading, setItemsLoading] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openAddItemModal, setOpenAddItemModal] = useState(false)
  const [reqData, setReqData] = useState({})
  const [singleItem, setSingleItem] = useState({})
  const [showItem, setShowItem] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const params = Object.fromEntries([...searchParams]);

  const axiosPrivate = useAxiosPrivate()

  const{id} = useParams()

  const navigate = useNavigate()

  useEffect(() => {
    setPageLoading(true)
    setItemsLoading(true)
    const getCollection = async () => {
      try {
          setPageLoading(true)
            const collectionResponse = await axiosPrivate.get(`/collection/${id}`)
            setCollection(collectionResponse.data.collection)
            const allowedResponse = await axiosPrivate.get('/collections/allowed', collectionResponse.data.id)

            // setCustomFields(response.data.customFields)
            setReqData(collectionResponse.data.collection)
            setCustomFields(collectionResponse.data.sortedCustomFields)
            setCollectionImage(collectionResponse.data?.collection.image && collectionResponse.data.collection.image)
            setSelectedTags(collectionResponse.data.collection.tags)
            setAllowedToEdit(allowedResponse.data)

        } catch (error) {
            console.error('Error:', error);
            setPageLoading(false)
        }
    };
    const getItems = async () => {
      try {
          setPageLoading(true)
            const itemsResponse = await axiosPrivate.get(`/items/${id}`);
            setItemsData(itemsResponse.data)
        } catch (error) {
            console.error('Error:', error);
            setItemsLoading(false)
        }
    };

    getCollection()
    getItems()
    setPageLoading(false)
    setItemsLoading(false)
  }, [axiosPrivate, id]);



const handleButtonClick = (e) => {
  setIsModalOpen(true);
};

const handleOnDelete = async () => {
  console.log(typeof(id))
  setDeleteIsLoading(true) 
  try{
    const response = await axiosPrivate.delete(`/collections/${id}`)
    if(response.statusText === "Ok"){
      message.info('Deleted Successfully')
    }
  }catch(error) {
    console.error(error)
    message.info(error);
  }
  setDeleteIsLoading(false)
  setIsModalOpen(false);
  navigate("/collections")
}

const handleCancel = () => {
  setIsModalOpen(false);
};

const items = [
  {
    label: 'Edit Collection',
    key: '1',
    icon: <EditOutlined />,
    onClick: () => setOpenEditModal(true)
  },
  {
    label: 'Add Item',
    key: '2',
    icon: <PlusOutlined />,
    onClick: () => setOpenAddItemModal(true)
  },

];
const menuProps = {
  items,
  // onClick: handleMenuClick,
};

const handleClickItem = async (itemId) => {
  try{
    const response = await axiosPrivate.get(`/items/item/${itemId}`)
    
    setSingleItem(response.data)
    if(response.status === 200) {
      setSearchParams({
        ...params,
        item: itemId
    })
      setShowItem(true)
    }
  }catch(err) {
    console.error(err)
    message.info(err);
  }
}

  return (
    pageLoading? <div>...Loading</div> : 
      collection?
      <section className="single-collection-pg-section">
        {collection && (
          <EditCollectionModal 
            openEditModal={openEditModal} 
            setOpenEditModal={setOpenEditModal} 
            collection={collection} 
            customFields={customFields}
            setCollectionImage={setCollectionImage}
            collectionImage={collectionImage}
            reqData={reqData}
            setReqData={setReqData}
            setSelectedTags={setSelectedTags}
            selectedTags={selectedTags}
          />
        )}
        {collection && (
          <AddItemModal 
            openAddItemModal={openAddItemModal}
            setOpenAddItemModal={setOpenAddItemModal}
            collection={collection}
            customFields={customFields}
            pageLoading={pageLoading}
            collectionId={id}
          />
        )}
        {collection && (
          <SingleItemModal
            collection={collection}
            allowedToEdit={allowedToEdit}
            showItem={showItem} 
            setShowItem={setShowItem}
            singleItem={singleItem}
          />
        )}
        <div className="single-collection-container">
          <div className="head-container">
            <Modal title="Are you sure you want to delete the collection?" open={isModalOpen} onOk={handleOnDelete} onCancel={handleCancel} confirmLoading={deleteisLoading} ></Modal>
            <div className="single-collection-image-container">
              <img src={collection.image} alt="collection" />
            </div>
            <div className="single-collection-info-container">
              <div className="collectio-name-h">
                <h1>{collection.name}</h1>
              </div>
              <div className="collection-creator-h">
                <h2>Collection Belongs To: {collection.ownerUsername}</h2>
              </div>
              <div className="collection-description-h">
                <span>{collection.description}</span>
              </div>
            </div>
            <ul className="collection-tags-container">
              {selectedTags?.map((tag) => {
                return <li>#{tag}</li>
              })}
            </ul>
          </div>
          {
          allowedToEdit &&
              <div className="collection-options">
                <Dropdown.Button  menu={menuProps} onClick={handleButtonClick} danger>
                  <DeleteOutlined />
                  Delete Collection
                </Dropdown.Button>
              </div>
          }
          {
            itemsLoading? <div>Loading</div> :
          <div className="items-container">
            <h2>Collection Items</h2>
            <ul className="items-ul">
              {itemsData.map(item => {
                return  <li className='items-li'
                          key={item.id}
                          style={{cursor: "pointer"}}
                        >
                          <Card
                            hoverable
                            style={{
                              width: 300,
                              border: "2px solid #f0f0f0",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center"
                            }}
                            cover={<img alt="item" src={item.imageUrl} style={{width: "98%"}} onClick={() => {handleClickItem(item.id)}} />}
                          >
                            <div style={{padding: "8px", display: "flex", justifyContent: "space-around" }}>
                              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />
                              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />
                            </div>
                          </Card>
                        </li>
              })}
            </ul>
          </div>}
        </div>
      </section> : navigate("/collections")
  ) 
}

export default SingleCollection
