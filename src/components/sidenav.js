import React, { useState } from "react"
import {
    FileEarmarkText,
    CurrencyDollar,
    PencilSquare,
    BoxArrowLeft
} from 'react-bootstrap-icons'
import { Flex } from '@mantine/core'
import './navbar.css'
import { useNavigate } from "react-router-dom";
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

const SideNav = () => {
    const navigate = useNavigate();
    
    return (
        <div class="wrapper">
            <div class="sidebar">
                <h2 className='my-auto'><a onClick={() => navigate('/')}>OFA</a></h2>
                <div>
                    <div class="section">
                        <Flex align="center">
                            <FileEarmarkText style={{ paddingRight: '15px', color: '#bdb8d7' }} />
                            <a onClick={() => navigate('/leave')}>Leave</a>
                        </Flex>
                    </div>
                    <div class="section">
                        <Flex align='center'>
                            <CurrencyDollar style={{ paddingRight: '15px', color: '#bdb8d7' }} />
                            <a onClick={() => navigate('/claims')}>Claims</a>
                        </Flex>
                    </div>
                    <div class="section">
                        <Flex align="center">
                            <PencilSquare style={{ paddingRight: '15px', color: '#bdb8d7' }} />
                            <a onClick={() => navigate('/performance_review')}>Performance Review</a>
                        </Flex>
                    </div>

                    <div class="section" id='anchored'>
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
        </div >
    )
}

export default SideNav

