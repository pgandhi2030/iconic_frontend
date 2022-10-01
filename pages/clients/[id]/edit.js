import React, { useEffect, useState } from 'react';
import { message } from "antd";
import moment from 'moment';
import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import axios from '@/util/Api';
import ClientForm from '@/routes/clientData/clientRegistrationForm';

const ClientEditPage = (props) => {
    const router = useRouter();
    const [clientData, setClientData] = useState({})

    useEffect(() => {
        axios.post('client/getById', { _id: router.query.id }).then(({ data }) => {
            data.eventDate = moment(data.eventDate)
            setClientData(data)
        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }, []);


    return (
        <>
            <ClientForm requestUserId={router.query.id} initialValues={clientData} />
        </>
    )
}
export default Page(ClientEditPage);
