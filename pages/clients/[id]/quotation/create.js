import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";

import Page from '@/app/hoc/securedPage';
import QuotationForm from '@/routes/clientData/quotationForm';

const QuotationPage = (props) => {

    const myInitialValues = {
        eventDetails: [{ photographerTypes: [{}] }],
        paymentPlan: [],
        services: [{}]
    }
    return (
        <QuotationForm {...props} initialValues={myInitialValues} />
    )
}
export default Page(QuotationPage);
