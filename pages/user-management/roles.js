import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Input, Button, message, Tooltip } from "antd";
import { DeleteFilled, PlusOutlined, InfoCircleFilled } from '@ant-design/icons';

import Page from '@/app/hoc/securedPage';
import { useRouter } from "next/router";
import Link from 'next/link';
import axios from '@/util/Api';

const RolesPage = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState(false)
    const [roleIds, setRoleIds] = useState(false)
    const [form] = Form.useForm();

    // const initialRoles = data && data.getRolesByProjectId || {};
    // let updatedInitialRoles = [];

    // if (Object.keys(initialRoles).length !== 0) {
    //     initialRoles.map((val) => {
    //         roleIds.push(val._id);
    //         updatedInitialRoles.push({
    //             "_id": val._id,
    //             "roleName": val.roleName,
    //         });
    //     });
    // }
    useEffect(() => {
        setLoading(true)
        axios.get('user/roles').then(({ data }) => {
            setRoles({ roles: data })
            const ids = [];

            data.map((val) => {
                ids.push(val._id);
            });
            setRoleIds(ids)
            form.setFieldsValue({ roles: data })
            setLoading(false)

        }).catch(function (error) {
            message.error("Something went wrong!");
        });
    }, []);

    const onFinish = async (fieldsValue) => {
        let values = [];
        fieldsValue.roles.map((role) => {
            values.push({
                '_id': role._id,
                "roleName": role.roleName
            });
        });

        axios.post('user/createOrUpdateRoles', values).then(({ data }) => {
            message.success(data.message);
            router.back()
        }).catch(function (error) {

            message.error("Something went wrong!" + error);

        });
    };

    return (
        <Card type="inner" title="Roles" loading={loading}>
            <Form form={form} name="roleDetails" onFinish={onFinish} scrollToFirstError initialValues={roles}>
                <Form.List name="roles">
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Row key={field.key} gutter={[60, 0]}>

                                    <Form.Item
                                        {...field}
                                        name={[field.name, '_id']}
                                        fieldKey={[field.fieldKey, '_id']}
                                        noStyle
                                    ><Input type="hidden" />
                                    </Form.Item>
                                    <Col lg={22} md={22} sm={24}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'roleName']}
                                            fieldKey={[field.fieldKey, 'roleName']}
                                            rules={[{ required: true, message: 'Role name required' }]}
                                            label="Role Name">
                                            <Input placeholder="Role Name" disabled={(roles.roles[index] && (["clientAdmin","photographer","employee"].includes(roles.roles[index].roleName))) ? true : false} />
                                        </Form.Item>
                                    </Col>
                                    {
                                        (fields.length > 1 && roleIds[field.fieldKey] != null) ?
                                            <Tooltip title="You cannot delete already created Roles details as Roles are linked with Role Based Access Permissions" placement="leftTop">
                                                <InfoCircleFilled className="gx-text-primary gx-mt-2" />
                                            </Tooltip>
                                            :
                                            ((fields.length > 1 && roleIds[field.fieldKey] == undefined) ?
                                                <DeleteFilled onClick={() => remove(field.name)} style={{ "fontSize": 25, "color": "red" }} />
                                                :
                                                null)
                                    }
                                </Row>
                            ))}
                            {
                                <Row>
                                    <Col span={3}>

                                    </Col>
                                    <Col span={16}>
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                style={{ width: '100%' }}
                                                icon={<PlusOutlined />}
                                            >
                                                Add Role
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            }
                        </>
                    )}
                </Form.List>
                {
                    <Form.Item className="gx-text-center">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>

                }
            </Form>
        </Card>
    );
};

export default Page(RolesPage);
