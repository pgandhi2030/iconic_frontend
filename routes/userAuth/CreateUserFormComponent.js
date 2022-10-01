import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';
import moment from 'moment';

const CreateUserFormComponent = (props) => {
    const [form] = Form.useForm();
    const [photographerType, setPhotographerType] = useState("Both");
    const [haveVehicle, setHaveVehicle] = useState("No");
    const [photographerTypeData, setPhotographerTypeData] = useState([]);
    const [roleData, setRoleData] = useState([]);

    const router = useRouter();

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };


    const fetchPhotographerTypeData = () => {
        axios.get('master/photographerTypeList').then(({ data }) => {
            setPhotographerTypeData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }

    const fetchRoleData = () => {
        axios.get('user/roles').then(({ data }) => {
            setRoleData(data)
        }).catch(function (error) {
            console.log(error)
            message.error("Something went wrong!");
        });
    }

    useEffect(() => {
        fetchPhotographerTypeData();
        fetchRoleData()
    }, [])

    useEffect(() => {
        form.setFieldsValue(props.initialValues)

    }, [form, props.initialValues])

    const onPhotographerTypeChange = (e) => {
        setPhotographerType(e.target.value);
    }

    const onHaveVehicleChange = (e) => {
        setHaveVehicle(e.target.value);
    }

    const onFinish = values => {
        if (props.requestUserId) {
            values['_id'] = props.requestUserId;
        }
        values['kycDone'] = true;
        values['approved'] = true;
        values['approvedAt'] = moment();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        console.log(formData)
        axios.post('user/createUser', values).then(({ data }) => {
            if (data) {
                message.success("User Created Successfully");
                router.back()
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
        <Form form={form} name="userKyc" onFinish={onFinish} scrollToFirstError initialValues={props.initialValues} encType={'multipart/form-data'}>
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



                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="emailId"
                        label="Email"
                        rules={[{ type: 'email', message: 'Not a valid Email' }, { required: true, message: 'Email is required' }]}
                    ><Input />
                    </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="mobileNumber"
                        label="Mobile Number"
                        rules={[{ required: true, pattern: new RegExp(/^\d{10,10}$/), message: "Enter 10 digit mobile number!" }]}
                    ><Input />
                    </Form.Item>
                </Col>


                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="whatsappNumber"
                        label="Whatsapp Number"
                        rules={[{ required: false, pattern: new RegExp(/^\d{10,10}$/), message: "Enter 10 digit Whatsapp number!" }]}
                    ><Input />
                    </Form.Item>
                </Col>

                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Gender is required!" }]}>
                        <Radio.Group>
                            <Radio value="male">Male</Radio>
                            <Radio value="female">Female</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                {
                    !props.initialValues &&
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="password"
                            label="Create Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    pattern: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{7,})\S$/,
                                    message: 'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number',
                                }
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder='Create password' />
                        </Form.Item>
                    </Col>
                }
                {/* <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        label="Confirm Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('The two passwords that you entered do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirm Password" />
                    </Form.Item>
                </Col> */}
                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="dateOfBirth"
                        label="Date of Birth">
                        <DatePicker
                            disabledDate={disabledDate}
                            format='DD-MM-YYYY' style={{ width: "99%" }} />
                    </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item name="role" label="Role" rules={[{ required: true, message: "Role is required!" }]}>

                        <Select
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Select Role"
                        >
                            {
                                roleData.length > 0 && roleData.map((role) => {
                                    return <Option value={role.roleName} key={role._id}>{role.roleName}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>

                {/* <Col lg={12} md={12} sm={12} xs={24}>
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
                </Col> */}
                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="totalExperience"
                        label="Total Experience">
                        <Input />
                    </Form.Item>
                </Col>

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


                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="aadharNo"
                        label="Aadhar Number"
                        rules={[{ pattern: new RegExp("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$"), message: "Enter Valid Aadhar number! (Format: xxxx xxxx xxxx)", required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="aadharFile"
                        label="Aadhar FIle">
                        <Input type="file" onChange={saveFile} />
                    </Form.Item>
                </Col>
                <Col lg={12} md={12} sm={12} xs={24}>
                    <Form.Item
                        name="panNo"
                        label="Pan Number"
                        rules={[{ pattern: new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}"), message: "Enter Valid PAN number! ex. ALWPG5809L", required: true }]}
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
                {
                    !props.fromProfile &&
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item name="isActive" label="Is Active?" rules={[{ required: true, message: "Is Active is required!" }]}>
                            <Radio.Group>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
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
    )

}

export default CreateUserFormComponent;