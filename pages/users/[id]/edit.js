import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import axios from '@/util/Api';
import CreateUserFormComponent from '@/routes/userAuth/CreateUserFormComponent';
import moment from 'moment';

const EditUserPage = (props) => {
    const router = useRouter();
    const [userData, setUserData] = useState({})

    useEffect(() => {
        axios.post('user/getById', { _id: router.query.id }).then(({ data }) => {
            data.dateOfBirth = moment(data.dateOfBirth)
            setUserData(data)
        }).catch(function (error) {
            console.log(error)
            message.error("Something went wrong!");
        });
    }, []);


    return (
        <Card className="gx-card" title="Edit User" >
            <CreateUserFormComponent requestUserId={router.query.id} initialValues={userData} />
        </Card>
    )
}
export default Page(EditUserPage);
