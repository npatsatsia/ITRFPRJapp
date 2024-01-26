import React, { useEffect, useState } from "react"
import './index.css'
import { UploadOutlined } from '@ant-design/icons';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import api from '../../api/axios'
import noImage from '../../static/images/no-image.avif'
import { 
    Modal,
    Button,
    Form,
    Input,
    Select,
    Upload,
    Card,
    message
  } from 'antd';
import { useNavigate } from "react-router-dom";

  const { TextArea } = Input;
  

const EditCollectionModal = (
  {
  openEditModal, 
  setOpenEditModal, 
  collection,
  setCollectionImage,
  collectionImage,
  reqData,
  setReqData
}
) => {

const [confirmLoading, setConfirmLoading] = useState(false);
const [categories, setCategories] = useState([])
const [fileList, setFileList] = useState([]);
const [uploadLoading, setUploadLoading] = useState(false)


const navigate = useNavigate()
const axiosPrivate = useAxiosPrivate()

const [form] = Form.useForm();

useEffect(() => {
  const getCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  getCategories();
}, []);

const handleOk = async (e) => {
  e.preventDefault();

  try {

    if (!reqData?.name || !reqData?.categoryId || !reqData?.description) {
      console.error('Required fields are not filled.');
      return;
    }

    setConfirmLoading(true);
    const response = await axiosPrivate.put('/collections', reqData)

    if (response.statusText === "Ok" || !reqData) {
      setConfirmLoading(false);
      message.info('Item Added Successfully');
    }
    setTimeout(() => {
      setConfirmLoading(false);
      setOpenEditModal(false);
      navigate(0)
    }, 2000);
  } catch (error) {
    message.info('Please Fill required Inputs');
    console.error('Validation Error:', error);
  }
};


  const handleCancel = () => {
  setOpenEditModal(false);
};



const props = {
    listType: 'picture',
    maxCount: 1,
    accept: "image/png, image/jpeg, image/jpg",
    customRequest: async ({ file, onSuccess, onError }) => {
        setFileList([{ uid: '-1', name: file.name, status: 'uploading' }]);
        setUploadLoading(true)
    try {
        const response = await axiosPrivate.post('/collections/image/upload', file, {
            headers: {
                'Content-Type': 'image/png, image/jpeg, image/jpg',
                'X-Collection-ID': collection.id,
                'X-Collection-Target': 'main_images',
            },
        });

        let url = response.data.imageUrl;
        let imageName = response.data.imageName
        if(url) {
          setCollectionImage(url)
        setReqData({
            ...reqData,
            image: url,
        })
        }

        setFileList([{ uid: '-1', name: imageName, status: 'done', url }]);
        setUploadLoading(false)
        onSuccess('Ok');
    } catch (err) {
        setFileList([]);
        setUploadLoading(false)
        onError('Error uploading file');
    }
    },
    fileList,
};

const getFilenameFromUrl = (url)=> {
  var urlObj = new URL(url);
  
  var pathname = urlObj.pathname;
  
  var parts = pathname.split('/');
  
  var filename = parts[parts.length - 1];
  
  return filename;
}

const deleteCollectionImage = async (collectionImage) => {
  getFilenameFromUrl(collectionImage)
  try {
    await axiosPrivate.post('/collections/image/delete', {imageName: fileList[0]?.name ? fileList[0]?.name : getFilenameFromUrl(collectionImage)},
      {headers: {
        'Content-Type': 'application/json',
        'X-Collection-Target': collection.id,
      }}
    );
    setCollectionImage('url')
    setReqData({
        ...reqData,
        image: '',
    })
    setFileList([]);
  } catch (err) {
  console.error('Error deleting file:', err);
  }
}

const handleInputChange = (field, value) => {
  setReqData({
      ...reqData,
      [field]: value,
  });
};


///  roca vshlit databazidanac ro cavshalot aitemis fotoebic da main fotoc





  return (
    <div className='edit-collection-modal-container'>
    <Modal
            width={850}
            title="Edit Collection"
            open={openEditModal}
            onOk={handleOk}
            okText={"Submit"}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
        >
        <>
          <Form
              form={form}
              labelCol={{
              span: 4,
              }}
              wrapperCol={{
              span: 14,
              }}
              layout="horizontal"
              style={{
              maxWidth: 800,
              }}
          >
            <Form.Item label="Collection Name">
                <Input
                  value={reqData?.name ? reqData.name : collection.name} 
                  onChange={e => handleInputChange("name", e.target.value)} />
            </Form.Item>
            <Form.Item label="Select Category">
            <Select
              value={
                categories.find((category) => category.id === collection.categoryId)?.categoryName
              }
              // value={categories.find((category) => category.id === reqData.categoryId)?.categoryName}
              onChange={(value) => handleInputChange("categoryId", value)}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.categoryName}
                </Select.Option>
              ))}
            </Select>
            </Form.Item>
            <Form.Item  label="Description" >
                <TextArea 
                  value={reqData?.description ? reqData.description : collection.description} 
                  rows={4} 
                  onChange={e => handleInputChange("description", e.target.value)}/>
            </Form.Item>
            <Form.Item label="Upload Image">
                <Card
                    style={{
                    padding: 0
                    }}
                >
                    <img src={collectionImage.length > 5 ? collectionImage : reqData?.image ? reqData.image : noImage} style={{width: "100%", height: "100%", objectFit: "contain"}} alt="" />
                </Card>
                <Upload {...props} fileList={fileList}>
                    <Button
                      style={{marginTop: 18}} 
                      icon={<UploadOutlined />} 
                      disabled={collectionImage.length > 5 || uploadLoading || reqData?.image}>
                        Upload
                    </Button>
                </Upload>
                <br />
                <Button
                  type="primary" 
                  danger
                  ghost 
                  onClick={() => deleteCollectionImage(collectionImage)}
                  disabled={uploadLoading || !collectionImage || reqData?.image}>
                    Delete
                </Button>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </div>
  )
}

export default EditCollectionModal



