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
import { ArrowLeft, Image as ImageIcon, Save, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { productService } from '../../services/productService';
import { Product } from '../../types/api';
import { PH } from '../../lib/formPlaceholders';
import { useEffect } from 'react';

export const AdminAddEditProductPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const isEdit = !!productId;
  const [loading, setLoading] = useState(isEdit);
  const [uploadingImages, setUploadingImages] = useState(false);
  
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
        });
      } catch (error: any) {
        console.error('Failed to fetch product:', error);
        const errorMessage = error?.response?.data?.error || error?.message || 'Failed to load product';
        toast.error(errorMessage);
        // Only navigate away if it's a 404 or invalid ID, not for other errors
        if (error?.response?.status === 404 || error?.response?.status === 400) {
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
      };

      if (isEdit && productId) {
        await productService.update(productId, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.create(productData);
        toast.success('Product created successfully');
      }
      
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Failed to save product:', error);
      toast.error(error.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !isEdit || !productId) return;
    e.target.value = '';
    try {
      setUploadingImages(true);
      const updated = await productService.uploadImages(productId, Array.from(files));
      setFormData((prev) => ({ ...prev, images: updated?.images || prev.images }));
      toast.success('Images uploaded');
    } catch (error: any) {
      console.error('Image upload failed:', error);
      toast.error(error?.message || 'Image upload failed');
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
                <div className="space-y-3">
                  <Label>Available Colors</Label>
                  
                  {/* Quick Select Common Colors */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Quick Select:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Black', value: '#000000' },
                        { name: 'White', value: '#FFFFFF' },
                        { name: 'Gray', value: '#808080' },
                        { name: 'Navy', value: '#000080' },
                        { name: 'Beige', value: '#F5F5DC' },
                        { name: 'Brown', value: '#8B4513' },
                        { name: 'Red', value: '#FF0000' },
                        { name: 'Blue', value: '#0000FF' },
                        { name: 'Green', value: '#008000' },
                        { name: 'Yellow', value: '#FFFF00' },
                        { name: 'Pink', value: '#FFC0CB' },
                        { name: 'Purple', value: '#800080' },
                        { name: 'Orange', value: '#FFA500' },
                        { name: 'Teal', value: '#008080' },
                      ].map((color) => (
                        <Button
                          key={color.name}
                          type="button"
                          variant={formData.colors.includes(color.name) ? 'default' : 'outline'}
                          size="sm"
                          className="gap-2"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              colors: formData.colors.includes(color.name)
                                ? formData.colors.filter((c) => c !== color.name)
                                : [...formData.colors, color.name],
                            });
                          }}
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Color Input */}
                  <div className="border-t pt-3 space-y-3">
                    <p className="text-xs text-gray-500">Add Custom Color:</p>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder={PH.colorName}
                          value={customColorName}
                          onChange={(e) => setCustomColorName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomColor();
                            }
                          }}
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="color"
                          value={customColorValue}
                          onChange={(e) => handleColorPickerChange(e.target.value)}
                          className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddCustomColor}
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Selected Colors Display */}
                  {formData.colors.length > 0 && (
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-xs font-medium text-gray-700">Selected Colors ({formData.colors.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.colors.map((colorName) => (
                          <div
                            key={colorName}
                            className="flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                          >
                            <span>{colorName}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveColor(colorName)}
                              className="text-gray-500 hover:text-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
    </AdminLayout>
  );
};