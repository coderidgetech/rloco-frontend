import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft, UserPlus, ExternalLink } from 'lucide-react';

/**
 * Customers are created via public signup (POST /api/auth/register).
 * There is no admin API to provision customer accounts yet.
 */
export function AdminAddUserPage() {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <Button variant="ghost" className="gap-2 -ml-2" onClick={() => navigate('/admin/customers')}>
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Button>

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserPlus className="h-8 w-8" />
            Add customer
          </h1>
          <p className="text-muted-foreground mt-1">
            New shopper accounts are created when someone registers on the storefront.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How customers join</CardTitle>
            <CardDescription>
              The API exposes list/update for customers, but not an admin-only “create user” endpoint. Use the public
              signup flow or share your store link.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/signup')}>
              Open signup page
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              View storefront
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
