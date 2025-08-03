import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Download, Package, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button, Modal, Form, Input, Space, Table, message, Select } from "antd";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [form] = Form.useForm();

  // Fonction pour récupérer les commandes depuis l'API
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      message.error("Erreur lors du chargement des commandes");
    }
  };

  // Charger les commandes au montage du composant
  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculer les statistiques des commandes
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const completedOrders = orders.filter((order) => order.status === "Completed").length;
  const cancelledOrders = orders.filter((order) => order.status === "Cancelled").length;

  // Filtrer les commandes en fonction du statut et de la recherche
  useEffect(() => {
    let result = orders;

    if (filterStatus !== "all") {
      result = result.filter((order) => order.status.toLowerCase() === filterStatus.toLowerCase());
    }

    if (searchQuery) {
      result = result.filter(
        (order) =>
          order.id.toString().includes(searchQuery.toLowerCase()) || // Recherche par ID de commande
          order.customer_id.toString().includes(searchQuery.toLowerCase()) // Recherche par ID de client
      );
    }

    setFilteredOrders(result);
  }, [filterStatus, searchQuery, orders]);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  // Formater les montants en devise
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Ouvrir le modal pour modifier une commande
  const showEditModal = (order) => {
    setSelectedOrder(order);
    form.setFieldsValue(order); // Pré-remplir le formulaire avec les données de la commande
    setIsEditModalVisible(true);
  };

  // Gérer la soumission du formulaire de modification
  const handleEditSubmit = async (values) => {
    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success) {
        message.success("Commande mise à jour avec succès");
        setIsEditModalVisible(false);
        fetchOrders(); // Recharger les commandes
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la commande:", err);
      message.error("Une erreur est survenue");
    }
  };

  // Supprimer une commande
  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        message.success("Commande supprimée avec succès");
        fetchOrders(); // Recharger les commandes
      }
    } catch (err) {
      console.error("Erreur lors de la suppression de la commande:", err);
      message.error("Une erreur est survenue");
    }
  };

  // Récupérer les informations du client associé à une commande
  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`);
      const data = await response.json();
      if (data.success) {
        setCustomerDetails(data.customer);
        setIsCustomerModalVisible(true);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des informations du client:", err);
      message.error("Une erreur est survenue");
    }
  };

  // Gérer le clic sur une ligne du tableau
  const handleRowClick = (record) => {
    fetchCustomerDetails(record.customer_id);
  };

  // Colonnes du tableau
  const columns = [
    { title: "Order ID", dataIndex: "id", key: "id" },
    { title: "Customer ID", dataIndex: "customer_id", key: "customer_id" },
    { title: "Date", dataIndex: "order_date", key: "order_date" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Amount", dataIndex: "total_amount", key: "total_amount" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Empêcher la propagation du clic
              showEditModal(record);
            }}
          >
            Modifier
          </Button>
          <Button
            danger
            onClick={(e) => {
              e.stopPropagation(); // Empêcher la propagation du clic
              handleDeleteOrder(record.id);
            }}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Statistiques des commandes */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
              <Package className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
              <Clock className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Cancelled</CardTitle>
              <AlertCircle className="h-5 w-5 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-gray-900">{cancelledOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 focus:border-blue-500 focus:outline-none bg-white text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="h-12 rounded-lg border border-gray-300 px-4 focus:border-blue-500 focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50">
              <Download className="h-5 w-5" />
              Export
            </button>
          </div>
        </div>

        {/* Tableau des commandes */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table
                dataSource={filteredOrders}
                columns={columns}
                rowKey="id"
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                })}
              />
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Modal pour modifier une commande */}
      <Modal
        title="Modifier la commande"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Form.Item name="status" label="Statut">
            <Select style={{ width: "100%" }}>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="total_amount" label="Montant total">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Enregistrer
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal pour afficher les informations du client */}
      <Modal
        title="Informations du client"
        open={isCustomerModalVisible}
        onCancel={() => setIsCustomerModalVisible(false)}
        footer={null}
      >
        {customerDetails && (
          <div>
            <p><strong>Nom:</strong> {customerDetails.name}</p>
            <p><strong>Email:</strong> {customerDetails.email}</p>
            <p><strong>Téléphone:</strong> {customerDetails.phone}</p>
            <p><strong>Adresse:</strong> {customerDetails.address}</p>
            <p><strong>Ville:</strong> {customerDetails.city}</p>
            <p><strong>Pays:</strong> {customerDetails.country}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;