import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SubNavbar from '../components/SubNavbar';
import { MdDownload } from 'react-icons/md';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';

const Transaction = () => {
    const params = useParams();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);

    const getAccountName = (accountId) => accounts.find(acc => acc._id === accountId)?.name || '';
    const getCategoryName = (categoryId) => categories.find(cat => cat._id === categoryId)?.name || '';
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, accountsRes, transactionsRes] = await Promise.all([
                    axios.get("/api/v1/category/categories"),
                    axios.get("/api/v1/account/accounts"),
                ]);
                setCategories(categoriesRes.data?.success ? categoriesRes.data.category : []);
                setAccounts(accountsRes.data?.success ? accountsRes.data.accounts : []);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Something went wrong while fetching data");
            }
        };
        fetchData();
    }, []);
    const fetchDataT = async () => {
        try {
            const response = await axios.get(`/api/v1/transaction/${params.id}`);
            const { success, message, transaction, entries } = response.data;

            if (success) {
                setTransactions([{ transaction, entries }]);
            } else {
                console.error(message);
                toast.error("Failed to fetch transaction data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Something went wrong while fetching data");
        }
    };
    useEffect(() => {
        fetchDataT();
    }, []);

    const handleDownload = () => {
        if (transactions.length === 0) {
            toast.error("No transactions found to be download");
            return;
        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([['Date', 'Account', 'Name', 'Category', 'Amount']]);

        let rowData = [];

        transactions.forEach(({ transaction, entries }) => {
            const date = new Date(transaction.date);
            const localDateString = date.toLocaleDateString();
            entries.forEach(entry => {
                const categoryNames = getCategoryName(entry.categoryID);
                rowData.push([localDateString, getAccountName(transaction.accountID), transaction.name, categoryNames, entry.amount]);
            });
        });

        // Add all rows to the worksheet
        XLSX.utils.sheet_add_aoa(ws, rowData);

        XLSX.utils.book_append_sheet(wb, ws, 'Entries');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'entries.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
    };
    return (
        <Layout title={'MYGL-Transactions'}>
            <SubNavbar />
            <div className="bg-transparent shadow-none" style={{ minHeight: '80vh' }}>
                <div className="d-flex flex-column align-items-center">
                    <div className="d-flex" style={{ gap: "20px" }}>
                        <button className='add-btn down' onClick={handleDownload}><MdDownload /></button>
                    </div>
                    <table className="my-4" id="table-1">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Account</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map(({ transaction, entries }) => {
                                    const date = new Date(transaction.date);
                                    const localDateString = date.toLocaleDateString();

                                    return entries.map(entry => (
                                        <tr key={entry._id}>
                                            <td>{localDateString}</td>
                                            <td>{getAccountName(transaction.accountID)}</td>
                                            <td>{transaction.name}</td>
                                            <td>{getCategoryName(entry.categoryID)}</td>
                                            <td>{entry.amount}</td>

                                        </tr>
                                    ));
                                }).flat() // Use flat() to flatten the array of arrays
                            ) : (
                                <tr>
                                    <td colSpan="4">No Transactions found.</td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Transaction;
