import React, { useEffect, useState } from "react";
import { Col, Row, Card, Dropdown, Menu, Result } from "antd";
import { SmileOutlined } from '@ant-design/icons';
import Page from '@/app/hoc/securedPage';
import ProjectViewCard from "@/app/components/Widgets/ProjectViewCard";
import { useRouter } from "next/router";
import Link from 'next/link';

const myPage = (props) => {
    const authUser = props.user
    // const hasAccessTo = authUser && authUser.rbac ? authUser.rbac.map(a => a.resource) : []
    const [hasAccessTo, setHasAccessTo] = useState(authUser && authUser.rbac ? authUser.rbac.map(a => a.resource) : []);
    useEffect(() => {
        setHasAccessTo(authUser.rbac.map(a => a.resource))
    }, []);

    return (
        <>
            {
                (authUser.approved && hasAccessTo.length > 0 &&
                    <Card bordered={false} title="Setup & Data" >
                        <Row>
                            {
                                hasAccessTo.includes("Master - Services Management") &&

                                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                                    <Link href="/services">
                                        <a><ProjectViewCard title="Services" sub_title="Manage Services List" icon="icon-components" /></a>
                                    </Link>
                                </Col>
                            }
                            {
                                hasAccessTo.includes("Master - Complimentary Services Management") &&

                                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                                    <Link href="/complimentary-services">
                                        <a><ProjectViewCard title="Complimentary Services" sub_title="Complimentary Services List" icon="icon-components" /></a>
                                    </Link>
                                </Col>
                            }
                            {
                                hasAccessTo.includes("Master - Photographer Types Management") &&
                                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                                    <Link href="/photographer-type">
                                        <a><ProjectViewCard title="Photographer Types" sub_title="Manage Photographer List" icon="icon-components" /></a>
                                    </Link>
                                </Col>
                            }

                            {
                                hasAccessTo.includes("User Management") &&
                                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                                    <Link href="/users">
                                        <a><ProjectViewCard title="All Photographers " sub_title="Manage All Users and Photographers" icon="icon-components" /></a>
                                    </Link>
                                </Col>
                            }
                            {
                                (hasAccessTo.includes("Client Enquiry") || hasAccessTo.includes("Client Approval") || hasAccessTo.includes("Client Quotation Management")) &&
                                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                                    <Link href="/clients">
                                        <a><ProjectViewCard title="Clients" sub_title="View All Clients" icon="icon-components" /></a>
                                    </Link>
                                </Col>
                            }
                            {
                                hasAccessTo.includes("Project Management") &&
                                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                                    <Link href="/projects">
                                        <a><ProjectViewCard title="Projects" sub_title="View All Projects" icon="icon-components" /></a>
                                    </Link>
                                </Col>
                            }
                            {
                                hasAccessTo.includes("Raw Data Management") &&
                                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                                    <Link href="/raw-data">
                                        <a><ProjectViewCard title="Raw Data" sub_title="Raw data Management" icon="icon-components" /></a>
                                    </Link>
                                </Col>
                            }
                            {
                                hasAccessTo.includes("Photographer Payout Management") &&
                                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                                    <Link href="/photographer-payout">
                                        <a><ProjectViewCard title="Photographer Payout Management" sub_title="Photographer Payout Management" icon="icon-components" /></a>
                                    </Link>
                                </Col>
                            }

                        </Row>
                    </Card >
                )
            }
            {
                authUser.role == "clientAdmin" &&
                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                    <Link href="/user-management/roles">
                        <a><ProjectViewCard title="Roles" sub_title="Roles" icon="icon-components" /></a>
                    </Link>
                </Col>
            }
            {
                authUser.role == "clientAdmin" &&
                <Col xl={6} lg={6} md={12} sm={12} xs={24}>
                    <Link href="/user-management/role-based-access">
                        <a><ProjectViewCard title="Role Based Access" sub_title="Setup Feature Access based on role" icon="icon-components" /></a>
                    </Link>
                </Col>
            }
            {
                hasAccessTo.length == 0 &&
                <Card bordered={false}>
                    <Result
                        icon={<SmileOutlined />}
                        title="Welcome to Iconic Films & Photography"
                        subTitle={<><b> Hi {props.user.firstName}, You have no access to features.Contact admin for the access.
                        </b> </>
                        }
                    />
                </Card>
            }
            {
                ((authUser.approved == false && authUser.role != "clientAdmin")) &&
                <Card bordered={false}>
                    <Result
                        icon={<SmileOutlined />}
                        title="Welcome to Iconic Films & Photography"
                        subTitle={<><b> Hi {props.user.firstName}, You are not approved by admin yet. You can access the features after you got approval.
                            <Link href="/kyc"> Update KYC</Link>
                        </b> </>
                        }
                    />
                </Card>
            }
        </>
    )
}
export default Page(myPage);
