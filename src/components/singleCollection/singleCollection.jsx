import React, { useEffect, useState } from 'react'
import './index.css'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { Dropdown, message, Modal } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import EditCollectionModal from './editCollectionModal';
import AddItemModal from './addItemModal';
import SingleItemModal from '../singleItem';

const SingleCollection = () => {
  const [collection, setCollection] = useState({})
  const [itemsData, setItemsData] = useState([])
  const [customFields, setCustomFields] = useState({})
  const [allowedToEdit, setAllowedToEdit] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteisLoading, setDeleteIsLoading] = useState(false)
  const [collectionImage, setCollectionImage] = useState('url')
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
    label: 'Edit Collections',
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
                <h2>Collection Belongs To: {collection.name}</h2>
              </div>
              <div className="collection-description-h">
                <span>{collection.description}</span>
              </div>
            </div>
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
                          onClick={() => {handleClickItem(item.id)}}
                          style={{cursor: "pointer"}}
                        >
                        <div className="single-item-container">
                          <img src={item.imageUrl} alt="" />
                          <div className="overlay">
                            <span>50 likes</span>
                            <span>50 comments</span>
                          </div>
                        </div>
                      </li>
              })}
            </ul>
          </div>}
        </div>
      </section> : navigate("/collections")
  ) 
}

export default SingleCollection
