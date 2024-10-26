import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import SubNavbar from '../components/SubNavbar';
import { GoPencil } from 'react-icons/go';
import { BiHide } from 'react-icons/bi';
import { FaRegEye, FaSortDown, FaSortUp } from 'react-icons/fa';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import axios from 'axios';


const Category = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [hidden, setHidden] = useState(false);
    const [selected, setSelected] = useState(null);
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(false);
    const [entries, setEntries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(100);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('');



    const getAllCategories = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/categories");
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!!");
        }
    };

    useEffect(() => {
        getAllCategories();
    }, []);




    const isCategoryUsed = (categoryId) => {
        // Check if the selected category ID exists in any transaction
        return entries.some((entry) => entry.categoryID === categoryId);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get("/api/v1/entry/entries");
            if (response.data.success) {
                setEntries(response.data.entries);
            } else {
                console.error("Error fetching entries:", response.data.message);
                toast.error("Something went wrong while fetching entries");
            }
        } catch (error) {
            console.error("Error fetching  entries:", error);
            toast.error("Something went wrong while fetching  entries");
        }
    };

    useEffect(() => {
        getAllCategories();
        fetchData();
    }, []);
    const handleEdit = (category) => {
        if (category && typeof category === 'object' && category._id) {
            setSelected(category);
            setName(category.name);
            setHidden(category.hidden);
            setEditing(true);
            setOpen(true);
        } else {
            console.error('Invalid category object:', category);
        }
    };


    const handleAdd = () => {
        setName('');
        setHidden(false);
        setSelected(null);
        setEditing(false);
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            toast.error('Please enter a category name!');
            return;
        }

        try {
            if (editing) {
                await axios.put(`/api/v1/category/${selected._id}`, { name, hidden });
                toast.success('Category updated successfully');
            } else {
                await axios.post("/api/v1/category/new", { name, hidden });
                toast.success('New category created successfully');
            }

            getAllCategories();
            setName('');
            setHidden(false);
            setEditing(false);
            setOpen(false);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong with the category form!');
        }
    };

    const handleCancel = () => {
        setName('');
        setHidden(false);
        setSelected(null);
        setEditing(false);
        setOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`/api/v1/category/${id}`);
            if (data.success) {
                toast.success(data.message);
                getAllCategories();
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

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedCategories = filteredCategories.sort((a, b) => {
        if (sortBy === 'hidden') {
            // Convert hidden values to numbers for sorting (true -> 1, false -> 0)
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
    const currentEntries = sortedCategories.slice(indexOfFirstEntry, indexOfLastEntry);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (
        <Layout title={'MYGL-Categories'}>
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
                <table className="my-4" id="categoryTable" >
                    <thead>
                        <tr>
                            <th scope="col" >
                                <span className="cur-p" onClick={() => handleSort('name')}>
                                    Category
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
                                    placeholder="Search Category"
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
                        {currentEntries.reverse().map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category.hidden ? <BiHide /> : <FaRegEye />}</td>
                                <td>
                                    <button className="text-primary border-0 bg-transparent" onClick={() => handleEdit(category)}>
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
                            {Math.min(indexOfLastEntry, categories.length)}
                            <span className='mx-1'> of</span> {categories.length}  entries
                        </p>
                    </div>

                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(currentPage - 1)} className="page-link">
                                Previous
                            </button>
                        </li>
                        {[...Array(Math.ceil(categories.length / entriesPerPage)).keys()].map(number => {
                            if (number + 1 === 1 || number + 1 === currentPage || number + 1 === currentPage - 1 || number + 1 === currentPage + 1 || number + 1 === Math.ceil(categories.length / entriesPerPage)) {
                                return (
                                    <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                        <button onClick={() => paginate(number + 1)} className="page-link">
                                            {number + 1}
                                        </button>
                                    </li>
                                );
                            } else if (number + 1 === 2 && currentPage > 5) {
                                return <li key={number + 1}>...</li>;
                            } else if (number + 1 === Math.ceil(categories.length / entriesPerPage) - 1 && currentPage < Math.ceil(categories.length / entriesPerPage) - 4) {
                                return <li key={number + 1}>...</li>;
                            }
                            return null;
                        })}
                        <li className={`page-item ${currentPage === Math.ceil(categories.length / entriesPerPage) ? 'disabled' : ''}`}>
                            <button onClick={() => paginate(currentPage + 1)} className="page-link">
                                Next
                            </button>
                        </li>
                    </ul>

                </nav>
                <button className="add-btn mb-3" onClick={handleAdd}>
                    +
                </button>
                <Modal onCancel={handleCancel} footer={null} open={open}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <h4>{editing ? 'Edit Category' : 'Add Category'}</h4>
                            <input
                                type="text"
                                className="form-control"
                                id="categoryName"
                                placeholder="Enter New Category Name"
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
                                <button type="button" className="btn btn-danger ms-3" onClick={() => selected && handleDelete(selected._id)} disabled={isCategoryUsed(selected._id)}>
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

export default Category;
