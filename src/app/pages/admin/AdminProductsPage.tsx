import { useState, useEffect } from 'react';
import { PH } from '../../lib/formPlaceholders';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { motion } from 'motion/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product } from '../../types/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const AdminProductsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [allCategories, setAllCategories] = useState<{ name: string }[]>([]);

  useEffect(() => {
    categoryService.list().then((list) => setAllCategories(list || [])).catch(() => setAllCategories([]));
  }, []);

  // Reset to first page when search changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery]);

  // Fetch products from API (server-side search when searchQuery is set)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = {
          limit,
          skip: page * limit,
        };
        if (categoryFilter !== 'all') {
          params.category = categoryFilter;
        }
        if (statusFilter === 'featured') {
          params.featured = true;
        } else if (statusFilter === 'sale') {
          params.on_sale = true;
        } else if (statusFilter === 'new') {
          params.new_arrival = true;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const response = await productService.list(params);
        setProducts(response?.products || []);
        setTotal(response?.total || 0);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, categoryFilter, statusFilter, searchQuery]);

  const filteredProducts = products || [];

  const categoryOptions = allCategories.length > 0
    ? allCategories
    : Array.from(new Set((products || []).map((p) => p.category))).map((name) => ({ name }));

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      await productService.delete(selectedProduct.id);
      toast.success(`Product "${selectedProduct.name}" deleted successfully`);
      setShowDeleteDialog(false);
      setSelectedProduct(null);
      // Refresh products list
      const response = await productService.list({ limit, skip: page * limit });
      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    navigate(`/admin/products/edit?id=${product.id}`);
  };

  const handleDuplicate = async (product: Product) => {
    try {
      const duplicateData: Partial<Product> = {
        name: `${product.name} (Copy)`,
        sku: product.sku || undefined,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
        gender: product.gender,
        price: product.price,
        original_price: product.original_price,
        sizes: product.sizes || [],
        colors: product.colors || [],
        material: product.material,
        care: product.care,
        images: product.images || [],
        stock: product.stock || {},
        details: product.details || [],
        featured: false,
        on_sale: product.on_sale,
        new_arrival: false,
      };
      await productService.create(duplicateData);
      toast.success(`Product "${product.name}" duplicated successfully`);
      // Refresh products list
      const response = await productService.list({ limit, skip: page * limit });
      setProducts(response.products || []);
      setTotal(response.total || 0);
    } catch (error: any) {
      console.error('Failed to duplicate product:', error);
      toast.error(error.message || 'Failed to duplicate product');
    }
  };

  const handleExport = async () => {
    try {
      const response = await productService.list({ limit: 10000 });
      const list = response?.products || [];
      const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${list.length} products`);
    } catch (error: any) {
      console.error('Export failed:', error);
      toast.error(error?.message || 'Export failed');
    }
  };

  const handleImportClick = () => {
    const input = document.getElementById('admin-products-import-input') as HTMLInputElement;
    input?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const list = Array.isArray(data) ? data : [data];
      let created = 0;
      for (const item of list) {
        const payload = { ...item };
        delete payload.id;
        delete payload.created_at;
        delete payload.updated_at;
        await productService.create(payload);
        created++;
      }
      toast.success(`Imported ${created} product(s)`);
      const response = await productService.list({ limit, skip: page * limit });
      setProducts(response?.products || []);
      setTotal(response?.total ?? total);
    } catch (error: any) {
      console.error('Import failed:', error);
      toast.error(error?.message || 'Import failed. Use a JSON array of products.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalog ({total} items)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <input
              id="admin-products-import-input"
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
            <Button variant="outline" onClick={handleImportClick}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => navigate('/admin/products/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={PH.searchProducts}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoryOptions.map((cat) => (
                <SelectItem key={cat.name} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="sale">On Sale</SelectItem>
              <SelectItem value="new">New Arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.images?.[0] || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">ID: {product.id.slice(-8)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.sku || '—'}</span>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <span className="capitalize">{product.gender}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">${product.price.toFixed(2)}</p>
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-sm text-gray-400 line-through">
                            ${product.original_price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const totalStock = Object.values(product.stock || {}).reduce((sum, qty) => sum + qty, 0);
                        return totalStock > 0 ? (
                          <Badge variant="outline">{totalStock} in stock</Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600">Out of stock</Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.featured && (
                          <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                        )}
                        {product.on_sale && (
                          <Badge className="bg-red-100 text-red-800">Sale</Badge>
                        )}
                        {product.new_arrival && (
                          <Badge className="bg-green-100 text-green-800">New</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View on Store
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info */}
        {total > limit && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">
              Showing {page * limit + 1}-{Math.min((page + 1) * limit, total)} of {total} products
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={(page + 1) * limit >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </AdminLayout>
  );
};
