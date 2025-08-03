import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '../services/api';
import { toast } from 'react-toastify';

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    country: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const response = await api.getCustomer(id);
          if (response.success) {
            setFormData(response.data);
          } else {
            toast.error(response.message || 'Failed to fetch customer details');
          }
        } catch (err) {
          console.error('Error fetching customer:', err);
          toast.error('An error occurred while fetching customer details.');
        } finally {
          setLoading(false);
        }
      };

      fetchCustomer();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (id) {
        response = await api.updateCustomer(id, formData);
      } else {
        response = await api.createCustomer(formData);
      }

      if (response.success) {
        toast.success(id ? 'Customer updated successfully!' : 'Customer created successfully!');
        navigate('/customers');
      } else {
        toast.error(response.message || 'Failed to save customer');
      }
    } catch (err) {
      console.error('Error saving customer:', err);
      toast.error('An error occurred while saving customer details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Edit Customer' : 'Create Customer'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {loading && <p className="text-blue-500">Loading...</p>}
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            <div className="flex items-center space-x-4">
              <label>Status:</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border rounded px-2 py-1">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <Button type="submit" className="bg-blue-600" disabled={loading}>
              {loading ? 'Saving...' : id ? 'Update Customer' : 'Create Customer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
