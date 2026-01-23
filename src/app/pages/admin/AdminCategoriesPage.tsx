import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  Package,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { categoryService } from '../../services/categoryService';
import { Category } from '../../types/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentCategory?: string;
  productCount: number;
  isVisible: boolean;
  order: number;
  gender: 'women' | 'men' | 'unisex';
}

export const AdminCategoriesPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoryService.list();
        setCategories(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories');
        console.error('Failed to fetch categories:', err);
        // Keep empty array on error
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Mock categories data (fallback - will be removed once API is fully working)
  const mockCategories: Category[] = [
    {
      id: 'CAT-001',
      name: 'Dresses',
      slug: 'dresses',
      description: 'Beautiful dresses for every occasion',
      gender: 'women',
      productCount: 45,
      isVisible: true,
      order: 1,
    },
    {
      id: 'CAT-002',
      name: 'Tops & Blouses',
      slug: 'tops-blouses',
      description: 'Stylish tops and elegant blouses',
      gender: 'women',
      productCount: 38,
      isVisible: true,
      order: 2,
    },
    {
      id: 'CAT-003',
      name: 'Bottoms',
      slug: 'bottoms',
      description: 'Pants, skirts, and shorts',
      gender: 'women',
      productCount: 32,
      isVisible: true,
      order: 3,
    },
    {
      id: 'CAT-004',
      name: 'Outerwear',
      slug: 'outerwear',
      description: 'Jackets, coats, and blazers',
      gender: 'unisex',
      productCount: 28,
      isVisible: true,
      order: 4,
    },
    {
      id: 'CAT-005',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Bags, jewelry, and fashion accessories',
      gender: 'unisex',
      productCount: 52,
      isVisible: true,
      order: 5,
    },
    {
      id: 'CAT-006',
      name: 'Shirts',
      slug: 'shirts',
      description: 'Classic and casual shirts for men',
      gender: 'men',
      productCount: 24,
      isVisible: true,
      order: 6,
    },
    {
      id: 'CAT-007',
      name: 'Footwear',
      slug: 'footwear',
      description: 'Shoes, boots, and sandals',
      gender: 'unisex',
      productCount: 36,
      isVisible: false,
      order: 7,
    },
  ];

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setShowEditDialog(true);
  };

  const handleDelete = (category: Category) => {
    toast.success(`Category "${category.name}" deleted successfully`);
  };

  const handleToggleVisibility = (category: Category) => {
    const newStatus = category.isVisible ? 'hidden' : 'visible';
    toast.success(`Category "${category.name}" is now ${newStatus}`);
  };

  // Use API data
  const displayCategories = categories;

  const stats = [
    {
      label: 'Total Categories',
      value: displayCategories.length,
      color: 'text-blue-600',
    },
    {
      label: 'Visible',
      value: displayCategories.filter((c) => (c as any).isVisible !== false && (c as any).is_visible !== false).length,
      color: 'text-green-600',
    },
    {
      label: 'Total Products',
      value: displayCategories.reduce((sum, c) => sum + ((c as any).productCount || (c as any).product_count || 0), 0),
      color: 'text-purple-600',
    },
    {
      label: 'Women\'s Categories',
      value: displayCategories.filter((c) => c.gender === 'women').length,
      color: 'text-pink-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-gray-600 mt-1">
              Organize your product catalog with categories
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Categories Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading categories...</p>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-600">
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : displayCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-600">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                displayCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{category.gender}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{(category as any).productCount || (category as any).product_count || 0} items</Badge>
                  </TableCell>
                  <TableCell>{category.order || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(category)}
                    >
                      {((category as any).isVisible !== false && (category as any).is_visible !== false) ? (
                        <>
                          <Eye className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-green-600">Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-gray-400">Hidden</span>
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new product category for your store
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input placeholder="e.g., Dresses" />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input placeholder="e.g., dresses" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of the category..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select defaultValue="women">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" placeholder="1" min="1" />
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <div className="flex items-center h-10">
                  <Switch defaultChecked />
                  <span className="ml-2 text-sm">Visible</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Parent Category (Optional)</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {displayCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Category created successfully');
                setShowAddDialog(false);
              }}
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category Name</Label>
                  <Input defaultValue={selectedCategory.name} />
                </div>
                <div className="space-y-2">
                  <Label>URL Slug</Label>
                  <Input defaultValue={selectedCategory.slug} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  defaultValue={selectedCategory.description}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select defaultValue={selectedCategory.gender}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    defaultValue={selectedCategory.order}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="flex items-center h-10">
                    <Switch defaultChecked={selectedCategory.isVisible} />
                    <span className="ml-2 text-sm">Visible</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Category updated successfully');
                setShowEditDialog(false);
                setSelectedCategory(null);
              }}
            >
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
