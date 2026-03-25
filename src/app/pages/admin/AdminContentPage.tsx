import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import {
  FileText,
  Image as ImageIcon,
  Video,
  Mail,
  Save,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '../../services/adminService';
import { PH } from '../../lib/formPlaceholders';

export const AdminContentPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({
    homepage: {
      hero: {
        title: 'Discover Your Style',
        subtitle: 'Curated Fashion for Modern Living',
        image: '',
        ctaText: 'Shop Now',
        show: true,
      },
      featured: {
        title: 'Featured Collection',
        description: 'Handpicked favorites just for you',
        show: true,
      },
      testimonials: {
        title: 'What Our Customers Say',
        show: true,
      },
    },
    pages: {
      about: {
        title: 'About Rloco',
        content: 'We are a premium fashion retailer...',
      },
      contact: {
        email: 'contact@rloco.com',
        phone: '+1 (555) 123-4567',
        address: '123 Fashion Street, New York, NY 10001',
      },
      footer: {
        copyright: '© 2026 Rloco. All rights reserved.',
        description: 'Your trusted fashion destination for modern style',
      },
    },
    email: {
      orderConfirmation: {
        subject: 'Your Rloco Order Confirmation #{order_id}',
        body: 'Thank you for your order! We\'re preparing your items for shipment...',
      },
      welcome: {
        subject: 'Welcome to Rloco!',
        body: 'Welcome to Rloco! We\'re thrilled to have you join our fashion community...',
      },
    },
    seo: {
      homepage: {
        metaTitle: 'Rloco - Modern Fashion Retailer',
        metaDescription: 'Discover the latest fashion trends at Rloco. Shop curated collections of premium clothing, accessories, and more.',
        keywords: 'fashion, clothing, online shopping, luxury fashion',
      },
      social: {
        ogTitle: 'Rloco - Discover Your Style',
        ogDescription: 'Curated fashion for modern living. Shop the latest trends.',
        ogImage: '',
      },
    },
  });

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const data = await adminService.getContent();
        if (data) {
          setContent(data);
        }
      } catch (error) {
        console.error('Failed to fetch content:', error);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSave = async (section: string) => {
    try {
      setSaving(true);
      await adminService.updateContent(content);
      toast.success(`${section} content saved successfully`);
    } catch (error) {
      console.error('Failed to save content:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (path: string[], value: any) => {
    setContent((prev: any) => {
      const newContent = { ...prev };
      let current = newContent;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Management</h1>
            <p className="text-gray-600 mt-1">
              Manage all website content and copy
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading content...</p>
          </div>
        ) : (
          <>
            {/* Content Tabs */}
            <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="email">Email Templates</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          {/* Homepage Content */}
          <TabsContent value="homepage" className="space-y-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Main banner content on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input
                    value={content?.homepage?.hero?.title || ''}
                    onChange={(e) => updateContent(['homepage', 'hero', 'title'], e.target.value)}
                    placeholder="Main headline"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle</Label>
                  <Input
                    value={content?.homepage?.hero?.subtitle || ''}
                    onChange={(e) => updateContent(['homepage', 'hero', 'subtitle'], e.target.value)}
                    placeholder="Supporting text"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Image URL</Label>
                  <Input
                    value={content?.homepage?.hero?.image || ''}
                    onChange={(e) => updateContent(['homepage', 'hero', 'image'], e.target.value)}
                    placeholder={PH.heroImageUrl}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input
                    value={content?.homepage?.hero?.ctaText || 'Shop Now'}
                    onChange={(e) => updateContent(['homepage', 'hero', 'ctaText'], e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={content?.homepage?.hero?.show !== false}
                    onCheckedChange={(checked) => updateContent(['homepage', 'hero', 'show'], checked)}
                  />
                  <Label>Show Hero Section</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSave('Hero Section')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Featured Section */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Products Section</CardTitle>
                <CardDescription>
                  Configure featured products display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={content?.homepage?.featured?.title || ''}
                    onChange={(e) => updateContent(['homepage', 'featured', 'title'], e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Description</Label>
                  <Textarea
                    value={content?.homepage?.featured?.description || ''}
                    onChange={(e) => updateContent(['homepage', 'featured', 'description'], e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={content?.homepage?.featured?.show !== false}
                    onCheckedChange={(checked) => updateContent(['homepage', 'featured', 'show'], checked)}
                  />
                  <Label>Show Featured Section</Label>
                </div>
                <Button onClick={() => handleSave('Featured Section')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            <Card>
              <CardHeader>
                <CardTitle>Testimonials Section</CardTitle>
                <CardDescription>
                  Customer reviews and testimonials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input
                    value={content?.homepage?.testimonials?.title || ''}
                    onChange={(e) => updateContent(['homepage', 'testimonials', 'title'], e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={content?.homepage?.testimonials?.show !== false}
                    onCheckedChange={(checked) => updateContent(['homepage', 'testimonials', 'show'], checked)}
                  />
                  <Label>Show Testimonials Section</Label>
                </div>
                <Button onClick={() => handleSave('Testimonials Section')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pages Content */}
          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Page</CardTitle>
                <CardDescription>
                  About us page content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Page Title</Label>
                  <Input
                    value={content?.pages?.about?.title || ''}
                    onChange={(e) => updateContent(['pages', 'about', 'title'], e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={content?.pages?.about?.content || ''}
                    onChange={(e) => updateContent(['pages', 'about', 'content'], e.target.value)}
                    rows={8}
                    placeholder="About page content..."
                  />
                </div>
                <Button onClick={() => handleSave('About Page')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Page</CardTitle>
                <CardDescription>
                  Contact information and form settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      value={content?.pages?.contact?.email || ''}
                      onChange={(e) => updateContent(['pages', 'contact', 'email'], e.target.value)}
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={content?.pages?.contact?.phone || ''}
                      onChange={(e) => updateContent(['pages', 'contact', 'phone'], e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={content?.pages?.contact?.address || ''}
                    onChange={(e) => updateContent(['pages', 'contact', 'address'], e.target.value)}
                    rows={2}
                  />
                </div>
                <Button onClick={() => handleSave('Contact Page')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer Content</CardTitle>
                <CardDescription>
                  Footer text and links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input
                    value={content?.pages?.footer?.copyright || ''}
                    onChange={(e) => updateContent(['pages', 'footer', 'copyright'], e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Footer Description</Label>
                  <Textarea
                    value={content?.pages?.footer?.description || ''}
                    onChange={(e) => updateContent(['pages', 'footer', 'description'], e.target.value)}
                    rows={2}
                  />
                </div>
                <Button onClick={() => handleSave('Footer')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Library */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Media Library</CardTitle>
                <CardDescription>
                  Manage images and videos for your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop images here, or click to browse
                  </p>
                  <Button>Upload Media</Button>
                </div>
                <div className="grid grid-cols-4 gap-4 pt-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-lg border border-gray-300"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Templates */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Confirmation Email</CardTitle>
                <CardDescription>
                  Customize order confirmation email template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input
                    value={content?.email?.orderConfirmation?.subject || ''}
                    onChange={(e) => updateContent(['email', 'orderConfirmation', 'subject'], e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Body</Label>
                  <Textarea
                    value={content?.email?.orderConfirmation?.body || ''}
                    onChange={(e) => updateContent(['email', 'orderConfirmation', 'body'], e.target.value)}
                    rows={6}
                  />
                </div>
                <Button onClick={() => handleSave('Order Email')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Template'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Welcome Email</CardTitle>
                <CardDescription>
                  New customer welcome email template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject Line</Label>
                  <Input
                    value={content?.email?.welcome?.subject || ''}
                    onChange={(e) => updateContent(['email', 'welcome', 'subject'], e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Body</Label>
                  <Textarea
                    value={content?.email?.welcome?.body || ''}
                    onChange={(e) => updateContent(['email', 'welcome', 'body'], e.target.value)}
                    rows={6}
                  />
                </div>
                <Button onClick={() => handleSave('Welcome Email')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Template'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage SEO</CardTitle>
                <CardDescription>
                  Search engine optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={content?.seo?.homepage?.metaTitle || ''}
                    onChange={(e) => updateContent(['seo', 'homepage', 'metaTitle'], e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={content?.seo?.homepage?.metaDescription || ''}
                    onChange={(e) => updateContent(['seo', 'homepage', 'metaDescription'], e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
                </div>
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <Input
                    value={content?.seo?.homepage?.keywords || ''}
                    onChange={(e) => updateContent(['seo', 'homepage', 'keywords'], e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSave('SEO Settings')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Open Graph and social sharing settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>OG Title</Label>
                  <Input
                    value={content?.seo?.social?.ogTitle || ''}
                    onChange={(e) => updateContent(['seo', 'social', 'ogTitle'], e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Description</Label>
                  <Textarea
                    value={content?.seo?.social?.ogDescription || ''}
                    onChange={(e) => updateContent(['seo', 'social', 'ogDescription'], e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Image URL</Label>
                  <Input
                    value={content?.seo?.social?.ogImage || ''}
                    onChange={(e) => updateContent(['seo', 'social', 'ogImage'], e.target.value)}
                    placeholder={PH.ogImageUrl}
                  />
                </div>
                <Button onClick={() => handleSave('Social Media Settings')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
