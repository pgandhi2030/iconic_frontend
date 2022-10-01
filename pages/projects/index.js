import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Space, Button, Input, Tooltip, message, Menu, Dropdown, Pagination, Upload, Spin } from "antd";
import { PlusOutlined, MailFilled, EditFilled, EyeOutlined, SearchOutlined, ExportOutlined, FileExcelOutlined, UploadOutlined, ExceptionOutlined } from '@ant-design/icons';
import moment from 'moment';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';

const AllProjectsPage = (props) => {

    const router = useRouter();

    const [dataSource, setDataSource] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [projectData, setProjectData] = useState([]);
    const [dataLoader, setDataLoader] = useState(false);

    //Pagination state Variable
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchString, setSearchString] = useState("");
    const [searchColumn, setSearchColumn] = useState(['name', 'email', 'mobile_number', 'employeeId', 'user_type.typeName', 'contractorId.personName', 'createdAt', 'reportingHeadId.name']);
    const [sortColumn, setSortColumn] = useState({ column: "updatedAt", sort: "descend" })


    const fetchProjectData = () => {
        setDataLoader(true);
        axios.get('client/projectList').then(({ data }) => {
            // message.success(data.message);

            setDataLoader(false);
            setProjectData(data)
        }).catch(function (error) {
            console.log("Something went wrong!", error);
            message.error("Something went wrong!");

        });
    }


    useEffect(() => {
        if (projectData) {
            setDataSource(projectData);
        }

    }, [projectData])

    useEffect(() => {
        fetchProjectData()
    }, []);

    const columns = [{
        title: 'Groom Name',
        dataIndex: 'groomName',
        key: 'groomName',
        sorter: true
    }, {
        title: 'Bride Name',
        dataIndex: 'brideName',
        key: 'brideName',
    }, {
        title: 'Email Id',
        dataIndex: 'email',
        key: 'email',
    }, {
        title: 'Mobile Number',
        dataIndex: 'mobile_number',
        key: 'mobile_number',
        sorter: true
    }, {
        title: 'Event Date',
        dataIndex: 'eventDate',
        key: 'eventDate',
        sorter: true,
        render: (record, text) => (
            <span>
                {moment(text.eventDate).format('DD/MM/YYYY')}
            </span>
        )
    }, {
        title: 'Photography Type',
        dataIndex: 'photographyType',
        key: 'photographyType',
        sorter: true
    }, {
        title: 'Opposite Side Studio',
        dataIndex: 'oppositeStudioName',
        key: 'oppositeStudioName',
        sorter: true
    }, {
        title: 'Reference By',
        dataIndex: 'referenceBy',
        key: 'referenceBy',
        sorter: true,
    }, {
        title: 'Action',
        key: '_id',
        dataIndex: '_id',
        render: (_id, record) => (
            <Space size="middle">
                {
                    <>
                        <Link href={`/projects/${_id}`}>
                            <EyeOutlined className="gx-text-primary" />
                        </Link>
                    </>

                }
            </Space>
        ),
    },
    ];



    const search = () => {
        // usersByProjectId({ variables: { 'projectId': props.projectId, 'resource': 'User Setup', paginationOption: { 'limit': 10, 'page': 1, 'searchString': searchString, 'columns': searchColumn, sortColumn: sortColumn } }, requestPolicy: 'cache-and-network' });
        fetchProjectData()
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
            <Card title="Projects" >
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
        </div>
    );
}
export default Page(AllProjectsPage);
