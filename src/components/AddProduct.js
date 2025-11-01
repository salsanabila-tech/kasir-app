// AddProduct.js
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function AddProduct() {
  const [name, setName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [unitType, setUnitType] = useState('pcs');
  const [stock, setStock] = useState('');

  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'products'), {
        name,
        unitPrice: parseFloat(unitPrice),
        unitType,
        stock: parseFloat(stock),
      });
      alert('Produk berhasil ditambahkan!');
      setName('');
      setUnitPrice('');
      setUnitType('pcs');
      setStock('');
    } catch (error) {
      console.error('Gagal tambah produk:', error);
    }
  };

  return (
    <form onSubmit={handleAddProduct} style={{ marginBottom: '20px' }}>
      <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="number" placeholder="Harga per Satuan" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
      <select value={unitType} onChange={(e) => setUnitType(e.target.value)} required>
        <option value="pcs">Per Butir / Pcs</option>
        <option value="kg">Per Kg</option>
      </select>
      <input type="number" placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} required />
      <button type="submit">Tambah Produk</button>
    </form>
  );
}

export default AddProduct;
