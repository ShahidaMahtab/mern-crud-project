//import ProductList from './components/products/productList/productList';
import ProductListRefactored from './components/products/ProductListRefactored/ProductListRefactored';
import Navbar from './layout/Navbar/Navbar';
function App() {
	return (
		<>
			<div>
				<Navbar />
				{/* <ProductList></ProductList> */}
				<ProductListRefactored />
			</div>
		</>
	);
}

export default App;
