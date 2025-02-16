import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Pagination } from 'antd';
import './ProductList.scss';

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [editingProduct, setEditingProduct] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isUpdate, setIsUpdate] = useState(false);
	const limit = 5; // Number of products per page

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const fetchProducts = (page) => {
		fetch(`http://localhost:5000/products?page=${page}&limit=${limit}`)
			.then((res) => res.json())
			.then((data) => {
				setProducts(data.products);
				setTotalPages(data.totalPages);
			})
			.catch((error) => console.error('Error fetching products:', error));
	};

	// Fetch products when component mounts or page changes
	useEffect(() => {
		fetchProducts(currentPage);
	}, [currentPage, isUpdate]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};
	const showAddModal = () => {
		setEditingProduct(null);
		reset({
			name: '',
			img: '',
			brand: '',
			price: '',
			rate: '',
		});
		setIsModalOpen(true);
	};
	const showEditModal = (product) => {
		setEditingProduct(product);
		reset(product);
		setIsModalOpen(true);
	};
	const handleDelete = (id) => {
		console.log(id);

		if (window.confirm('Are you sure you want to delete this product?')) {
			setIsUpdate(false);
			fetch(`http://localhost:5000/deleteproduct/${id}`, {
				method: 'DELETE',
			})
				.then((res) => res.json())
				.then((data) => {
					console.log('Product deleted:', data);
					setIsUpdate(true);
					// Remove the deleted product from the state
					/* setProducts((prevProducts) =>
						prevProduct 	s.filter((product) => product._id !== id)
					); */
				});
		}
	};
	const onSubmit = (data) => {
		console.log(data);
		const newData = {
			name: data.name,
			img: data.img,
			brand: data.brand,
			price: data.price,
			rate: data.rate,
		};
		if (editingProduct) {
			setIsUpdate(false);
			fetch(`http://localhost:5000/updateproduct/${data._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newData),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data, 'product updated');
					setIsUpdate(true);
				});
		} else {
			fetch('http://localhost:5000/addproducts', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify(data),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data, 'data');
					alert('product added successfully');
					setIsUpdate(true);
				});
		}
		setIsModalOpen(false);
		reset();
	};

	return (
		<section className='productList'>
			<div className='container'>
				<div className='productList-top'>
					<h4>Products</h4>
					<button onClick={showAddModal}>Add Product</button>
				</div>
				<div className='table table-responsive'>
					<table className='table table-bordered table-striped'>
						<thead className='table-light'>
							<tr>
								<th>Name</th>
								<th>Image</th>
								<th>Brand</th>
								<th>Price ($)</th>
								<th>Rating</th>

								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{products?.map((product) => (
								<tr key={product._id}>
									<td>{product?.name}</td>
									<td>
										<img
											src={product?.img}
											alt={product?.name}
											style={{
												width: '50px',
												height: '50px',
											}}
										/>
									</td>
									<td>{product?.brand}</td>
									<td>{product?.price}</td>
									<td>{product?.rate}</td>

									<td>
										<button
											className='edit-btn'
											onClick={() =>
												showEditModal(product)
											}
										>
											Edit
										</button>
										<button
											className='delete-btn'
											onClick={() =>
												handleDelete(product._id)
											}
										>
											delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='pagination'>
					<Pagination
						current={currentPage}
						total={totalPages * limit}
						pageSize={limit}
						onChange={handlePageChange}
					/>
				</div>
			</div>

			{/* Modal for Add/Edit */}
			<Modal
				title={editingProduct ? 'Edit Product' : 'Add Product'}
				open={isModalOpen}
				onCancel={() => setIsModalOpen(false)}
				footer={null}
			>
				<form className='form' onSubmit={handleSubmit(onSubmit)}>
					<div className='form-field'>
						<label>Name:</label>
						<input
							{...register('name', {
								required: 'Name is required',
							})}
						/>
						{errors.name && (
							<p className='error-message'>
								{errors.name.message}
							</p>
						)}
					</div>

					<div className='form-field'>
						<label>Image URL:</label>
						<input
							{...register('img', {
								required: 'Image URL is required',
							})}
						/>
						{errors.img && (
							<p className='error-message'>
								{errors.img.message}
							</p>
						)}
					</div>

					<div className='form-field'>
						<label>Brand:</label>
						<input
							{...register('brand', {
								required: 'Brand is required',
							})}
						/>
						{errors.brand && (
							<p className='error-message'>
								{errors.brand.message}
							</p>
						)}
					</div>

					<div className='form-field'>
						<label>Price ($):</label>
						<input
							type='number'
							{...register('price', {
								required: 'Price is required',
								min: {
									value: 1,
									message: 'Price must be at least $1',
								},
							})}
						/>
						{errors.price && (
							<p className='error-message'>
								{errors.price.message}
							</p>
						)}
					</div>

					<div className='form-field'>
						<label>Rating:</label>
						<input
							type='number'
							{...register('rate', {
								required: 'Rating is required',
								min: {
									value: 1,
									message: 'Minimum rating is 1',
								},
								max: {
									value: 5,
									message: 'Maximum rating is 5',
								},
							})}
						/>
						{errors.rate && (
							<p className='error-message'>
								{errors.rate.message}
							</p>
						)}
					</div>

					<button type='submit' className='submit-btn'>
						{editingProduct ? 'Update' : 'Add'}
					</button>
				</form>
			</Modal>
		</section>
	);
};

export default ProductList;
