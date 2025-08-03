import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, UserPlus, Activity, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newThisMonth: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Récupérer les clients depuis l'API
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers"); // URL relative
        const data = await response.json();

        if (data.success) {
          setCustomers(data.customers);

          // Calculer les statistiques
          const totalCustomers = data.customers.length;
          const newThisMonth = data.customers.filter((customer) => {
            const joinedDate = new Date(customer.created_at);
            const currentDate = new Date();
            return (
              joinedDate.getMonth() === currentDate.getMonth() &&
              joinedDate.getFullYear() === currentDate.getFullYear()
            );
          }).length;
          const activeUsers = data.customers.filter(
            (customer) => customer.status === "Active"
          ).length;

          setStats({
            totalCustomers,
            newThisMonth,
            activeUsers,
          });
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des clients:", err);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Customer Management Portal</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 focus:border-blue-500 focus:outline-none bg-white"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Customers</CardTitle>
              <Users className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</div>
                <div className="flex items-center text-sm text-green-600">
                  +12.3%
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">New This Month</CardTitle>
              <UserPlus className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-semibold text-gray-900">{stats.newThisMonth}</div>
                <div className="flex items-center text-sm text-green-600">
                  +8.2%
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
              <Activity className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</div>
                <div className="flex items-center text-sm text-green-600">
                  +3.1%
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Customers Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.email}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;