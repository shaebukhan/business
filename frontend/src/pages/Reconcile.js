
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SubNavbar from '../components/SubNavbar';
import { GoPencil } from 'react-icons/go';
import { BiHide } from 'react-icons/bi';
import { FaRegEye } from 'react-icons/fa';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Select } from "antd";
const { Option } = Select;

const Reconcile = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [hidden, setHidden] = useState(false);
    const [selected, setSelected] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [search, setSearch] = useState("");
    const [sortOption, setSortOption] = useState("");



    // Render the component
    return (
        <Layout title={'MYGL-Accounts'}>
            <SubNavbar />
            <div className="container bg-transparent shadow-none" style={{ minHeight: '80vh' }}>
                <div className="my-3"> <h1 className='text-center'>Reconcilation page</h1> </div>
            </div>
        </Layout>
    );
};

export default Reconcile;
