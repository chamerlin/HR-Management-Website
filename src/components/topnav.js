import { Avatar, Flex, Space, Text, Group } from "@mantine/core";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import './navbar.css';
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

const TopNav = () => {
    const navigate = useNavigate()
    const isLoggedIn = useMemo(() => {
        return pb.authStore.isValid;
    }, [pb.authStore.isValid]);

    return (
        <div>
            {
                isLoggedIn ? (
                    <div class="topnav">
                        <Flex justify='flex-end' align="center" c="white">
                            <Text>{pb.authStore.model.name ? pb.authStore.model.name : "-"}</Text>
                            <Space w='md' />
                            <Avatar radius='xl' />
                            <Space w='xl' />
                        </Flex>
                    </div>
                ) : (
                    <div class="unauthorizeNav">
                        <Flex align='center' style={{ paddingLeft: "150px" }}>
                            <Text style={{ fontSize: "30px" }} c="white">OFA</Text>
                        </Flex>

                        <Flex align='center' justify="flex-end" style={{paddingRight: "100px"}}>
                            <Text style={{ fontSize: "15px", marginRight: "45px" }} c="white"><a onClick={() => navigate('/signup')}>SignUp</a></Text>
                            <Text style={{ fontSize: "15px" }} c="white"><a onClick={() => navigate('/login')}>Login</a></Text>
                        </Flex>
                    </div>
                )
            }

        </div>
    )
}

export default TopNav