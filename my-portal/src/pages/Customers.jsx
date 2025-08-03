import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, Space, message } from "antd";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [form] = Form.useForm();

  // Charger les clients au montage du composant
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Récupérer tous les clients
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers"); // URL relative
      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des clients:", err);
    }
  };

  // Ouvrir le modal pour ajouter ou modifier un client
  const showModal = (customer = null) => {
    setEditingCustomer(customer);
    form.setFieldsValue(customer || {});
    setIsModalVisible(true);
  };

  // Gérer la création ou la mise à jour d'un client
  const handleSubmit = async (values) => {
    try {
      if (editingCustomer) {
        // Mettre à jour un client existant
        const response = await fetch(`/api/customers/${editingCustomer.id}`, { // URL relative
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.success) {
          message.success("Client mis à jour avec succès");
        }
      } else {
        // Créer un nouveau client
        const response = await fetch("/api/customers", { // URL relative
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.success) {
          message.success("Client créé avec succès");
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchCustomers();
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err);
      message.error("Une erreur est survenue");
    }
  };

  // Supprimer un client
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/customers/${id}`, { // URL relative
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        message.success("Client supprimé avec succès");
        fetchCustomers();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du client:", err);
      message.error("Une erreur est survenue");
    }
  };

  // Colonnes du tableau
  const columns = [
    { title: "Nom", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Téléphone", dataIndex: "phone", key: "phone" },
    { title: "Statut", dataIndex: "status", key: "status" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => showModal(record)}>Modifier</Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => showModal()}>
        Ajouter un client
      </Button>
      <Table dataSource={customers} columns={columns} rowKey="id" />

      {/* Modal pour ajouter ou modifier un client */}
      <Modal
        title={editingCustomer ? "Modifier un client" : "Ajouter un client"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item name="name" label="Nom" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Le mot de passe est requis' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="phone" label="Téléphone">
            <Input />
          </Form.Item>
          <Form.Item name="company" label="Entreprise">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Adresse">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Ville">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Pays">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Statut">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCustomer ? "Modifier" : "Créer"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;