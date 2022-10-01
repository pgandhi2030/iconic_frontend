import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Space, Button, Input, Modal, message, Select, Anchor, Descriptions, Form, Tag } from "antd";
import { PlusOutlined, MailFilled, EditFilled, EyeOutlined, SearchOutlined, ExportOutlined, WhatsAppOutlined, FilePdfOutlined } from '@ant-design/icons';
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

const AllClientsPage = (props) => {

    const router = useRouter();

    const [dataSource, setDataSource] = useState([]);

    const [clientData, setClientData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [isQuotationStatusModalVisible, setIsQuotationStatusModalVisible] = useState(false);
    const [isQuotationServiceModalVisible, setIsQuotationServiceModalVisible] = useState(false);
    const [status, setStatus] = useState();
    const [serviceData, setServiceData] = useState([]);
    const [quotationApprovalForm] = Form.useForm();

    const authUser = props.user

    const [hasAccessTo, setHasAccessTo] = useState(authUser && authUser.rbac ? authUser.rbac.map(a => a.resource) : []);
    useEffect(() => {
        setHasAccessTo(authUser.rbac.map(a => a.resource))
    }, []);

    const fetchQuotations = () => {
        setDataLoader(true);
        axios.post('client/quotationByClientId', { clientId: router.query.id }).then(({ data }) => {
            setDataLoader(false);
            setDataSource(data)
        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }


    const showQuotationStatusModal = (record) => {
        quotationApprovalForm.setFieldsValue({
            'quotationId': record._id,
            'clientId': router.query.id
        });
        setIsQuotationStatusModalVisible(true);
    };

    const showQuotationServiceModal = (record) => {
        setServiceData(record)
        setIsQuotationServiceModalVisible(true);
    };


    const handleQuotationStatusOk = () => {
        setIsQuotationStatusModalVisible(false);
    };

    const handleQuotationStatusCancel = () => {
        quotationApprovalForm.resetFields();
        setStatus(null);
        setIsQuotationStatusModalVisible(false);
        fetchQuotations()

    };

    const handleQuotationServiceOk = () => {
        setIsQuotationServiceModalVisible(false);
    };

    const handleQuotationServiceCancel = () => {
        setIsQuotationServiceModalVisible(false);
        fetchQuotations()
    };

    const onQuotationApproval = (values) => {
        setDataLoader(true);
        axios.post('client/changeQuotationStatus', values).then(({ data }) => {
            message.success(data.message);
            setDataLoader(false);
            handleQuotationStatusCancel();
        }).catch(function (error) {
            message.error("Something went wrong!");

        });

    }

    const viewQuotationPDF = (quotationId) => {
        setDataLoader(true);
        axios.post('client/getQuotationPDF', { _id: quotationId }).then(({ data }) => {
            setDataLoader(false);
            window.open(
                process.env.NEXT_PUBLIC_BACKEND_PATH_VARIABLE + data,
                '_blank' // <- This is what makes it open in a new window.
            );
        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }

    const shareWhatsapp = (quotationId) => {
        setDataLoader(true);
        axios.post('client/getQuotationPDFWithLink', { _id: quotationId }).then(({ data }) => {
            setDataLoader(false);
            window.open(
                data,
                '_blank' // <- This is what makes it open in a new window.
            );
        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }

    const shareEmail = (quotationId) => {
        setDataLoader(true);
        axios.post('client/shareQuotationOnEmail', { _id: quotationId }).then(({ data }) => {
            setDataLoader(false);
            message.success("Quotation Shared via Mail");

        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }


    const onStatusChange = (value) => {
        setStatus(value);
        //This Counter Is used to render UI forcefully after update
        // setCount(prevCount => prevCount + 1);
    }

    useEffect(() => {
        axios.post('client/getById', { _id: router.query.id }).then(({ data }) => {
            data.eventDate = moment(data.eventDate).format("DD-MM-YYYY")
            setClientData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
        fetchQuotations()
    }, []);

    const columns = [{
        title: 'Quotation Number',
        dataIndex: 'quotationNumber',
        key: 'quotationNumber',
        sorter: false
    },
    {
        title: 'Quotation Title',
        dataIndex: 'title',
        key: 'title',
        sorter: false
    },
    {
        title: 'Services',
        dataIndex: 'services',
        key: 'services',
        render: (record, text) => (

            <Space size="middle">
                {
                    <>
                        <a className="gx-mr-1 gx-ml-1" onClick={() => showQuotationServiceModal(record)}>
                            <EyeOutlined className="gx-text-primary" />
                        </a>
                    </>

                }
            </Space>
        ),
    }, {
        title: 'Complimentary Service',
        dataIndex: 'complimentaryService',
        key: 'complimentaryService',
        render: (record, text) => (
            <span>
                {
                    record.join(", ")
                }
            </span>
        )
    }, {
        title: 'Event Managed By',
        dataIndex: 'eventManagedBy',
        key: 'eventManagedBy',
        sorter: false
    }, {
        title: 'Final Amount',
        dataIndex: 'finalAmount',
        key: 'finalAmount',
        sorter: false,
        render: (record, text) => (
            <span>
                {
                    text.finalAmount && text.discount &&
                    parseFloat(text.finalAmount) - parseFloat(text.discount)
                }
                <span>
                    {" "}({text.finalAmount + "-" + text.discount})
                </span>
            </span>
        )
    }, {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        sorter: false,
        render: (record, text) => (
            <span>
                {
                    text.status && text.status.includes("Send For Approval") &&
                    <Tag color="orange">{text.status} </Tag>
                }
                {
                    text.status && text.status.includes("Approved") &&
                    <Tag color="green">{text.status} </Tag>
                }
                {
                    text.status && text.status.includes("Rejected") &&
                    <Tag color="red">{text.status} </Tag>
                }
                {
                    (hasAccessTo.includes("Client Quotation Management")) &&
                    <span>
                        | <a className="gx-mr-1 gx-ml-1" onClick={() => showQuotationStatusModal(text)}> Change Status</a>
                    </span>
                }
            </span>
        )
    }, {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: false,
        render: (record, text) => (
            <span>
                {moment(text.createdAt).format('DD/MM/YYYY HH:mm')}
            </span>
        )
    }, {
        title: 'Action',
        key: '_id',
        dataIndex: '_id',
        render: (_id, record) => (

            <Space size="middle">
                {
                    <>
                        {
                            (hasAccessTo.includes("Client Quotation Management")) &&
                            <Link href={`/clients/${record.clientId}/quotation/${_id}/edit`}>
                                <EditFilled className="gx-text-primary" />
                            </Link>
                        }
                        <a onClick={() => viewQuotationPDF(_id)}>
                            <FilePdfOutlined className="gx-text-danger" />
                        </a>

                        <a onClick={() => shareWhatsapp(_id)}>
                            <WhatsAppOutlined className="gx-text-success" />
                        </a>

                        <a onClick={() => shareEmail(_id)}>
                            <MailFilled className="gx-text-primary" />
                        </a>
                    </>

                }
            </Space>
        ),
    },
    ];

    const serviceTableColumns = [{
        title: 'Service',
        dataIndex: 'serviceName',
        key: 'serviceName',
        sorter: false,
        render: (record, text) => (
            <span>
                {record.serviceName}
            </span>
        )
    },
    {
        title: 'Estimate Delivery Time',
        dataIndex: 'deliveryTime',
        key: 'deliveryTime',
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
        // usersByProjectId({ variables: { 'projectId': props.projectId, 'resource': 'User Setup', paginationOption: { 'limit': limit, 'page': currentPage, 'searchString': searchString, 'columns': searchColumn, sortColumn: sortColumnTemp } }, requestPolicy: 'cache-and-network' });
    }

    return (
        <div>
            {
                clientData &&
                <Descriptions title="Client Info">
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Groom Name">{clientData.groomName}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Bride Name">{clientData.brideName}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Event Date">{clientData.eventDate}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Photography Type">{clientData.photographyType}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Email Id">{clientData.email}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Contact Number">{clientData.mobile_number}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Reference By">{clientData.referenceBy}</Descriptions.Item>
                    <Descriptions.Item labelStyle={{ fontWeight: "bold" }} label="Status">{(clientData.status == "Project") ? <Tag icon={<CheckCircleOutlined />} color="green">{clientData.status}</Tag> : <Tag icon={<SyncOutlined />} color="orange">{clientData.status}</Tag>}</Descriptions.Item>
                </Descriptions>
            }
            <Card title="Quotations" extra={
                <Row justify="end">
                    {
                        (hasAccessTo.includes("Client Quotation Management")) &&

                        <Link href={`/clients/` + router.query.id + "/quotation/create"}><a>
                            <Button type="primary" style={{ marginRight: "14px" }} icon={<PlusOutlined />}>Add Quotation</Button></a>
                        </Link>

                    }
                </Row>
            }>
                {/* <Row style={{ marginRight: "5px", marginBottom: "6px" }}>
                    <Col lg={8} md={8} sm={20} xs={20}>
                        <Input placeholder="Search.." />
                    </Col>
                    <Col lg={1} md={1} style={{ paddingRight: "0px", paddingLeft: "0px", margin: "0px" }}>
                        <Button icon={<SearchOutlined />} disabled={false} onClick={() => search()}></Button>
                    </Col>
                </Row> */}
                <Table
                    loading={dataLoader}
                    className="gx-table-responsive"
                    columns={columns}
                    dataSource={(dataSource) ? dataSource : []}
                    pagination={true}
                    rowKey="_id"
                    onChange={handleTableChange}
                    scroll={{ x: 800 }}
                />
                <br />
                {/* <Pagination
                    // disabled={}
                    style={{ float: "right" }}
                    onChange={setPageEventChange}
                    total={(dataSource) ? dataSource.totalDocs : 0}
                    current={currentPage}
                    pageSize={limit}
                    showSizeChanger={true}
                    onShowSizeChange={setPageEventChange}
                    position="bottomRight"
                /> */}
            </Card>
            {/* Data Source Approval Start Modal */}
            <Modal title="Update Quotation Status" maskClosable={false} visible={isQuotationStatusModalVisible} onOk={handleQuotationStatusOk} onCancel={handleQuotationStatusCancel} footer={[
                <Button key="back" onClick={handleQuotationStatusCancel}>
                    Cancel
                </Button>,
                <Button key="statusUpdateButton" type="primary" htmlType="submit" form="quotationApprovalForm">
                    Update
                </Button>,
            ]}>
                <Form name="quotationApprovalForm" layout="vertical" preserve={false} form={quotationApprovalForm} onFinish={onQuotationApproval} scrollToFirstError >
                    <Form.Item
                        name='quotationId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name='clientId'
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
                            onChange={onStatusChange}
                            placeholder="Status"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Select.Option value="Approved" key="Approve">Approve</Select.Option>
                            <Select.Option value="Rejected" key="Reject">Reject</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="description"
                        rules={[{ required: true, message: 'Comment is required' }]}
                        label="Comment"
                    >
                        <TextArea placeholder="Comment Here..." />
                    </Form.Item>
                </Form>
            </Modal>
            {/* Data Source Approval End Modal */}

            {/* Services View modal */}
            <Modal title="Services" maskClosable={false} visible={isQuotationServiceModalVisible} onOk={handleQuotationServiceOk} onCancel={handleQuotationServiceCancel} footer={[
                <Button key="back" onClick={handleQuotationServiceCancel}>
                    Cancel
                </Button>
            ]}>
                <Table
                    loading={dataLoader}
                    className="gx-table-responsive"
                    columns={serviceTableColumns}
                    dataSource={(serviceData) ? serviceData : []}
                    pagination={true}
                    rowKey="_id"
                // scroll={{ x: 400 }}
                />
            </Modal>
        </div >

    );
}
export default Page(AllClientsPage);
