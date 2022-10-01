import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
const FormItem = Form.Item;
import axios from '@/util/Api';
import ClientForm from '@/routes/clientData/clientRegistrationForm';

const RegistrationPage = (props) => {
    const [form] = Form.useForm();
    const [photographyType, setPhotographyType] = useState("Both");
    const router = useRouter();
    const authUser = props.user

    const [hasAccessTo, setHasAccessTo] = useState(authUser && authUser.rbac ? authUser.rbac.map(a => a.resource) : []);
    useEffect(() => {
        const hasAccess = authUser.rbac.find(a => a.resource == "Client Enquiry")
        if (hasAccess == undefined) {
            router.push(process.env.NEXT_PUBLIC_FRONTEND_PATH_VARIABLE + '/403');
        }
    }, []);

    const onPhotographyTypeChange = (e) => {
        setPhotographyType(e.target.value);
    }

    return (

        <ClientForm {...props} />
    )
}
export default Page(RegistrationPage);
