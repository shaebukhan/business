import React from 'react';

const Categoryform = ({ handleSubmit, value, setValue, handleCancel, isCategoryVisible, setIsCategoryVisible }) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <h4>Add Category</h4>
                    <input
                        type="text"
                        className="form-control"
                        id="categoryName"
                        placeholder="Enter New Category Name"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <div className='mb-3 d-flex'>
                    <span>Hide Category</span>
                    <input className=' ms-2'
                        type="checkbox"
                        checked={isCategoryVisible}
                        onChange={setIsCategoryVisible}
                    />

                </div>
                <div className="mb-2">
                    <button type="submit" className="btn btn-primary me-3">
                        Submit
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default Categoryform;
