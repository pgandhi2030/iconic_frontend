import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";
import { useRouter } from "next/router";
import axios from '@/util/Api';
import moment from 'moment';


const ClientForm = (props) => {
    const [form] = Form.useForm();
    const [photographyType, setPhotographyType] = useState("Both");
    const router = useRouter();

    const onFinish = async fieldsValue => {
        if (props.requestUserId) {
            fieldsValue['_id'] = props.requestUserId;
        }
        axios.post('client/registration', fieldsValue).then(({ data }) => {
            message.success(data.message);
            router.back()
        }).catch(function (error) {

            message.error("Something went wrong!" + error);

        });
    }
    const onPhotographyTypeChange = (e) => {
        setPhotographyType(e.target.value);
    }

    useEffect(() => {
        if (props.initialValues) {
            setPhotographyType(props.initialValues.photographyType)
        }
        form.setFieldsValue(props.initialValues)

    }, [form, props.initialValues])

    const disabledDate = current => {
        // Can not select days before today and today
        return current && current <= moment().subtract('1','day');
    };

    return (
        <Card className="gx-card" title="Registration">
            <Form form={form} name="createUsers" onFinish={onFinish} scrollToFirstError initialValues={props.initialValues} encType={'multipart/form-data'}>
                <Row gutter={[60, 0]}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="groomName"
                            rules={[{ required: true, message: 'Groom Full name required' }]}
                            label="Groom Name">
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="brideName"
                            rules={[{ required: true, message: 'Bride Full name required' }]}
                            label="Bride Name">
                            <Input />
                        </Form.Item>
                    </Col>

                </Row>
                <Row gutter={[60, 0]}>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="eventDate"
                            label="Event Date">
                            <DatePicker
                                format='DD-MM-YYYY'
                                style={{ width: "99%" }}
                                disabledDate={disabledDate} />
                        </Form.Item>
                    </Col>

                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item name="photographyType" label="Photography Type" rules={[{ required: true, message: "Photography Type is required!" }]}>
                            <Radio.Group onChange={(e) => onPhotographyTypeChange(e)} value={photographyType}>
                                <Radio value="Both">Both</Radio>
                                <Radio value="Bride Side">Bride Side</Radio>
                                <Radio value="Groom Side">Groom Side</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    {
                        photographyType != "Both" && (
                            <>
                                <Col lg={12} md={12} sm={12} xs={24}>
                                    <Form.Item
                                        name="oppositeStudioName"
                                        label="Opposite Studio name"
                                        rules={[{ required: true, message: 'Opposite Studio required' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </>
                        )
                    }


                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ type: 'email', message: 'Not a valid Email' }, { required: false, message: 'Email is required' }]}
                        ><Input />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="mobile_number"
                            label="Mobile Number"
                            rules={[{ required: false, pattern: new RegExp(/^\d{10,10}$/), message: "Enter 10 digit mobile number!" }]}
                        ><Input />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="referenceBy"
                            label="Reference By"
                        ><Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item className="gx-text-center">
                    <Button type="primary" htmlType="submit" >

                        {/* loading={createUpdateUserLoading}> */}
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default ClientForm;
