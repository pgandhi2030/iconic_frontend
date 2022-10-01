import React from "react";
import { Col, Row, Dropdown } from "antd";
import Widget from "../../components/Widget/index";
import { DownOutlined } from '@ant-design/icons';

const ProjectDropdownCard = (props) => {
    return (
        <Widget styleName="gx-card-full gx-px-3 gx-py-2">
            <Row>
                <Col xl={20} lg={20} md={20} sm={20} xs={20} className="gx-pr-md-2">
                    <h2 className="h4 gx-mb-2">{props.title}</h2>
                    <p className="gx-mb-1 gx-text-grey gx-fs-sm">{props.sub_title}</p>
                    <p className="gx-text-right">
                        
                    </p>
                </Col>
                <Col xl={2} lg={2} md={2} sm={2} xs={2}>
                    <Dropdown overlay={props.menu} trigger={['click']}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            <DownOutlined style={{ fontSize: '17px', marginTop:"2px" }} />
                        </a>
                    </Dropdown>
                </Col>
            </Row>
        </Widget>
    );
};

export default ProjectDropdownCard;