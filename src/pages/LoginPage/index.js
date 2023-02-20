import React, { useState, useMemo } from 'react';
import { Card, Container, PasswordInput, Space, Title, Button, TextInput, Group, Flex, Image, Divider } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { PersonFill } from 'react-bootstrap-icons'
import PocketBase from 'pocketbase';
import TopNav from '../../components/topnav';

const pb = new PocketBase('http://127.0.0.1:8090');

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const disabled = useMemo(() => {
        return loading;
    }, [loading]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const authData = await pb.collection('users').authWithPassword(
                email,
                password,
            );
            setLoading(false);
            showNotification({
                title: 'Success',
                message: 'You have successfully logged in.',
                color: 'green',
                icon: <i className="bi bi-check-circle"></i>
            });
            navigate('/');
        } catch (error) {
            setLoading(false);
            showNotification({
                title: 'Error',
                message: error.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            });
        }
    }

    return (
        <div>
            <TopNav />
            <Container
                pt="90px"
                pb="45px"
            >
                <Flex justify='center' align="center" >
                    <Image width={500} src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1776&q=80" />

                    <Divider orientation="vertical" style={{marginRight: '75px', marginLeft: '75px'}} size="sm"/>

                    <div>
                        <Card
                        style={{width: "500px", height: "300px"}}
                            shadow="sm" padding="sm">
                            <Flex align='center' justify='center'>
                                <PersonFill style={{ fontSize: "27px", paddingRight: "10px" }} />
                                <Title order={3} align="center">Welcome Back</Title>
                            </Flex>
                            <Space h="md" />
                            <TextInput
                                label="Email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) => setEmail(event.currentTarget.value)}
                                disabled={disabled}
                            />
                            <Space h="md" />
                            <PasswordInput
                                label="Password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) => setPassword(event.currentTarget.value)}
                                disabled={disabled}
                            />
                            <Space h="md" />
                            <Button
                                fullWidth
                                variant="light"
                                color="violet"
                                loading={loading}
                                onClick={handleSubmit}>
                                Login
                            </Button>
                        </Card>
                        <Group
                            mt="lg"
                            position='right'
                        >
                            <Button
                                variant='subtle'
                                color='blue'
                                rightIcon={<i className="bi bi-arrow-right"></i>}
                                onClick={() => navigate('/signup')}
                                disabled={disabled}
                            >
                                Don't have an account? Sign up here
                            </Button>
                        </Group>
                    </div>

                </Flex>

            </Container>
        </div>

    );
}

export default LoginPage;