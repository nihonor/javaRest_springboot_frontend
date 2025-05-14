import axios from 'axios';
import type { Product } from '../types/Product';

const API_URL = 'http://localhost:8080/api/products';

export const productService = {
    // Get paginated products
    getPagedProducts: async (page: number = 0, size: number = 5) => {
        const response = await axios.get(`${API_URL}/paged?page=${page}&size=${size}`);
        return response.data;
    },

    // Get all products
    getAllProducts: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    // Get product by ID
    getProductById: async (id: number) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    // Get products by price
    getProductsByPrice: async (price: number) => {
        const response = await axios.get(`${API_URL}/price/${price}`);
        return response.data;
    },

    // Create new product
    createProduct: async (product: Omit<Product, 'id'>) => {
        const response = await axios.post(API_URL, product);
        return response.data;
    },

    // Update product
    updateProduct: async (id: number, product: Product) => {
        const response = await axios.put(`${API_URL}/${id}`, product);
        return response.data;
    },

    // Delete product
    deleteProduct: async (id: number) => {
        await axios.delete(`${API_URL}/${id}`);
    }
}; 