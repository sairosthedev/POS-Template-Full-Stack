import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, Download, Upload, Tags } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Table, TableHead, TableBody, TableHeader, TableRow, TableCell } from '../../components/ui/Table';
import ImportProductsModal from '../../components/ImportProductsModal';

const API = ''; // baseURL is configured globally (services/axios.config.js)

const UNITS = ['Unit', 'Item', 'Kg', 'Gram', 'Litre', 'Piece', 'Pack', 'Box', 'Carton', 'Dozen'];
const STOCK_TYPES = ['Defined', 'Unlimited', 'None'];

const emptyProduct = {
  name: '', barcode: '', category: '', price: '', cost: '',
  stock: '', unit: 'Unit', stockType: 'Defined', stockAlert: 0,
  availableForSale: true, addToProfit: true,
};

// ── Category Manager Modal ────────────────────────────────────────────────────
const CategoriesModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => { if (isOpen) fetchCategories(); }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/products/categories`);
      setCategories(res.data.data || []);
    } catch { setCategories([]); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await axios.post(`${API}/products/categories`, { name: newName.trim() });
    setNewName('');
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      await axios.delete(`${API}/products/categories/${id}`);
      fetchCategories();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Categories">
      <form onSubmit={handleAdd} className="flex gap-2 mb-5">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          placeholder="New category name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
        />
        <Button type="submit" size="md" className="bg-primary hover:bg-blue-700 shadow-sm shadow-primary/20 font-bold"><Plus size={16} className="mr-1" />Add</Button>
      </form>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
        {categories.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-6">No categories yet. Add one above.</p>
        )}
        {categories.map(cat => (
          <div key={cat._id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
            <span className="text-sm font-bold text-text-main">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat._id)}
              className="w-8 h-8 flex items-center justify-center text-danger hover:bg-danger/10 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(emptyProduct);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data.data || []);
    } catch { setProducts([]); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/products/categories`);
      setCategories(res.data.data || []);
    } catch { setCategories([]); }
  };

  const openAdd = () => {
    setCurrentProduct(emptyProduct);
    setShowProductModal(true);
  };

  const openEdit = (product) => {
    setCurrentProduct(product);
    setShowProductModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...currentProduct };
      if (!payload.barcode) delete payload.barcode;

      if (currentProduct._id) {
        await axios.put(`${API}/products/${currentProduct._id}`, payload);
      } else {
        await axios.post(`${API}/products`, payload);
      }
      setShowProductModal(false);
      fetchProducts();
    } catch (error) {
      alert('Failed to save product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await axios.delete(`${API}/products/${id}`);
      fetchProducts();
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const header = ['Name', 'Barcode', 'Category', 'Price', 'Cost', 'Stock', 'Unit'];
    const rows = products.map(p => [p.name, p.barcode || '', p.category, p.price, p.cost, p.stock, p.unit]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'products.csv'; a.click();
  };

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-black text-text-main tracking-tight leading-none">Catalog Inventory</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">Manage your retail products</p>
          </div>
          
          <div className="relative group hidden md:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-72 placeholder:text-slate-300 font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={openAdd} className="bg-primary hover:bg-blue-700 shadow-lg shadow-primary/20 gap-2 h-11 px-6 font-bold rounded-xl active:scale-95 transition-all">
            <Plus size={18} /> Add Product
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-indigo-500/20 text-indigo-600 hover:bg-indigo-50 h-11 px-4 font-bold rounded-xl"
            onClick={() => { setShowCatModal(true); fetchCategories(); }}
          >
            <Tags size={18} /> Categories
          </Button>
          <Button variant="outline" className="gap-2 border-slate-200 text-slate-500 hover:bg-slate-50 h-11 px-4 font-bold rounded-xl" onClick={handleExportCSV}>
            <Download size={18} /> Export
          </Button>
          <Button variant="outline" className="gap-2 border-warning/20 text-warning hover:bg-warning/5 h-11 px-4 font-bold rounded-xl" onClick={() => setShowImportModal(true)}>
            <Upload size={18} /> Batch Import
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Unit</TableHeader>
            <TableHeader>Stock</TableHeader>
            <TableHeader>Actions</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map(product => (
            <TableRow key={product._id} className="group hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-bold text-text-main py-4">{product.name}</TableCell>
              <TableCell>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-primary text-[11px] font-black uppercase tracking-wider border border-blue-100/50">
                  {product.category}
                </span>
              </TableCell>
              <TableCell className="font-bold">${Number(product.price).toFixed(2)}</TableCell>
              <TableCell className="text-slate-400 font-medium">{product.unit}</TableCell>
              <TableCell>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase ${
                  product.stock < (product.stockAlert || 5) 
                    ? 'bg-danger/10 text-danger border border-danger/20' 
                    : 'bg-success/10 text-success border border-success/20'
                }`}>
                  {product.stock} {product.unit}s
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 transition-opacity">
                  <button
                    onClick={() => openEdit(product)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                {search ? `No products match "${search}"` : 'No products yet. Click "Add New Product" to get started.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ── Add / Edit Product Modal ── */}
      <Modal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        title={currentProduct._id ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name"
              value={currentProduct.name}
              onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              required
            />
            <Input
              label="Barcode (Optional)"
              value={currentProduct.barcode || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, barcode: e.target.value })}
            />
          </div>

          {/* Row 2: Category dropdown + Unit dropdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                value={currentProduct.category}
                onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                required
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3eb2]"
              >
                <option value="">Select a Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <select
                value={currentProduct.unit}
                onChange={e => setCurrentProduct({ ...currentProduct, unit: e.target.value })}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3eb2]"
              >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Row 3: Stock Type + Stock Alert */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Stock Type</label>
              <select
                value={currentProduct.stockType}
                onChange={e => setCurrentProduct({ ...currentProduct, stockType: e.target.value })}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c3eb2]"
              >
                {STOCK_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Input
              label="Stock Alert"
              type="number"
              value={currentProduct.stockAlert}
              onChange={e => setCurrentProduct({ ...currentProduct, stockAlert: e.target.value })}
            />
          </div>

          {/* Row 4: Cost + Price */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cost"
              type="number"
              step="0.01"
              value={currentProduct.cost}
              onChange={e => setCurrentProduct({ ...currentProduct, cost: e.target.value })}
              required
            />
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={currentProduct.price}
              onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })}
              required
            />
          </div>

          {/* Row 5: Stock (only show when adding new) */}
          {!currentProduct._id && (
            <Input
              label="Opening Stock"
              type="number"
              value={currentProduct.stock}
              onChange={e => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
              required
            />
          )}

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={currentProduct.availableForSale}
                onChange={e => setCurrentProduct({ ...currentProduct, availableForSale: e.target.checked })}
                className="w-4 h-4 accent-[#1c3eb2]"
              />
              Available for Sale
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={currentProduct.addToProfit}
                onChange={e => setCurrentProduct({ ...currentProduct, addToProfit: e.target.checked })}
                className="w-4 h-4 accent-[#1c3eb2]"
              />
              Add to Profit
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
            <Button type="button" variant="ghost" onClick={() => setShowProductModal(false)}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Modal>

      {/* ── Category Modal ── */}
      <CategoriesModal
        isOpen={showCatModal}
        onClose={() => { setShowCatModal(false); fetchCategories(); }}
      />

      {/* ── Import Products Modal ── */}
      <ImportProductsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImported={() => { fetchProducts(); setShowImportModal(false); }}
      />
    </div>
  );
};

export default ProductsManagement;
