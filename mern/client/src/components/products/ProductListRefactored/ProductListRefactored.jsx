import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import './ProductListRefactored.scss';
import ProductModal from '../../ProductModal/ProductModal';

const ProductListRefactored = () => {
	const [products, setProducts] = useState([]);
	const [editingProduct, setEditingProduct] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isUpdate, setIsUpdate] = useState(false);
	const limit = 5; // Number of products per page

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
		setIsModalOpen(true);
	};

	const showEditModal = (product) => {
		setEditingProduct(product);
		setIsModalOpen(true);
	};

	const handleDelete = (id) => {
		setIsUpdate(false);
		if (window.confirm('Are you sure you want to delete this product?')) {
			fetch(`http://localhost:5000/deleteproduct/${id}`, {
				method: 'DELETE',
			})
				.then((res) => res.json())
				.then((data) => {
					console.log('Product deleted:', data);
					setIsUpdate(true);
				})
				.catch((error) =>
					console.error('Error deleting product:', error)
				);
		}
	};

	const handleFormSubmit = (data, isEditing) => {
		const newData = {
			name: data.name,
			img: data.img,
			brand: data.brand,
			price: data.price,
			rate: data.rate,
		};

		setIsUpdate(false);

		if (isEditing) {
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
				})
				.catch((error) =>
					console.error('Error updating product:', error)
				);
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
				})
				.catch((error) =>
					console.error('Error adding product:', error)
				);
		}

		setIsModalOpen(false);
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
											Delete
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

			<ProductModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleFormSubmit}
				product={editingProduct}
			/>
		</section>
	);
};

export default ProductListRefactored;
