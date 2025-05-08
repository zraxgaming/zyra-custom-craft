
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { format } from "date-fns";
import { Search, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  email: string;
  created_at: string;
  profile: {
    display_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    role: string | null;
  };
  orders: {
    count: number;
    total: number;
  };
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // First, get users with their profiles
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select(`
          id,
          display_name,
          avatar_url,
          phone,
          role,
          created_at
        `)
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (userError) throw userError;

      // Fetch the auth users to get email addresses
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({
        page: currentPage,
        perPage: pageSize,
      });

      if (authError) {
        console.error("Error fetching auth users:", authError);
      }

      // Get order stats for each user
      const customerData = await Promise.all(
        userData.map(async (user) => {
          // Get order count and total spent
          const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .select("total_amount")
            .eq("user_id", user.id);

          if (orderError) {
            console.error(`Error fetching orders for user ${user.id}:`, orderError);
          }

          const orderCount = orderData?.length || 0;
          const totalSpent = orderData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

          // Find matching auth user to get email
          const authUser = authUsers?.data.find(u => u.id === user.id);
          
          return {
            id: user.id,
            email: authUser?.email || "Unknown",
            created_at: user.created_at,
            profile: {
              display_name: user.display_name,
              avatar_url: user.avatar_url,
              phone: user.phone,
              role: user.role,
            },
            orders: {
              count: orderCount,
              total: totalSpent,
            },
          };
        })
      );

      setCustomers(customerData);
    } catch (error: any) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error loading customers",
        description: error.message || "An error occurred while fetching customer data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = searchQuery
    ? customers.filter(
        (customer) =>
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (customer.profile.display_name &&
            customer.profile.display_name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : customers;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-gray-500">Manage your store customers</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <h2 className="font-semibold">All Customers</h2>
              <Badge variant="outline" className="ml-2">
                {customers.length} total
              </Badge>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zyra-purple"></div>
              </div>
            ) : filteredCustomers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={customer.profile.avatar_url || undefined} />
                            <AvatarFallback>
                              {customer.profile.display_name
                                ? customer.profile.display_name.substring(0, 2).toUpperCase()
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            {customer.profile.display_name || "Unnamed Customer"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.profile.phone || "—"}</TableCell>
                      <TableCell>{customer.orders.count}</TableCell>
                      <TableCell>${customer.orders.total.toFixed(2)}</TableCell>
                      <TableCell>{format(new Date(customer.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Badge variant={customer.profile.role === "admin" ? "default" : "outline"}>
                          {customer.profile.role || "customer"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No customers found matching your search.</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    Previous
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={customers.length < pageSize || isLoading}
                  >
                    Next
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Customers;
