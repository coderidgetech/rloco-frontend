import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Phone, Calendar, MapPin, Camera, Save } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { toast } from 'sonner';

export function MobileProfileEditPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Praneeth Kumar',
    email: 'praneeth@example.com',
    phone: '+91 98765 43210',
    gender: 'male',
    dateOfBirth: '1995-06-15',
    city: 'Hyderabad',
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    toast.success('Profile updated successfully');
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader onBack={() => navigate('/account')} />

      <div className="pt-[100px] p-4">{/* Header + safe area */}
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-medium">Edit Profile</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Update your personal information
          </p>
        </div>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white">
              <Camera size={16} className="text-white" />
            </button>
          </div>
          <p className="text-sm text-foreground/60 mt-3">Tap to change photo</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-border/30 rounded-xl shadow-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-border/30 rounded-xl shadow-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-border/30 rounded-xl shadow-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your phone"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Gender
            </label>
            <div className="flex gap-3">
              {['male', 'female', 'other'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => handleChange('gender', gender)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium shadow-sm transition-colors ${
                    formData.gender === gender
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border/30 text-foreground/70'
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-border/30 rounded-xl shadow-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              City
            </label>
            <div className="relative">
              <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-border/30 rounded-xl shadow-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter your city"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full bg-primary text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 mt-8"
        >
          <Save size={20} />
          <span>Save Changes</span>
        </motion.button>
      </div>
    </div>
  );
}