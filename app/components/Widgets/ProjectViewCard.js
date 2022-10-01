import React from "react";
import { Col, Row } from "antd";
import Widget from "../../components/Widget/index";

const ProjectViewCard = (props) => {
    return (
        <Widget styleName="gx-card-full gx-px-3 gx-py-2">
            <Row>
                <Col xl={24} lg={24} md={24} sm={24} xs={24} className="gx-pr-md-2">
                    <h2 className="h4 gx-mb-2">{props.title}</h2>
                    <p className="gx-mb-1 gx-text-grey gx-fs-sm">{props.sub_title}</p>
                </Col>
            </Row>
        </Widget>
    );
};

export default ProjectViewCard;