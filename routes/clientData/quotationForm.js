import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, Divider, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";
import { useRouter } from "next/router";
import axios from '@/util/Api';
import { DeleteFilled, PlusOutlined, InfoCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import PhotographerTypesComponent from './PhotographerTypesComponent';

const QuotationForm = (props) => {
    const [form] = Form.useForm();
    const [photographyType, setPhotographyType] = useState("Both");
    const router = useRouter();

    const [complimentaryServiceData, setComplimentaryServicesData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [photographerTypeData, setPhotographerTypeData] = useState([]);
    let ids = [];
    let paymentIds = [];
    let serviceIds = [];

    const fetchServiceData = () => {
        axios.get('master/servicesList').then(({ data }) => {
            setServiceData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }
    const fetchPhotographerTypeData = () => {
        axios.get('master/photographerTypeList').then(({ data }) => {
            setPhotographerTypeData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }

    const fetchComplimentaryServicesData = () => {
        axios.get('master/complimentaryServiceList').then(({ data }) => {
            setComplimentaryServicesData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }

    const onFinish = async fieldsValue => {
        // if (props.requestUserId) {
        //     fieldsValue['_id'] = props.requestUserId;
        // }
        fieldsValue['clientId'] = router.query.id
        axios.post('client/createQuotation', fieldsValue).then(({ data }) => {
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


    useEffect(() => {
        fetchServiceData();
        fetchPhotographerTypeData();
        fetchComplimentaryServicesData();
    }, [])

    useEffect(() => {

    }, [photographerTypeData])

    const calculatePaymentPlanData = () => {
        const formData = form.getFieldsValue()
        const paymentPlan = []
        let finalAmount = 0
        if (formData['finalAmount'] && formData['discount']) {
            finalAmount = formData['finalAmount'] - formData['discount']
        }
        paymentPlan.push({
            amount: (finalAmount * 30) / 100,
            phaseName: "Advance Payment to Freeze Event Dates"
        })
        paymentPlan.push({
            amount: (finalAmount * 50) / 100,
            phaseName: "10-20 Days Prior to event"
        })
        paymentPlan.push({
            amount: (finalAmount * 20) / 100,
            phaseName: "On submission of Pictures And After Movie"
        })

        form.setFieldsValue({ ...formData, paymentPlan: paymentPlan })

    }
    const disabledDate = current => {
        // Can not select days before today and today
        return current && current <= moment().subtract('1', 'day');
    };

    const photographerChange = (index, index2) => {
        const formData = form.getFieldsValue()
        formData.eventDetails[index].photographerTypes.map((type, i) => {
            if (i != index2) {
                if (type['photographerType'] == formData.eventDetails[index].photographerTypes[index2].photographerType) {
                    message.warning("Please select other photographer type.")
                    formData.eventDetails[index].photographerTypes[index2].photographerType = null
                    formData.eventDetails[index].photographerTypes[index2].requiredPhotographers = null
                    form.setFieldsValue({ ...formData })
                }
            }
        })
    }

    const serviceChange = (index) => {
        const formData = form.getFieldsValue()
        let flag = true
        formData.services.map((service, i) => {
            if (i != index) {
                if (service["serviceName"] == formData['services'][index].serviceName) {
                    message.warning("Please select other service.")
                    flag = false;
                    formData['services'][index].serviceName = null
                    formData['services'][index].deliveryTime = null
                    form.setFieldsValue({ ...formData })
                }
            }
        })
        if (flag) {
            if (!formData['services'][index].deliveryTime || props.initialValues.type == "Edit") {
                const time = serviceData.find(a => a._id == formData['services'][index].serviceName).estimatedTime
                formData['services'][index].deliveryTime = time
                form.setFieldsValue({ ...formData })
            }
        }

    }
    return (
        <Card className="gx-card" title="Create Quotation">
            <Form form={form} name="createUsers" onFinish={onFinish} scrollToFirstError initialValues={props.initialValues} encType={'multipart/form-data'}>
                <Row gutter={[60, 0]}>

                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Form.Item
                            name="title"
                            label="Quotation Title"
                            rules={[{ required: true, message: 'Quotation Title is required' }]}
                        ><Input />
                        </Form.Item>
                        <Form.Item
                            name='type'
                            noStyle
                        ><Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            name='quotationId'
                            noStyle
                        ><Input type="hidden" />
                        </Form.Item>
                    </Col>
                </Row>
                <Card type="inner" title="Event Details" style={{ "borderColor": "#FDCD01" }}>
                    <Form.List name="eventDetails">
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <div key={["shift_", field.key]}>
                                        <Divider>Event {index + 1}</Divider>

                                        <Row gutter={[60, 0]}>
                                            <Col lg={12} md={12} sm={12} xs={24}>
                                                <Form.Item
                                                    name={[index, "eventDateTime"]}
                                                    label="Event Date And Time"
                                                >
                                                    <DatePicker
                                                        format="YYYY-MM-DD HH:mm"
                                                        showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
                                                        style={{ width: "99%" }}
                                                        disabledDate={disabledDate}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={12} md={12} sm={12} xs={24}>
                                                <Form.Item
                                                    name={[index, "eventPlace"]}
                                                    label="Event Place"
                                                    rules={[{ required: true, message: 'Event Place is required' }]}>
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={12} md={12} sm={12} xs={24}>
                                                <Form.Item
                                                    name={[index, "eventDescription"]}
                                                    label="Event Description"
                                                    rules={[{ required: true, message: 'Event Description is required' }]}>
                                                    <Input />
                                                </Form.Item>
                                            </Col>

                                        </Row>
                                        <Card type="inner" title="Event Photographer Types" style={{ "borderColor": "#e7538f" }}>

                                            {/* <PhotographerTypesComponent fieldKey={field.name} photographerTypeData={photographerTypeData} /> */}
                                            <Form.List name={[field.name, "photographerTypes"]}>
                                                {(photographerTypeFields, { add, remove }) => (
                                                    <>
                                                        {photographerTypeFields.map(field2 => (
                                                            <div key={[field2.fieldKey, 'photographerTypes']}>
                                                                <Row key={field2.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                                                    <Col lg={11} md={11} sm={11} xs={24}>
                                                                        <Form.Item
                                                                            name={[field2.fieldKey, "photographerType"]}
                                                                            label="Photographer Type"
                                                                            rules={[{ required: true, message: "Photographer Type is required!" }]}>
                                                                            <Select
                                                                                allowClear
                                                                                style={{ width: '100%' }}
                                                                                placeholder="Select Photographer Type"
                                                                                onChange={() => photographerChange(index, field2.fieldKey)}
                                                                            >
                                                                                {
                                                                                    photographerTypeData.length > 0 && photographerTypeData.map((photographerType) => {
                                                                                        return <Option value={photographerType.photographerTypeName} key={photographerType._id}>{photographerType.serviceName}</Option>
                                                                                    })

                                                                                }
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col lg={11} md={11} sm={11} xs={24}>
                                                                        <Form.Item
                                                                            name={[field2.fieldKey, "requiredPhotographers"]}
                                                                            label="Number Of Photographers "
                                                                            rules={[{ required: true, message: 'Number Of Photographers  is required' }]}>
                                                                            <Input />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col lg={2} md={2} sm={24} xs={24} className="gx-text-right">
                                                                        {fields.length > 0 ? (
                                                                            <DeleteFilled onClick={() => remove(field2.name)} style={{ "fontSize": 25, "color": "red" }} />
                                                                        ) : null}
                                                                    </Col>
                                                                </Row>
                                                                <Divider />
                                                            </div>
                                                        ))}
                                                        <Row>
                                                            <Col lg={2} md={2} sm={0} xs={0}>

                                                            </Col>
                                                            <Col lg={20} md={20} sm={24} xs={24}>
                                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                    Add PhotographerType
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </Form.List>

                                        </Card>
                                        <Row gutter={[60, 0]}>

                                            {
                                                (fields.length > 1 && ids[field.fieldKey] != null) ?
                                                    <Col lg={24} md={24} sm={24} xs={24} className="gx-text-right">
                                                        <Tooltip title="You cannot delete already created events" placement="leftBottom">
                                                            <InfoCircleFilled className="gx-text-primary" />
                                                        </Tooltip>
                                                    </Col>
                                                    :
                                                    ((fields.length > 1 && ids[field.fieldKey] == undefined) ?
                                                        <Col lg={24} md={24} sm={24} xs={24} className="gx-text-right">
                                                            <DeleteFilled onClick={() => remove(field.name)} style={{ "fontSize": 25, "color": "red" }} />
                                                        </Col>
                                                        :
                                                        null
                                                    )
                                            }
                                        </Row>
                                        <Divider />
                                    </div>
                                ))}
                                {
                                    <Row>
                                        <Col span={3}>

                                        </Col>
                                        <Col span={16}>
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    style={{ width: '100%' }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    Add Event
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                }
                            </>
                        )}
                    </Form.List>
                </Card>
                <Card type="inner" title="Services" style={{ "borderColor": "#C2D136" }}>
                    <Form.List name="services">
                        {(serviceFields, { add, remove }, { errors }) => (
                            <>
                                {serviceFields.map((field, index) => (
                                    <div key={["shift_", field.key]}>

                                        <Row gutter={[60, 0]}>
                                            <Col lg={12} md={12} sm={12} xs={24}>
                                                <Form.Item
                                                    name={[index, "serviceName"]}
                                                    label="Service"
                                                    rules={[{ required: true, message: 'Service is required' }]}
                                                >
                                                    {/* <Input /> */}
                                                    <Select
                                                        allowClear
                                                        style={{ width: '100%' }}
                                                        placeholder="Select Service"
                                                        onChange={() => serviceChange(index)}
                                                    >

                                                        {
                                                            serviceData.length > 0 && serviceData.map((service) => {
                                                                return <Option value={service._id} key={service._id}>{service.serviceName}</Option>
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>

                                            </Col>
                                            <Col lg={12} md={12} sm={12} xs={24}>
                                                <Form.Item
                                                    name={[index, "deliveryTime"]}
                                                    label="Estimate Delivery Time"
                                                    rules={[{ required: true, message: 'Estimate Delivery Time' }]}
                                                ><Input />
                                                </Form.Item>
                                            </Col>
                                            {
                                                (serviceFields.length > 1 && serviceIds[field.fieldKey] != null) ?
                                                    <Col lg={24} md={24} sm={24} xs={24} className="gx-text-right">
                                                        <Tooltip title="You cannot delete already created services" placement="leftBottom">
                                                            <InfoCircleFilled className="gx-text-primary" />
                                                        </Tooltip>
                                                    </Col>
                                                    :
                                                    ((serviceFields.length > 1 && serviceIds[field.fieldKey] == undefined) ?
                                                        <Col lg={24} md={24} sm={24} xs={24} className="gx-text-right">
                                                            <DeleteFilled onClick={() => remove(field.name)} style={{ "fontSize": 25, "color": "red" }} />
                                                        </Col>
                                                        :
                                                        null
                                                    )
                                            }
                                        </Row>
                                        <Divider />
                                    </div>
                                ))}
                                {
                                    <Row>
                                        <Col span={3}>

                                        </Col>
                                        <Col span={16}>
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    style={{ width: '100%' }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    Add Services
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                }
                            </>
                        )}
                    </Form.List>
                </Card>
                <Row gutter={[60, 0]}>


                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="complimentaryService"
                            label="Complimentary Service"
                            rules={[{ required: true, message: "Complimentary Service is required" }]}
                        ><Select
                            mode="tags"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Add multiple complementary Services"
                        // onChange={handleChange}
                        >
                                {
                                    complimentaryServiceData.length > 0 && complimentaryServiceData.map((complimentaryService) => {
                                        return <Option value={complimentaryService.complimentaryServiceName} key={complimentaryService._id}>{complimentaryService.serviceName}</Option>
                                    })

                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="eventManagedBy"
                            label="Event Managed By"
                            rules={[{ required: true, message: "Event Managed By is required" }]}
                        ><Input />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="finalAmount"
                            label="Final Amount"
                            rules={[{ required: true, pattern: new RegExp(/^\d+(\.\d{1,2})?$/), message: "Enter only number!" }]}
                        >
                            <Input
                                onBlur={calculatePaymentPlanData} />
                        </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={24}>
                        <Form.Item
                            name="discount"
                            label="Discount"
                            rules={[{ required: true, pattern: new RegExp(/^\d+(\.\d{1,2})?$/), message: "Enter only number!" }]}
                        >
                            <Input
                                onBlur={calculatePaymentPlanData}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Card type="inner" title="Payment Plan" style={{ "borderColor": "#8ED1EB" }}>

                    <Form.List name="paymentPlan">
                        {(paymentFields, { add, remove }, { errors }) => (
                            <>
                                {paymentFields.map((field, index) => (
                                    <div key={["shift_", field.key]}>

                                        <Row gutter={[60, 0]}>
                                            <Col lg={12} md={12} sm={12} xs={24}>
                                                <Form.Item
                                                    name={[index, "phaseName"]}
                                                    label="Phase Name"
                                                    rules={[{ required: true, message: 'Phase Name is required' }]}>

                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={12} md={12} sm={12} xs={24}>
                                                <Form.Item
                                                    name={[index, "amount"]}
                                                    label="Amount"
                                                    rules={[{ required: true, pattern: new RegExp(/^\d+(\.\d{1,2})?$/), message: "Enter only number!" }]}>
                                                    <Input />
                                                </Form.Item>
                                            </Col>
                                            {
                                                (paymentFields.length > 1 && paymentIds[field.fieldKey] != null) ?
                                                    <Col lg={24} md={24} sm={24} xs={24} className="gx-text-right">
                                                        <Tooltip title="You cannot delete already created payment plan" placement="leftBottom">
                                                            <InfoCircleFilled className="gx-text-primary" />
                                                        </Tooltip>
                                                    </Col>
                                                    :
                                                    ((paymentFields.length > 1 && paymentIds[field.fieldKey] == undefined) ?
                                                        <Col lg={24} md={24} sm={24} xs={24} className="gx-text-right">
                                                            <DeleteFilled onClick={() => remove(field.name)} style={{ "fontSize": 25, "color": "red" }} />
                                                        </Col>
                                                        :
                                                        null
                                                    )
                                            }
                                        </Row>
                                        <Divider />
                                    </div>
                                ))}
                                {
                                    <Row>
                                        <Col span={3}>

                                        </Col>
                                        <Col span={16}>
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    style={{ width: '100%' }}
                                                    icon={<PlusOutlined />}
                                                >
                                                    Add Payment Schedule
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                }
                            </>
                        )}
                    </Form.List>
                </Card>
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

export default QuotationForm;
