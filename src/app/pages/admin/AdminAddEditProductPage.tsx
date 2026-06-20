import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import { ArrowLeft, Image as ImageIcon, Save, X, Plus, Link2, Link2Off, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { productService } from '../../services/productService';
import { Product } from '../../types/api';
import { PH } from '../../lib/formPlaceholders';
import { useEffect } from 'react';
import { isAxiosError } from 'axios';
import { getApiErrorMessage } from '../../lib/apiErrors';
import { useProductVariants } from '../../hooks/useProducts';

const COMMON_COLORS = [
  { name: 'Black',  hex: '#000000' },
  { name: 'White',  hex: '#FFFFFF' },
  { name: 'Gray',   hex: '#808080' },
  { name: 'Navy',   hex: '#000080' },
  { name: 'Beige',  hex: '#F5F5DC' },
  { name: 'Brown',  hex: '#8B4513' },
  { name: 'Red',    hex: '#FF0000' },
  { name: 'Blue',   hex: '#0000FF' },
  { name: 'Green',  hex: '#008000' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Pink',   hex: '#FFC0CB' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Teal',   hex: '#008080' },
];

export const AdminAddEditProductPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const isEdit = !!productId;
  const [loading, setLoading] = useState(isEdit);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [variantGroupInput, setVariantGroupInput] = useState('');
  const [variantColor, setVariantColor] = useState('');
  const [variantSaving, setVariantSaving] = useState(false);
  const { variants, loading: variantsLoading, refetch: refetchVariants } = useProductVariants(isEdit ? productId! : undefined);

  // Add Color Variant modal
  const [showAddVariantModal, setShowAddVariantModal] = useState(false);
  const [addVariantForm, setAddVariantForm] = useState({
    parentColor: '',
    newColor: '',
    priceOverride: '',
    stock: {} as Record<string, number>,
  });
  const [addVariantSaving, setAddVariantSaving] = useState(false);

  const openAddVariantModal = () => {
    setAddVariantForm({
      parentColor: '',
      newColor: '',
      priceOverride: '',
      stock: Object.fromEntries(formData.sizes.map((s) => [s, 0])),
    });
    setShowAddVariantModal(true);
  };

  const handleAddVariant = async () => {
    const newColor = addVariantForm.newColor.trim();
    if (!newColor) {
      toast.error('Enter a color name for the new variant');
      return;
    }
    const parentHasGroup = variants.length > 1;
    const parentColor = addVariantForm.parentColor.trim();
    if (!parentHasGroup && !parentColor) {
      toast.error('Enter the color name for this (current) product first');
      return;
    }

    setAddVariantSaving(true);
    try {
      // 1. Clone current product with new color
      const newProduct = await productService.create({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        gender: formData.gender,
        price: addVariantForm.priceOverride ? parseFloat(addVariantForm.priceOverride) : parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        sizes: formData.sizes,
        colors: [newColor],
        material: formData.material,
        care: formData.care,
        images: [],
        stock: addVariantForm.stock,
        details: formData.details,
        featured: formData.featured,
        on_sale: formData.onSale,
        new_arrival: formData.newArrival,
        is_gift: formData.isGift,
        available_markets: formData.availableMarkets,
      });
      const newProductId = String(newProduct.id);

      // 2. Determine or create the variant group
      let groupId: string | undefined;
      if (parentHasGroup) {
        groupId = String(variants[0]?.variant_group_id);
      } else {
        const result = await productService.setVariantGroup(productId!, {
          color: parentColor,
          is_main_variant: true,
        });
        groupId = result.variant_group_id;
      }

      // 3. Link the new product to the group
      await productService.setVariantGroup(newProductId, {
        variant_group_id: groupId,
        color: newColor,
        is_main_variant: false,
      });

      toast.success(`"${newColor}" variant created — upload its images now`);
      setShowAddVariantModal(false);
      refetchVariants?.();
      navigate(`/admin/products/edit?id=${newProductId}`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to create variant'));
    } finally {
      setAddVariantSaving(false);
    }
  };
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    subcategory: '',
    gender: 'women' as 'women' | 'men' | 'unisex',
    price: '',
    originalPrice: '',
    sizes: [] as string[],
    colors: [] as string[],
    material: '',
    care: '',
    featured: false,
    onSale: false,
    newArrival: false,
    isGift: false,
    images: [] as string[],
    stock: {} as Record<string, number>,
    details: [] as string[],
    availableMarkets: ['IN', 'US'] as ('IN' | 'US')[],
    // Publishing
    status: 'active' as 'active' | 'draft',
    badge: '',
    videoUrl: '',
    // Catalog / identity
    brand: '',
    barcode: '',
    countryOfOrigin: '',
    tags: [] as string[],
    // Pricing extras
    priceInr: '',
    costPrice: '',
    // Shipping
    weight: '',
    lengthCm: '',
    widthCm: '',
    heightCm: '',
    // Tax
    hsnCode: '',
    taxCode: '',
    gstPercent: '',
    // SEO
    metaTitle: '',
    metaDescription: '',
  });

  // Fetch product data if editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEdit || !productId) return;
      
      try {
        setLoading(true);
        const product = await productService.getById(productId);
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          category: product.category || '',
          subcategory: product.subcategory || '',
          gender: product.gender || 'women',
          price: product.price?.toString() || '',
          originalPrice: product.original_price?.toString() || '',
          sizes: product.sizes || [],
          colors: product.colors || [],
          material: product.material || '',
          care: product.care || '',
          featured: product.featured || false,
          onSale: product.on_sale || false,
          newArrival: product.new_arrival || false,
          isGift: product.is_gift || false,
          images: product.images || [],
          stock: product.stock || {},
          details: product.details || [],
          availableMarkets: (() => {
            const m = product.available_markets;
            if (m?.length) {
              return m.filter((x): x is 'IN' | 'US' => x === 'IN' || x === 'US');
            }
            return ['IN', 'US'] as ('IN' | 'US')[];
          })(),
          status: (product.status === 'draft' ? 'draft' : 'active') as 'active' | 'draft',
          badge: product.badge || '',
          videoUrl: product.video_url || '',
          brand: product.brand || '',
          barcode: product.barcode || '',
          countryOfOrigin: product.country_of_origin || '',
          tags: product.tags || [],
          priceInr: product.price_inr?.toString() || '',
          costPrice: product.cost_price?.toString() || '',
          weight: product.weight?.toString() || '',
          lengthCm: product.length_cm?.toString() || '',
          widthCm: product.width_cm?.toString() || '',
          heightCm: product.height_cm?.toString() || '',
          hsnCode: product.hsn_code || '',
          taxCode: product.tax_code || '',
          gstPercent: product.gst_percent?.toString() || '',
          metaTitle: product.meta_title || '',
          metaDescription: product.meta_description || '',
        });
      } catch (error: unknown) {
        console.error('Failed to fetch product:', error);
        toast.error(getApiErrorMessage(error, 'Failed to load product'));
        if (
          isAxiosError(error) &&
          (error.response?.status === 404 || error.response?.status === 400)
        ) {
          navigate('/admin/products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isEdit, productId, navigate]);

  // Custom color state
  const [customColorName, setCustomColorName] = useState('');
  const [customColorValue, setCustomColorValue] = useState('#000000');

  // Function to get color name from hex value
  const getColorNameFromHex = (hex: string): string => {
    const colorMap: { [key: string]: string } = {
      '#000000': 'Black',
      '#ffffff': 'White',
      '#808080': 'Gray',
      '#c0c0c0': 'Silver',
      '#ff0000': 'Red',
      '#00ff00': 'Lime',
      '#0000ff': 'Blue',
      '#ffff00': 'Yellow',
      '#00ffff': 'Cyan',
      '#ff00ff': 'Magenta',
      '#800000': 'Maroon',
      '#808000': 'Olive',
      '#008000': 'Green',
      '#800080': 'Purple',
      '#008080': 'Teal',
      '#000080': 'Navy',
      '#ffa500': 'Orange',
      '#ffc0cb': 'Pink',
      '#a52a2a': 'Brown',
      '#f5f5dc': 'Beige',
      '#d3d3d3': 'Light Gray',
      '#add8e6': 'Light Blue',
      '#90ee90': 'Light Green',
      '#ffb6c1': 'Light Pink',
      '#ffd700': 'Gold',
      '#b87333': 'Copper',
      '#e6e6fa': 'Lavender',
      '#f0e68c': 'Khaki',
      '#dda0dd': 'Plum',
      '#bc8f8f': 'Rosy Brown',
      '#4169e1': 'Royal Blue',
      '#8b4513': 'Saddle Brown',
      '#fa8072': 'Salmon',
      '#f4a460': 'Sandy Brown',
      '#2e8b57': 'Sea Green',
      '#fff5ee': 'Seashell',
      '#a0522d': 'Sienna',
      '#87ceeb': 'Sky Blue',
      '#6a5acd': 'Slate Blue',
      '#708090': 'Slate Gray',
      '#fffafa': 'Snow',
      '#00ff7f': 'Spring Green',
      '#4682b4': 'Steel Blue',
      '#d2b48c': 'Tan',
      '#d8bfd8': 'Thistle',
      '#ff6347': 'Tomato',
      '#40e0d0': 'Turquoise',
      '#ee82ee': 'Violet',
      '#f5deb3': 'Wheat',
      '#f5f5f5': 'White Smoke',
      '#9acd32': 'Yellow Green',
    };

    const normalizedHex = hex.toLowerCase();
    
    // Check for exact match
    if (colorMap[normalizedHex]) {
      return colorMap[normalizedHex];
    }

    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Determine color family based on RGB values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    // Grayscale
    if (diff < 30) {
      if (max < 50) return 'Black';
      if (max < 100) return 'Dark Gray';
      if (max < 150) return 'Gray';
      if (max < 200) return 'Light Gray';
      if (max < 240) return 'Very Light Gray';
      return 'White';
    }

    // Determine hue
    let hue = 0;
    if (max === r) {
      hue = ((g - b) / diff) % 6;
    } else if (max === g) {
      hue = (b - r) / diff + 2;
    } else {
      hue = (r - g) / diff + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;

    // Determine saturation and lightness
    const lightness = (max + min) / 2 / 255;
    const saturation = diff / (255 - Math.abs(2 * lightness * 255 - 255));

    // Generate color name based on hue
    let colorName = '';
    
    if (hue < 15 || hue >= 345) {
      colorName = 'Red';
    } else if (hue < 45) {
      colorName = 'Orange';
    } else if (hue < 75) {
      colorName = 'Yellow';
    } else if (hue < 150) {
      colorName = 'Green';
    } else if (hue < 200) {
      colorName = 'Cyan';
    } else if (hue < 260) {
      colorName = 'Blue';
    } else if (hue < 290) {
      colorName = 'Purple';
    } else if (hue < 330) {
      colorName = 'Magenta';
    } else {
      colorName = 'Pink';
    }

    // Add lightness descriptor
    if (lightness < 0.25) {
      colorName = 'Dark ' + colorName;
    } else if (lightness > 0.75) {
      colorName = 'Light ' + colorName;
    } else if (lightness > 0.6) {
      colorName = 'Pale ' + colorName;
    }

    // Add saturation descriptor for muted colors
    if (saturation < 0.3 && lightness > 0.3 && lightness < 0.7) {
      colorName = 'Muted ' + colorName;
    }

    return colorName;
  };

  const handleColorPickerChange = (hexColor: string) => {
    setCustomColorValue(hexColor);
    // Auto-fill color name if the field is empty or unchanged from previous auto-fill
    const suggestedName = getColorNameFromHex(hexColor);
    setCustomColorName(suggestedName);
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) {
      toast.error('Please enter a color name');
      return;
    }

    if (formData.colors.includes(customColorName)) {
      toast.error('This color is already added');
      return;
    }

    setFormData({
      ...formData,
      colors: [...formData.colors, customColorName],
    });

    toast.success(`Color "${customColorName}" added`);
    setCustomColorName('');
    setCustomColorValue('#000000');
  };

  const handleRemoveColor = (colorName: string) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c !== colorName),
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.availableMarkets.length === 0) {
      toast.error('Select at least one market (IN / US)');
      return;
    }

    try {
      const productData: Partial<Product> = {
        name: formData.name,
        sku: formData.sku || undefined,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        gender: formData.gender,
        price: parseFloat(formData.price),
        original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        sizes: formData.sizes,
        colors: formData.colors,
        material: formData.material,
        care: formData.care || undefined,
        images: formData.images,
        stock: formData.stock,
        details: formData.details,
        featured: formData.featured,
        on_sale: formData.onSale,
        new_arrival: formData.newArrival,
        is_gift: formData.isGift,
        available_markets: formData.availableMarkets,
        status: formData.status,
        badge: formData.badge || undefined,
        video_url: formData.videoUrl || undefined,
        brand: formData.brand || undefined,
        barcode: formData.barcode || undefined,
        country_of_origin: formData.countryOfOrigin || undefined,
        tags: formData.tags,
        price_inr: formData.priceInr ? parseFloat(formData.priceInr) : undefined,
        cost_price: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        length_cm: formData.lengthCm ? parseFloat(formData.lengthCm) : undefined,
        width_cm: formData.widthCm ? parseFloat(formData.widthCm) : undefined,
        height_cm: formData.heightCm ? parseFloat(formData.heightCm) : undefined,
        hsn_code: formData.hsnCode || undefined,
        tax_code: formData.taxCode || undefined,
        gst_percent: formData.gstPercent ? parseFloat(formData.gstPercent) : undefined,
        meta_title: formData.metaTitle || undefined,
        meta_description: formData.metaDescription || undefined,
      };

      if (isEdit && productId) {
        await productService.update(productId, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.create(productData);
        toast.success('Product created successfully');
      }
      
      navigate('/admin/products');
    } catch (error: unknown) {
      console.error('Failed to save product:', error);
      toast.error(getApiErrorMessage(error, `Failed to ${isEdit ? 'update' : 'create'} product`));
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList?.length || !isEdit || !productId) return;
    // Snapshot before clearing input — FileList is live and empties when value is reset.
    const filesToUpload = Array.from(fileList);
    e.target.value = '';
    try {
      setUploadingImages(true);
      const updated = await productService.uploadImages(productId, filesToUpload);
      setFormData((prev) => ({ ...prev, images: updated?.images || prev.images }));
      toast.success('Images uploaded');
    } catch (error: unknown) {
      console.error('Image upload failed:', error);
      toast.error(getApiErrorMessage(error, 'Image upload failed'));
    } finally {
      setUploadingImages(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-4 text-gray-600">Loading product...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEdit
                  ? 'Update product information'
                  : 'Create a new product in your catalog'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.images.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt=""
                        className="w-20 h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="admin-product-images"
                  onChange={handleImageUpload}
                  disabled={!isEdit || uploadingImages}
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors">
                  <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 mb-1 font-medium">
                    {isEdit ? 'Click to upload or drag and drop' : 'Save product first to upload images'}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB (recommended: 800x1000px)
                  </p>
                  {isEdit && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      size="sm"
                      disabled={uploadingImages}
                      onClick={() => document.getElementById('admin-product-images')?.click()}
                    >
                      {uploadingImages ? 'Uploading...' : 'Upload Images'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder={PH.productName}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (optional)</Label>
                  <Input
                    id="sku"
                    placeholder={PH.productSku}
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder={PH.productDescription}
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dresses">Dresses</SelectItem>
                        <SelectItem value="Tops">Tops</SelectItem>
                        <SelectItem value="Bottoms">Bottoms</SelectItem>
                        <SelectItem value="Outerwear">Outerwear</SelectItem>
                        <SelectItem value="Footwear">Footwear</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Jewelry">Jewelry</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Bags">Bags</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="unisex">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="subcategory">Subcategory (optional)</Label>
                    <Input
                      id="subcategory"
                      placeholder={PH.subcategory}
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label>
                      Markets <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={formData.availableMarkets.includes('IN')}
                          onChange={(e) => {
                            const next = new Set(formData.availableMarkets);
                            if (e.target.checked) next.add('IN');
                            else next.delete('IN');
                            setFormData({
                              ...formData,
                              availableMarkets: Array.from(next) as ('IN' | 'US')[],
                            });
                          }}
                        />
                        India (IN)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={formData.availableMarkets.includes('US')}
                          onChange={(e) => {
                            const next = new Set(formData.availableMarkets);
                            if (e.target.checked) next.add('US');
                            else next.delete('US');
                            setFormData({
                              ...formData,
                              availableMarkets: Array.from(next) as ('IN' | 'US')[],
                            });
                          }}
                        />
                        United States (US)
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (USD) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder={PH.priceZero}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder={PH.priceZero}
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, originalPrice: e.target.value })
                      }
                    />
                    <p className="text-xs text-gray-500">Leave empty if not on sale</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceInr">Price (INR)</Label>
                    <Input
                      id="priceInr"
                      type="number"
                      placeholder="0"
                      value={formData.priceInr}
                      onChange={(e) => setFormData({ ...formData, priceInr: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">India price. Leave empty to convert from USD.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price (Optional)</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      placeholder="0"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">Your cost — used for margin/commission.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping & Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping &amp; Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" step="0.01" placeholder="0.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                    <p className="text-xs text-gray-500">Used for live shipping rates. Defaults if empty.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="lengthCm">L (cm)</Label>
                      <Input id="lengthCm" type="number" placeholder="0" value={formData.lengthCm}
                        onChange={(e) => setFormData({ ...formData, lengthCm: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="widthCm">W (cm)</Label>
                      <Input id="widthCm" type="number" placeholder="0" value={formData.widthCm}
                        onChange={(e) => setFormData({ ...formData, widthCm: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heightCm">H (cm)</Label>
                      <Input id="heightCm" type="number" placeholder="0" value={formData.heightCm}
                        onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Tax &amp; Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hsnCode">HSN Code (India)</Label>
                    <Input id="hsnCode" placeholder="e.g. 6109" value={formData.hsnCode}
                      onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstPercent">GST % (India)</Label>
                    <Input id="gstPercent" type="number" placeholder="e.g. 12" value={formData.gstPercent}
                      onChange={(e) => setFormData({ ...formData, gstPercent: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxCode">Stripe Tax Code (US)</Label>
                    <Input id="taxCode" placeholder="txcd_30011000" value={formData.taxCode}
                      onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                    <Input id="countryOfOrigin" placeholder="e.g. India" value={formData.countryOfOrigin}
                      onChange={(e) => setFormData({ ...formData, countryOfOrigin: e.target.value })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization & Publishing */}
            <Card>
              <CardHeader>
                <CardTitle>Organization &amp; Publishing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" placeholder="Brand name" value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode / UPC</Label>
                    <Input id="barcode" placeholder="Barcode" value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select id="status" className="w-full h-10 px-3 border rounded-md bg-background text-sm"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' })}>
                      <option value="active">Active (visible in store)</option>
                      <option value="draft">Draft (hidden from store)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge / Tag</Label>
                    <select id="badge" className="w-full h-10 px-3 border rounded-md bg-background text-sm"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}>
                      <option value="">None</option>
                      {['Best Seller', 'Trending', 'Most Ordered', 'New', 'Limited Edition', 'Exclusive', 'Hot', 'Popular'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="tags">Tags / Keywords (comma-separated)</Label>
                    <Input id="tags" placeholder="summer, cotton, casual"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media & SEO */}
            <Card>
              <CardHeader>
                <CardTitle>Media &amp; SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Product Video URL</Label>
                  <Input id="videoUrl" placeholder="https://…/video.mp4" value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                  <Input id="metaTitle" placeholder="Shown in search results / browser tab" value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                  <Textarea id="metaDescription" rows={2} placeholder="Short description for search engines"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} />
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sizes */}
                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <Button
                        key={size}
                        type="button"
                        variant={formData.sizes.includes(size) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            sizes: formData.sizes.includes(size)
                              ? formData.sizes.filter((s) => s !== size)
                              : [...formData.sizes, size],
                          });
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Stock per size */}
                {formData.sizes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Stock quantity per size</Label>
                    <div className="flex flex-wrap gap-3">
                      {formData.sizes.map((size) => (
                        <div key={size} className="flex items-center gap-2">
                          <Label className="text-sm font-normal w-8">{size}</Label>
                          <Input
                            type="number"
                            min={0}
                            className="w-20"
                            value={formData.stock[size] ?? ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              setFormData({
                                ...formData,
                                stock: {
                                  ...formData.stock,
                                  [size]: v === '' ? 0 : Math.max(0, parseInt(v, 10) || 0),
                                },
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {isEdit && variants.length > 1 ? (
                  <div className="rounded-md bg-muted px-3 py-2.5 text-xs text-muted-foreground flex items-start gap-2">
                    <Palette className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>Color display is managed by your variant group. Each variant has its own color shown as a dot on product cards.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label>Display Colors</Label>
                      <p className="text-xs text-muted-foreground mt-1">Shown as dots on product cards. Click to toggle.</p>
                    </div>

                    {/* Color dot grid */}
                    <div className="flex flex-wrap gap-2">
                      {COMMON_COLORS.map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          title={color.name}
                          onClick={() => {
                            setFormData({
                              ...formData,
                              colors: formData.colors.includes(color.name)
                                ? formData.colors.filter((c) => c !== color.name)
                                : [...formData.colors, color.name],
                            });
                          }}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${
                            formData.colors.includes(color.name)
                              ? 'border-foreground scale-110 ring-2 ring-foreground/20'
                              : 'border-transparent hover:border-foreground/40'
                          } ${color.hex === '#FFFFFF' ? 'ring-1 ring-gray-200' : ''}`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>

                    {/* Custom color row */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Custom color name"
                        value={customColorName}
                        onChange={(e) => setCustomColorName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomColor(); } }}
                        className="flex-1"
                      />
                      <input
                        type="color"
                        value={customColorValue}
                        onChange={(e) => handleColorPickerChange(e.target.value)}
                        title="Pick custom color"
                        className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <Button type="button" size="sm" onClick={handleAddCustomColor}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Selected chips */}
                    {formData.colors.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {formData.colors.map((colorName) => {
                          const preset = COMMON_COLORS.find((c) => c.name === colorName);
                          return (
                            <div key={colorName} className="flex items-center gap-1.5 bg-muted rounded-full pl-1 pr-2 py-0.5 text-xs">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-foreground/15 shrink-0"
                                style={{ backgroundColor: preset?.hex || '#9CA3AF' }}
                              />
                              {colorName}
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(colorName)}
                                className="text-muted-foreground hover:text-destructive ml-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      placeholder={PH.material}
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="care">Care Instructions</Label>
                    <Input
                      id="care"
                      placeholder={PH.careInstructions}
                      value={formData.care}
                      onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Details (one per line)</Label>
                  <Textarea
                    id="details"
                    placeholder={PH.productDetailsLines}
                    rows={4}
                    value={formData.details.join('\n')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        details: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium">Featured Product</p>
                    <p className="text-xs text-gray-500">Show on homepage</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.onSale}
                    onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium">On Sale</p>
                    <p className="text-xs text-gray-500">Mark as sale item</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) =>
                      setFormData({ ...formData, newArrival: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium">New Arrival</p>
                    <p className="text-xs text-gray-500">Mark as new</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isGift}
                    onChange={(e) =>
                      setFormData({ ...formData, isGift: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium">Gift Worthy</p>
                    <p className="text-xs text-gray-500">Show in Gift For Her / Gift For Him; allow gift wrap</p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Variant Group */}
            {isEdit && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-4 w-4" /> Color Variants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {variantsLoading ? (
                    <p className="text-xs text-muted-foreground">Loading…</p>
                  ) : variants.length > 1 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">
                        {variants.length} colors in this group:
                      </p>
                      {variants.map((v) => (
                        <div key={v.id} className={`flex items-center gap-2 text-xs p-2 rounded-md border ${String(v.id) === productId ? 'bg-muted border-muted-foreground/20 font-medium' : 'border-transparent'}`}>
                          <span className="w-3 h-3 rounded-full border border-foreground/20 shrink-0" style={{ backgroundColor: v.color ? '#888' : '#ccc' }} />
                          <span className="truncate flex-1">{v.color || '—'}</span>
                          {String(v.id) === productId
                            ? <span className="text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">current</span>
                            : <button type="button" className="text-muted-foreground hover:text-foreground text-[10px] underline" onClick={() => navigate(`/admin/products/edit?id=${v.id}`)}>edit</button>
                          }
                        </div>
                      ))}
                      <Button
                        size="sm"
                        className="w-full mt-1"
                        onClick={openAddVariantModal}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add another color
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
                        onClick={async () => {
                          setVariantSaving(true);
                          try {
                            await productService.unsetVariantGroup(productId!);
                            toast.success('Removed from variant group');
                            refetchVariants?.();
                          } catch {
                            toast.error('Failed to remove from group');
                          } finally {
                            setVariantSaving(false);
                          }
                        }}
                        disabled={variantSaving}
                      >
                        <Link2Off className="h-3.5 w-3.5 mr-1.5" /> Remove from group
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        This product has no color variants yet. Add one to let customers switch between colors on the product page.
                      </p>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={openAddVariantModal}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add color variant
                      </Button>
                      <div className="border-t pt-3 space-y-2">
                        <p className="text-[10px] text-muted-foreground">Advanced: join an existing group</p>
                        <Label className="text-xs">Color for this product</Label>
                        <Input
                          placeholder="e.g. Navy"
                          value={variantColor}
                          onChange={(e) => setVariantColor(e.target.value)}
                        />
                        <Label className="text-xs">Existing group ID</Label>
                        <Input
                          placeholder="24-char ObjectID"
                          value={variantGroupInput}
                          onChange={(e) => setVariantGroupInput(e.target.value)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          disabled={!variantColor || !variantGroupInput || variantSaving}
                          onClick={async () => {
                            setVariantSaving(true);
                            try {
                              await productService.setVariantGroup(productId!, {
                                variant_group_id: variantGroupInput,
                                color: variantColor,
                                is_main_variant: false,
                              });
                              toast.success('Joined variant group');
                              setVariantGroupInput('');
                              setVariantColor('');
                              refetchVariants?.();
                            } catch {
                              toast.error('Failed to join group');
                            } finally {
                              setVariantSaving(false);
                            }
                          }}
                        >
                          <Link2 className="h-3.5 w-3.5 mr-1.5" /> Join group
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {isEdit ? 'Update' : 'Create'} Product
                </Button>
                <Button variant="outline" onClick={handleCancel} className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Color Variant Modal */}
      <Dialog open={showAddVariantModal} onOpenChange={setShowAddVariantModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Color Variant</DialogTitle>
            <DialogDescription>
              Creates a copy of <strong>{formData.name}</strong> with a different color. All product details are pre-filled — you'll just need to upload images after.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Parent color — only needed if not already in a group */}
            {variants.length <= 1 && (
              <div className="space-y-2">
                <Label>
                  Color of <em>this</em> product <span className="text-destructive">*</span>
                </Label>
                <p className="text-[11px] text-muted-foreground">What color is the product you're currently editing?</p>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      onClick={() => setAddVariantForm((f) => ({ ...f, parentColor: c.name }))}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        addVariantForm.parentColor === c.name
                          ? 'border-foreground scale-110 ring-2 ring-foreground/20'
                          : 'border-transparent hover:border-foreground/40'
                      } ${c.hex === '#FFFFFF' ? 'ring-1 ring-gray-200' : ''}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {addVariantForm.parentColor && (
                    <span
                      className="w-5 h-5 rounded-full border border-foreground/20 shrink-0"
                      style={{ backgroundColor: COMMON_COLORS.find((c) => c.name === addVariantForm.parentColor)?.hex || '#9CA3AF' }}
                    />
                  )}
                  <Input
                    placeholder="e.g. Red, Navy, Beige"
                    value={addVariantForm.parentColor}
                    onChange={(e) => setAddVariantForm((f) => ({ ...f, parentColor: e.target.value }))}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                New variant color <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => setAddVariantForm((f) => ({ ...f, newColor: c.name }))}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      addVariantForm.newColor === c.name
                        ? 'border-foreground scale-110 ring-2 ring-foreground/20'
                        : 'border-transparent hover:border-foreground/40'
                    } ${c.hex === '#FFFFFF' ? 'ring-1 ring-gray-200' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {addVariantForm.newColor && (
                  <span
                    className="w-5 h-5 rounded-full border border-foreground/20 shrink-0"
                    style={{ backgroundColor: COMMON_COLORS.find((c) => c.name === addVariantForm.newColor)?.hex || '#9CA3AF' }}
                  />
                )}
                <Input
                  placeholder="e.g. Blue, Black, White"
                  value={addVariantForm.newColor}
                  onChange={(e) => setAddVariantForm((f) => ({ ...f, newColor: e.target.value }))}
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Price override <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                type="number"
                placeholder={formData.price || '0.00'}
                value={addVariantForm.priceOverride}
                onChange={(e) => setAddVariantForm((f) => ({ ...f, priceOverride: e.target.value }))}
              />
              <p className="text-[11px] text-muted-foreground">Leave blank to use same price ({formData.price ? `$${formData.price}` : '—'})</p>
            </div>

            {formData.sizes.length > 0 && (
              <div className="space-y-2">
                <Label>Stock per size</Label>
                <div className="flex flex-wrap gap-3">
                  {formData.sizes.map((size) => (
                    <div key={size} className="flex items-center gap-1.5">
                      <span className="text-sm w-8 text-muted-foreground">{size}</span>
                      <Input
                        type="number"
                        min={0}
                        className="w-20"
                        value={addVariantForm.stock[size] ?? 0}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10) || 0;
                          setAddVariantForm((f) => ({ ...f, stock: { ...f.stock, [size]: Math.max(0, v) } }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVariantModal(false)} disabled={addVariantSaving}>
              Cancel
            </Button>
            <Button onClick={handleAddVariant} disabled={addVariantSaving}>
              {addVariantSaving ? 'Creating…' : 'Create variant'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};