
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SubNavbar from '../components/SubNavbar';
import { GoPencil } from 'react-icons/go';
import { BiHide } from 'react-icons/bi';
import { FaRegEye, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import './acc.css';
const Account = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [hidden, setHidden] = useState(false);
    const [selected, setSelected] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(100);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('');

    // Function to get all accounts from the backend
    const getAllAccounts = async () => {
        try {
            const { data } = await axios.get("/api/v1/account/accounts");
            if (data?.success) {
                setAccounts(data?.accounts);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    };

    useEffect(() => {
        getAllAccounts();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("/api/v1/transaction/transactions");
            if (response.data.success) {
                setTransactions(response.data.transactions);
            } else {
                console.error("Error fetching transactions:", response.data.message);
                toast.error("Something went wrong while fetching transactions");
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Something went wrong while fetching transactions");
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const isAccountUsed = (accountId) => {
        // Check if the selected account ID exists in any transaction
        return transactions.some(({ transaction }) => transaction.accountID === accountId);
    };


    // Function to handle edit button click
    const handleEdit = (account) => {
        if (account && typeof account === 'object' && account._id) {
            setSelected(account);
            setName(account.name);
            setHidden(account.hidden);
            setEditing(true);
            setOpen(true);
        } else {
            console.error('Invalid account object:', account);
        }
    };

    // Function to handle add button click
    const handleAdd = () => {
        setName('');
        setHidden(false);
        setSelected(null);
        setEditing(false);
        setOpen(true);
    };

    // Function to handle form submission (create/update account)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            toast.error('Please enter an account name!');
            return;
        }

        try {
            if (editing) {
                await axios.put(`/api/v1/account/${selected._id}`, { name, hidden });
                toast.success('Account updated successfully');
            } else {
                await axios.post("/api/v1/account/new", { name, hidden });
                toast.success('New account created successfully');
            }

            getAllAccounts();
            setName('');
            setHidden(false);
            setEditing(false);
            setOpen(false);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong with the account form!');
        }
    };

    // Function to handle cancel button click
    const handleCancel = () => {
        setName('');
        setHidden(false);
        setSelected(null);
        setEditing(false);
        setOpen(false);
    };

    // Function to handle delete button click
    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`/api/v1/account/${id}`);
            if (data.success) {
                toast.success(data.message);
                getAllAccounts();
                setOpen(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    };
    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const filteredAccounts = accounts.filter(account =>
        account.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedAccounts = filteredAccounts.sort((a, b) => {
        if (sortBy === 'hidden') {

            const hiddenA = a.hidden ? 1 : 0;
            const hiddenB = b.hidden ? 1 : 0;
            return sortOrder === 'asc' ? hiddenA - hiddenB : hiddenB - hiddenA;
        } else {
            // Sort alphabetically by category name for other fields
            const order = sortOrder === 'asc' ? 1 : -1;
            return order * (a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1);
        }
    });

    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = sortedAccounts.slice(indexOfFirstEntry, indexOfLastEntry);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    // Render the component
    return (
        <Layout title={'MYGL-Accounts'}>
            <SubNavbar />
            <div className="container bg-transparent shadow-none" style={{ minHeight: '80vh' }}>
                <div className="mb-3 d-flex justify-content-between">
                    <div className='mt-3'>
                        <label>Show Entries:</label>
                        <select
                            className="form-select ms-2"
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                        >
                            {[100, 250, 500, 1000].map(option =>
                                <option key={option} value={option}>{option}</option>
                            )}
                        </select>
                    </div>
                </div>
                <table className="mt-4" id="table-1">
                    <thead>
                        <tr>
                            <th scope="col" >
                                <span className="cur-p" onClick={() => handleSort('name')}>
                                    Account
                                    {sortBy === 'name' && (
                                        <span className='ms-1'>
                                            {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                        </span>
                                    )}
                                </span>
                                <br />
                                <input
                                    type="text"
                                    className="form-control mb-1"
                                    placeholder="Search Account"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </th>
                            <th scope="col">   <span className="cur-p" onClick={() => handleSort('hidden')}>
                                Hidden
                                {sortBy === 'hidden' && (
                                    <span className='ms-1'>
                                        {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                    </span>
                                )}
                            </span> </th>
                            <th scope="col">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map(account => (
                            <tr key={account._id}>
                                <td className=' text-primary'>{account.name}</td>
                                <td>{account.hidden ? <BiHide /> : <FaRegEye />}</td>
                                <td>
                                    <button className="text-primary border-0 bg-transparent" onClick={() => handleEdit(account)}>
                                        <GoPencil />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <div className="mb-3">
                        <p>
                            Showing  {indexOfFirstEntry + 1}-
                            {Math.min(indexOfLastEntry, currentEntries.length)}
                            <span className='mx-1'> of</span> {currentEntries.length}  entries
                        </p>
                    </div>

                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(currentPage - 1)} className="page-link">
                                Previous
                            </button>
                        </li>
                        {[...Array(Math.ceil(currentEntries.length / entriesPerPage)).keys()].map(number => {
                            if (number + 1 === 1 || number + 1 === currentPage || number + 1 === currentPage - 1 || number + 1 === currentPage + 1 || number + 1 === Math.ceil(currentEntries.length / entriesPerPage)) {
                                return (
                                    <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                        <button onClick={() => paginate(number + 1)} className="page-link">
                                            {number + 1}
                                        </button>
                                    </li>
                                );
                            } else if (number + 1 === 2 && currentPage > 5) {
                                return <li key={number + 1}>...</li>;
                            } else if (number + 1 === Math.ceil(currentEntries.length / entriesPerPage) - 1 && currentPage < Math.ceil(currentEntries.length / entriesPerPage) - 4) {
                                return <li key={number + 1}>...</li>;
                            }
                            return null;
                        })}
                        <li className={`page-item ${currentPage === Math.ceil(currentEntries.length / entriesPerPage) ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(currentPage + 1)} className="page-link">
                                Next
                            </button>
                        </li>
                    </ul>

                </nav>
                <button className="add-btn" onClick={handleAdd}>
                    +
                </button>
                <Modal onCancel={handleCancel} footer={null} open={open}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <h4>{editing ? 'Edit Account' : 'Add Account'}</h4>
                            <input
                                type="text"
                                className="form-control"
                                id="accountName"
                                placeholder="Enter New Account Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 d-flex">
                            <span>Hidden</span>
                            <input
                                className="ms-2"
                                type="checkbox"
                                checked={hidden}
                                onChange={() => setHidden(!hidden)}
                            />
                        </div>
                        <div className="mb-2">
                            <button type="submit" className="btn btn-primary me-3">
                                {editing ? 'Update' : 'Submit'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                            {editing && selected && (
                                <button
                                    type="button"
                                    className="btn btn-danger ms-3"
                                    onClick={() => selected && handleDelete(selected._id)}
                                    disabled={isAccountUsed(selected._id)}
                                >
                                    Delete
                                </button>
                            )}

                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default Account;
