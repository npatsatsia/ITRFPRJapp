import React, {useState} from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { UploadOutlined } from '@ant-design/icons';
import { 
    Modal,
    Button,
    Form,
    Input,
    Select,
    Upload,
    Row,
    Col } from 'antd';
import { useNavigate } from 'react-router-dom';

    const { TextArea } = Input;


const AddCollectionModal = ({open, setOpen, categories}) => {

    // const [confirmLoading, setConfirmLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [reqData, setReqData] = useState({
        name: '',
        description: '',
        categoryId: '',
        image: '',
        tags: [],
        customFields: {}
    });

    const axiosPrivate = useAxiosPrivate()

    const navigate = useNavigate()

    const props = {
        listType: 'picture',
        maxCount: 1,
        accept: "image/png, image/jpeg, image/jpg",
        customRequest: async ({ file, onSuccess, onError }) => {
            setFileList([{ uid: '-1', name: file.name, status: 'uploading' }]);
          try {
            const response = await axiosPrivate.post('/collections/image/upload', file, {
                headers: {
                    'Content-Type': 'image/png, image/jpeg, image/jpg',
                    'X-Collection-ID': null,
                    'X-Collection-Target': 'main_images',
                },
                withCredentials: true
            });
  
            const url = response.data.imageUrl;
            const imageName = response.data.imageName
            if(url) {
              setReqData({
                ...reqData,
                image: url,
            })}
  
            setFileList([{ uid: '-1', name: imageName, status: 'done', url,  }]);
            onSuccess('Ok');
          } catch (err) {
            setFileList([]);
            onError('Error uploading file');
          }
        },
        onRemove: async () => {
            try {
              await axiosPrivate.post('/collections/image/delete', { imageName: fileList[0].name},
              {headers: {
                'Content-Type': 'application/json',
                'X-Collection-Target': "add collection",
            },}
            );
              setReqData({
                ...reqData,
                image: '',
            })
              setFileList([]);
            } catch (err) {
              console.error('Error deleting file:', err);
            }
          },
        fileList
      };

    const handleOk = async (e) => {
    e.preventDefault()

    await axiosPrivate.post('/collections', reqData)
    .then(response => response.status === 200 && navigate(0))
    .catch(error => console.error(error));
    };

    const handleCancel = () => {
    setOpen(false);
    };

    const handleInputChange = (field, value) => {
      if (field.startsWith("custom_")) {
        console.log(value)
        if (value === undefined) {
          // If the value is undefined, remove the field from reqData
          const fieldNameParts = field.split('_');
          const fieldType = fieldNameParts[1]; // Extract the field type (e.g., string, number, etc.)
          const fieldIndex = parseInt(fieldNameParts[2]) - 1; // Extract the field index
    
          setReqData(prevState => {
            const newCustomFields = { ...prevState.customFields };
            delete newCustomFields[field];
            
            // Remove the corresponding custom field from the state based on field type and index
            if (fieldType === "string") {
              const newTextFields = [...prevState.customFields.text];
              newTextFields.splice(fieldIndex, 1);
              return { ...prevState, customFields: { ...prevState.customFields, text: newTextFields } };
            }
            // Handle other field types if needed
    
            return { ...prevState, customFields: newCustomFields };
          });
        } else {
          // Otherwise, update the field in reqData
          setReqData(prevState => ({
            ...prevState,
            customFields: {
              ...prevState.customFields,
              [field]: value,
            },
          }));
        }
      } else {
        setReqData(prevState => ({
          ...prevState,
          [field]: value,
        }));
      }
    };
    


  return (
    <Modal
                width={850}
                title="Create Collection"
                open={open}
                onOk={handleOk}
                okText={"Submit"}
                // confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
            <>
              <Form
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
                <Form.Item label="Collection Name" required={true}>
                    <Input onChange={e => handleInputChange("name", e.target.value)} />
                </Form.Item>
                <Form.Item label="Select Category" required={true}>
                  <Select onChange={(value) => handleInputChange("categoryId", value)} required>
                      {categories.map(category => {
                          return <Select.Option key={category.id} value={category.id}>{category.categoryName}</Select.Option>
                          })}
                  </Select>
                </Form.Item>
                <Form.Item label="Description" required={true}>
                    <TextArea rows={4} onChange={e => handleInputChange("description", e.target.value)}/>
                </Form.Item>
                <Form.Item label="Upload Image" required={false}>
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                </Form.Item>
                <h3 style={{ padding: "0 0 20px 10px", color: "gray" }}>Specified Fields For Each Item (optional)</h3>
                <h4 style={{ padding: "0 0 13px 10px"}}>Text Fields</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_string1_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_string1_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_string1_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_string1_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_string2_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_string2_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_string2_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_string2_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_string3_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_string3_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_string3_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_string3_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <h4 style={{ padding: "0 0 13px 10px"}}>Number Fields</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_integer1_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing integer Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_integer1_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_integer1_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_integer1_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_integer2_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_integer2_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_integer2_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_integer2_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_integer3_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_integer3_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_integer3_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_integer3_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <h4 style={{ padding: "0 0 20px 10px"}}>Date Fields</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_date1_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing date Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_date1_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_date1_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_date1_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_date2_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_date2_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_date2_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_date2_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_date3_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_date3_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_date3_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_date3_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <h4 style={{ padding: "0 0 20px 10px"}}>Checkbox Fields</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_checkbox1_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing checkbox Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_checkbox1_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_checkbox1_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_checkbox1_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_checkbox2_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_checkbox2_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_checkbox2_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_checkbox2_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="custom_checkbox3_name"
                      rules={[
                        {
                          required: true,
                          message: 'Missing Field Name',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Field Name"
                        onChange={(e) => handleInputChange('custom_checkbox3_name', e.target.value)}
                        style={{ width: '100%' }}
                        required
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="custom_checkbox3_state"
                    >
                      <Select
                        placeholder="Optional Type"
                        onChange={(value) => handleInputChange('custom_checkbox3_state', value)}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="required">Required</Select.Option>
                        <Select.Option value="optional">Optional</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </>
            </Modal>
  )
}

export default AddCollectionModal
