import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import SubNavbar from '../components/SubNavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

const Homepage = () => {
    const [data, setData] = useState([]);
    const [file, setFile] = useState(null);

    const handleFormSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (!data) {
            toast.error('No file selected.');
            return;
        }

        try {
            const response = await axios.post('/api/v1/account/upload', data);
            if (response.status === 200) {
                toast.success("Data imported successfully!");
                setData([]); // Clear data state
                setFile("");

            } else {
                toast.error(response.error);
                setData([]); // Clear data state
                setFile("");

            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const fileData = [];
                XLSX.utils.sheet_to_json(worksheet, { header: 1 }).forEach((row) => {
                    const rowData = {
                        A: row[0] || '',
                        B: row[1] || '',
                        C: row[2] || '',
                        D: row[3] || '',
                        E: row[4] || '',
                        F: row[5] || '',
                        G: row[6] || '',
                        H: row[7] || '',
                        // Add more columns as needed
                    };
                    fileData.push(rowData);
                });

                setData(fileData);
            };
            reader.readAsBinaryString(file);
        } else {
            toast.error('Please select a valid .xlsx file.');
            setData([]);
        }
    };

    return (
        <Layout title="MYGL">
            <SubNavbar />
            <div className="container-fluid">
                <div style={{ height: "80vh" }} className="d-flex flex-column bg-transparent">
                    <div className="container mt-5 bg-transparent shadow-none">
                        <div className="row">
                            <form onSubmit={handleFormSubmit}>
                                <input required type="file" className='form-control' value={file} onChange={handleFileChange} accept=".xlsx" />
                                <button type="submit" className='btn btn-dark btn-sm mt-4 cur-p'  >Import Data</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Homepage;
