import React, { useState, useMemo } from 'react';
import { Card, Container, PasswordInput, Space, Title, Button, TextInput, Group, Image, Flex, Divider } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { PersonPlusFill } from 'react-bootstrap-icons'
import PocketBase from 'pocketbase'
import TopNav from '../../components/topnav';

const pb = new PocketBase('http://127.0.0.1:8090');

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const disabled = useMemo(() => {
        return loading;
    }, [loading]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {

            const data = await pb.collection('users').create({
                "email": email,
                "password": password,
                "passwordConfirm": passwordConfirm,
                "name": name,
                "onboarding_status": true
            });

            setLoading(false);
            showNotification({
                title: 'Success',
                message: 'You have successfully signed up. Please login to continue.',
                color: 'green',
                icon: <i className="bi bi-check-circle"></i>
            });
            navigate('/login');

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
                size="xs"
                pt="60px"
                pb="45px"
            >
                <Flex justify="center" align="center">
                    <Image width={500} src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" />
                    
                    <Divider orientation="vertical" style={{marginRight: '75px', marginLeft: '75px'}} size="sm"/>
                    
                    <div>
                        <Card
                        style={{width: "500px", height: "450px"}}
                            shadow="sm" padding="md">
                            <Flex align='center' justify='center'>
                                <PersonPlusFill style={{ fontSize: "27px", paddingRight: "10px" }} />
                                <Title order={3} align="center">Register Here</Title>
                            </Flex>
                            
                            <Space h="md" />
                            <TextInput
                                label="Name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(event) => setName(event.currentTarget.value)}
                                disabled={disabled}
                            />
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
                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                value={passwordConfirm}
                                onChange={(event) => setPasswordConfirm(event.currentTarget.value)}
                                disabled={disabled}
                            />
                            <Space h="md" />
                            <Button
                                fullWidth
                                variant="light"
                                color="violet"
                                loading={loading}
                                onClick={handleSubmit}>
                                Sign Up
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
                                onClick={() => navigate('/login')}
                                disabled={disabled}
                            >
                                Already have an account? Login here
                            </Button>
                        </Group>
                    </div>
                </Flex>
            </Container>
        </div>

    );
}

export default SignUpPage;