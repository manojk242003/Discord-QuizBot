import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

const Navbar = () => {
    const [loggedin, setLoggedin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State to hold server messages

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setLoggedin(true);
        }
    }, []);

    const signinHandler = async () => {
        try {
            const res = await axios.post('http://localhost:5001/api/v1/signin', {
                username: username,
                password: password,
            });
            const { token, message } = res.data;

            if (token) {
                localStorage.setItem('token', token);
                console.log('Logged in');
                setLoggedin(true);
                setOpen(false); // Close modal after successful login
            } else {
                setErrorMessage(message || 'Login failed'); // Display server message if login fails
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'An error occurred. Please try again.' // Handle errors
            );
        }
    };

    return (
        <div className="navbar bg-gray-800">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Discord Quiz Bot</a>
            </div>
            {
                !loggedin ? ( // Show Signin button and modal if not logged in
                    <div className='mx-3'>
                        <React.Fragment>
                            <Button variant="outlined" color="white" onClick={() => setOpen(true)}>
                                Signin
                            </Button>
                            <Modal
                                aria-labelledby="modal-title"
                                aria-describedby="modal-desc"
                                open={open}
                                onClose={() => setOpen(false)}
                                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Sheet
                                    variant="outlined"
                                    sx={{ maxWidth: 500, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
                                >
                                    <ModalClose variant="plain" sx={{ m: 1 }} />
                                    <Typography
                                        component="h2"
                                        id="modal-title"
                                        level="h4"
                                        textColor="inherit"
                                        sx={{ fontWeight: 'lg', mb: 1 }}
                                    >
                                        Sign in to Discord Quiz Bot
                                    </Typography>
                                    <form className='flex-col m-2'>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            className="input input-primary input-bordered m-2"
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="input input-primary input-bordered m-2"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-primary m-2"
                                            onClick={signinHandler}
                                        >
                                            Signin
                                        </button>
                                    </form>
                                    {errorMessage && ( // Display error message if login fails
                                        <Typography
                                            color="danger"
                                            sx={{ mt: 2, fontSize: 'sm', textAlign: 'center' }}
                                        >
                                            {errorMessage}
                                        </Typography>
                                    )}
                                </Sheet>
                            </Modal>
                        </React.Fragment>
                    </div>
                ) : ( // Show profile and dropdown if logged in
                    <div className="flex-none gap-2 mx-6">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="User Avatar"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                            >
                                <li>
                                    <a className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a>Settings</a></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Navbar;
