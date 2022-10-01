import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Input, Modal, message, Form, Space } from "antd";
import { PlusOutlined, SearchOutlined, EditFilled, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';

const AllComplimentaryServicesPage = (props) => {

    const router = useRouter();
    const [createComplimentaryServicesForm] = Form.useForm();

    const [dataSource, setDataSource] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [complimentaryServiceData, setComplimentaryServicesData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [isComplimentaryServicesModalVisible, setIsComplimentaryServicesModalVisible] = useState(false);

    //Pagination state Variable
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState("");
    const [searchColumn, setSearchColumn] = useState(['name', 'email', 'mobile_number', 'employeeId', 'user_type.typeName', 'contractorId.personName', 'createdAt', 'reportingHeadId.name']);
    const [sortColumn, setSortColumn] = useState({ column: "updatedAt", sort: "descend" })


    const fetchComplimentaryServicesData = () => {
        setDataLoader(true);
        axios.get('master/complimentaryServiceList').then(({ data }) => {
            setDataLoader(false);
            setComplimentaryServicesData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }

    const showComplimentaryServicesModal = () => {

        setIsComplimentaryServicesModalVisible(true);
    };

    const editComplimentaryServiceModal = (record) => {
        createComplimentaryServicesForm.setFieldsValue({
            '_id': record._id,
            "complimentaryServiceName": record.complimentaryServiceName,
        });
        setIsComplimentaryServicesModalVisible(true);
    };

    const deleteComplimentaryService = (record) => {
        axios.post('master/deleteComplimentaryServiceById', { _id: record._id }).then(({ data }) => {
            message.success(data.message);
            setDataLoader(false);
            handleComplimentaryServicesCancel();
        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }

    const handleComplimentaryServicesOk = () => {
        setIsComplimentaryServicesModalVisible(false);
    };

    const handleComplimentaryServicesCancel = () => {
        createComplimentaryServicesForm.resetFields();
        setIsComplimentaryServicesModalVisible(false);
        fetchComplimentaryServicesData()

    };

    const onComplimentaryServicesApproval = (values) => {
        setDataLoader(true);
        axios.post('master/createComplimentaryService', values).then(({ data }) => {
            message.success(data.message);
            setDataLoader(false);
            handleComplimentaryServicesCancel();
        }).catch(function (error) {
            message.error("Something went wrong!");

        });

    }

    useEffect(() => {
        if (complimentaryServiceData) {
            setDataSource(complimentaryServiceData);
        }

    }, [complimentaryServiceData])

    useEffect(() => {
        fetchComplimentaryServicesData()
    }, []);

    const columns = [{
        title: 'Complimentary Services Name',
        dataIndex: 'complimentaryServiceName',
        key: 'complimentaryServiceName',
        sorter: true
    }, {
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
                        <a onClick={() => editComplimentaryServiceModal(text)}>
                            <EditFilled className="gx-text-primary" />
                        </a>
                        <a onClick={() => deleteComplimentaryService(text)}>
                            <DeleteOutlined className="gx-text-danger" />
                        </a>
                    </>

                }
            </Space>
        ),
    },
    ];



    const search = () => {
        // usersByProjectId({ variables: { 'projectId': props.projectId, 'resource': 'User Setup', paginationOption: { 'limit': 10, 'page': 1, 'searchString': searchString, 'columns': searchColumn, sortColumn: sortColumn } }, requestPolicy: 'cache-and-network' });
        fetchComplimentaryServicesData()
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
            <Card title="Complimentary Services" extra={
                <Row justify="end">
                    {
                        <Button type="primary" style={{ marginRight: "14px" }} icon={<PlusOutlined />} onClick={() => showComplimentaryServicesModal()}>Add Complimentary Services</Button>
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
                <Modal title="Create Complimentary Service" maskClosable={false} visible={isComplimentaryServicesModalVisible} onOk={handleComplimentaryServicesOk} onCancel={handleComplimentaryServicesCancel} footer={[
                    <Button key="back" onClick={handleComplimentaryServicesCancel}>
                        Cancel
                    </Button>,
                    <Button key="complimentaryServiceCreateButton" type="primary" htmlType="submit" form="createComplimentaryServicesForm">
                        Create
                    </Button>,
                ]}>
                    <Form name="createComplimentaryServicesForm" layout="vertical" preserve={false} form={createComplimentaryServicesForm} onFinish={onComplimentaryServicesApproval} scrollToFirstError >
                        <Form.Item
                            name='_id'
                            noStyle
                        ><Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            name="complimentaryServiceName"
                            rules={[{ required: true, message: 'Complimentary Services Name is required' }]}
                            label="Complimentary Service Name"
                        >
                            <Input />
                        </Form.Item>

                    </Form>
                </Modal>
            </Card>
        </div>
    );
}
export default Page(AllComplimentaryServicesPage);
