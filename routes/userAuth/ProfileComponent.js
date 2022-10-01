import React, { useEffect, useState } from 'react'
// import { GET_USER_BY_ID, UPDATE_USER_PROFILE, UPDATE_PROFILE_PICTURE } from '@/apollo/queries';
// import { useLazyQuery, useMutation } from "react-apollo";
import { Avatar, Card, Row, Col, Tabs, Tooltip, Modal, Form, Button, Input, DatePicker, Radio, message, Upload, Badge } from "antd";
import Widget from '@/app/components/Widget';
import { EditOutlined, PlusOutlined, CameraOutlined } from "@ant-design/icons";
import moment from 'moment';
import ImgCrop from 'antd-img-crop';


const ProfileComponent = (props) => {
    const TabPane = Tabs.TabPane;
    // const projectId = props.user.projectId._id;
    const userId = props.user._id;
    const [editDetailForm] = Form.useForm()
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [status, setStatus] = useState(null);
    const [count, setCount] = useState(0);
    const [uploadFileFlag, setUploadFileFlag] = useState(false);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [defaultFileList, setDefaultFileList] = useState([]);
    const [getUserById, setGetUserById] = useState(null)
    const [getUserLoading, setGetUserLoading] = useState(false)
    /*---------------Query---------*/
    // const [useGetUserById, { data: { getUserById } = {}, loading: getUserLoading }] = useLazyQuery(GET_USER_BY_ID)

    /*--------Mutation---------*/
    // const [updateUserProfile, { loading: updateUserProfileLoading }] = useMutation(UPDATE_USER_PROFILE)
    // const [updateProfilePicture, { loading: updateProfilePictureLoading }] = useMutation(UPDATE_PROFILE_PICTURE)

    /* initial render API Calls */
    useEffect(() => {
        setGetUserLoading(true)
        axios.post('user/me').then(({ data }) => {
            if (data.result) {
                data.user.dateOfBirth = moment(data.user.dateOfBirth)
                setGetUserById(data.user);
            }
            setGetUserLoading(false)

        }).catch(function (error) {
            dispatch(updateLoadUser());
        });
    }, []);

    const OverView = [
        {
            icon: 'wall',
            title: 'Gender',
            desc: getUserById && getUserById.gender
        },
        {
            icon: 'home',
            title: 'Lives in',
            desc: (getUserById && getUserById.city ? getUserById.city : "-") + ", " +
                (getUserById && getUserById.address ? getUserById.address : "-") + ", " +
                (getUserById && getUserById.state ? getUserById.state : "-")
        },
        {
            icon: 'company',
            title: 'Date of Joining',
            desc: getUserById && getUserById.date_of_joining
        },
        {
            icon: 'birthday-new',
            title: 'Date of Birth',
            desc: getUserById && getUserById.date_of_birthString
        },
        {
            icon: 'family',
            title: 'Anniversary Date',
            desc: getUserById && getUserById.anniversary_dateString
        },
        {
            icon: 'diamond',
            title: 'Marital Status',
            desc: getUserById && getUserById.marital_status
        }
    ]

    const Work = [
        {
            icon: 'company',
            title: 'Role',
            desc: getUserById && getUserById.role
        },
        {
            icon: 'company',
            title: 'Designation',
            desc: getUserById && getUserById.designationId && getUserById.designationId.designationName
        },
        {
            icon: 'company',
            title: 'Department',
            desc: getUserById && getUserById.departmentId && getUserById.departmentId.departmentName
        },
        {
            icon: 'company',
            title: 'Reporting Head',
            desc: getUserById && getUserById.reportingHeadId && getUserById.reportingHeadId.name
        },
        {
            icon: 'company',
            title: 'User Type',
            desc: getUserById && getUserById.user_type && getUserById.user_type.typeName
        },
        {
            icon: 'company',
            title: 'Salary Level',
            desc: getUserById && getUserById.salaryLevelId && getUserById.salaryLevelId.levelName
        }
    ]

    const Other = [
        {
            icon: 'card',
            title: 'Aadhar Number',
            desc: getUserById && getUserById.aadharNo
        },
        {
            icon: 'card',
            title: 'PAN Number',
            desc: getUserById && getUserById.panNo
        },
        {
            icon: 'card',
            title: 'IFSC',
            desc: getUserById && getUserById.ifsc
        },
        {
            icon: 'card',
            title: 'Bank Name',
            desc: getUserById && getUserById.bankName
        },
        {
            icon: 'card',
            title: 'Bank Account Number',
            desc: getUserById && getUserById.bankAccountNo
        },
    ]

    const showModal = () => {
        setIsEditModalVisible(true);
    };

    const handleOk = () => {
        setIsEditModalVisible(false);
    };

    const handleCancel = () => {
        setIsEditModalVisible(false);
    };


    const onChange = (e) => {
        setStatus(e.target.value);
    };


    const onEditDetails = () => {
        editDetailForm.setFieldsValue({
            address: getUserById && getUserById.address ? getUserById.address : null,
            city: getUserById && getUserById.city ? getUserById.city : null,
            state: getUserById && getUserById.state ? getUserById.state : null,
            date_of_birth: (getUserById && getUserById.date_of_birth != null) ? moment(getUserById && getUserById.date_of_birth, 'DD-MM-YYYY') : null,
            marital_status: getUserById && getUserById.marital_status,
            anniversary_date: (getUserById && getUserById.anniversary_date != null) ? moment(getUserById && getUserById.anniversary_date, 'DD-MM-YYYY') : null
        })
        setStatus(getUserById && getUserById.marital_status)
        showModal();
    }

    const onFormSubmit = (values) => {
        if (values.date_of_birth || values.anniversary_date) {
            values.date_of_birth = moment(values.date_of_birth).format("DD-MM-YYYY");
            if (values.marital_status == "Married") {
                values.anniversary_date = moment(values.anniversary_date).format("DD-MM-YYYY");
            } else {
                values.anniversary_date = null;
            }
        }
        values._id = userId
        handleCancel();
    }

    

    

    return (
        <div>
            <div className="gx-profile-banner">
                <div className="gx-profile-container">
                    <div className="gx-profile-banner-top">
                        <div className="gx-profile-banner-top-left">
                            <div className="gx-profile-banner-avatar gx-mt-3 gx-ml-4">
                                <Tooltip title="Edit Profile Picture" className='gx-text-primary'>
                                    <ImgCrop
                                        grid
                                        // rotate 
                                        modalMaskTransitionName="none"
                                        modalTransitionName="none"
                                        beforeCrop={beforeUpload}
                                        onModalCancel={() => { setUploadFileList([]); }}
                                        onModalOk={() => { setCount(count => count + 1) }}
                                    // onModalOk={ () => { onProfileUpdate(uploadFileList) } }
                                    >
                                        <Upload
                                            fileList={uploadFileList}
                                            showUploadList={false}
                                            onChange={(e) => onFileChange(e)}
                                            // onPreview={(e) => onPreview(e)}
                                            maxCount={1}
                                        >
                                            <Badge className='gx-pointer' count={<CameraOutlined style={{ borderRadius: "100%", padding: "4px", backgroundColor: "#CCCCCC", fontSize: "1.2rem", marginLeft: "0.5rem" }} />} offset={[-25, 110]}>
                                                <Avatar style={{ position: 'relative' }} className="gx-size-120" alt="..." src={(getUserById && getUserById.avatar) ? (process.env.NEXT_PUBLIC_BACKEND_PATH_VARIABLE + getUserById.avatar) : "/images/profile/default.jpg"} />
                                            </Badge>
                                        </Upload>
                                    </ImgCrop>
                                </Tooltip>
                            </div>
                            <div className="gx-profile-banner-avatar-info">
                                <h2 className="gx-mb-2 gx-mb-sm-3 gx-fs-xxl gx-font-weight-light">{getUserById && getUserById.name ? getUserById.name : "-"}</h2>
                                <p className="gx-mb-0 gx-fs-lg gx-text-capitalize">{getUserById && getUserById.role ? getUserById.role : "-"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="gx-profile-banner-bottom">
                        <span className="gx-link gx-profile-setting" style={{ marginRight: '1.5rem' }}>
                            <span className="gx-d-inline-flex gx-vertical-align-middle gx-ml-2 gx-ml-sm-0">
                                <Button icon={<EditOutlined />} className="gx-mb-0" onClick={() => onEditDetails()}>
                                    Edit Profile
                                </Button>
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            <div className='gx-profile-content gx-ml-4'>
                <Row>
                    {/* // About */}
                    <Col xl={16} lg={14} md={14} sm={24} xs={24}>
                        <Widget title="About" loading={getUserLoading} styleName="gx-card-tabs gx-card-profile">
                            <Tabs className='gx-tabs-right' defaultActiveKey="1">
                                <TabPane tab="Overview" key="1">
                                    <div className="gx-mb-2">
                                        <Row gutter={[40, 14]}>
                                            {
                                                OverView.map((data, index) =>
                                                    <Col key={index} xl={8} lg={12} md={12} sm={12} xs={24}>
                                                        <div key={index} className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                                                            <div className="gx-mr-3">
                                                                <i className={`icon icon-${data.icon} gx-fs-2xl gx-text-orange`} />
                                                            </div>
                                                            <div className="gx-media-body">
                                                                <span className="gx-mb-0 gx-text-grey gx-fs-md">{data.title}</span>
                                                                {
                                                                    !(data.desc) ?
                                                                        <p className="gx-mb-0">-</p>
                                                                        :
                                                                        <p className="gx-mb-0 gx-text-capitalize">{data.desc}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            }
                                        </Row>
                                    </div>
                                </TabPane>
                                <TabPane tab="Work" key="2">
                                    <div className="gx-mb-2">
                                        <Row gutter={[40, 14]}>
                                            {
                                                Work.map((data, index) =>
                                                    <Col key={index} xl={8} lg={12} md={12} sm={12} xs={24}>
                                                        <div key={index} className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                                                            <div className="gx-mr-3">
                                                                <i className={`icon icon-${data.icon} gx-fs-2xl gx-text-orange`} />
                                                            </div>
                                                            <div className="gx-media-body">
                                                                <span className="gx-mb-0 gx-text-grey gx-fs-md">{data.title}</span>
                                                                {
                                                                    !(data.desc) ?
                                                                        <p className="gx-mb-0">-</p>
                                                                        :
                                                                        <p className="gx-mb-0 gx-text-capitalize">{data.desc}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            }
                                        </Row>
                                    </div>
                                </TabPane>
                                <TabPane tab="Other" key="3">
                                    <div className="gx-mb-2">
                                        <Row gutter={[40, 14]}>
                                            {
                                                Other.map((data, index) =>
                                                    <Col key={index} xl={8} lg={12} md={12} sm={12} xs={24}>
                                                        <div key={index} className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                                                            <div className="gx-mr-3">
                                                                <i className={`icon icon-${data.icon} gx-fs-2xl gx-text-orange`} />
                                                            </div>
                                                            <div className="gx-media-body">
                                                                <span className="gx-mb-0 gx-text-grey gx-fs-md">{data.title}</span>
                                                                {
                                                                    !(data.desc) ?
                                                                        <p className="gx-mb-0">-</p>
                                                                        :
                                                                        <p className="gx-mb-0">{data.desc}</p>
                                                                }
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            }
                                        </Row>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </Widget>
                    </Col>

                    <Col xl={8} lg={10} md={10} sm={24} xs={24}>
                        <Widget title="Contact" loading={getUserLoading} styleName="gx-card-profile-sm">
                            <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                                <div className="gx-mr-4">
                                    <i className={`icon icon-email gx-fs-2xl gx-text-orange`} />
                                </div>
                                <div className="gx-media-body">
                                    <span className="gx-mb-0 gx-text-grey gx-fs-md">Email</span>
                                    <p className="gx-mb-0">{getUserById && getUserById.email ? getUserById.email : "-"}</p>
                                </div>
                            </div>

                            <div className="gx-media gx-align-items-center gx-flex-nowrap gx-pro-contact-list">
                                <div className="gx-mr-4">
                                    <i className={`icon icon-phone gx-fs-2xl gx-text-orange`} />
                                </div>
                                <div className="gx-media-body">
                                    <span className="gx-mb-0 gx-text-grey gx-fs-md">Phone</span>
                                    <p className="gx-mb-0">{getUserById && getUserById.mobile_number ? getUserById.mobile_number : "-"}</p>
                                </div>
                            </div>

                        </Widget>
                    </Col>
                </Row>
            </div>

            <Modal
                title="Edit Detail"
                visible={isEditModalVisible}
                okText="Update"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={
                    <div key="userModalFooter">
                        <Button key="back" onClick={handleCancel}>Cancel</Button>
                        <Button key="submit" type="primary" htmlType="submit" form="editDetailForm" loading={updateUserProfileLoading}>Update</Button>
                    </div>
                }
            >
                <Form form={editDetailForm} name="editDetailForm" onFinish={onFormSubmit}>
                    <Card bordered={false} bodyStyle={{ padding: "5px" }}>
                        <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                            <Input type="text" />
                        </Form.Item>

                        <Form.Item label="City" name="city" rules={[{ required: true }]}>
                            <Input type="text" />
                        </Form.Item>

                        <Form.Item label="State" name="state" rules={[{ required: true }]}>
                            <Input type="text" />
                        </Form.Item>

                        <Form.Item label="Date of Birth" name="date_of_birth" rules={[{ required: true }]}>
                            <DatePicker style={{ width: "100%" }} format={'DD-MM-YYYY'} />
                        </Form.Item>

                        <Form.Item label="Marital Status" name="marital_status" rules={[{ required: true }]}>
                            <Radio.Group onChange={onChange} value={status}>
                                <Radio value="Married">Married</Radio>
                                <Radio value="Unmarried">Unmarried</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {
                            status == 'Married' ?
                                <Form.Item label="Anniversary Date" name="anniversary_date" rules={[{ required: true }]}>
                                    <DatePicker style={{ width: "100%" }} format={'DD-MM-YYYY'} />
                                </Form.Item>
                                :
                                null
                        }
                    </Card>
                </Form>
            </Modal>
        </div>
    )
}

export default ProfileComponent