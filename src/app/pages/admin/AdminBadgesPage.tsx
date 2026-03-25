import { useState } from 'react';
import { motion } from 'motion/react';
import { AdminLayout } from '@/app/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { 
  Plus, 
  Edit,
  Trash2,
  Award,
  Tag,
  Zap,
  Flame,
  Star,
  Clock,
  Percent,
  TrendingUp,
  Eye,
  EyeOff,
} from 'lucide-react';
import { PH } from '@/app/lib/formPlaceholders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Switch } from '@/app/components/ui/switch';

interface ProductBadge {
  id: string;
  name: string;
  label: string;
  description: string;
  type: 'new' | 'sale' | 'trending' | 'limited' | 'exclusive' | 'custom';
  backgroundColor: string;
  textColor: string;
  icon: 'star' | 'flame' | 'zap' | 'clock' | 'percent' | 'trending-up' | 'award' | 'tag';
  isActive: boolean;
  priority: number;
  productsCount: number;
  createdAt: string;
}

const iconComponents = {
  star: Star,
  flame: Flame,
  zap: Zap,
  clock: Clock,
  percent: Percent,
  'trending-up': TrendingUp,
  award: Award,
  tag: Tag,
};

export function AdminBadgesPage() {
  // NOTE: Badges are product-level attributes (product.badge field)
  // Badges can be managed via the product edit page (AdminAddEditProductPage)
  // This page is a UI helper for designing badges that can then be assigned to products
  // If you need badge management as a separate entity, create backend endpoint: GET/POST/PUT/DELETE /admin/badges
  
  const [badges, setBadges] = useState<ProductBadge[]>([
    {
      id: '1',
      name: 'new_arrival',
      label: 'NEW',
      description: 'Displays on products added in the last 30 days',
      type: 'new',
      backgroundColor: '#B4770E',
      textColor: '#FFFFFF',
      icon: 'star',
      isActive: true,
      priority: 1,
      productsCount: 45,
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'on_sale',
      label: 'SALE',
      description: 'Shows discount percentage for products on sale',
      type: 'sale',
      backgroundColor: '#DC2626',
      textColor: '#FFFFFF',
      icon: 'percent',
      isActive: true,
      priority: 2,
      productsCount: 128,
      createdAt: '2024-01-01',
    },
    {
      id: '3',
      name: 'trending',
      label: 'TRENDING',
      description: 'Highlights products with high views and purchases',
      type: 'trending',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      icon: 'trending-up',
      isActive: true,
      priority: 3,
      productsCount: 32,
      createdAt: '2024-01-01',
    },
    {
      id: '4',
      name: 'limited_edition',
      label: 'LIMITED',
      description: 'Shows for products with limited stock quantity',
      type: 'limited',
      backgroundColor: '#7C2D12',
      textColor: '#FFFFFF',
      icon: 'flame',
      isActive: true,
      priority: 4,
      productsCount: 18,
      createdAt: '2024-01-01',
    },
    {
      id: '5',
      name: 'exclusive',
      label: 'EXCLUSIVE',
      description: 'Premium or exclusive collection items',
      type: 'exclusive',
      backgroundColor: '#1F2937',
      textColor: '#B4770E',
      icon: 'award',
      isActive: true,
      priority: 5,
      productsCount: 24,
      createdAt: '2024-01-01',
    },
    {
      id: '6',
      name: 'best_seller',
      label: 'BEST SELLER',
      description: 'Top performing products by sales volume',
      type: 'custom',
      backgroundColor: '#059669',
      textColor: '#FFFFFF',
      icon: 'zap',
      isActive: true,
      priority: 6,
      productsCount: 56,
      createdAt: '2024-01-05',
    },
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<ProductBadge | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: '',
    type: 'custom' as ProductBadge['type'],
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    icon: 'tag' as ProductBadge['icon'],
    priority: badges.length + 1,
  });

  const handleCreate = () => {
    const newBadge: ProductBadge = {
      id: Date.now().toString(),
      ...formData,
      isActive: true,
      productsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setBadges([...badges, newBadge]);
    setIsCreateOpen(false);
    resetForm();
  };

  const handleUpdate = () => {
    if (!editingBadge) return;
    setBadges(badges.map(badge => 
      badge.id === editingBadge.id 
        ? { ...badge, ...formData }
        : badge
    ));
    setEditingBadge(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setBadges(badges.filter(badge => badge.id !== id));
  };

  const toggleActive = (id: string) => {
    setBadges(badges.map(badge => 
      badge.id === id 
        ? { ...badge, isActive: !badge.isActive }
        : badge
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      label: '',
      description: '',
      type: 'custom',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      icon: 'tag',
      priority: badges.length + 1,
    });
  };

  const openEdit = (badge: ProductBadge) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      label: badge.label,
      description: badge.description,
      type: badge.type,
      backgroundColor: badge.backgroundColor,
      textColor: badge.textColor,
      icon: badge.icon,
      priority: badge.priority,
    });
  };

  const BadgePreview = ({ badge }: { badge: Partial<ProductBadge> }) => {
    const IconComponent = iconComponents[badge.icon || 'tag'];
    return (
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wider"
        style={{
          backgroundColor: badge.backgroundColor,
          color: badge.textColor,
        }}
      >
        <IconComponent size={12} />
        {badge.label}
      </div>
    );
  };

  const totalActive = badges.filter(b => b.isActive).length;
  const totalProducts = badges.reduce((sum, b) => sum + b.productsCount, 0);

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-light tracking-wider mb-2">BADGE MANAGEMENT</h1>
            <p className="text-muted-foreground">Create and manage product badges and labels</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={20} />
                Create Badge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Badge</DialogTitle>
                <DialogDescription>
                  Design a custom badge to highlight special products
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Badge Name (Internal)</Label>
                    <Input
                      placeholder={PH.badgeInternalName}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Display Label</Label>
                    <Input
                      placeholder={PH.badgeDisplayLabel}
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder={PH.badgeUsageDescription}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Arrival</SelectItem>
                        <SelectItem value="sale">On Sale</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="limited">Limited Edition</SelectItem>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select value={formData.icon} onValueChange={(value: any) => setFormData({ ...formData, icon: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="star">Star</SelectItem>
                        <SelectItem value="flame">Flame</SelectItem>
                        <SelectItem value="zap">Zap</SelectItem>
                        <SelectItem value="clock">Clock</SelectItem>
                        <SelectItem value="percent">Percent</SelectItem>
                        <SelectItem value="trending-up">Trending Up</SelectItem>
                        <SelectItem value="award">Award</SelectItem>
                        <SelectItem value="tag">Tag</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <BadgePreview badge={formData} />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>
                  Create Badge
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Badges</p>
                  <p className="text-2xl font-light">{badges.length}</p>
                </div>
                <Tag className="text-muted-foreground" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Badges</p>
                  <p className="text-2xl font-light">{totalActive}</p>
                </div>
                <Eye className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Products Tagged</p>
                  <p className="text-2xl font-light">{totalProducts}</p>
                </div>
                <Award className="text-[#B4770E]" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges List */}
        <div className="grid grid-cols-1 gap-4">
          {badges.map((badge) => {
            const IconComponent = iconComponents[badge.icon];
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className={!badge.isActive ? 'opacity-50' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <BadgePreview badge={badge} />
                          {!badge.isActive && (
                            <Badge variant="outline" className="text-muted-foreground">
                              <EyeOff size={12} className="mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium tracking-wide mb-1">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="capitalize">{badge.type} Badge</span>
                          <span>•</span>
                          <span>Priority: {badge.priority}</span>
                          <span>•</span>
                          <span>{badge.productsCount} Products</span>
                          <span>•</span>
                          <span>Created {new Date(badge.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 pr-4 border-r">
                          <Label className="text-sm">Active</Label>
                          <Switch
                            checked={badge.isActive}
                            onCheckedChange={() => toggleActive(badge.id)}
                          />
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => openEdit(badge)}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Badge</DialogTitle>
                              <DialogDescription>
                                Update badge settings and appearance
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              {/* Same form as create */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Badge Name (Internal)</Label>
                                  <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Display Label</Label>
                                  <Input
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={formData.description}
                                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label>Background</Label>
                                  <Input
                                    type="color"
                                    value={formData.backgroundColor}
                                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Text Color</Label>
                                  <Input
                                    type="color"
                                    value={formData.textColor}
                                    onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label>Priority</Label>
                                  <Input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Preview</Label>
                                <div className="p-4 border rounded-lg bg-muted/30">
                                  <BadgePreview badge={formData} />
                                </div>
                              </div>
                            </div>

                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingBadge(null)}>
                                Cancel
                              </Button>
                              <Button onClick={handleUpdate}>
                                Update Badge
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(badge.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
