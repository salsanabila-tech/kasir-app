import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');

  const fetchProducts = async () => {
    const data = await getDocs(collection(db, 'products'));
    setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setNewName(product.name);
    setNewPrice(product.price);
    setNewStock(product.stock || 0);
  };

  const handleUpdate = async () => {
    if (editProduct) {
      await updateDoc(doc(db, 'products', editProduct.id), {
        name: newName,
        price: Number(newPrice),
        stock: Number(newStock),
      });
      setEditProduct(null);
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">📦 Daftar Produk</h2>
      {products.map((product) => (
        <div key={product.id} className="mb-2">
          <strong>{product.name}</strong> — Rp{product.price} — Stock: {product.stock || 0}
          <button className="ml-2 text-blue-500" onClick={() => handleEdit(product)}>
            Edit
          </button>
          <button className="ml-2 text-red-500" onClick={() => deleteProduct(product.id)}>
            Hapus
          </button>
        </div>
      ))}

      {editProduct && (
        <div className="mt-4">
          <h3>Edit Produk</h3>
          <input className="border p-1 mr-2" placeholder="Nama Produk" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input className="border p-1 mr-2" placeholder="Harga" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          <input className="border p-1 mr-2" placeholder="Stok" value={newStock} onChange={(e) => setNewStock(e.target.value)} />
          <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={handleUpdate}>
            Simpan
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;
