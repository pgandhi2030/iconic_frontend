import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";

import Page from '@/app/hoc/securedPage';
import QuotationForm from '@/routes/clientData/quotationForm';
import { useRouter } from "next/router";
import axios from '@/util/Api';
import moment from 'moment';

const QuotationPage = (props) => {

    const router = useRouter();
    const [quotationData, setQuotationData] = useState({})

    useEffect(() => {
        axios.post('client/getQuotationById', { _id: router.query.quotationId }).then(({ data }) => {
            data.eventDetails.map((event) => {
                event.eventDateTime = moment(event.eventDateTime)
            })
            data.services = data.services.map((event) => {
                return {
                    deliveryTime: event.deliveryTime,
                    serviceName: event.serviceName._id
                }
            })
            data['type'] = "Edit"
            data['quotationId'] = router.query.quotationId
            setQuotationData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }, []);

    return (
        <QuotationForm {...props} initialValues={quotationData} />
    )
}
export default Page(QuotationPage);
