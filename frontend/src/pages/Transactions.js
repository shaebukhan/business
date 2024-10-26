import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SubNavbar from '../components/SubNavbar';
import { Modal } from 'antd';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoPencil } from 'react-icons/go';
import { MdAdd, MdDownload } from 'react-icons/md';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './trans.css';

const Transactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [saccounts, setsAccounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [scategories, setSCategories] = useState([]);
    const [account, setAccount] = useState("");
    const [formVisible, setFormVisible] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [rows, setRows] = useState([{ category: '', amount: '', comments: '' }]);
    const [searchQueryD, setSearchQueryD] = useState('');
    const [searchQueryAC, setSearchQueryAC] = useState('');
    const [searchQueryNa, setSearchQueryNa] = useState('');
    const [searchQueryCa, setSearchQueryCa] = useState('');
    const [searchQueryAm, setSearchQueryAm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(100);
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const getAccountName = (accountId) => accounts.find(acc => acc._id === accountId)?.name || '';
    const getCategoryName = (categoryId) => categories.find(cat => cat._id === categoryId)?.name || '';

    const handleCategoryChange = (index, value) => {
        const updatedRows = [...rows];
        updatedRows[index].category = value;
        setRows(updatedRows);
    };

    const handleAmountChange = (index, value) => {
        const updatedRows = [...rows];
        updatedRows[index].amount = value;
        setRows(updatedRows);
    };

    const handleCommentsChange = (index, value) => {
        const updatedRows = [...rows];
        updatedRows[index].comments = value;
        setRows(updatedRows);
    };

    const handleDeleteRow = (index) => {
        // Create a copy of the rows array
        const updatedRows = [...rows];

        // Remove the row at the specified index
        updatedRows.splice(index, 1);

        // Update the state with the modified rows
        setRows(updatedRows);
    };

    const handleAddRow = () => {
        // Create a new row with empty data
        const newRow = { category: '', amount: '', comments: '' };

        // Clone the existing rows
        const newRows = [...rows];

        // Append the new row to the end
        newRows.push(newRow);

        // Update state with the new rows
        setRows(newRows);
    };

    const handleCancel = () => setFormVisible(false);

    const handleAdd = () => {
        setFormVisible(true);
        setEditing(false);
        setName("");
        setDate("");
        setAccount("");
        setRows([{ category: '', amount: '', comments: '' }]);
    };

    const fetchData = async () => {
        try {
            const [categoriesRes, accountsRes, transactionsRes, scategoriesRes, saccountsRes] = await Promise.all([
                axios.get("/api/v1/category/categories"),
                axios.get("/api/v1/account/accounts"),
                axios.get("/api/v1/transaction/transactions"),
                axios.get("/api/v1/category/scategories"),
                axios.get("/api/v1/account/saccounts"),
            ]);
            setCategories(categoriesRes.data?.success ? categoriesRes.data.category : []);
            setSCategories(scategoriesRes.data?.success ? scategoriesRes.data.category : []);
            setAccounts(accountsRes.data?.success ? accountsRes.data.accounts : []);
            setTransactions(transactionsRes.data?.success ? transactionsRes.data.transactions : []);
            setsAccounts(saccountsRes.data?.success ? saccountsRes.data.accounts : []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Something went wrong while fetching data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date || !account || !name) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (rows.some(row => !row.category || !row.amount)) {
            toast.error('Please fill in all required fields for Category and Amount');
            return;
        }

        if (rows.some(row => row.comments && (!row.category || !row.amount))) {
            toast.error('Please fill in Category and Amount for rows with comments');
            return;
        }

        let dataToSend = { date, account, name, rows };

        try {
            const url = editing ? `/api/v1/transaction/${selectedTransaction}` : '/api/v1/transaction/new';
            const axiosMethod = editing ? axios.put : axios.post;
            const response = await axiosMethod(url, dataToSend);

            if (response?.data.success) {
                toast.success(response?.data.message);
                fetchData();
                setFormVisible(false);
            } else {
                toast.error(response?.data.message);
            }
        } catch (error) {
            console.error("Error submitting data:", error);
            toast.error("Error submitting data. Please try again later.");
        }
    };

    const handleDelete = async () => {
        try {
            const { data } = await axios.delete(`/api/v1/transaction/${selectedTransaction}`);
            if (data.success) {
                fetchData();
                setSelectedTransaction(null);
                setFormVisible(false);
                setEditing(false);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    const handleDownload = () => {
        if (transactions.length === 0) {
            toast.error("No transactions found to download");
            return;
        }

        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Date', 'Account', 'Name', 'Category', 'Amount'],
            ...transactions.map(({ transaction, entries }) => {
                const date = new Date(transaction.date);
                const localDateString = date.toLocaleDateString();
                const categoryNames = entries.map(entry => getCategoryName(entry.categoryID)).join(', ');
                const totalAmount = entries.reduce((acc, entry) => acc + entry.amount, 0);
                return [localDateString, getAccountName(transaction.accountID), transaction.name, categoryNames, totalAmount];
            })
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    //search 

    const filteredTransactions = transactions.filter(transaction => {
        // Calculate the total amount for the transaction
        const totalAmount = transaction.entries.reduce((total, entry) => total + entry.amount, 0);
        const accountName = getAccountName(transaction.transaction.accountID);
        return (
            (!searchQueryD || (transaction.transaction.date && transaction.transaction.date.includes(searchQueryD))) &&
            (!searchQueryAC || (accountName && accountName.toLowerCase().includes(searchQueryAC))) &&
            (!searchQueryNa || (transaction.transaction.name && transaction.transaction.name.includes(searchQueryNa))) &&
            (!searchQueryCa || transaction.entries.some(entry => getCategoryName(entry.categoryID).toLowerCase().includes(searchQueryCa.toLowerCase()))) &&
            (!searchQueryAm || totalAmount.toString().includes(searchQueryAm))
        );
    });

    // Function to toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };

    // Sorting logic with toggle functionality
    const sortedTransactions = filteredTransactions.slice().sort((a, b) => {
        let valueA = a[sortBy];
        let valueB = b[sortBy];

        if (sortBy === 'date') {
            // Convert dates to ISO string format for comparison
            console.log(a);
            valueA = new Date(a.transaction.date);
            valueB = new Date(b.transaction.date);
        } else if (sortBy === 'amount') {
            // Calculate total amount for each transaction
            const totalAmountA = a.entries.reduce((total, entry) => total + entry.amount, 0);
            const totalAmountB = b.entries.reduce((total, entry) => total + entry.amount, 0);
            valueA = totalAmountA;
            valueB = totalAmountB;
        } else if (sortBy === 'category') {
            // Concatenate category names for sorting
            const categoriesA = a.entries.map(entry => getCategoryName(entry.categoryID).toLowerCase()).sort();
            const categoriesB = b.entries.map(entry => getCategoryName(entry.categoryID).toLowerCase()).sort();
            valueA = categoriesA.join(', ');
            valueB = categoriesB.join(', ');
        } else if (sortBy === 'account') {
            valueA = getAccountName(a.transaction.accountID);
            valueB = getAccountName(b.transaction.accountID);
        } else if (sortBy === 'name') {
            valueA = a.transaction.name.toLowerCase();
            valueB = b.transaction.name.toLowerCase();

            // Custom sorting function
            const customSort = (a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            };

            // Split the strings into arrays of characters, sort them using the custom function,
            // and then join them back into strings
            valueA = valueA.split('').sort(customSort).join('');
            valueB = valueB.split('').sort(customSort).join('');
        } else {

        }
        if (valueA < valueB) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });


    // return sortOrder === 'asc' ? comparison : -comparison;  


    // Function to handle header click
    const handleSort = (field) => {
        setSortBy(field);
        toggleSortOrder(); // Toggle sort order when clicking on header
    };

    // Current page entries
    const currentEntries = sortedTransactions.slice(indexOfFirstEntry, indexOfLastEntry);

    // Pagination function
    const paginate = (pageNumber) => setCurrentPage(pageNumber);




    return (
        <Layout title={'MYGL-Transactions'}>
            <SubNavbar />
            <div className="container-fluid px-5 bg-transparent shadow-none" style={{ minHeight: '80vh' }}>
                <div className="">
                    <div className="container bg-transparent shadow-none">
                        <div className="d-flex justify-content-between">
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

                        <div className="d-flex flex-column ">
                            <div className="d-flex" style={{ gap: "20px" }}>
                                <button className='add-btn' onClick={handleAdd}><MdAdd /></button>
                                <button className='add-btn down' onClick={handleDownload}><MdDownload /></button>
                            </div>
                        </div>
                    </div>
                    <table className="my-4" id="table-1">
                        <thead>
                            <tr>
                                <th scope="col" >
                                    <span className="cur-p" onClick={() => handleSort('date')}>
                                        Date
                                        {sortBy === 'date' && (
                                            <span className='ms-1'>
                                                {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                            </span>
                                        )}
                                    </span>
                                    <br />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="search Date"
                                        value={searchQueryD}
                                        onChange={(e) => setSearchQueryD(e.target.value)}
                                    />
                                </th>
                                <th scope="col" >
                                    <span className="cur-p" onClick={() => handleSort('account')}>
                                        Account
                                        {sortBy === 'account' && (
                                            <span className='ms-1'>
                                                {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                            </span>
                                        )}
                                    </span>
                                    <br />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="search Account"
                                        value={searchQueryAC}
                                        onChange={(e) => setSearchQueryAC(e.target.value)}
                                    />
                                </th>
                                <th scope="col" >
                                    <span className="cur-p" onClick={() => handleSort('name')}>
                                        Name
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
                                        placeholder="search Name"
                                        value={searchQueryNa}
                                        onChange={(e) => setSearchQueryNa(e.target.value)}
                                    />
                                </th>
                                <th scope="col" >
                                    <span className="cur-p" onClick={() => handleSort('category')}>
                                        Category
                                        {sortBy === 'category' && (
                                            <span className='ms-1'>
                                                {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                            </span>
                                        )}
                                    </span>
                                    <br />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="search Category"
                                        value={searchQueryCa}
                                        onChange={(e) => setSearchQueryCa(e.target.value)}
                                    />
                                </th>
                                <th scope="col" >
                                    <span className="cur-p" onClick={() => handleSort('amount')}>
                                        Amount
                                        {sortBy === 'amount' && (
                                            <span className='ms-1'>
                                                {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                                            </span>
                                        )}
                                    </span>
                                    <br />
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        placeholder="search Amount"
                                        value={searchQueryAm}
                                        onChange={(e) => setSearchQueryAm(e.target.value)}
                                    />
                                </th>
                                {/* <th>Pending</th>
                                <th>statementDate</th> */}
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentEntries.length > 0 ? (
                                currentEntries.reverse().map(({ transaction, entries }) => {
                                    const date = new Date(transaction.date);
                                    const localDateString = date.toLocaleDateString();
                                    const sDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                                    return (
                                        <tr key={transaction._id}>
                                            <td>{localDateString}</td>
                                            <td>
                                                <button
                                                    className='border-0 text-primary bg-transparent'
                                                    onClick={() => navigate(`/transaction/${transaction._id}`)}
                                                >
                                                    {getAccountName(transaction.accountID)}
                                                </button>
                                            </td>
                                            <td>{transaction.name}</td>
                                            <td>
                                                {entries.map((entry, index) => (
                                                    <span key={entry._id}>
                                                        {getCategoryName(entry.categoryID)}
                                                        {index !== entries.length - 1 && ', '}
                                                    </span>
                                                ))}
                                            </td>
                                            <td>
                                                {entries.reduce((total, entry) => total + entry.amount, 0)}
                                            </td>
                                            {/* <td className="m-auto">
                                                <input className='fs-3' type="checkbox" name="" id="" />
                                            </td>
                                            <td></td> */}
                                            <td>
                                                <button
                                                    className=' fs-3 border-0 bg-transparent'
                                                    onClick={() => {
                                                        setSelectedTransaction(transaction._id);
                                                        setFormVisible(true);
                                                        setDate(sDate);
                                                        setEditing(true);
                                                        setAccount(transaction.accountID);
                                                        setName(transaction.name);
                                                        const categoryData = entries.map(entry => entry.categoryID);
                                                        const amountData = entries.map(entry => entry.amount);
                                                        const commentsData = entries.map(entry => entry.comments);
                                                        setRows(categoryData.map((category, index) => ({
                                                            category: category,
                                                            amount: amountData[index],
                                                            comments: commentsData[index]
                                                        })));
                                                    }}
                                                >
                                                    <GoPencil />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6">No Transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <nav>
                        <div className="mb-3">
                            <p>
                                Showing {indexOfFirstEntry + 1}-
                                {Math.min(indexOfLastEntry, transactions.length)}
                                <span className='mx-1'> of</span> {transactions.length} entries
                            </p>
                        </div>
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button onClick={() => paginate(currentPage - 1)} className="page-link">
                                    Previous
                                </button>
                            </li>
                            {[...Array(Math.ceil(transactions.length / entriesPerPage)).keys()].map(number => {
                                if (
                                    number + 1 === 1 ||
                                    number + 1 === currentPage ||
                                    number + 1 === currentPage - 1 ||
                                    number + 1 === currentPage + 1 ||
                                    number + 1 === Math.ceil(transactions.length / entriesPerPage)
                                ) {
                                    return (
                                        <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                            <button onClick={() => paginate(number + 1)} className="page-link">
                                                {number + 1}
                                            </button>
                                        </li>
                                    );
                                } else if (number + 1 === 2 && currentPage > 5) {
                                    return <li key={number + 1}>...</li>;
                                } else if (number + 1 === Math.ceil(transactions.length / entriesPerPage) - 1 && currentPage < Math.ceil(transactions.length / entriesPerPage) - 4) {
                                    return <li key={number + 1}>...</li>;
                                }
                                return null;
                            })}
                            <li className={`page-item ${currentPage === Math.ceil(transactions.length / entriesPerPage) ? 'disabled' : ''}`}>
                                <button onClick={() => paginate(currentPage + 1)} className="page-link">
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Modal onCancel={() => setFormVisible(false)} footer={null} open={formVisible}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <h4>{editing ? 'Edit Transaction' : 'Add Transaction'}</h4>
                            <div className="d-flex justify-content-between align-items-center inp-main">
                                <h5>Date: </h5>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3 d-flex justify-content-between align-items-center inp-main">
                            <h5>Account: </h5>
                            <select
                                bordered={false}
                                placeholder="Select Account"
                                size="large"
                                className="form-select"
                                onChange={(e) => {
                                    const selectedAccountId = e.target.value;
                                    setAccount(selectedAccountId);
                                }}
                                value={account}
                            >
                                <option value="">Select Account</option>
                                {saccounts?.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3 d-flex justify-content-between align-items-center inp-main">
                            <h5>Name: </h5>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Name"
                                id='TransactionName'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="d-flex">
                                <h5 className='pe-3'>Category</h5>
                                <h5 className='pe-3'>Amount</h5>
                                <h5 className='pe-3'>Comments</h5>
                            </div>

                            {rows.map((row, index) => (
                                <div className="row mb-3" key={index}>
                                    <div className="d-flex align-items-center">
                                        <select
                                            value={row.category}
                                            onChange={(e) => handleCategoryChange(index, e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="">Select Category</option>
                                            {scategories.map((c) => (
                                                <option key={c._id} value={c._id}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={row.amount}
                                            onChange={(e) => handleAmountChange(index, e.target.value)}
                                            className="form-control"
                                            placeholder='Amount'
                                        />
                                        <input
                                            type="text"
                                            value={row.comments}
                                            onChange={(e) => handleCommentsChange(index, e.target.value)}
                                            className="form-control"
                                            placeholder='Comments'
                                            id='EntryComments'
                                        />
                                        {index !== 0 && (
                                            <button type='button' className="btn" onClick={() => handleDeleteRow(index)}><RiDeleteBin6Line /></button>
                                        )}
                                    </div>
                                </div>
                            ))}

                        </div>
                        <div className="mb-2">
                            <button type="submit" className="btn btn-primary me-3">
                                {editing ? 'Update' : 'Submit'}
                            </button>
                            <button type='button' className='btn border-2 border-dark rounded-5 me-3' onClick={handleAddRow}>+</button>

                            {editing && (
                                <button
                                    type='button'
                                    className='btn btn-danger mx-3'
                                    onClick={() => handleDelete(selectedTransaction)}
                                >
                                    Delete
                                </button>
                            )}

                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default Transactions;
