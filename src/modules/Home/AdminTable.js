import React, { useState } from "react"
import { Container, Table, Accordion, Text, Button, Flex, Modal, TextInput, Group, Textarea } from '@mantine/core'
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import PocketBase from 'pocketbase'

const pb = new PocketBase("http://127.0.0.1:8090")

let AdminTable = ({ users, announcements }) => {
    const [isOpen, setIsOpened] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const record = await pb.collection('announcement').create({
                "title": form.values.title,
                "description": form.values.description,
                "announcer": pb.authStore.model.id
            });
            setIsOpened(false)
            showNotification({
                title: 'Success',
                message: 'You have successfully created an announcement',
                color: 'green',
                icon: <i className="bi bi-check-circle"></i>
            });
        } catch (err) {
            showNotification({
                title: 'Error',
                message: err.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            });
        }
    }

    const form = useForm({
        initialValues: {
            title: "",
            description: ""
        },
    });

    return (
        <Container>
            <Table style={{ marginLeft: "250px", marginTop: "50px", width: "60%" }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Job Title</th>
                        <th>Contact</th>
                        <th>IC</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.job_title ? user.job_title : "-"}</td>
                            <td>{user.contact ? user.contact : "-"}</td>
                            <td>{user.ic ? user.contact : "-"}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" align="center">No User registered yet.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div class="seventh-step">
                <Container style={{ marginLeft: 120, marginTop: 50 }}>

                    <Flex align="center">
                        <Group position="apart">
                            <Text fz="xl" fw={600} >Announcements</Text>
                            <Button color='teal' variant='light' compact onClick={() => setIsOpened(true)}>Create Announcement</Button>
                        </Group>
                    </Flex>

                    <Modal
                        centered
                        opened={isOpen}
                        withCloseButton={false}
                        onClose={() => setIsOpened(false)}
                        title="Create Announcement">
                        <form onSubmit={onSubmitHandler}>
                            <TextInput
                                withAsterisk
                                label="Title"
                                placeholder="Write your title"
                                {...form.getInputProps('title')}
                            />

                            <Textarea
                                withAsterisk
                                mt="md"
                                label="Description"
                                placeholder="Description on title..."
                                {...form.getInputProps('description')}
                            />

                            <Group position="right" mt="md">
                                <Button type="submit">Submit</Button>
                            </Group>
                        </form>
                    </Modal>

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
    )
}

export default AdminTable