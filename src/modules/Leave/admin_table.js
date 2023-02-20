import React, { useState, useEffect } from 'react'
import { Table, Box, Group, Button, Space, Badge, LoadingOverlay, Text } from '@mantine/core'
import PocketBase from 'pocketbase'
import { showNotification } from '@mantine/notifications'


const pb = new PocketBase('http://127.0.0.1:8090');


const LeaveAdmin = ({ leaveType }) => {
    const [leaves, setLeaves] = useState([])
    const [users, setUsers] = useState([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (!loaded) {
            getLeaves()
            getUsers()
        }
    }, [])

    useEffect(() => {
        getLeaves()
        getUsers()
    }, [leaves])


    const getUsers = async () => {
        try {
            const records = await pb.collection('users').getFullList(200 /* batch size */, {
                sort: '-created',
                $autoCancel: false
            });
            setUsers(records)
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

    const getLeaves = async () => {
        try {
            const records = await pb.collection('leaves').getFullList(200 /* batch size */, {
                sort: '-created',
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

    const onClickApprove = async (e, id) => {
        e.preventDefault()
        try{
            const record = await pb.collection('leaves').update(id, {
                "approved": parseInt(1)
            });
            showNotification({
                title: 'Success',
                message: 'You have approved this leave application',
                color: 'green',
                icon: <i className="bi bi-check-circle"></i>
            });
        } catch(err) {
            showNotification({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            });
        }
    }

    const onClickDeny = async (e, id) => {
        e.preventDefault()
        try{
            const record = await pb.collection('leaves').update(id, {
                "approved": 2
            });
            showNotification({
                title: 'Success',
                message: 'You have deny this leave application',
                color: 'green',
                icon: <i className="bi bi-check-circle"></i>
            });
        } catch(err) {
            showNotification({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            });
        }
    }
    return (
        <Table>
            <thead>
                <tr>
                    <th>Date of Leave</th>
                    <th>Number of Days</th>
                    <th>Approve</th>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Action(s)</th>
                </tr>
            </thead>
            <tbody>
                {leaves.length > 0 ? leaves.map(leave => (
                    <tr key={leave.id}>
                        <td>{new Date(leave.date_of_leave).toDateString()}</td>
                        <td>{leave.number_of_days}</td>
                        <td>{leave.approved == 1 ? <Badge color="green">Approved</Badge> : leave.approved == 2 ? <Badge color="red">Denied</Badge> : <Badge color="yellow">Pending</Badge>}</td>
                        <td>{users.map(user => {
                            if (user.id == leave.user) {
                                return user.name
                            }
                        })}</td>
                        <td>{leaveType.map(type => {
                            if (type.id == leave.leave_type) {
                                return type.leave_name
                            }
                        })}</td>
                        <td>
                            <Group position="center">
                                <Button
                                    disabled={leave.approved != 0 ? true : false}
                                    variant="filled"
                                    color="green"
                                    compact
                                    leftIcon={<i className="bi bi-check"></i>}
                                    onClick={(e) => {onClickApprove(e, leave.id.toString())}}
                                >Approve
                                </Button>
                                <Button
                                    disabled={leave.approved != 0 ? true : false}
                                    variant="filled"
                                    color="red"
                                    compact
                                    leftIcon={<i className="bi bi-x-lg"></i>}
                                    onClick={(e) => {onClickDeny(e, leave.id.toString())}}
                                >
                                    Deny
                                </Button>
                            </Group>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="6" align="center">No Leave submitted yet.</td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}

export default LeaveAdmin