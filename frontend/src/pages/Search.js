import React from 'react';
import Layout from '../components/Layout/Layout';
import { useSearch } from '../context/Search';

const Search = () => {
    const [values, setValues] = useSearch();
    return (
        <Layout title={"Search results"}>
            <div className="container">
                <div className="text-center">
                    <h1 className='mt-4'>Search Results</h1>
                    <h5>{values?.results.length < 1 ? "No Products Found" : `Found ${values.results.length} Products`} </h5>
                    <div className="d-flex flex-wrap mt-4">
                        {values?.results.map((p) => (
                            <div className="col-md-4 mb-3" key={p._id}>
                                <div className="card m-2">
                                    <img style={{ height: "200px" }} src={`/api/v1/product/product-photo/${p._id}`} className="p-3" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text m-0">Price: {p.price}$</p>
                                        <p className="card-text m-0">quantity: {p.quantity} Products left</p>
                                        <p className="card-text m-0">{p.description.substring(0, 20)} ...</p>
                                    </div>

                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-outline-dark btn-sm">Details</button>
                                            <button className="btn btn-outline-warning btn-sm">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Search;