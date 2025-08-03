import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { 
  User, Mail, Phone, Building, MapPin, Calendar,
  ArrowLeft, Edit, Trash
} from 'lucide-react';
import api from '../services/api';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await api.getCustomer(id);
        setCustomer(response); // Suppression de la validation `response.success`
      } catch (err) {
        console.error('Customer Detail Error:', err);
        setError('An error occurred. Please try again.');
      }
    };

    fetchCustomer();
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center p-6">{error}</p>;
  }

  if (!customer) {
    return <p className="text-center p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center">
        <Button variant="ghost" className="mr-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Customer Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{customer.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{customer.company || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{customer.address || 'Not provided'}</p>
                  <p className="font-medium">
                    {customer.city || 'N/A'}, {customer.country || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Join Date</p>
                <p className="font-medium">{customer.joinDate || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="mt-1 inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                  {customer.status || 'Unknown'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Purchase</p>
                <p className="font-medium">{customer.lastPurchase || 'None'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Purchases</p>
                <p className="font-medium">{customer.totalPurchases || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <Button className="bg-blue-600">
          <Edit className="mr-2 h-4 w-4" />
          Edit Customer
        </Button>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete Customer
        </Button>
      </div>
    </div>
  );
};

export default CustomerDetail;
