import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Plus,
  Package,
  Edit2,
  Trash2,
  Copy,
  Eye,
  AlertTriangle,
  UploadCloud,
  FileSpreadsheet,
  Layers
} from 'lucide-react';
import { PageHeader } from '../../../components/common/KpiCard.jsx';
import { DataTable } from '../../../components/tables/DataTable.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Modal, ConfirmDialog, Drawer } from '../../../components/ui/Card.jsx';
import { Input, Select, Textarea, Badge } from '../../../components/ui/Input.jsx';
import { productsApi } from '../products.api.js';
import { formatCurrency } from '../../../utils/formatCurrency.js';

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: response, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getProducts()
  });

  const products = response?.data || [];

  const { data: catResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: productsApi.getCategories
  });
  const categories = catResponse?.data || [];

  const { register, handleSubmit, reset, setValue } = useForm();

  const createMutation = useMutation({
    mutationFn: productsApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product added to catalog');
      setIsModalOpen(false);
      reset();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productsApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product updated');
      setIsModalOpen(false);
      setEditingProduct(null);
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: productsApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Product removed');
      setDeletingId(null);
    }
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    reset({
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      name: '',
      category: categories[0]?.name || 'Industrial Tools',
      unit: 'PCS',
      packingUnit: 'Carton of 12',
      costPrice: 0,
      salePrice: 0,
      reorderLevel: 10,
      stock: 0,
      status: 'Active',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setValue('sku', p.sku);
    setValue('barcode', p.barcode);
    setValue('name', p.name);
    setValue('category', p.category);
    setValue('unit', p.unit);
    setValue('packingUnit', p.packingUnit);
    setValue('costPrice', p.costPrice);
    setValue('salePrice', p.salePrice);
    setValue('reorderLevel', p.reorderLevel);
    setValue('status', p.status);
    setValue('description', p.description);
    setIsModalOpen(true);
  };

  const handleDuplicate = (p) => {
    const duplicated = {
      ...p,
      sku: `${p.sku}-COPY`,
      name: `${p.name} (Copy)`
    };
    delete duplicated._id;
    delete duplicated.createdAt;
    delete duplicated.updatedAt;
    createMutation.mutate(duplicated);
  };

  const onSubmit = (formData) => {
    formData.costPrice = Number(formData.costPrice) || 0;
    formData.salePrice = Number(formData.salePrice) || 0;
    formData.reorderLevel = Number(formData.reorderLevel) || 0;
    formData.stock = Number(formData.stock) || 0;

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const columns = [
    { key: 'sku', header: 'SKU', cellClassName: 'font-mono font-bold text-sky-700' },
    {
      key: 'name',
      header: 'Product Name',
      cellClassName: 'font-semibold text-slate-900',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-400 font-mono">Barcode: {row.barcode || 'N/A'}</div>
        </div>
      )
    },
    { key: 'category', header: 'Category' },
    { key: 'unit', header: 'Unit', cellClassName: 'text-center font-medium' },
    {
      key: 'costPrice',
      header: 'Cost Price',
      render: (val) => formatCurrency(val)
    },
    {
      key: 'salePrice',
      header: 'Sale Price',
      render: (val) => <span className="font-semibold text-slate-900">{formatCurrency(val)}</span>
    },
    {
      key: 'stock',
      header: 'Stock On Hand',
      render: (val, row) => (
        <span
          className={`font-bold px-2 py-0.5 rounded text-xs ${
            val <= row.reorderLevel
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'text-slate-800'
          }`}
        >
          {val} {row.unit}
        </span>
      )
    },
    { key: 'reorderLevel', header: 'Reorder Level', cellClassName: 'text-slate-500' },
    {
      key: 'status',
      header: 'Status',
      render: (val) => <Badge size="sm">{val}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setViewingProduct(row)}
            className="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-50"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDuplicate(row)}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingId(row._id)}
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Products & Master Catalog"
        subtitle="Manage SKU catalog, barcode indexing, multi-tier pricing, and inventory reorder metrics"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={UploadCloud} onClick={() => toast.info('Import wizard ready for CSV/Excel')}>
              Import
            </Button>
            <Button icon={Plus} onClick={handleOpenCreate}>
              Add Product
            </Button>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={filteredProducts}
        isLoading={isLoading}
        title="Products"
        exportFileName="products_catalog"
        filterComponent={
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        }
      />

      {/* Product Drawer Viewer */}
      <Drawer
        isOpen={Boolean(viewingProduct)}
        onClose={() => setViewingProduct(null)}
        title="Product Specification Sheet"
        footer={
          <Button variant="outline" onClick={() => setViewingProduct(null)}>
            Close
          </Button>
        }
      >
        {viewingProduct && (
          <div className="space-y-5 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[10px] font-mono text-sky-600 font-bold uppercase">{viewingProduct.sku}</div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">{viewingProduct.name}</h3>
              <p className="text-slate-500 mt-1">{viewingProduct.description || 'No detailed specification provided.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400">Category</span>
                <div className="font-semibold text-slate-800 mt-0.5">{viewingProduct.category}</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400">Barcode</span>
                <div className="font-mono font-semibold text-slate-800 mt-0.5">{viewingProduct.barcode || '-'}</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400">Cost Price</span>
                <div className="font-semibold text-slate-800 mt-0.5">{formatCurrency(viewingProduct.costPrice)}</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400">Sale Price</span>
                <div className="font-bold text-sky-700 mt-0.5">{formatCurrency(viewingProduct.salePrice)}</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400">Current Stock</span>
                <div className="font-bold text-slate-900 mt-0.5">{viewingProduct.stock} {viewingProduct.unit}</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400">Reorder Level</span>
                <div className="font-semibold text-slate-800 mt-0.5">{viewingProduct.reorderLevel} {viewingProduct.unit}</div>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product Specification' : 'Add New Product to Catalog'}
        maxWidth="max-w-3xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingProduct ? 'Update Product' : 'Save Product'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="SKU" required {...register('sku')} />
          <Input label="Barcode" placeholder="EAN-13 / UPC" {...register('barcode')} />
          <Select
            label="Category"
            options={categories.map((c) => c.name)}
            required
            {...register('category')}
          />

          <div className="md:col-span-3">
            <Input label="Product Name" placeholder="e.g. Titanium Rotary Drill 850W" required {...register('name')} />
          </div>

          <Select label="Quantity Unit" options={['PCS', 'KG', 'BOX', 'MTR']} required {...register('unit')} />
          <Select label="Packing Unit" options={['Single Unit', 'Carton of 12', 'Pallet of 100']} {...register('packingUnit')} />
          <Select label="Status" options={['Active', 'Inactive']} {...register('status')} />

          <Input label="Cost Price ($)" type="number" step="0.01" required {...register('costPrice')} />
          <Input label="Sale Price ($)" type="number" step="0.01" required {...register('salePrice')} />
          <Input label="Reorder Level" type="number" required {...register('reorderLevel')} />

          {!editingProduct && (
            <Input label="Initial Opening Stock" type="number" {...register('stock')} />
          )}

          <div className="md:col-span-3">
            <Textarea label="Product Description & Notes" placeholder="Detailed product specifications..." {...register('description')} />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deleteMutation.mutate(deletingId)}
        title="Delete Product"
        message="Are you sure you want to delete this SKU from the master product catalog?"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
