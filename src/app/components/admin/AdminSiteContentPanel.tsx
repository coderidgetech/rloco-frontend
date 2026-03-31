import { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Mail, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '../../services/adminService';
import { PH } from '../../lib/formPlaceholders';
import { defaultSiteConfig, useSiteConfig, type SiteConfig } from '../../context/SiteConfigContext';
import { uploadImage } from '../../services/uploadService';

const SECTION_LABELS: Record<keyof SiteConfig['homepage']['sections'], string> = {
  featuredProducts: 'Featured products',
  newArrivals: 'New arrivals',
  shopByCategory: 'Shop by category',
  bestSellers: 'Best sellers',
  editorialFeatures: 'Editorial features',
  promotionalBanner: 'Promotional banner',
  testimonials: 'Testimonials',
  brandStory: 'Brand story',
  instagramFeed: 'Instagram feed',
  newsletterSignup: 'Newsletter signup',
};

export function AdminSiteContentPanel() {
  const { config, setSiteConfig, refreshConfig, loading } = useSiteConfig();
  const [saving, setSaving] = useState(false);
  const smtpPasswordBackup = useRef<string | null>(null);

  const persist = async (label: string) => {
    try {
      setSaving(true);
      const payload = structuredClone(config) as unknown as Record<string, unknown>;
      const email = payload.email as Record<string, unknown> | undefined;
      const smtpPayload = email?.smtp as Record<string, unknown> | undefined;
      if (smtpPayload) {
        const typed = (smtpPayload.password as string) || '';
        if (!typed.trim() && smtpPasswordBackup.current) {
          smtpPayload.password = smtpPasswordBackup.current;
        } else if (!typed.trim()) {
          delete smtpPayload.password;
        } else {
          smtpPasswordBackup.current = typed.trim();
        }
      }
      await adminService.updateConfiguration(payload);
      await refreshConfig();
      toast.success(`${label} saved`);
      localStorage.setItem('rloco_config_updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('rloco_config_updated'));
    } catch (error) {
      console.error('Failed to save:', error);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const hero = config.homepage.hero;
  const sections = config.homepage.sections;
  const meta = config.seo.meta;
  const og = config.seo.openGraph;
  const smtp = config.email.smtp;
  const tmpl = config.emailTemplates ?? defaultSiteConfig.emailTemplates!;

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
        <p className="mt-4 text-gray-600">Loading site config…</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Homepage, site copy, media URLs, SMTP, email templates, and SEO — saved with{' '}
        <strong>Save</strong> in the header (full site configuration document).
      </p>
      <Tabs defaultValue="homepage" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="homepage">Homepage</TabsTrigger>
              <TabsTrigger value="pages">Site &amp; footer</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="homepage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero</CardTitle>
                  <CardDescription>Main banner — drives the storefront hero.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={hero.enabled}
                      onCheckedChange={(v) =>
                        setSiteConfig((c) => ({
                          ...c,
                          homepage: { ...c.homepage, hero: { ...c.homepage.hero, enabled: v } },
                        }))
                      }
                    />
                    <Label>Show hero</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Heading</Label>
                    <Input
                      value={hero.heading}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          homepage: {
                            ...c.homepage,
                            hero: { ...c.homepage.hero, heading: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subheading</Label>
                    <Input
                      value={hero.subheading}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          homepage: {
                            ...c.homepage,
                            hero: { ...c.homepage.hero, subheading: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Background image URL</Label>
                    <Input
                      value={hero.backgroundImage}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          homepage: {
                            ...c.homepage,
                            hero: { ...c.homepage.hero, backgroundImage: e.target.value },
                          },
                        }))
                      }
                      placeholder={PH.heroImageUrl}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary button text</Label>
                      <Input
                        value={hero.primaryButtonText}
                        onChange={(e) =>
                          setSiteConfig((c) => ({
                            ...c,
                            homepage: {
                              ...c.homepage,
                              hero: { ...c.homepage.hero, primaryButtonText: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary button link</Label>
                      <Input
                        value={hero.primaryButtonLink}
                        onChange={(e) =>
                          setSiteConfig((c) => ({
                            ...c,
                            homepage: {
                              ...c.homepage,
                              hero: { ...c.homepage.hero, primaryButtonLink: e.target.value },
                            },
                          }))
                        }
                        placeholder="/all-products"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <Label>Hero layout</Label>
                    <Select
                      value={hero.style}
                      onValueChange={(v) =>
                        setSiteConfig((c) => ({
                          ...c,
                          homepage: { ...c.homepage, hero: { ...c.homepage.hero, style: v } },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullscreen">Fullscreen</SelectItem>
                        <SelectItem value="split">Split</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => void persist('Homepage hero')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving…' : 'Save homepage'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Homepage sections</CardTitle>
                  <CardDescription>Toggle which blocks appear on the home page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(Object.keys(sections) as Array<keyof typeof sections>).map((key) => (
                    <div key={key} className="flex items-center justify-between gap-4 border rounded-lg px-3 py-2">
                      <Label className="cursor-pointer">{SECTION_LABELS[key]}</Label>
                      <Switch
                        checked={sections[key]}
                        onCheckedChange={(v) =>
                          setSiteConfig((c) => ({
                            ...c,
                            homepage: {
                              ...c.homepage,
                              sections: { ...c.homepage.sections, [key]: v },
                            },
                          }))
                        }
                      />
                    </div>
                  ))}
                  <Button onClick={() => void persist('Homepage sections')} disabled={saving} className="mt-2">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving…' : 'Save sections'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured collections</CardTitle>
                  <CardDescription>Collections highlighted on the homepage strip.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Slots</Label>
                    <p className="text-xs text-muted-foreground mb-2">Up to six collection keys.</p>
                    <div className="space-y-3">
                      {[0, 1, 2, 3, 4, 5].map((index) => {
                        const collectionValue = Array.isArray(config.homepage.featuredCollections)
                          ? config.homepage.featuredCollections[index] || ''
                          : '';
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <Label className="w-32 text-sm">Collection {index + 1}</Label>
                            <Select
                              value={collectionValue}
                              onValueChange={(value) => {
                                const current = Array.isArray(config.homepage.featuredCollections)
                                  ? [...config.homepage.featuredCollections]
                                  : [];
                                current[index] = value;
                                const updated = current.filter((v) => v).slice(0, 6);
                                setSiteConfig((c) => ({
                                  ...c,
                                  homepage: { ...c.homepage, featuredCollections: updated },
                                }));
                              }}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select collection" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New Arrivals</SelectItem>
                                <SelectItem value="women">Women&apos;s Fashion</SelectItem>
                                <SelectItem value="men">Men&apos;s Fashion</SelectItem>
                                <SelectItem value="accessories">Accessories</SelectItem>
                              </SelectContent>
                            </Select>
                            {index > 0 ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  const current = Array.isArray(config.homepage.featuredCollections)
                                    ? [...config.homepage.featuredCollections]
                                    : [];
                                  current.splice(index, 1);
                                  setSiteConfig((c) => ({
                                    ...c,
                                    homepage: { ...c.homepage, featuredCollections: current },
                                  }));
                                }}
                              >
                                Remove
                              </Button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Button onClick={() => void persist('Featured collections')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save featured collections
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brand &amp; about</CardTitle>
                  <CardDescription>Maps to <code className="text-xs">general</code> in site config.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Site name</Label>
                    <Input
                      value={config.general.siteName}
                      onChange={(e) =>
                        setSiteConfig((c) => ({ ...c, general: { ...c.general, siteName: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={config.general.tagline}
                      onChange={(e) =>
                        setSiteConfig((c) => ({ ...c, general: { ...c.general, tagline: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (about-style copy)</Label>
                    <Textarea
                      value={config.general.description}
                      onChange={(e) =>
                        setSiteConfig((c) => ({ ...c, general: { ...c.general, description: e.target.value } }))
                      }
                      rows={5}
                    />
                  </div>
                  <Button onClick={() => void persist('General')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact details</CardTitle>
                  <CardDescription>Shown in footer and contact flows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={config.general.email}
                        onChange={(e) =>
                          setSiteConfig((c) => ({ ...c, general: { ...c.general, email: e.target.value } }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Support email</Label>
                      <Input
                        type="email"
                        value={config.general.supportEmail}
                        onChange={(e) =>
                          setSiteConfig((c) => ({ ...c, general: { ...c.general, supportEmail: e.target.value } }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={config.general.phone}
                      onChange={(e) =>
                        setSiteConfig((c) => ({ ...c, general: { ...c.general, phone: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={config.general.address}
                      onChange={(e) =>
                        setSiteConfig((c) => ({ ...c, general: { ...c.general, address: e.target.value } }))
                      }
                      rows={2}
                    />
                  </div>
                  <Button onClick={() => void persist('Contact')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Footer</CardTitle>
                  <CardDescription>
                    Copyright line in <code className="text-xs">navigation.footer</code>.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Copyright text</Label>
                    <Input
                      value={config.navigation.footer.copyrightText}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          navigation: {
                            ...c.navigation,
                            footer: { ...c.navigation.footer, copyrightText: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.navigation.footer.showNewsletter}
                        onCheckedChange={(v) =>
                          setSiteConfig((c) => ({
                            ...c,
                            navigation: {
                              ...c.navigation,
                              footer: { ...c.navigation.footer, showNewsletter: v },
                            },
                          }))
                        }
                      />
                      <Label>Show newsletter</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.navigation.footer.showSocial}
                        onCheckedChange={(v) =>
                          setSiteConfig((c) => ({
                            ...c,
                            navigation: {
                              ...c.navigation,
                              footer: { ...c.navigation.footer, showSocial: v },
                            },
                          }))
                        }
                      />
                      <Label>Show social</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={config.navigation.footer.showPaymentIcons}
                        onCheckedChange={(v) =>
                          setSiteConfig((c) => ({
                            ...c,
                            navigation: {
                              ...c.navigation,
                              footer: { ...c.navigation.footer, showPaymentIcons: v },
                            },
                          }))
                        }
                      />
                      <Label>Show payment icons</Label>
                    </div>
                  </div>
                  <Button onClick={() => void persist('Footer')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key images</CardTitle>
                  <CardDescription>Upload to storage, then URLs are saved in site config.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Hero background</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Input
                        className="flex-1 min-w-[200px]"
                        value={hero.backgroundImage}
                        onChange={(e) =>
                          setSiteConfig((c) => ({
                            ...c,
                            homepage: {
                              ...c.homepage,
                              hero: { ...c.homepage.hero, backgroundImage: e.target.value },
                            },
                          }))
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async () => {
                            const file = input.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadImage(file);
                              setSiteConfig((c) => ({
                                ...c,
                                homepage: {
                                  ...c.homepage,
                                  hero: { ...c.homepage.hero, backgroundImage: url },
                                },
                              }));
                              toast.success('Image uploaded');
                            } catch (e) {
                              console.error(e);
                              toast.error('Upload failed');
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {hero.backgroundImage ? (
                      <img
                        src={hero.backgroundImage}
                        alt=""
                        className="mt-2 max-h-40 rounded-md border object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label>Open Graph image (social share)</Label>
                    <div className="flex gap-2 flex-wrap">
                      <Input
                        className="flex-1 min-w-[200px]"
                        value={og.image}
                        onChange={(e) =>
                          setSiteConfig((c) => ({
                            ...c,
                            seo: {
                              ...c.seo,
                              openGraph: { ...c.seo.openGraph, image: e.target.value },
                            },
                          }))
                        }
                        placeholder={PH.ogImageUrl}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = async () => {
                            const file = input.files?.[0];
                            if (!file) return;
                            try {
                              const url = await uploadImage(file);
                              setSiteConfig((c) => ({
                                ...c,
                                seo: {
                                  ...c.seo,
                                  openGraph: { ...c.seo.openGraph, image: url },
                                },
                              }));
                              toast.success('Image uploaded');
                            } catch (e) {
                              console.error(e);
                              toast.error('Upload failed');
                            }
                          };
                          input.click();
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    {og.image ? (
                      <img src={og.image} alt="" className="mt-2 max-h-40 rounded-md border object-cover" />
                    ) : null}
                  </div>
                  <Button onClick={() => void persist('Media')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save media URLs
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SMTP (transactional)</CardTitle>
                  <CardDescription>
                    Stored in site config. Production often overrides with environment variables on the server.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Host</Label>
                      <Input
                        value={smtp.host}
                        onChange={(e) =>
                          setSiteConfig((c) => ({
                            ...c,
                            email: {
                              ...c.email,
                              smtp: { ...c.email.smtp, host: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input
                        value={smtp.port}
                        onChange={(e) =>
                          setSiteConfig((c) => ({
                            ...c,
                            email: {
                              ...c.email,
                              smtp: { ...c.email.smtp, port: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      value={smtp.username}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          email: { ...c.email, smtp: { ...c.email.smtp, username: e.target.value } },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      placeholder={smtpPasswordBackup.current ? 'Leave blank to keep saved password' : 'Not set'}
                      value={smtp.password}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          email: {
                            ...c.email,
                            smtp: { ...c.email.smtp, password: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From email</Label>
                      <Input
                        type="email"
                        value={smtp.fromEmail}
                        onChange={(e) =>
                          setSiteConfig((c) => ({
                            ...c,
                            email: {
                              ...c.email,
                              smtp: { ...c.email.smtp, fromEmail: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>From name</Label>
                      <Input
                        value={smtp.fromName}
                        onChange={(e) =>
                          setSiteConfig((c) => ({
                            ...c,
                            email: {
                              ...c.email,
                              smtp: { ...c.email.smtp, fromName: e.target.value },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={() => void persist('SMTP')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save SMTP
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Marketing copy (stored)</CardTitle>
                  <CardDescription>
                    Saved as <code className="text-xs">emailTemplates</code>. Server emails use fixed HTML; this is
                    for reference or future automation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Order confirmation — subject</Label>
                    <Input
                      value={tmpl.orderConfirmation.subject}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          emailTemplates: {
                            ...c.emailTemplates!,
                            orderConfirmation: {
                              ...c.emailTemplates!.orderConfirmation,
                              subject: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Order confirmation — body</Label>
                    <Textarea
                      rows={4}
                      value={tmpl.orderConfirmation.body}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          emailTemplates: {
                            ...c.emailTemplates!,
                            orderConfirmation: {
                              ...c.emailTemplates!.orderConfirmation,
                              body: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Welcome — subject</Label>
                    <Input
                      value={tmpl.welcome.subject}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          emailTemplates: {
                            ...c.emailTemplates!,
                            welcome: { ...c.emailTemplates!.welcome, subject: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Welcome — body</Label>
                    <Textarea
                      rows={4}
                      value={tmpl.welcome.body}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          emailTemplates: {
                            ...c.emailTemplates!,
                            welcome: { ...c.emailTemplates!.welcome, body: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <Button onClick={() => void persist('Email templates')} disabled={saving}>
                    <Mail className="h-4 w-4 mr-2" />
                    Save templates
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meta tags</CardTitle>
                  <CardDescription>
                    <code className="text-xs">seo.meta</code>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={meta.title}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          seo: { ...c.seo, meta: { ...c.seo.meta, title: e.target.value } },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={meta.description}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          seo: { ...c.seo, meta: { ...c.seo.meta, description: e.target.value } },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input
                      value={meta.keywords}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          seo: { ...c.seo, meta: { ...c.seo.meta, keywords: e.target.value } },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Canonical URL</Label>
                    <Input
                      value={meta.canonicalUrl}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          seo: { ...c.seo, meta: { ...c.seo.meta, canonicalUrl: e.target.value } },
                        }))
                      }
                    />
                  </div>
                  <Button onClick={() => void persist('SEO meta')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save meta
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Open Graph</CardTitle>
                  <CardDescription>
                    <code className="text-xs">seo.openGraph</code>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>OG title</Label>
                    <Input
                      value={og.title}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          seo: {
                            ...c.seo,
                            openGraph: { ...c.seo.openGraph, title: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OG description</Label>
                    <Textarea
                      rows={2}
                      value={og.description}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          seo: {
                            ...c.seo,
                            openGraph: { ...c.seo.openGraph, description: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OG image URL</Label>
                    <Input
                      value={og.image}
                      onChange={(e) =>
                        setSiteConfig((c) => ({
                          ...c,
                          seo: {
                            ...c.seo,
                            openGraph: { ...c.seo.openGraph, image: e.target.value },
                          },
                        }))
                      }
                    />
                  </div>
                  <Button onClick={() => void persist('Open Graph')} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Open Graph
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </div>
  );
}
