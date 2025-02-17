import { useForm } from 'react-hook-form';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import './ProductModal.scss';
const ProductModal = ({ isOpen, onClose, onSubmit, product }) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	// Reset form when product changes
	useEffect(() => {
		if (product) {
			reset(product);
		} else {
			reset({
				name: '',
				img: '',
				brand: '',
				price: '',
				rate: '',
			});
		}
	}, [product, reset]);

	const submitHandler = (data) => {
		onSubmit(data, !!product);
		reset();
	};

	return (
		<Modal
			title={product ? 'Edit Product' : 'Add Product'}
			open={isOpen}
			onCancel={onClose}
			footer={null}
		>
			<form className='form' onSubmit={handleSubmit(submitHandler)}>
				<div className='form-field'>
					<label>Name:</label>
					<input
						{...register('name', {
							required: 'Name is required',
						})}
					/>
					{errors.name && (
						<p className='error-message'>{errors.name.message}</p>
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
						<p className='error-message'>{errors.img.message}</p>
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
						<p className='error-message'>{errors.brand.message}</p>
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
						<p className='error-message'>{errors.price.message}</p>
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
						<p className='error-message'>{errors.rate.message}</p>
					)}
				</div>

				<button type='submit' className='submit-btn'>
					{product ? 'Update' : 'Add'}
				</button>
			</form>
		</Modal>
	);
};
ProductModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	product: PropTypes.object,
};
export default ProductModal;
