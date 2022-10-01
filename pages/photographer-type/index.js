import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Space, Button, Input, Modal, message, Select, Anchor, Descriptions, Form, Tag } from "antd";
import { PlusOutlined, EditFilled, EyeOutlined, SearchOutlined, ExportOutlined, FileExcelOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';

const AllPhotographerTypesPage = (props) => {

    const router = useRouter();
    const [createPhotographerTypeForm] = Form.useForm();

    const [dataSource, setDataSource] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [photographerTypeData, setPhotographerTypeData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);
    const [isPhotographerTypeModalVisible, setIsPhotographerTypeModalVisible] = useState(false);

    //Pagination state Variable
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState("");
    const [searchColumn, setSearchColumn] = useState(['name', 'email', 'mobile_number', 'employeeId', 'user_type.typeName', 'contractorId.personName', 'createdAt', 'reportingHeadId.name']);
    const [sortColumn, setSortColumn] = useState({ column: "updatedAt", sort: "descend" })


    const fetchPhotographerTypeData = () => {
        setDataLoader(true);
        axios.get('master/photographerTypeList').then(({ data }) => {
            // message.success(data.message);

            setDataLoader(false);
            setPhotographerTypeData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }

    const showPhotographerTypeModal = () => {

        setIsPhotographerTypeModalVisible(true);
    };

    const editPhotographerTypeModal = (record) => {
        createPhotographerTypeForm.setFieldsValue({
            '_id': record._id,
            "photographerTypeName": record.photographerTypeName,
        });
        setIsPhotographerTypeModalVisible(true);
    };

    const deletePhotographerType = (record) => {
        axios.post('master/deletePhotographerTypeById', { _id: record._id }).then(({ data }) => {
            message.success(data.message);
            setDataLoader(false);
            handlePhotographerTypeCancel();
        }).catch(function (error) {
            message.error("Something went wrong!");

        });
    }


    const handlePhotographerTypeOk = () => {
        setIsPhotographerTypeModalVisible(false);
    };

    const handlePhotographerTypeCancel = () => {
        createPhotographerTypeForm.resetFields();
        setIsPhotographerTypeModalVisible(false);
        fetchPhotographerTypeData()

    };

    const onPhotographerTypeApproval = (values) => {
        setDataLoader(true);
        axios.post('master/createPhotographerType', values).then(({ data }) => {
            message.success(data.message);
            setDataLoader(false);
            handlePhotographerTypeCancel();
        }).catch(function (error) {
            message.error("Something went wrong!");
        });

    }

    useEffect(() => {
        if (photographerTypeData) {
            setDataSource(photographerTypeData);
        }

    }, [photographerTypeData])

    useEffect(() => {
        fetchPhotographerTypeData()
    }, []);

    const columns = [{
        title: 'PhotographerType Name',
        dataIndex: 'photographerTypeName',
        key: 'photographerTypeName',
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
                        <a onClick={() => editPhotographerTypeModal(text)}>
                            <EditFilled className="gx-text-primary" />
                        </a>
                        <a onClick={() => deletePhotographerType(text)}>
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
        fetchPhotographerTypeData()
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
            <Card title="Photographer Types" extra={
                <Row justify="end">
                    {
                        <Button type="primary" style={{ marginRight: "14px" }} icon={<PlusOutlined />} onClick={() => showPhotographerTypeModal()}>Add PhotographerType</Button>
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
                <Modal title="Create Photographer Type" maskClosable={false} visible={isPhotographerTypeModalVisible} onOk={handlePhotographerTypeOk} onCancel={handlePhotographerTypeCancel} footer={[
                    <Button key="back" onClick={handlePhotographerTypeCancel}>
                        Cancel
                    </Button>,
                    <Button key="photographerTypeCreateButton" type="primary" htmlType="submit" form="createPhotographerTypeForm">
                        Create
                    </Button>,
                ]}>
                    <Form name="createPhotographerTypeForm" layout="vertical" preserve={false} form={createPhotographerTypeForm} onFinish={onPhotographerTypeApproval} scrollToFirstError >

                        <Form.Item
                            name='_id'
                            noStyle
                        ><Input type="hidden" />
                        </Form.Item>
                        <Form.Item
                            name="photographerTypeName"
                            rules={[{ required: true, message: 'PhotographerType Name is required' }]}
                            label="Photographer Type Name"
                        >
                            <Input />
                        </Form.Item>

                    </Form>
                </Modal>
            </Card>
        </div>
    );
}
export default Page(AllPhotographerTypesPage);
