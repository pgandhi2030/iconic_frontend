import React, { useEffect, useState } from 'react';
import { Card, message } from "antd";

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import axios from '@/util/Api';
import CreateUserFormComponent from '@/routes/userAuth/CreateUserFormComponent';
import moment from 'moment';

const UserProfile = (props) => {
    const router = useRouter();
    const [userData, setUserData] = useState({})

    useEffect(() => {
        axios.post('user/getById', { _id: props.user._id }).then(({ data }) => {
            data.dateOfBirth = moment(data.dateOfBirth)
            setUserData(data)
        }).catch(function (error) {
            console.log(error)
            message.error("Something went wrong!");
        });
    }, []);


    return (
        <Card className="gx-card" title="User Profile" >
            <CreateUserFormComponent fromProfile={true} requestUserId={router.query.id} initialValues={userData} />
        </Card>
    )
}

export default Page((props) => <UserProfile {...props} />);