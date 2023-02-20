import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Button, Text, Flex, Card, Image, Group, Badge, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import SideNav from '../../components/sidenav';
import TopNav from '../../components/topnav';
import PocketBase from 'pocketbase'
import { useNavigate } from 'react-router-dom';
import LeaveAdmin from './admin_table';

const pb = new PocketBase('http://127.0.0.1:8090')

const Leave = () => {
    const [leaves, setLeaves] = useState([])
    const [leaveType, setLeaveType] = useState([])
    const [loaded, setLoaded] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (!loaded) {
            getLeaves()
            getLeavesType()
        }
    }, [])

    const getLeaves = async () => {
        try {
            const records = await pb.collection('leaves').getFullList(200 /* batch size */, {
                sort: '-created',
                filter: `user.id = "${pb.authStore.model.id}"`,
                $autoCancel: false
            });
            setLeaves(records)
            setLoaded(true)
        } catch (err) {
            showNotification({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            });
        }
    }

    const getLeavesType = async () => {
        try {
            const records = await pb.collection('leave_types').getFullList(200 /* batch size */, {
                sort: '-created',
                $autoCancel: false
            });
            setLeaveType(records)
            setLoaded(true)
        } catch (err) {
            showNotification({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            });
        }
    }
    return (
        <div>
            <SideNav />
            <TopNav />
            <Container style={{ marginLeft: "250px", marginTop: "50px" }}>
                <Flex style={{ justifyContent: 'space-between' }} align='center'>
                    <Text weight={500} style={{ fontSize: "27px" }}>Leave</Text>
                    {pb.authStore.model.role != "supervisor" ? (
                        <Button style={{ marginRight: "50px" }} color="green" onClick={() => navigate('/add_leave')}>Create Leave Application</Button>
                    ) : (<div></div>)}
                </Flex>
                <Space h="md" />
                {
                    pb.authStore.model.role != "supervisor" ? (
                        <Flex>
                            {leaves.map(leave => {
                                return (
                                    <Card shadow="sm" p="lg" radius="md" withBorder style={{ width: "350px", marginRight: "20px", marginBottom: '20px' }}>
                                        <Card.Section>
                                            <Image
                                                src={leave.evidence}
                                                height={160}
                                            />
                                        </Card.Section>

                                        {leaveType.map(type => {
                                            if (type.id == leave.leave_type) {
                                                return (
                                                    <Text>Type of Leave: {type.leave_name}</Text>
                                                )
                                            }
                                        })}
                                        <Text>Date: {new Date(leave.date_of_leave).toDateString()}</Text>
                                        <Text>Number of Days: {leave.number_of_days}</Text>
                                        <Badge color={leave.approved == 0 ? "yellow" : leave.approved == "1" ? "green" : "red"}>{leave.approved == 0 ? "PENDING" : leave.approved == "1" ? "APPROVED" : "DENIED"}</Badge>
                                    </Card>
                                )
                            })}
                        </Flex>
                    ) : (
                        <LeaveAdmin leaves={leaves} leaveType={leaveType}/>
                    )
                }


            </Container>
        </div>
    )
}

export default Leave