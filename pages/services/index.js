import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Space, Button, Input, Modal, message, Tooltip, Anchor, Descriptions, Form, Tag } from "antd";
import { PlusOutlined, EditFilled, InfoCircleFilled, SearchOutlined, ExportOutlined, FileExcelOutlined, DeleteFilled, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';

const AllServicesPage = (props) => {

    const router = useRouter();
    const [createServiceForm] = Form.useForm();

    const [dataSource, setDataSource] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [serviceData, setServiceData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);

    //Pagination state Variable
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState("");
    const [searchColumn, setSearchColumn] = useState(['name', 'email', 'mobile_number', 'employeeId', 'user_type.typeName', 'contractorId.personName', 'createdAt', 'reportingHeadId.name']);
    const [sortColumn, setSortColumn] = useState({ column: "updatedAt", sort: "descend" })


    const fetchServiceData = () => {
        setDataLoader(true);
        axios.get('master/servicesList').then(({ data }) => {
            // message.success(data.message);

            setDataLoader(false);
            setServiceData(data)
        }).catch(function (error) {
            console.log("Something went wrong!", error);
            message.error("Something went wrong!");

        });
    }

    const showServiceModal = () => {

        setIsServiceModalVisible(true);
    };


    const editServiceModal = (record) => {
        createServiceForm.setFieldsValue({
            '_id': record._id,
            "serviceName": record.serviceName,
            "estimatedTime": record.estimatedTime
        });
        setIsServiceModalVisible(true);
    };

    const deleteService = (record) => {
        axios.post('master/deleteServiceById', { _id: record._id }).then(({ data }) => {
            message.success(data.message);
            console.log(data)
            setDataLoader(false);
            handleServiceCancel();
        }).catch(function (error) {
            console.log("Something went wrong!", error);
            message.error("Something went wrong!");

        });
    }

    const handleServiceOk = () => {
        setIsServiceModalVisible(false);
    };

    const handleServiceCancel = () => {
        createServiceForm.resetFields();
        setIsServiceModalVisible(false);
        fetchServiceData()

    };

    const onServiceApproval = (values) => {
        setDataLoader(true);
        axios.post('master/createService', values).then(({ data }) => {
            message.success(data.message);
            console.log(data)
            setDataLoader(false);
            handleServiceCancel();
        }).catch(function (error) {
            console.log("Something went wrong!", error);
            message.error("Something went wrong!");

        });

    }

    useEffect(() => {
        if (serviceData) {
            setDataSource(serviceData);
        }

    }, [serviceData])

    useEffect(() => {
        fetchServiceData()
    }, []);

    const columns = [{
        title: 'Service Name',
        dataIndex: 'serviceName',
        key: 'serviceName',
        sorter: true
    },
    {
        title: 'Estimated Time',
        dataIndex: 'estimatedTime',
        key: 'estimatedTime',
        sorter: true
    },
    {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy._id',
        sorter: true,
        render: (record, text) => (
            <span>
                {text.createdBy.firstName + " " + text.createdBy.lastName}
            </span>
        )
    }, {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: true,
        render: (record, text) => (
            <span>
                {moment(text.createdAt).format('DD/MM/YYYY HH:mm')}
            </span>
        )
    }, {
        title: 'Updated At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: true,
        render: (record, text) => (
            <span>
                {moment(text.updatedAt).format('DD/MM/YYYY HH:mm')}
            </span>
        )
    }, {
        title: 'Action',
        key: '_id',
        dataIndex: '_id',
        render: (record, text) => (
            <Space size="middle">
                {
                    <>
                        <a onClick={() => editServiceModal(text)}>
                            <EditFilled className="gx-text-primary" />
                        </a>
                        {text.isDelete &&
                            <a onClick={() => deleteService(text)}>
                                <DeleteFilled className="gx-text-danger" />
                            </a>
                        }
                        {!text.isDelete &&
                            <Tooltip title="You cannot delete this service. as it is used in quotations" placement="leftBottom">
                                <DeleteOutlined className="gx-text-danger" />
                            </Tooltip>
                        }
                    </>

                }
            </Space>
        ),
    },
    ];



    const search = () => {
        // usersByProjectId({ variables: { 'projectId': props.projectId, 'resource': 'User Setup', paginationOption: { 'limit': 10, 'page': 1, 'searchString': searchString, 'columns': searchColumn, sortColumn: sortColumn } }, requestPolicy: 'cache-and-network' });
        fetchServiceData()
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
            <Card title="Services" extra={
                <Row justify="end">
                    {
                        <Button type="primary" style={{ marginRight: "14px" }} icon={<PlusOutlined />} onClick={() => showServiceModal()}>Add Service</Button>
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
                <Modal title="Create Service" maskClosable={false} visible={isServiceModalVisible} onOk={handleServiceOk} onCancel={handleServiceCancel} footer={[
                    <Button key="back" onClick={handleServiceCancel}>
                        Cancel
                    </Button>,
                    <Button key="serviceCreateButton" type="primary" htmlType="submit" form="createServiceForm">
                        Save
                    </Button>,
                ]}>
                    <Form name="createServiceForm" layout="vertical" preserve={false} form={createServiceForm} onFinish={onServiceApproval} scrollToFirstError >

                        <Form.Item
                            name='_id'
                            noStyle
                        ><Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            name="serviceName"
                            rules={[{ required: true, message: 'Service Name is required' }]}
                            label="Service Name"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="estimatedTime"
                            rules={[{ required: true, message: 'Estimated Time is required' }]}
                            label="Estimated Time"
                        >
                            <Input />
                        </Form.Item>

                    </Form>
                </Modal>
            </Card>
        </div>
    );
}
export default Page(AllServicesPage);
