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

    const [eventData, setEventData] = useState([]);

    const [dataLoader, setDataLoader] = useState(false);
    const [paymentApprovalForm] = Form.useForm();
    const [isPaymentStatusModalVisible, setIsPaymentStatusModalVisible] = useState(false);


    const fetchQuotations = () => {
        setDataLoader(true);
        axios.post('client/photographerEventList', { photographerId: router.query.id }).then(({ data }) => {
            setEventData(data)
            setDataLoader(false);
        }).catch(function (error) {
            console.log("Something went wrong!", error);
            message.error("Something went wrong!");

        });
    }

    const showRawDataStatusModal = (record, text) => {
        console.log(text, record)
        paymentApprovalForm.setFieldsValue({
            "_id": text._id,
            'quotationId': text.quotationId,
            'clientId': text.clientId,
            'eventId': text.eventId,
            "payment": text.payment,
            "type": text.type,
            "photographerId": router.query.id,
            "photographerName": text.photographerName,
        });

        setIsPaymentStatusModalVisible(true);
    };

    const handleQuotationStatusOk = () => {
        setIsPaymentStatusModalVisible(false);
    };

    const handleQuotationStatusCancel = () => {
        paymentApprovalForm.resetFields();
        setIsPaymentStatusModalVisible(false);
        fetchQuotations()

    };

    const onPaymentApproval = (values) => {
        values['photographerPayoutData'] = {
            _id: values._id,
            "payment": values.payment,
            "photographerId": values.photographerId,
            "photographerName": values.photographerName,
            "status": values.status,
            "type": values.type
        }
        console.log(values);

        setDataLoader(true);
        axios.post('client/addPhotographerWisePayout', values).then(({ data }) => {
            message.success(data.message);
            setDataLoader(false);
            handleQuotationStatusCancel();
        }).catch(function (error) {
            message.error("Something went wrong!");

        });

    }

    useEffect(() => {
        fetchQuotations()
    }, []);


    const columns = [{
        title: 'Client',
        dataIndex: 'clientName',
        key: 'clientName',
        sorter: false
    }, {
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
        dataIndex: 'eventName',
        key: 'eventName',
        sorter: false
    }, {
        title: 'Event Place',
        dataIndex: 'eventPlace',
        key: 'eventPlace',
        sorter: false,

    }, {
        title: 'Payment',
        dataIndex: 'payment',
        key: 'payment',
    }, {
        title: 'Status',
        dataIndex: 'paymentStatus',
        key: 'paymentStatus',
        sorter: false,
        render: (record, text) => (
            <span>
                {
                    text.paymentStatus && text.paymentStatus.includes("Pending") &&
                    <Tag color="orange">{text.paymentStatus} </Tag>
                }
                {
                    text.paymentStatus && text.paymentStatus.includes("Completed") &&
                    <Tag color="green">{text.paymentStatus} </Tag>
                }
                {
                    text.paymentStatus && text.paymentStatus.includes("Reject") &&
                    <Tag color="red">{text.paymentStatus} </Tag>
                }
                {
                    text.paymentStatus && text.paymentStatus.includes("Pending") &&
                    <span>
                        | <a className="gx-mr-1 gx-ml-1" onClick={() => showRawDataStatusModal(record, text)}> Change Status</a>
                    </span>
                }
            </span>
        )

    }
    ];


    return (
        <div>
            <Table
                loading={dataLoader}
                className="gx-table-responsive"
                columns={columns}
                dataSource={(eventData) ? eventData : []}
                pagination={true}
                rowKey="_id"
            />
            {/* Raw Data Approval Start Modal */}
            <Modal title="Update raw data Status" maskClosable={false} visible={isPaymentStatusModalVisible} onOk={handleQuotationStatusOk} onCancel={handleQuotationStatusCancel} footer={[
                <Button key="back" onClick={handleQuotationStatusCancel}>
                    Cancel
                </Button>,
                <Button key="statusUpdateButton" type="primary" htmlType="submit" form="paymentApprovalForm">
                    Update
                </Button>,
            ]}>
                <Form name="paymentApprovalForm" layout="vertical" preserve={false} form={paymentApprovalForm} onFinish={onPaymentApproval} scrollToFirstError >
                    <Form.Item
                        name='eventId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>

                    <Form.Item
                        name='_id'
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
                        name='photographerId'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        name='type'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>

                    <Form.Item
                        name='payment'
                        noStyle
                    ><Input type="hidden" />
                    </Form.Item>

                    <Form.Item
                        name='photographerName'
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
                            <Select.Option value="Pending" key="Pending">Pending</Select.Option>
                            <Select.Option value="Completed" key="Completed">Completed</Select.Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
            {/* Raw Data Approval End Modal */}
        </div >

    );
}
export default Page(AllProjectsPage);
