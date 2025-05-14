import React, { useState, useEffect } from "react";
import type { Product } from "../types/Product";
import { productService } from "../services/productService";
import EditProductModal from "../components/EditProductModal";
import NewProductModal from "../components/NewProductModal";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getPagedProducts(
        currentPage,
        pageSize
      );
      console.log("Full API Response:", response);
      console.log("Current Page:", currentPage);
      console.log("Page Size:", pageSize);
      console.log("Total Elements:", response.page?.totalElements);
      console.log("Total Pages:", response.page?.totalPages);
      console.log("Content Length:", response.content?.length);

      setProducts(response.content || []);
      setTotal(response.page?.totalElements || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products");
      setProducts([]);
      setTotal(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize]);

  const handleCreate = () => {
    setNewModalVisible(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(id);
        alert("Product deleted successfully");
        if (products.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchProducts();
        }
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const handleUpdateProduct = async (updatedProduct: Partial<Product>) => {
    if (!editingProduct) return;
    try {
      await productService.updateProduct(editingProduct.id, {
        ...editingProduct,
        ...updatedProduct,
      });
      alert("Product updated successfully");
      fetchProducts();
    } catch (error) {
      alert("Failed to update product");
    }
  };

  const handleCreateProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      await productService.createProduct(newProduct);
      alert("Product created successfully");
      fetchProducts();
    } catch (error) {
      alert("Failed to create product");
    }
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200 shadow-sm"
        >
          <span className="mr-2">+</span>
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="3">3 per page</option>
            <option value="6">6 per page</option>
            <option value="9">9 per page</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            Next
          </button>
        </div>
      </div>

      <EditProductModal
        isVisible={editModalVisible}
        product={editingProduct}
        onClose={() => {
          setEditModalVisible(false);
          setEditingProduct(null);
        }}
        onSubmit={handleUpdateProduct}
      />

      <NewProductModal
        isVisible={newModalVisible}
        onClose={() => setNewModalVisible(false)}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
};

export default Products;
