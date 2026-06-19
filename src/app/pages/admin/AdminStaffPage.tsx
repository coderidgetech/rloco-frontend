import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../lib/apiErrors';
import type { User } from '../../types/api';
import { Users, Copy } from 'lucide-react';

/**
 * Admin-only management of internal staff (first-party operations). Staff manage
 * the house catalog + house orders only; that scope is enforced by the backend.
 */
export const AdminStaffPage = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setStaff(await adminService.listStaff());
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Failed to load staff'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSubmitting(true);
    setTempPassword(null);
    try {
      const res = await adminService.createStaff({
        name: name.trim(),
        email: email.trim(),
        password: password.trim() || undefined,
      });
      toast.success('Staff account created');
      if (res.temporary_password) setTempPassword(res.temporary_password);
      setName('');
      setEmail('');
      setPassword('');
      load();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Failed to create staff'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-16">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6" />
          <div>
            <h1 className="text-3xl font-bold">Staff</h1>
            <p className="text-gray-600 mt-1">
              Internal staff manage the first-party (house) catalog and its orders only.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add staff member</CardTitle>
            <CardDescription>
              They'll be required to set a new password on first login. Leave password blank to auto-generate one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="s-name">Name</Label>
                <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-email">Email</Label>
                <Input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="s-pass">Password (optional)</Label>
                <Input id="s-pass" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="auto-generate" />
              </div>
              <div className="sm:col-span-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating…' : 'Create staff'}
                </Button>
              </div>
            </form>

            {tempPassword && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                <span>Temporary password (share securely): </span>
                <code className="rounded bg-white px-2 py-0.5 font-mono">{tempPassword}</code>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    navigator.clipboard?.writeText(tempPassword);
                    toast.success('Copied');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff members</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Loading…</p>
            ) : staff.length === 0 ? (
              <p className="text-sm text-gray-500">No staff accounts yet.</p>
            ) : (
              <div className="divide-y">
                {staff.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.must_reset_password && <Badge variant="outline">Pending password reset</Badge>}
                      <Badge variant={s.active ? 'default' : 'secondary'}>{s.active ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};
