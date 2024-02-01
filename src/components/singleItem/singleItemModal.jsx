import React from 'react';
import { Modal, Checkbox } from 'antd';
import './index.css'
// import { useSearchParams } from 'react-router-dom';


const SingleItemModal = ({
    collection,
    singleItem, 
    showItem, 
    setShowItem, 
    // allowedToEdit
  }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [searchParams, setSearchParams] = useSearchParams()

  // const params = Object.fromEntries([...searchParams]);


  const handleCancel = () => {
  //   setSearchParams({
  //     item: ''
  // })
  console.log(singleItem)
    setShowItem(false);
  };
  return (
      <Modal width={1200} open={showItem} onOk={() => setShowItem(false)} onCancel={handleCancel}>
        <div className="single-item-container">
          <div className="item-image-container">
            <img src={singleItem.imageUrl} alt="item" />
          </div>
          <div className="item-fields-container">
            {singleItem?.fields &&
              Object.entries(singleItem.fields).map(([key, value]) => (
                <div key={key} className="field" style={value.length > 20 ? { display: "flex", flexDirection: "column" } : {}} >
                  <b className="field-key">{typeof(value) === "boolean" ? key : key + ": "}</b>
                  <span className="field-value">{value} {typeof(value) === "boolean" && <Checkbox checked/>}</span>
                </div>
              ))}
          </div>
        </div>
      </Modal>
  );
};
export default SingleItemModal;
