import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Table, Space, Button, Input, Modal, message, Select, Tabs, Descriptions, Form, Tag } from "antd";
import { PlusOutlined, EditFilled, EyeOutlined } from '@ant-design/icons';
import { FaRupeeSign } from "react-icons/fa";

import moment from 'moment';
import TextArea from "antd/lib/input/TextArea";
import {
    CheckCircleOutlined,
    SyncOutlined
} from '@ant-design/icons';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';
const { TabPane } = Tabs;
const { Title } = Typography;

const AllProjectsPage = (props) => {

    const router = useRouter();

    const [approvedQuotations, setApprovedQuotations] = useState([]);

    const [projectData, setProjectData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [modalLoader, setModalLoader] = useState(false);
    const [isPhotographerTypeModalVisible, setIsPhotographerTypeModalVisible] = useState(false);
    const [isRawDataManagementModalVisible, setIsRawDataManagementModalVisible] = useState(false);
    const [isPhotographerPayoutModalVisible, setIsPhotographerPayoutModalVisible] = useState(false);
    const [isRawDataStatusModalVisible, setIsRawDataStatusModalVisible] = useState(false);
    const [photographerTypeData, setPhotographerTypeData] = useState([]);
    const [rawDataManagement, setRawDataManagement] = useState()
    const [photographerPayoutData, setPhotographerPayoutData] = useState()
    const [photographersList, setPhotographersList] = useState([])
    const [optionsSelected, setOptionsSelected] = useState([]);
    const [quotationId, setQuotationId] = useState()
    const [statusModalMode, setStatusModalMode] = useState("Edit")
    const [rawDataManagementForm] = Form.useForm();
    const [photographerPayoutForm] = Form.useForm();
    const [rawDataApprovalForm] = Form.useForm();


    const fetchQuotations = () => {
        setDataLoader(true);
        axios.post('client/approvedQuotationsByClientId', { clientId: router.query.id }).then(({ data }) => {
            setApprovedQuotations(data)
            setDataLoader(false);
            setQuotationId(data[0]._id)
        }).catch(function (error) {
            console.log("Something went wrong!", error);
            message.error("Something went wrong!");

        });
    }

    const fetchPhotographers = () => {
        setDataLoader(true);
        axios.get('user/list').then(({ data }) => {
            setDataLoader(false);
            setPhotographersList(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }


    const showPhotographerTypesModal = (record) => {
        setPhotographerTypeData(record)
        setIsPhotographerTypeModalVisible(true);
    };


    const handleQuotationOk = () => {
        setIsPhotographerTypeModalVisible(false);
    };

    const handleQuotationCancel = () => {
        setIsPhotographerTypeModalVisible(false);
        fetchQuotations()
    };


    const showRawDataManagementModal = (record, eventId, mode) => {
        setRawDataManagement(record)
        rawDataManagementForm.setFieldsValue({
            'quotationId': quotationId,
            'clientId': router.query.id,
            'eventId': eventId,
            'rawData': record,

        });
        setStatusModalMode(mode)
        setIsRawDataManagementModalVisible(true);
    };


    const handleAssignPhotographerOk = () => {
        setIsRawDataManagementModalVisible(false);
    };

    const handleAssignPhotographerCancel = () => {
        setIsRawDataManagementModalVisible(false);
        fetchQuotations()
    };

    const showPhotographersPayoutModal = (record, text) => {
        let photographers = []
        if (text.payoutData) {
            photographers = text.payoutData.map((payoutData) => {
                return {
                    ...payoutData,
                    rawDataStatus: text.rawDataStatus
                }
            })
            // photographers = text.payoutData
        } else {
            record.map((rec) => {
                rec.photographers.map((photographer) => {
                    photographers.push({
                        type: rec.photographerType,
                        photographerName: (photographer.firstName ? photographer.firstName : '') + " " + (photographer.lastName ? photographer.lastName : ''),
                        photographerId: photographer._id,
                        rawDataStatus: text.rawDataStatus
                    })
                })
            })
        }
        setPhotographerPayoutData(photographers)
        photographerPayoutForm.setFieldsValue({
            'quotationId': quotationId,
            'clientId': router.query.id,
            'eventId': text._id,
            'photographerPayoutData': photographers
        });

        setIsPhotographerPayoutModalVisible(true);
    };


    const handlePhotographerPayoutOk = () => {
        setIsPhotographerPayoutModalVisible(false);
    };

    const handlePhotographerPayoutCancel = () => {
        setIsPhotographerPayoutModalVisible(false);
        fetchQuotations()
    };


    const showRawDataStatusModal = (record, eventId) => {
        rawDataApprovalForm.setFieldsValue({
            'quotationId': quotationId,
            'clientId': router.query.id,
            'eventId': eventId,
        });
        setIsRawDataStatusModalVisible(true);
    };

    const handleQuotationStatusOk = () => {
        setIsRawDataStatusModalVisible(false);
    };

    const handleQuotationStatusCancel = () => {
        rawDataApprovalForm.resetFields();
        setIsRawDataStatusModalVisible(false);
        fetchQuotations()

    };

    const onRawDataApproval = (values) => {
        setDataLoader(true);
        axios.post('client/changeRawDataStatus', values).then(({ data }) => {
            message.success(data.message);
            setDataLoader(false);
            handleQuotationStatusCancel();
        }).catch(function (error) {
            message.error("Something went wrong!");

        });

    }

    useEffect(() => {
        axios.post('client/getById', { _id: router.query.id }).then(({ data }) => {
            data.eventDate = moment(data.eventDate).format("DD-MM-YYYY")
            setProjectData(data)
        }).catch(function (error) {
            console.log("Something went wrong!", error);
            message.error("Something went wrong!");
        });
        fetchQuotations()
        fetchPhotographers();
    }, []);

    const handleChange = value => {
        setOptionsSelected(value);
    };

    const columns = [{
        title: 'Event date - time',
        dataIndex: 'eventDateTime',
        key: 'eventDateTime',
        sorter: false,
        render: (record, text) => (
            <span>
                {moment(text.eventDateTime).format('DD-MM-YYYY HH:mm')}
            </span>
        )
    }, {
        title: 'Event Description',
        dataIndex: 'eventDescription',
        key: 'eventDescription',
        sorter: false
    }, {
        title: 'Event Place',
        dataIndex: 'eventPlace',
        key: 'eventPlace',
        sorter: false,

    }, {
        title: 'Photographer Types',
        dataIndex: 'photographerTypes',
        key: 'photographerTypes',
        render: (record, text) => (
            <Space size="middle">
                {
                    <>
                        <a className="gx-mr-1 gx-ml-1" onClick={() => showPhotographerTypesModal(record)}>
                            <EyeOutlined className="gx-text-primary" />
                        </a>
                    </>
                }
            </Space>
        ),
    }, {
        title: 'Add Raw Data Location',
        dataIndex: 'rawData',
        key: 'rawData',
        render: (record, text) => (
            <Space size="middle">
                {
                    <>
                        {
                            text.isPhotographersAssigned ?
                                text.rawDataStatus != "Approve" ?
                                    text.rawData ?
                                        <a className="gx-mr-1 gx-ml-1" onClick={() => showRawDataManagementModal(record, text._id, "Edit")}>
                                            <EditFilled className="gx-text-primary" />
                                        </a>
                                        :
                                        <a className="gx-mr-1 gx-ml-1" onClick={() => showRawDataManagementModal(record, text._id, "Edit")}>
                                            <PlusOutlined className="gx-text-primary" />
                                        </a>
                                    :
                                    <a className="gx-mr-1 gx-ml-1" onClick={() => showRawDataManagementModal(record, text._id, "Show")}>
                                        <EyeOutlined className="gx-text-primary" />
                                    </a>
                                : "N/A"

                        }
                    </>
                }
            </Space>
        ),
    }, {
        title: 'Raw Data Status',
        dataIndex: 'rawDataStatus',
        key: 'rawDataStatus',
        sorter: false,
        render: (record, text) => (
            <span>
                {
                    text.rawDataStatus && text.rawDataStatus.includes("Pending Approval") &&
                    <Tag color="orange">{text.rawDataStatus} </Tag>
                }
                {
                    text.rawDataStatus && text.rawDataStatus.includes("Approve") &&
                    <Tag color="green">{text.rawDataStatus} </Tag>
                }
                {
                    text.rawDataStatus && text.rawDataStatus.includes("Reject") &&
                    <Tag color="red">{text.rawDataStatus} </Tag>
                }
                {
                    <span>
                        | <a className="gx-mr-1 gx-ml-1" onClick={() => showRawDataStatusModal(record, text._id)}> Change Status</a>
                    </span>
                }
            </span>
        )

    }, {
        title: 'Photographers Payout',
        dataIndex: 'photographerTypes',
        key: 'photographerTypes',
        render: (record, text) => (
            <Space size="middle">
                {
                    <>
                        {
                            text.rawDataStatus == "Approve" ?
                                text.payoutData ?
                                    <a className="gx-mr-1 gx-ml-1" onClick={() => showPhotographersPayoutModal(record, text)}>
                                        <EyeOutlined className="gx-text-primary" />
                                    </a>
                                    :
                                    <a className="gx-mr-1 gx-ml-1" onClick={() => showPhotographersPayoutModal(record, text)}>
                                        <FaRupeeSign className="gx-text-primary" />
                                    </a>
                                :
                                "N/A"

                        }
                    </>
                }
            </Space>
        ),
    }
    ];

    const photographerTypeTableColumns = [{
        title: 'Photographer Type',
        dataIndex: 'photographerType',
        key: 'photographerType',
        sorter: false
    },
    {
        title: 'Required Photographers',
        dataIndex: 'requiredPhotographers',
        key: 'requiredPhotographers',
        sorter: false
    },]




    const handleTableChange = (pagination, filters, sorter) => {
        let sortColumnTemp = { column: "updatedAt", sort: "descend" }
        if (sorter.column != undefined) {
            sortColumnTemp = { column: sorter.columnKey, sort: sorter.order }
            setSortColumn(sortColumnTemp);
        } else {
            setSortColumn(sortColumnTemp);
        }
        // usersByProjectId({ variables: { 'clientId': props.clientId, 'resource': 'User Setup', paginationOption: { 'limit': limit, 'page': currentPage, 'searchString': searchString, 'columns': searchColumn, sortColumn: sortColumnTemp } }, requestPolicy: 'cache-and-network' });
    }

    const onTabChange = (key) => {
        console.log(key)
        setQuotationId(key)
    };


    const quotationWiseTabs = (data) => {
        return data.map((tab, index) => (
            <>
                <TabPane tab={tab.title} key={tab._id}>
                    <Title level={3}>Event Details</Title>
                    <Table
                        loading={dataLoader}
                        className="gx-table-responsive"
                        columns={columns}
                        dataSource={(tab.eventDetails) ? tab.eventDetails.filter(a => a.isPhotographersAssigned) : []}
                        pagination={true}
                        rowKey="_id"
                        onChange={handleTableChange}
                        scroll={{ x: 800 }}
                    />
                </TabPane>
            </>
        ))
    };

    const onRawDataManagementStore = (values) => {
        setModalLoader(true);
        axios.post('client/addRawDataToEvent', values).then(({ data }) => {
            message.success(data.message);
            setModalLoader(false);
            handleAssignPhotographerCancel()
        }).catch(function (error) {
            message.error("Something went wrong!");
            setModalLoader(false);
        });
    }

    const onPhotographerPayout = (values) => {
        setModalLoader(true);
        axios.post('client/addPhotographerPayout', values).then(({ data }) => {
            message.success(data.message);
            setModalLoader(false);
            handlePhotographerPayoutCancel()
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }


    return (
        <div>
            {
                projectData &&
                <Descriptions title="Project Info">
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Groom Name">{projectData.groomName}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Bride Name">{projectData.brideName}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Event Date">{projectData.eventDate}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Photography Type">{projectData.photographyType}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Email Id">{projectData.email}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Contact Number">{projectData.mobile_number}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Reference By">{projectData.referenceBy}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Status">{(projectData.status == "Project") ? <Tag icon={<CheckCircleOutlined />} color="green">{projectData.status}</Tag> : <Tag icon={<SyncOutlined />} color="orange">{projectData.status}</Tag>}</Descriptions.Item>
                </Descriptions>
            }
            <Tabs onChange={onTabChange} >
                {
                    quotationWiseTabs(approvedQuotations)
                }
            </Tabs>
            {/* Photographer Start Modal */}
            <Modal title="Photographer Types" maskClosable={false} visible={isPhotographerTypeModalVisible} onOk={handleQuotationOk} onCancel={handleQuotationCancel} footer={[
                <Button key="back" onClick={handleQuotationCancel}>
                    Cancel
                </Button>,

            ]}>
                <Table
                    loading={dataLoader}
                    className="gx-table-responsive"
                    columns={photographerTypeTableColumns}
                    dataSource={(photographerTypeData) ? photographerTypeData : []}
                    pagination={true}
                    rowKey="_id"
                />
            </Modal>
            {/* Photographer End Modal */}

            {/* Photographer Assign Start Modal */}
            <Modal
                title="Assign Photographers"
                maskClosable={false}
                visible={isRawDataManagementModalVisible}
                onOk={handleAssignPhotographerOk}
                onCancel={handleAssignPhotographerCancel}
                width={1200}
                footer={[
                    <Button loading={modalLoader}
                        key="back" onClick={handleAssignPhotographerCancel}>
                        Cancel
                    </Button>,
                    statusModalMode == "Edit" &&
                    <Button
                        loading={modalLoader}
                        key="statusUpdateButton" type="primary" htmlType="submit" form="rawDataManagementForm">
                        Save
                    </Button>,
                ]}>
                <Form name="rawDataManagementForm" preserve={false} form={rawDataManagementForm} initialValues={rawDataManagement} onFinish={onRawDataManagementStore} scrollToFirstError >
                    <Form.Item
                        name='eventId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name='clientId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name='quotationId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name="rawData"
                        rules={[{ required: true, message: 'Raw Data Location is required' }]}
                        label="Raw Data Location"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            {/* Photographer Assign End Modal */}

            {/* Photographer Payout Start Modal */}
            <Modal
                title="Photographers Payout"
                maskClosable={false}
                visible={isPhotographerPayoutModalVisible}
                onOk={handlePhotographerPayoutOk}
                onCancel={handlePhotographerPayoutCancel}
                width={1200}
                footer={[
                    <Button loading={modalLoader}
                        key="back" onClick={handlePhotographerPayoutCancel}>
                        Cancel
                    </Button>,
                    <Button
                        loading={modalLoader}
                        key="statusUpdateButton" type="primary" htmlType="submit" form="photographerPayoutForm">
                        Update
                    </Button>,
                ]}>
                <Form name="photographerPayoutForm" preserve={false} form={photographerPayoutForm} onFinish={onPhotographerPayout} scrollToFirstError >
                    <Form.Item
                        name='eventId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name='clientId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name='quotationId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.List name="photographerPayoutData">
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (

                                    <div key={["photographerPayout_", field.key]}>
                                        <Row gutter={[60, 0]}>

                                            <Col lg={6} md={6} sm={6} xs={6}>
                                                <Form.Item
                                                    name={[index, "type"]}
                                                    rules={[{ required: true, message: 'Photographer Type is required' }]}
                                                    label="Photographer Type"
                                                >
                                                    <Input disabled={true} />
                                                </Form.Item>
                                            </Col>

                                            <Col lg={6} md={6} sm={6} xs={6}>
                                                <Form.Item
                                                    name={[index, "photographerName"]}
                                                    rules={[{ required: true, message: 'Required Photographers is required' }]}
                                                    label="Photographer Name"
                                                >
                                                    <Input disabled={true} />
                                                </Form.Item>
                                            </Col>
                                            <Form.Item
                                                name='photographerId'
                                                noStyle
                                            ><Input type="hidden" />
                                            </Form.Item>


                                            <Col lg={6} md={6} sm={6} xs={6}>
                                                <Form.Item
                                                    name={[index, "payment"]}
                                                    rules={[{ required: true, pattern: new RegExp(/^\d+(\.\d{1,2})?$/), message: "Enter Payment in only number!" }]}
                                                    label="Payment"
                                                >
                                                    <Input
                                                        disabled={photographerPayoutData && photographerPayoutData[index]['rawDataStatus'] == "Approve" ? true : false} />
                                                </Form.Item>
                                            </Col>
                                            <Col lg={6} md={6} sm={6} xs={6}>

                                                <Form.Item
                                                    name={[index, "status"]}
                                                    rules={[{ required: true, message: 'Status is required' }]}
                                                    label="Status"
                                                >
                                                    <Select
                                                        allowClear
                                                        placeholder="Status"
                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                        <Select.Option value="Pending" key="Pending">Pending</Select.Option>
                                                        <Select.Option value="Completed" key="Completed">Completed</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
            {/* Photographer Assign End Modal */}

            {/* Raw Data Approval Start Modal */}
            <Modal title="Update raw data Status" maskClosable={false} visible={isRawDataStatusModalVisible} onOk={handleQuotationStatusOk} onCancel={handleQuotationStatusCancel} footer={[
                <Button key="back" onClick={handleQuotationStatusCancel}>
                    Cancel
                </Button>,
                <Button key="statusUpdateButton" type="primary" htmlType="submit" form="rawDataApprovalForm">
                    Update
                </Button>,
            ]}>
                <Form name="rawDataApprovalForm" layout="vertical" preserve={false} form={rawDataApprovalForm} onFinish={onRawDataApproval} scrollToFirstError >
                    <Form.Item
                        name='eventId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name='clientId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name='quotationId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        rules={[{ required: true, message: 'Status is required' }]}
                        label="Status"
                    >
                        <Select
                            allowClear
                            placeholder="Status"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Select.Option value="Approve" key="Approve">Approve</Select.Option>
                            <Select.Option value="Reject" key="Reject">Reject</Select.Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
            {/* Raw Data Approval End Modal */}
        </div >

    );
}
export default Page(AllProjectsPage);
