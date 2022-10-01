import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
const FormItem = Form.Item;
import axios from '@/util/Api';
import ClientForm from '@/routes/clientData/clientRegistrationForm';

const KycPage = (props) => {
    const [form] = Form.useForm();
    const [photographerType, setPhotographerType] = useState("Both");
    const [haveVehicle, setHaveVehicle] = useState("No");
    const [photographerTypeData, setPhotographerTypeData] = useState([]);
    const router = useRouter();

    const defaultFile = (!props.user) || (props.user && props.user.aadharCardFile == null) ? [] : [{
        uid: -1,
        name: 'Profile Picture',
        status: 'done',
        url: "",
    }];

    const [uploadFileList, setUploadFileList] = useState(defaultFile);
    // if(props.initialValues && props.initialValues.avatar && props.initialValues.avatar!=null && uploadFileList.length == 0){
    //     setUploadFileList(defaultFile);
    // }
    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const fetchPhotographerTypeData = () => {
        axios.get('master/photographerTypeList').then(({ data }) => {
            setPhotographerTypeData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }

    useEffect(() => {
        fetchPhotographerTypeData();
    }, [])


    const onPhotographerTypeChange = (e) => {
        setPhotographerType(e.target.value);
    }

    const onHaveVehicleChange = (e) => {
        setHaveVehicle(e.target.value);
    }

    const onFinish = values => {
        values["_id"] = props.user._id
        values["aadharCardFile"] = (uploadFileList && uploadFileList[0]) ? uploadFileList[0].originFileObj : ""

        axios.post('user/userKyc', values).then(({ data }) => {
            if (data) {
                message.success(data.message);
                router.push('/home')
            }
        })
    }
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current.valueOf() > Date.now();
    }

    const fileProps = {
        onChange(info) {
            let fileList = info.fileList;

            // 1. Limit the number of uploaded files
            fileList = fileList.slice(-1);

            // 2. read from response and show file link
            fileList = fileList.map((file) => {
                if (file.response) {
                    // Component will show file.url as link
                    file.url = file.response.url;
                }
                return file;
            });
            setUploadFileList(fileList);
        }
    };

    return (
        <Card className="gx-card" title="Complete Your KYC">
            <Form form={form} name="userKyc" onFinish={onFinish} scrollToFirstError initialValues={props.user} encType={'multipart/form-data'}>
                <Row gutter={[60, 0]}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="firstName"
                            rules={[{ required: true, message: 'First name required' }]}
                            label="First Name">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="lastName"
                            rules={[{ required: true, message: 'Last name required' }]}
                            label="Last Name">
                            <Input />
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={[60, 0]}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="emailId"
                            label="Email"
                            rules={[{ type: 'email', message: 'Not a valid Email' }, { required: false, message: 'Email is required' }]}
                        ><Input />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="mobileNumber"
                            label="Mobile Number"
                            rules={[{ required: false, pattern: new RegExp(/^\d{10,10}$/), message: "Enter 10 digit mobile number!" }]}
                        ><Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[60, 0]}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="whatsappNumber"
                            label="Whatsapp Number"
                            rules={[{ required: false, pattern: new RegExp(/^\d{10,10}$/), message: "Enter 10 digit Whatsapp number!" }]}
                        ><Input />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="dateOfBirth"
                            label="Date of Birth">
                            <DatePicker
                                disabledDate={disabledDate}
                                format='DD-MM-YYYY' style={{ width: "99%" }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[60, 0]}>

                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item name="photographerType" label="Photographer Type" rules={[{ required: true, message: "Photographer Type is required!" }]}>

                            <Select
                                mode='multiple'
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Select Photographer Type"
                            >
                                {
                                    photographerTypeData.length > 0 && photographerTypeData.map((photographerType) => {
                                        return <Option value={photographerType.photographerTypeName} key={photographerType._id}>{photographerType.serviceName}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="totalExperience"
                            label="Total Experience">
                            <Input />
                        </Form.Item>
                    </Col>

                </Row>

                <Row gutter={[60, 0]}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="address"
                            label="Address">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={24}>
                        <Form.Item
                            name="city"
                            label="City">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={24}>
                        <Form.Item
                            name="state"
                            label="State">
                            <Input />
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={[60, 0]}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="aadharNo"
                            label="Aadhar Number"
                            rules={[{ pattern: new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"), message: "Enter Valid Aadhar number!", required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    {/* <Col lg={12} md={12} sm={12} xs={24}>

                        <Upload {...fileProps} fileList={uploadFileList} customRequest={dummyRequest} beforeUpload={beforeUpload}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Col> */}
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="panNo"
                            label="Pan Number"
                            rules={[{ pattern: new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}"), message: "Enter Valid PAN number!", required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item name="haveVehicle" label="Do you have any Vehicle?" rules={[{ required: true, message: "Vehicle Type is required!" }]}>
                            <Radio.Group onChange={(e) => onHaveVehicleChange(e)} value={haveVehicle}>
                                <Radio value="Yes">Yes</Radio>
                                <Radio value="No">No</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    {
                        haveVehicle === "Yes" && (
                            <>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item
                                        name="vehicleType"
                                        label="Vehicle Type"
                                        rules={[{ required: true, message: 'Opposite Studio required' }]}>
                                        <Select
                                            showSearch
                                            placeholder="Select Vehicle Type"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            <Option value="Two Wheeler">Two Wheeler</Option>
                                            <Option value="Four Wheeler">Four Wheeler</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item
                                        name="licenseNumber"
                                        label="License Number">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </>
                        )
                    }
                </Row>
                <Form.Item className="gx-text-center">
                    <Button type="primary" htmlType="submit"
                        // disabled={(props.user.approved)}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default Page(KycPage);
