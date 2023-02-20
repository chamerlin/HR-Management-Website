import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Grid, Group, Button, Space, LoadingOverlay, Text, NumberInput, Textarea } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { DatePicker } from '@mantine/dates';
import { showNotification } from '@mantine/notifications';
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const AddNewClaim = ({
    onRefresh = () => { },
}) => {
    const [opened, setOpened] = useState(false);
    const [receiptDate, setReceiptDate] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); 

    useEffect(() => {
        if (!opened) {
            setReceiptDate(null);
            setTotalAmount(0);
            setNotes('');
            setFile(null);
            setLoading(false);
        }
    }, [opened]);

    const handleAddnew = async () => {
        setLoading(true);
        try {
            const record = await axios({
                method: 'POST',
                url: "http://127.0.0.1:8090/api/collections/claims/records",
                data: {
                    receipt_date: receiptDate.toISOString(),
                    total_amount: totalAmount,
                    notes,
                    receipt: file,
                    user: pb.authStore.model.id
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${pb.authStore.token}`
                }

            })
            setLoading(false);
            setOpened(false);
            showNotification({
                title: 'Success',
                message: 'Claim added successfully',
                color: 'green',
                icon: <i className="bi bi-check-circle"></i>
            });
            onRefresh();
        } catch (error) {
            showNotification({
                title: 'Error',
                message: error.message,
                color: 'red',
                icon: <i className="bi bi-x-circle"></i>
            });
            setLoading(false);
        }
    }

    const handleUpload = async (files) => {
        setFile(files[0]);
    }

    return (
        <div>
            <Group position="right">
                <Button
                    variant="filled"
                    color="green"
                    compact
                    leftIcon={<i className="bi bi-plus"></i>}
                    onClick={() => setOpened(true)}
                    style={{marginTop: "15px"}}
                >
                    Add New Claim
                </Button>
            </Group>

            <Modal
                opened={opened}
                centered
                onClose={() => setOpened(false)}
                title="Add New Claim"
                size="lg"
            >
                <LoadingOverlay visible={loading} />
                <Grid>
                    <Grid.Col span={6}>
                        <DatePicker
                            label="Receipt Date"
                            value={receiptDate}
                            onChange={setReceiptDate}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <NumberInput
                            label="Total Amount"
                            value={totalAmount}
                            onChange={setTotalAmount}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Textarea
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.currentTarget.value)}
                            minRows={3}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        {file ? (
                            <>
                                <Button
                                    variant="filled"
                                    color="red"
                                    leftIcon={<i className="bi bi-trash"></i>}
                                    onClick={() => setFile(null)}
                                >
                                    Remove Receipt
                                </Button>
                            </>
                        ) : (
                            <Dropzone
                                onDrop={handleUpload}
                                maxSize={3 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                                multiple={false}
                                maxFiles={1}
                                useFsAccessApi={false}
                            >
                                <Group position="center" spacing="xl" style={{ minHeight: 150, pointerEvents: 'none' }}>
                                    <div>
                                        <Text size="xl" inline>
                                            Drag your receipt here or click to select a receipt file
                                        </Text>
                                    </div>
                                </Group>
                            </Dropzone>
                        )}
                    </Grid.Col>
                </Grid>
                <Space h="md" />
                <Group position="right">
                    <Button
                        variant="filled"
                        color="blue"
                        leftIcon={<i className="bi bi-plus"></i>}
                        onClick={handleAddnew}
                    >
                        Add New
                    </Button>
                </Group>
            </Modal>
        </div>
    )
}

export default AddNewClaim;