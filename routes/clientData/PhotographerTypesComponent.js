import React, { useState } from "react";

import { Form, Button, Space, Select, Row, Col, Input, Radio, Divider, DatePicker, Cascader } from "antd";
import { PlusOutlined, DeleteFilled } from "@ant-design/icons";
const { Option } = Select;

const PhotographerTypesComponent = props => {

    const photographerChange = (value) => {
        console.log("value", value)
    }
    return (
        <>
            <Form.List name={[props.fieldKey, "photographerTypes"]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                            <div key={[field.fieldKey, 'photographerTypes']}>
                                <Row key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                    <Col lg={11} md={11} sm={11} xs={24}>
                                        <Form.Item
                                            name={[field.fieldKey, "photographerType"]}
                                            label="Photographer Type"
                                            rules={[{ required: true, message: "Photographer Type is required!" }]}>
                                            <Select
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Select Photographer Type"
                                                onChange={photographerChange}
                                            >
                                                {
                                                    props.photographerTypeData.length > 0 && props.photographerTypeData.map((photographerType) => {
                                                        return <Option value={photographerType.photographerTypeName} key={photographerType._id}>{photographerType.serviceName}</Option>
                                                    })

                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col lg={11} md={11} sm={11} xs={24}>
                                        <Form.Item
                                            name={[field.fieldKey, "requiredPhotographers"]}
                                            label="Number Of Photographers "
                                            rules={[{ required: true, message: 'Number Of Photographers  is required' }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={2} md={2} sm={24} xs={24} className="gx-text-right">
                                        {fields.length > 0 ? (
                                            <DeleteFilled onClick={() => remove(field.name)} style={{ "fontSize": 25, "color": "red" }} />
                                        ) : null}
                                    </Col>
                                </Row>
                                <Divider />
                            </div>
                        ))}
                        <Row>
                            <Col lg={2} md={2} sm={0} xs={0}>

                            </Col>
                            <Col lg={20} md={20} sm={24} xs={24}>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add PhotographerType
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Form.List>
        </>
    )

}
export default PhotographerTypesComponent;
