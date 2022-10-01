import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Modal, Button, Input, Select, message, Form, Tag, Space, Upload, Spin } from "antd";
import { PlusOutlined, MailFilled, EditFilled, EyeOutlined, SearchOutlined, ExportOutlined, FileExcelOutlined, UploadOutlined, ExceptionOutlined } from '@ant-design/icons';
import moment from 'moment';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';

const AllClientsPage = (props) => {

    const router = useRouter();

    const [dataSource, setDataSource] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [photographerData, setPhotographerData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [quotationApprovalForm] = Form.useForm();
    const [isQuotationStatusModalVisible, setIsQuotationStatusModalVisible] = useState(false);
    const [status, setStatus] = useState();

    //Pagination state Variable
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState("");
    const [searchColumn, setSearchColumn] = useState(['name', 'email', 'mobile_number', 'employeeId', 'user_type.typeName', 'contractorId.personName', 'createdAt', 'reportingHeadId.name']);
    const [sortColumn, setSortColumn] = useState({ column: "updatedAt", sort: "descend" })


    const fetchPhotographerData = () => {
        setDataLoader(true);
        axios.get('user/list').then(({ data }) => {
            // message.success(data.message);

            setDataLoader(false);
            setPhotographerData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }


    useEffect(() => {
        if (photographerData) {
            setDataSource(photographerData);
        }

    }, [photographerData])

    useEffect(() => {
        fetchPhotographerData()
    }, []);


    const showQuotationStatusModal = (record) => {
        quotationApprovalForm.setFieldsValue({
            '_id': record._id,
        });
        setIsQuotationStatusModalVisible(true);
    };

    const handleQuotationStatusOk = () => {
        setIsQuotationStatusModalVisible(false);
    };

    const handleQuotationStatusCancel = () => {
        quotationApprovalForm.resetFields();
        setStatus(null);
        setIsQuotationStatusModalVisible(false);
        fetchPhotographerData()

    };

    const onQuotationApproval = (values) => {
        setDataLoader(true);
        axios.post('user/photographerApproval', values).then(({ data }) => {
            message.success(data.message);
            setDataLoader(false);
            handleQuotationStatusCancel();
        }).catch(function (error) {
            message.error("Something went wrong!");

        });

    }

    const onStatusChange = (value) => {
        setStatus(value);
        //This Counter Is used to render UI forcefully after update
        // setCount(prevCount => prevCount + 1);
    }
    const columns = [{
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
    }, {
        title: 'Last Name',
        dataIndex: 'lastName',
        key: 'lastName',
    }, {
        title: 'Email Id',
        dataIndex: 'emailId',
        key: 'emailId',
    }, {
        title: 'Mobile Number',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
        sorter: true
    },
    {
        title: 'KYC Status',
        dataIndex: 'kycDone',
        key: 'kycDone',
        sorter: false,
        render: (record, text) => (
            <span>
                {
                    text.kycDone &&
                    <Tag color="green">Completed </Tag>
                }
                {
                    !text.kycDone &&
                    <Tag color="orange">Pending </Tag>
                }
            </span>
        )
    },
    {
        title: 'Status',
        dataIndex: 'approved',
        key: 'approved',
        sorter: false,
        render: (record, text) => (
            <span>
                {
                    text.approved &&
                    <Tag color="green">Approved </Tag>
                }
                {
                    text.kycDone == false &&
                    <Tag color="orange">Pending </Tag>
                }
                {
                    text.kycDone && !text.approved &&
                    <Tag color="red">Pending </Tag>
                }
                {
                    text.kycDone && !text.approved &&
                    <span>
                        | <a className="gx-mr-1 gx-ml-1" onClick={() => showQuotationStatusModal(text)}> Change Status</a>
                    </span>
                }
            </span>
        )
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: true,
        render: (record, text) => (
            <span>
                {
                    moment(record).format("DD-MM-YYYY HH:mm")
                }
            </span>
        )
    }, {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: true,
        render: (record, text) => (
            <span>
                {
                    moment(record).format("DD-MM-YYYY HH:mm")
                }
            </span>
        )
    },
    {
        title: 'Active / Inactive',
        dataIndex: 'approved',
        key: 'approved',
        sorter: false,
        render: (record, text) => (
            <span>
                {
                    text.isActive &&
                    <Tag color="green">Active </Tag>
                }
                {
                    text.isActive == false &&
                    <Tag color="orange">Inactive </Tag>
                }

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
                        <Link href={`/users/${_id}/edit`}>
                            <EditFilled className="gx-text-primary" />
                        </Link>
                    </>

                }
            </Space>
        ),
    },
    ];



    const search = () => {
        // usersByProjectId({ variables: { 'projectId': props.projectId, 'resource': 'User Setup', paginationOption: { 'limit': 10, 'page': 1, 'searchString': searchString, 'columns': searchColumn, sortColumn: sortColumn } }, requestPolicy: 'cache-and-network' });
        fetchPhotographerData()
        setCurrentPage(1);
        setLimit(10);
    }

    const onSearchChange = val => {
        if (val.target.value == "") {
            // usersByProjectId({ variables: { 'projectId': props.projectId, 'resource': 'User Setup', paginationOption: { 'limit': limit, 'page': currentPage, 'searchString': '', 'columns': searchColumn, sortColumn: sortColumn } }, requestPolicy: 'cache-and-network' });
        }
        setSearchString(val.target.value)
    }
    const setPageEventChange = (current, size) => {
        // usersByProjectId({ variables: { 'projectId': props.projectId, 'resource': 'User Setup', paginationOption: { 'limit': size, 'page': current, 'searchString': searchString, 'columns': searchColumn, sortColumn: sortColumn } }, requestPolicy: 'cache-and-network' });
        setCurrentPage(current);
        setLimit(size);
    }

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
            <Card title="Photographers" extra={
                <Row justify="end">
                    {
                        <Link href={`/users/create`}><a>
                            <Button type="primary" style={{ marginRight: "14px" }} icon={<PlusOutlined />}>Add User</Button></a>
                        </Link>

                    }
                </Row>
            }>
                <Row style={{ marginRight: "5px", marginBottom: "6px" }}>
                    <Col lg={8} md={8} sm={20} xs={20}>
                        <Input value={searchString} placeholder="Search.." onChange={onSearchChange} />
                    </Col>
                    <Col lg={1} md={1} style={{ paddingRight: "0px", paddingLeft: "0px", margin: "0px" }}>
                        <Button icon={<SearchOutlined />} disabled={false} onClick={() => search()}></Button>
                    </Col>
                </Row>
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

            </Card>

            <Modal title="Update Photographer Status" maskClosable={false} visible={isQuotationStatusModalVisible} onOk={handleQuotationStatusOk} onCancel={handleQuotationStatusCancel} footer={[
                <Button key="back" onClick={handleQuotationStatusCancel}>
                    Cancel
                </Button>,
                <Button key="statusUpdateButton" type="primary" htmlType="submit" form="quotationApprovalForm">
                    Update
                </Button>,
            ]}>
                <Form name="quotationApprovalForm" layout="vertical" preserve={false} form={quotationApprovalForm} onFinish={onQuotationApproval} scrollToFirstError >
                    <Form.Item
                        name='_id'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>

                    <Form.Item
                        name="approved"
                        rules={[{ required: true, message: 'Status is required' }]}
                        label="Status"
                    >
                        <Select
                            allowClear
                            onChange={onStatusChange}
                            placeholder="Status"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Select.Option value={true} key="Approve">Approve</Select.Option>
                            <Select.Option value={false} key="Pending">Pending</Select.Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
}
export default Page(AllClientsPage);
