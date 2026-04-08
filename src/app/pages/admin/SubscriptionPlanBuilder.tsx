import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Package, DollarSign, Users, Settings, Calendar, CreditCard, TrendingUp, Bell, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { toast } from 'sonner';
import { PH } from '@/app/lib/formPlaceholders';

export default function SubscriptionPlanBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('id');
  const isClone = searchParams.get('clone') === 'true';

  // Form state
  const [formData, setFormData] = useState({
    id: 0,
    configName: '',
    name: '',
    description: '',
    color: '#6B7280',
    price: '$299',
    period: '/month',
    isPopular: false,
    isDefault: false,
    isActive: true,
    icon: 'Star',
    
    // Commission & Earnings
    commissionRate: 5,
    payoutFrequency: 'Weekly',
    minimumPayout: 50,
    
    // Usage Limits
    maxProducts: 500,
    maxOrders: 1000,
    storageLimit: '10 GB',
    bandwidthLimit: '100 GB',
    
    // Features
    features: [
      'Product Management',
      'Order Processing',
      'Analytics Dashboard',
      'Email Notifications',
      'Customer Support',
    ],
    
    // Billing Configuration
    billingCycle: 'monthly',
    trialPeriod: 0,
    setupFee: 0,
    currency: 'USD',
    
    // Payment Methods
    paymentMethods: ['credit_card', 'bank_transfer'],
    
    // Advanced Settings
    autoRenew: true,
    allowDowngrade: true,
    allowUpgrade: true,
    prorationEnabled: true,
    
    // Discounts
    annualDiscount: 20,
    bulkDiscount: 0,
    
    // Email Notifications
    emailNotifications: {
      welcome: true,
      renewal: true,
      paymentFailed: true,
      upgrade: true,
      downgrade: true,
    },
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (planId) {
      // Load existing plan data from localStorage or API
      const savedPlans = localStorage.getItem('subscriptionPlans');
      if (savedPlans) {
        const plans = JSON.parse(savedPlans);
        const plan = plans.find((p: any) => p.id === parseInt(planId));
        if (plan) {
          if (isClone) {
            setFormData({
              ...plan,
              id: 0,
              configName: `${plan.configName}_COPY`,
              name: `${plan.name} (Copy)`,
              isDefault: false,
            });
          } else {
            setFormData(plan);
          }
        }
      }
    }
  }, [planId, isClone]);

  const handleSave = () => {
    // Validation
    if (!formData.configName.trim()) {
      toast.error('Config Name is required');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Plan Name is required');
      return;
    }

    // Load existing plans
    const savedPlans = localStorage.getItem('subscriptionPlans');
    let plans = savedPlans ? JSON.parse(savedPlans) : [];

    if (formData.id === 0) {
      // Create new plan
      const newId = plans.length > 0 ? Math.max(...plans.map((p: any) => p.id)) + 1 : 1;
      const newPlan = { ...formData, id: newId };
      plans.push(newPlan);
      toast.success('Subscription plan created successfully');
    } else {
      // Update existing plan
      plans = plans.map((p: any) => (p.id === formData.id ? formData : p));
      toast.success('Subscription plan updated successfully');
    }

    // Save to localStorage
    localStorage.setItem('subscriptionPlans', JSON.stringify(plans));

    // Navigate back
    navigate('/admin/configuration?tab=subscriptions');
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="page-container-lg py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin/configuration?tab=subscriptions')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Configuration
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold">
                {formData.id === 0 ? 'Create New Subscription Plan' : 'Edit Subscription Plan'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/configuration?tab=subscriptions')}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#B4770E] hover:bg-[#8B5A0B]"
              >
                <Save className="h-4 w-4 mr-2" />
                {formData.id === 0 ? 'Create Plan' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container-lg py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#B4770E]" />
                  Plan Details
                </CardTitle>
                <CardDescription>
                  Configure the basic information for this subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Config Name (Unique Identifier)</Label>
                  <Input
                    value={formData.configName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        configName: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
                      })
                    }
                    placeholder={PH.planConfigCode}
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    Use UPPERCASE with underscores (e.g., PLAN_PROFESSIONAL, PLAN_CUSTOM_VIP)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Plan Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={PH.planName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Plan Color</Label>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this plan"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="$299"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Input
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="/month"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Input
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      placeholder="USD"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Mark as Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Set as Default</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Commission & Earnings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#B4770E]" />
                  Commission & Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Commission Rate (%)</Label>
                    <Input
                      type="number"
                      value={formData.commissionRate}
                      onChange={(e) =>
                        setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payout Frequency</Label>
                    <select
                      value={formData.payoutFrequency}
                      onChange={(e) => setFormData({ ...formData, payoutFrequency: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Bi-weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Payout ($)</Label>
                    <Input
                      type="number"
                      value={formData.minimumPayout}
                      onChange={(e) =>
                        setFormData({ ...formData, minimumPayout: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#B4770E]" />
                  Usage Limits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max Products</Label>
                    <Input
                      type="number"
                      value={formData.maxProducts}
                      onChange={(e) =>
                        setFormData({ ...formData, maxProducts: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Orders Per Month</Label>
                    <Input
                      type="number"
                      value={formData.maxOrders}
                      onChange={(e) =>
                        setFormData({ ...formData, maxOrders: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Storage Limit</Label>
                    <Input
                      value={formData.storageLimit}
                      onChange={(e) => setFormData({ ...formData, storageLimit: e.target.value })}
                      placeholder={PH.storageLimit}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bandwidth Limit</Label>
                    <Input
                      value={formData.bandwidthLimit}
                      onChange={(e) => setFormData({ ...formData, bandwidthLimit: e.target.value })}
                      placeholder={PH.bandwidthLimit}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#B4770E]" />
                  Billing Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Billing Cycle</Label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Trial Period (days)</Label>
                    <Input
                      type="number"
                      value={formData.trialPeriod}
                      onChange={(e) =>
                        setFormData({ ...formData, trialPeriod: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Setup Fee ($)</Label>
                    <Input
                      type="number"
                      value={formData.setupFee}
                      onChange={(e) =>
                        setFormData({ ...formData, setupFee: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Annual Discount (%)</Label>
                    <Input
                      type="number"
                      value={formData.annualDiscount}
                      onChange={(e) =>
                        setFormData({ ...formData, annualDiscount: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bulk Discount (%)</Label>
                    <Input
                      type="number"
                      value={formData.bulkDiscount}
                      onChange={(e) =>
                        setFormData({ ...formData, bulkDiscount: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Advanced Settings</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.autoRenew}
                        onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Auto Renew</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowDowngrade}
                        onChange={(e) =>
                          setFormData({ ...formData, allowDowngrade: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span className="text-sm">Allow Downgrade</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allowUpgrade}
                        onChange={(e) =>
                          setFormData({ ...formData, allowUpgrade: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span className="text-sm">Allow Upgrade</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.prorationEnabled}
                        onChange={(e) =>
                          setFormData({ ...formData, prorationEnabled: e.target.checked })
                        }
                        className="rounded"
                      />
                      <span className="text-sm">Proration Enabled</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#B4770E]" />
                  Email Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications.welcome}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailNotifications: {
                            ...formData.emailNotifications,
                            welcome: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Welcome Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications.renewal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailNotifications: {
                            ...formData.emailNotifications,
                            renewal: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Renewal Reminder</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications.paymentFailed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailNotifications: {
                            ...formData.emailNotifications,
                            paymentFailed: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Payment Failed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emailNotifications.upgrade}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailNotifications: {
                            ...formData.emailNotifications,
                            upgrade: e.target.checked,
                          },
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Upgrade Notification</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Features */}
          <div className="space-y-6">
            {/* Plan Preview */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-[#B4770E]" />
                  Plan Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 rounded-lg p-6 text-center"
                  style={{ borderColor: formData.color }}
                >
                  {formData.isPopular && (
                    <div className="inline-block bg-[#B4770E] text-white text-xs px-3 py-1 rounded-full mb-3">
                      POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{formData.name || 'Plan Name'}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {formData.description || 'Plan description'}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{formData.price}</span>
                    <span className="text-gray-600">{formData.period}</span>
                  </div>
                  <div className="space-y-2 text-left">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B4770E]" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#B4770E]" />
                  Plan Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Feature</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Enter feature name"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddFeature();
                        }
                      }}
                    />
                    <Button onClick={handleAddFeature} size="sm" className="shrink-0">
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Current Features ({formData.features.length})</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span className="text-sm">{feature}</span>
                        <button
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
