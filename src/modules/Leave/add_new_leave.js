import { Center, Divider } from "@mantine/core"
import React, { useState, useEffect } from "react"
import SideNav from "../../components/sidenav"
import TopNav from "../../components/topnav"
import { Card, Container, Flex, Text, Button, Space, Group, NumberInput, Select, FileInput, Textarea } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { useForm } from "@mantine/form"
import PocketBase from 'pocketbase'
import { DatePicker } from "@mantine/dates"
import { showNotification } from "@mantine/notifications"

const pb = new PocketBase('http://127.0.0.1:8090')

const AddLeave = () => {
    const [leaveType, setLeaveType] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [selectData, setSelectData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const form = useForm({
        initialValues: {
            date_of_leave: "",
            number_of_days: 0,
            reason: "",
            leave_type: ""
        },
    });

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

    useEffect(() => {
        if (!loaded) {
            getLeavesType()
        }
    }, [])

    leaveType.map(type => {
        selectData.push({ value: type.id.toString(), label: type.leave_name })
    })

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const record = await pb.collection('leaves').create({
                "date_of_leave": new Date(form.values.date_of_leave),
                "number_of_days": form.values.number_of_days,
                "user": pb.authStore.model.id,
                "reason": form.values.reason,
                "leave_type": form.values.leave_type,
            });
            setLoading(false)
            navigate('/leave')
            showNotification({
                title: 'Success',
                message: 'You have successfully updated your details.',
                color: 'green',
                icon: <i className="bi bi-check-circle"></i>
            });
        } catch (err) {
            setLoading(false)
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
                    <Text weight={500} style={{ fontSize: "27px" }}>Create Leave Application </Text>
                </Flex>
                <Space h="md" />

                <Center>
                    <Card style={{ width: "80%" }}>
                        <form onSubmit={onSubmitHandler}>
                            <Flex align="center" justify="center">
                                <DatePicker
                                    style={{ width: "35%" }}
                                    withAsterisk
                                    label="Day of leave"
                                    placeholder="Pick A Date"
                                    {...form.getInputProps('date_of_leave')}
                                />

                                <NumberInput
                                    style={{ width: "35%", marginLeft: "50px" }}
                                    ml="xl"
                                    label="Number of Days"
                                    placeholder="How many day on leave"
                                    {...form.getInputProps('number_of_days')}
                                />
                            </Flex>

                            <Flex align="center" justify="center" pt="xl">
                                <Select
                                    style={{ width: "35%" }}
                                    label="Type of Leave"
                                    placeholder="Pick One"
                                    data={selectData}
                                    {...form.getInputProps('leave_type')}
                                />

                                <FileInput
                                    style={{ width: "35%" , marginLeft: "50px"}}
                                    ml="xl"
                                    label="Your MC"
                                    placeholder="Upload a file"
                                />
                            </Flex>

                            <Center pt="xl">
                                <Textarea 
                                    placeholder="Your reason..." 
                                    label="Your Reason" 
                                    style={{ width: "77%" }}
                                    {...form.getInputProps('reason')} />
                            </Center>

                            <Center>
                                <Group position="right" mt="md">
                                    <Button type="submit">Submit</Button>
                                </Group>
                            </Center>

                        </form>
                    </Card>
                </Center>




            </Container>
        </div>
    )
}

export default AddLeave