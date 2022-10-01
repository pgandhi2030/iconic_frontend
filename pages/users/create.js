import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Form, Input, Tooltip, Upload, Space, Button, Select, DatePicker, Switch, TimePicker, message, AutoComplete, Radio, Tag, Modal } from "antd";
import { UploadOutlined } from '@ant-design/icons';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
const FormItem = Form.Item;
import axios from '@/util/Api';
import CreateUserFormComponent from '@/routes/userAuth/CreateUserFormComponent';

const CreateUserPage = (props) => {

    return (
        <Card className="gx-card" title="Create User" >
            <CreateUserFormComponent />
        </Card>
    )
}
export default Page(CreateUserPage);
