import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useSearchParams } from 'react-router-dom';


const SingleItemModal = ({
    collection,
    singleItem, 
    showItem, 
    setShowItem, 
    allowedToEdit
  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams()

  const params = Object.fromEntries([...searchParams]);


  const handleCancel = () => {
    console.log(params, searchParams)
    setSearchParams({
      item: ''
  })
    setShowItem(false);
  };
  return (
      <Modal width={1200} title="" open={showItem} onOk={() => setShowItem(false)} onCancel={handleCancel}>
        <div className="single-item-container">
          <h1>{collection?.name}</h1>
          <div className="item-image-container">
            <img src={singleItem.imageUrl} alt="item image" />
          </div>
          <div className="items-common-description">
            <span>{collection?.description}</span>
          </div>
          <div className="item-fields-container">

          </div>
        </div>
      </Modal>
  );
};
export default SingleItemModal;
