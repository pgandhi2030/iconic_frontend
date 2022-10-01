import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Input, Button, message, Tooltip, Table, Checkbox } from "antd";
import { DeleteFilled, PlusOutlined, InfoCircleFilled } from '@ant-design/icons';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';

const RolesPage = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [rbacLoading, setRbacLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [dataSource, setDataSource] = useState([]);
    const [permissionIds, setPermissionIds] = useState([]);
    const [columns, setColumns] = useState([
        { title: 'Name', dataIndex: 'name', key: 'name', fixed: 'left' },
    ]);
    const [count, setCount] = useState(0);


    const getRoles = () => {
        setLoading(true)
        axios.get('user/roles').then(({ data }) => {
            setRoles({ roles: data })
            const ids = [];
            data.map((val) => {
                ids.push(val._id);
            });
            setLoading(false)

        }).catch(function (error) {
            setLoading(false)
            message.error("Something went wrong!");
        });
    }
    const getRoleBasedAccess = () => {
        setRbacLoading(true)
        axios.post('user/getAllRoleBasedAccesses').then((rbacData) => {
            setDataSource(rbacData.data.data)
            setRbacLoading(false)

        }).catch(function (error) {
            setRbacLoading(false)
            message.error("Something went wrong!");
        });


    }
    useEffect(() => {
        getRoles();
        getRoleBasedAccess();
    }, []);

    useEffect(() => {
        const ids = {}
        dataSource.map((rbac) => {
            const permissionObj = {}
            roles.roles && roles.roles.map((role) => {
                permissionObj[role.roleName] = rbac[role.roleName].checked
            })
            ids[rbac.permissionName] = permissionObj
        })
        setPermissionIds(ids)
        setCount(prevCount => prevCount + 1);

    }, [loading, rbacLoading])

    useEffect(
        () => {
            onload();
        }, [permissionIds]
    )

    function Capitalize(str) {
        str = str.replace('_', ' ');
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async function onload() {
        const data = roles.roles
        let new_columns = [];
        for (let i = 0; data && i < data.length; i++) {
            const newColumn = data[i] && {
                title: Capitalize(data[i].roleName),
                dataIndex: data[i].roleName,
                width: "200px",
                render: (text, record, index) => <span>
                    {
                        <>
                            <Row>
                                <Col lg={24} md={24} sm={24} xs={24}>
                                    <Form.Item >
                                        <span style={{ marginLeft: "10px", marginRight: "10px"}}>
                                            <Checkbox
                                                onChange={permissionChange}
                                                permissionName={record.permissionName}
                                                roleName={data[i].roleName}
                                                checked={record[data[i].roleName].checked}
                                            />
                                        </span>
                                    </Form.Item>
                                </Col>

                            </Row>
                        </>
                    }
                </span>
            };
            new_columns.push(newColumn);
        }
        setColumns([{
            title: 'Name', dataIndex: 'permissionName', key: 'permissionName', fixed: 'left', width: 120,
            render: (text, record) => <span>
                {/* + " ( "+record.permissionDescription+" )" */}
                {Capitalize(record.permissionName)}
            </span>
        }, ...new_columns]);

    }

    const permissionChange = (e) => {
        setLoading(true)

        const objToSave = {
            role: e.target.roleName,
            resource: e.target.permissionName,
            hasAccess: e.target.checked,
        }
        let ids = permissionIds;
        ids[e.target.permissionName][e.target.roleName] = e.target.checked;
        setPermissionIds(ids);
        setCount(prevCount => prevCount + 1);

        axios.post('user/createOrUpdateRoleBasedAccess', objToSave).then(({ data }) => {
            message.success(data.message);
            setLoading(false)
            getRoleBasedAccess()

        }).catch(function (error) {
            message.error("Something went wrong!" + error);

        });
    }

    return (
        <>
            <Form>
                <Card title="Role Based Access Control">
                    <Table
                        rowKey="permissionName"
                        columns={columns}
                        dataSource={dataSource}
                        // scroll={{ x: 800, y: 640 }}
                        bordered={true}
                        loading={loading}
                    />

                </Card>
            </Form>
        </>
    );
};

export default Page(RolesPage);
