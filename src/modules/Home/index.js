import React, { useState, useEffect, useMemo } from "react";
import {
    Container,
} from "react-bootstrap";
import {
    Card,
    Text,
    Button,
    Group,
    Flex,
    Center,
    Divider,
    Space,
    Accordion,
    Modal,
    TextInput,
    Table
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from "@mantine/notifications";
import {
    PersonCircle,
    Pencil,
    FileEarmarkText,
    CurrencyDollar,
    PencilSquare,
    BoxArrowLeft
} from 'react-bootstrap-icons'
import PocketBase from 'pocketbase';
import "./home.css";
import { useNavigate } from "react-router-dom";
import TopNav from "../../components/topnav";
import Joyride from 'react-joyride'
import AdminTable from "./AdminTable";

const pb = new PocketBase("http://127.0.0.1:8090")

const Home = () => {
    const navigate = useNavigate()
    const [employeeProfile, setEmployeeProfile] = useState({
        name: "",
        email: "",
        role: "",
        job_title: "",
        contact: "",
        ic: ""
    })
    const [announcements, setAnnouncements] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [isOpen, setIsOpened] = useState(false)
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])

    const [steps, setSteps] = useState(
        [{
            target: ".first-step",
            content: "This is the Side Navigation Bar",
        }, {
            target: '.second-step',
            content: "This will lead to the leave application page. You can see the leaves you applied, whether it was approved and create a leave application",
        }, {
            target: ".third-step",
            content: "This will lead to the claim application page. You can all your claim application here, checked whether it was approve and create one accordingly",
        }, {
            target: '.fourth-step',
            content: "This is where you can write performance reviews on your peers or supervisor",
        }, {
            target: '.fifth-step',
            content: "This is where you logout.",
        }, {
            target: '.sixth-step',
            content: "You can view and update your profile here",
        }, {
            target: ".seventh-step",
            content: "This is where you can see announcement made by the supervisor",
        }]
    )

    const form = useForm({
        initialValues: {
            contact: "",
            ic: ""
        },
    });

    const profileForm = useForm({
        initialValues: {
            name: pb.authStore.model.name,
            email: pb.authStore.model.email,
            ic: pb.authStore.model.ic,
            contact: pb.authStore.model.contact
        },
    });


    useEffect(() => {
        if (!loaded) {
            getEmployeeProfile()
            getAnnouncement()
            getUsers()
        }
    }, [])

    useEffect(() => {
        getEmployeeProfile()
    }, [employeeProfile])

    useEffect(() => {
        getAnnouncement()
    }, [announcements])

    const isLoggedIn = useMemo(() => {
        return pb.authStore.isValid;
    }, [pb.authStore.isValid]);

    const getEmployeeProfile = () => {
        try {
            setEmployeeProfile({
                name: pb.authStore.model.name,
                email: pb.authStore.model.email,
                role: pb.authStore.model.role,
                job_title: pb.authStore.model.job_title,
                contact: pb.authStore.model.contact,
                ic: pb.authStore.model.ic
            })
            setLoaded(true)
        } catch (err) {
            showNotification({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            })
        }
    }

    const getAnnouncement = async () => {
        try {
            const records = await pb.collection('announcement').getFullList(200, {
                sort: '-created',
                $autoCancel: false
            });
            setAnnouncements(records)
        } catch (err) {
            showNotification({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            })
        }
    }

    const getUsers = async () => {
        try {
            const records = await pb.collection('users').getFullList(200, {
                sort: '-created',
                $autoCancel: false
            });
            setUsers(records)
        } catch (err) {
            showNotification({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            })
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const record = await pb.collection('users').update(pb.authStore.model.id, {
                "contact": form.values.contact,
                "ic": form.values.ic,
                "onboarding_status": false
            });
            setLoading(false)
            setIsOpened(false)
            showNotification({
                title: 'Success',
                message: 'You have successfully completed your details.',
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

    const onSubmitProfileHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const record = await pb.collection('users').update(pb.authStore.model.id, {
                "name": profileForm.values.name,
                "email": profileForm.values.email,
                "contact": profileForm.values.contact,
                "ic": profileForm.values.ic,
            });
            setLoading(false)
            setIsEditing(false)
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
        <Container >
            <div class="wrapper">
                <div class="sidebar first-step">
                    <h2 className='my-auto'><a onClick={() => navigate('/')}>OFA</a></h2>
                    <div>
                        <div class="section second-step">
                            <Flex align="center">
                                <FileEarmarkText style={{ paddingRight: '15px', color: '#bdb8d7' }} />
                                <a onClick={() => navigate('/leave')}>Leave</a>
                            </Flex>
                        </div>
                        <div class="section third-step">
                            <Flex align='center'>
                                <CurrencyDollar style={{ paddingRight: '15px', color: '#bdb8d7' }} />
                                <a onClick={() => navigate('/claims')}>Claims</a>
                            </Flex>
                        </div>
                        <div class="section fourth-step">
                            <Flex align="center">
                                <PencilSquare style={{ paddingRight: '15px', color: '#bdb8d7' }} />
                                <a onClick={() => navigate('/performance_review')}>Performance Review</a>
                            </Flex>
                        </div>

                        <div class="section fifth-step" id='anchored'>
                            <Flex align="center">
                                <BoxArrowLeft style={{ paddingRight: '15px', color: '#bdb8d7' }} />
                                <a onClick={() => {
                                    pb.authStore.clear();
                                    navigate('/login');
                                }}>
                                    Logout
                                </a>
                            </Flex>
                        </div>
                    </div>
                </div>
            </div>
            <TopNav />
            {pb.authStore.model.onboarding_status && pb.authStore.model.onboarding_status == true ? (
                <Joyride steps={steps} continuous={true} showProgress={true} callback={(step) => {
                    const currentStep = step.index + 1
                    if (currentStep === steps.length) {
                        setIsOpened(true)
                    }
                }} />
            ) :
                <div></div>
            }
            {
                pb.authStore.model.role == 'supervisor' ? (
                    <AdminTable users={users} announcements={announcements}/>
                ) : (
                    <div>

                        <Container style={{ marginLeft: "200px", marginTop: "50px" }}>
                            <Modal
                                centered
                                opened={isOpen}
                                withCloseButton={false}
                                onClose={() => setIsOpened(false)}
                                title="Welcome! Please Fill in the Details">
                                <form onSubmit={onSubmitHandler}>
                                    <TextInput
                                        withAsterisk
                                        label="Contact"
                                        placeholder="xxx-xxxxxxx"
                                        {...form.getInputProps('contact')}
                                    />

                                    <TextInput
                                        mt="md"
                                        label="IC Number"
                                        placeholder="xxxxxx-xx-xxxx"
                                        {...form.getInputProps('ic')}
                                    />

                                    <Group position="right" mt="md">
                                        <Button type="submit">Submit</Button>
                                    </Group>
                                </form>
                            </Modal>
                            <div class="sixth-step">
                                <Center >
                                    {!isEditing ? (
                                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ width: 800 }} >
                                            <Card.Section inheritPadding py="xs">
                                                <Text weight={500} fz="xl">Profile</Text>
                                            </Card.Section>
                                            <Space h="xs" />
                                            <Group>
                                                <PersonCircle style={{ fontSize: "3rem" }} />
                                                <Flex direction="column">
                                                    <Text fz="md">Name: {employeeProfile?.name}</Text>
                                                    <Text fz="md">Job Title: {employeeProfile.job_title ? employeeProfile.job_title : "-"}</Text>
                                                </Flex>
                                            </Group>
                                            <Space h="xs" />
                                            <Flex direction="column" >
                                                <Text fz="md">Email: {employeeProfile.email}</Text>
                                                <Text fz="md">IC: {employeeProfile.ic ? employeeProfile.ic : "-"}</Text>
                                                <Text fz="md">Contact Number: {employeeProfile.contact ? employeeProfile.contact : "-"}</Text>
                                            </Flex>

                                            <Divider mt="lg" />
                                            <Flex justify="flex-end">
                                                <Button variant="light" color="blue" mt="md" radius="md" onClick={() => setIsEditing(true)}>
                                                    <Pencil />
                                                    <Space w="sm" />
                                                    Edit Profile
                                                </Button>
                                            </Flex>
                                        </Card>
                                    ) : (
                                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ width: 800 }} >
                                            <Card.Section inheritPadding py="xs">
                                                <Text weight={500} fz="xl">Profile</Text>
                                            </Card.Section>
                                            <Space h="xs" />
                                            <form>
                                                <Group>
                                                    <PersonCircle style={{ fontSize: "3rem" }} />
                                                    <Flex direction="column">
                                                        <Flex direction="row">
                                                            <TextInput
                                                                label="Name"
                                                                {...profileForm.getInputProps('name')} />
                                                        </Flex>
                                                        <Space h="sm" />
                                                        <Text fz="md">Job Title: {employeeProfile.job_title ? employeeProfile.job_title : "-"}</Text>
                                                    </Flex>
                                                </Group>
                                                <Space h="xs" />
                                                <Flex direction="column" >
                                                    <Flex direction="row">
                                                        <TextInput
                                                            label="Email"
                                                            {...profileForm.getInputProps('email')} />
                                                    </Flex>
                                                    <Space h="sm" />
                                                    <Flex direction="row">
                                                        <TextInput
                                                            label="IC Number"
                                                            {...profileForm.getInputProps('ic')} />
                                                    </Flex>
                                                    <Space h="sm" />
                                                    <Flex direction="row">
                                                        <TextInput
                                                            label="Contact Number"
                                                            {...profileForm.getInputProps('contact')} />
                                                    </Flex>
                                                </Flex>

                                                <Divider mt="lg" />
                                                <Flex justify="flex-end">
                                                    <Button color="red" mt="md" radius="md" onClick={() => setIsEditing(false)}>
                                                        Cancel
                                                    </Button>

                                                    <Space w="sm" />
                                                    <Button color="blue" mt="md" radius="md" onClick={onSubmitProfileHandler}>
                                                        Update Profile
                                                    </Button>
                                                </Flex>
                                            </form>
                                        </Card>
                                    )}


                                </Center>
                            </div>

                            <div class="seventh-step">
                                <Container style={{ marginLeft: 120, marginTop: 50 }}>
                                    <Text fz="xl" fw={600} >Announcements</Text>
                                    <Accordion
                                        variant="contained"
                                        radius="md"
                                        chevronPosition="left"
                                        style={{ width: "90%", backgroundColor: 'white', marginTop: 10 }} >
                                        {announcements && announcements.map((announcement) => (
                                            <Accordion.Item value={announcement.title} key={announcement.id} >
                                                <Accordion.Control>
                                                    <div style={{ display: "flex", justifyContent: 'space-between' }}>
                                                        <Text>{announcement.title}</Text>
                                                        <Text style={{ marginRight: 20 }}>{new Date(announcement.created).toLocaleString()}</Text>
                                                    </div>
                                                </Accordion.Control>
                                                <Accordion.Panel>{announcement.description}</Accordion.Panel>
                                            </Accordion.Item>
                                        ))}
                                    </Accordion>
                                </Container>
                            </div>
                        </Container>
                    </div>
                )
            }

        </Container>
    )
}

export default Home