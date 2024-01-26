import React, {useState} from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Checkbox, message, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const AddItemModal = ({setOpenAddItemModal, openAddItemModal, collection, customFields, pageLoading, collectionId}) => {
  const [reqData, setReqData] = useState({
    imageUrl: '',
    imageName: ''
  })
  const [fileList, setFileList] = useState([]);

  const navigate = useNavigate()

  const [form] = Form.useForm();

  const axiosPrivate = useAxiosPrivate()

  const handleOk = async () => {
    try {
      await form.validateFields();
      
      const values = await form.validateFields();
      
      const response = await axiosPrivate.post('/items', {reqData, fields: values, collectionId});
  
      if (response.status === 200 || !reqData) {
        setOpenAddItemModal(false);
        message.info('Item Added Successfully');
        setTimeout(() => {
          navigate(0)
        }, 1500);
      }
    } catch (error) {
      message.info('Please Fill required Inputs');
      console.error('Validation Error:', error);
    }
  };
  

  const onValuesChange = (changedValues, allValues) => {
    // You can do additional logic here if needed
    console.log('Changed Values:', changedValues);
    console.log('All Values:', allValues);
  };

  const handleCancel = async () => {
    
    if(reqData.image) {
      try {
        await axiosPrivate.post('/collections/image/delete', { imageName: reqData.imageName},
              {headers: {
                'Content-Type': 'application/json',
                'X-Item-Target': collection.id,
            },}
            );
        setReqData({
          ...reqData,
          imageUrl: '',
          imageName: ''
          
      })
        setFileList([]);
      } catch (err) {
        setFileList([]);
        setOpenAddItemModal(false);
        message.error('can not delete image')
        console.error('Error deleting file:', err);
      }
    }
    setOpenAddItemModal(false);
  };

  const props = {
    listType: 'image',
    maxCount: 1,
    accept: "image/png, image/jpeg, image/jpg",
    customRequest: async ({ file, onSuccess, onError }) => {
        setFileList([{ uid: '-1', name: file.name, status: 'uploading' }]);
      try {
        const response = await axiosPrivate.post('/collections/image/upload', file, {
            headers: {
                'Content-Type': 'image/png, image/jpeg, image/jpg',
                'X-Item-Target': collection.id
            },
        });

        const url = response.data.imageUrl;
        const imageName = response.data.imageName
        if(url) {
          setReqData({
            ...reqData,
            imageUrl: url,
            imageName: imageName
        })}

        setFileList([{ uid: '-1', name: imageName, status: 'done', url }]);
        onSuccess('Ok');
      } catch (err) {
        setFileList([]);
        onError('Error uploading file');
      }
    },
    onRemove: async () => {
        try {
          await axiosPrivate.post('/collections/image/delete', {imageName: fileList[0].name},
            {headers: {
              'Content-Type': 'application/json',
              'X-Item-Target': collection.id,
            }}
        );
          setReqData({
            ...reqData,
            imageUrl: '',
            imageName: ''

        })
          setFileList([]);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      },
    fileList
  };

  return (
    !pageLoading &&
    <div>
      <Modal okText={"Add"} title={`Add Item In Collection ${collection.name}`}  open={openAddItemModal} onOk={handleOk} onCancel={handleCancel}>
        <Form
        form={form}
        onValuesChange={onValuesChange}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        >
          <Form.Item label="Image" required={true}>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          {customFields.stringArray && customFields.stringArray.map((pair, index) => {
            return <Form.Item
              required={Object.keys(pair)[1]}
              key={index + 111}
              label={Object.values(pair)[0]}
              name={Object.values(pair)[0]}
              rules={[
                {
                  message: 'Please enter value',
                  required: Object.values(pair)[1] === 'required',
                },
              ]}
            >
              <Input placeholder={`enter ${Object.values(pair)[0]}`} />
          </Form.Item>
            })
          }
        
          {customFields.integerArray && customFields.integerArray.map((pair, index) => {
            return <Form.Item
              required={Object.values(pair)[1] === 'required'}
              key={index + 222}
              label={Object.values(pair)[0]}
              name={Object.values(pair)[0]}
              rules={[
                {
                  required: Object.values(pair)[1] === 'required',
                  message: 'Please enter value',
                },
              ]}
            >
              <InputNumber placeholder={`Enter ${Object.values(pair)[0]}`} />
            </Form.Item>

            }) 
          }
  
          {customFields.dateArray && customFields.dateArray.map((pair, index) => {
            return <Form.Item
              required={Object.values(pair)[1] === 'required'}
              key={index + 333}
              label={Object.values(pair)[0]}
              name={Object.values(pair)[0]}
              rules={[
                {
                  required: Object.values(pair)[1] === 'required',
                  message: 'Please select a date',
                },
              ]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder={`Select ${Object.values(pair)[0]}`}
              />
            </Form.Item>
            })
          }
        
          {customFields.checkboxArray && customFields.checkboxArray.map((pair, index) => {
            return <Form.Item
              required={Object.values(pair)[1] === 'required'}
              key={index + 444}
              label={Object.values(pair)[0]}
              name={Object.values(pair)[0]}
              valuePropName="checked"
              rules={[
                {
                  required: Object.values(pair)[1] === 'required',
                  message: 'Please check the checkbox',
                },
              ]}
            >
              <Checkbox/>
            </Form.Item>
            })
          }
        </Form>
      </Modal>
    </div>
  )
}

export default AddItemModal
