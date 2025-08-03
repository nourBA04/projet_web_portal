import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Form, Input, Space, InputNumber, Select, message, Upload } from "antd";
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [imageUrls, setImageUrls] = useState({});

  // Surveiller les changements de `colors`
  const colors = Form.useWatch('colors', form);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Erreur réseau");
      }
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des produits:", err);
      message.error("Impossible de charger les produits");
    }
  };

  const showModal = (product = null) => {
    setEditingProduct(product);
    form.setFieldsValue(product ? product : { colors: [] });
    setImageUrls(product?.image_variants || {}); // Synchroniser imageUrls
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      values.image_variants = imageUrls;

      if (editingProduct) {
        const response = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.success) {
          message.success("Produit mis à jour avec succès");
        }
      } else {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.success) {
          message.success("Produit ajouté avec succès");
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      setImageUrls({});
      fetchProducts();
    } catch (err) {
      console.error("Erreur lors de la soumission du formulaire:", err);
      message.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        message.success("Produit supprimé avec succès");
        fetchProducts();
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du produit:", err);
      message.error("Une erreur est survenue");
    }
  };

  const handleImageUpload = async (file, color) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setImageUrls((prev) => {
          const newImageUrls = { ...prev, [color]: data.imageUrl };
          // Définir la première image téléchargée comme image par défaut
          if (!prev.default) {
            newImageUrls.default = data.imageUrl;
          }
          return newImageUrls;
        });
        message.success("Image téléchargée avec succès");
      }
    } catch (err) {
      console.error("Erreur lors du téléchargement de l'image:", err);
      message.error("Erreur lors du téléchargement de l'image");
    }
  };

  const columns = [
    { title: "Nom", dataIndex: "name", key: "name" },
    { title: "Catégorie", dataIndex: "category", key: "category" },
    {
      title: "Prix",
      dataIndex: "price",
      key: "price",
      render: (price) => `${parseFloat(price).toFixed(2)} €`,
    },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Image",
      dataIndex: "image_variants",
      key: "image",
      render: (imageVariants) => (
        <img
          src={`http://localhost/sportsdist/backend${imageVariants.default}`}
          alt="Produit"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
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
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <Button type="primary" onClick={() => showModal()}>
          Ajouter un produit
        </Button>
      </div>

      <Table dataSource={products} columns={columns} rowKey="id" />

      <Modal
        title={editingProduct ? "Modifier un produit" : "Ajouter un produit"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Nom du produit"
            rules={[{ required: true, message: "Le nom est obligatoire" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Prix"
            rules={[{ required: true, message: "Le prix est obligatoire" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              formatter={(value) => `${value} €`}
              parser={(value) => value.replace(" €", "")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: "Le stock est obligatoire" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Catégorie"
            rules={[{ required: true, message: "La catégorie est obligatoire" }]}
          >
            <Select>
              <Option value="running">Running</Option>
              <Option value="cycling">Cycling</Option>
              <Option value="fitness">Fitness</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="brand"
            label="Marque"
            rules={[{ required: true, message: "La marque est obligatoire" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="sizes"
            label="Tailles disponibles"
            rules={[{ required: true, message: "Les tailles sont obligatoires" }]}
          >
            <Select mode="tags" placeholder="Sélectionnez les tailles">
              <Option value="39">39</Option>
              <Option value="40">40</Option>
              <Option value="41">41</Option>
              <Option value="42">42</Option>
              <Option value="43">43</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="colors"
            label="Couleurs disponibles"
            rules={[{ required: true, message: "Les couleurs sont obligatoires" }]}
          >
            <Select mode="tags" placeholder="Sélectionnez les couleurs">
              <Option value="blue">Bleu</Option>
              <Option value="red">Rouge</Option>
              <Option value="green">Vert</Option>
              <Option value="black">Noir</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Images par couleur">
            {colors?.map((color) => (
              <div key={color} style={{ marginBottom: 16 }}>
                <h4>{color}</h4>
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleImageUpload(file, color);
                    return false; // Empêcher l'upload automatique
                  }}
                >
                  <Button icon={<UploadOutlined />}>Télécharger une image</Button>
                </Upload>
                {imageUrls[color] && (
                  <img
                    src={`http://localhost/sportsdist/backend${imageUrls[color]}`}
                    alt={color}
                    style={{ width: 50, height: 50, marginTop: 8 }}
                  />
                )}
              </div>
            ))}
          </Form.Item>

          <Form.Item>
            <Space className="w-full justify-end">
              <Button onClick={() => setIsModalVisible(false)}>Annuler</Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Modifier" : "Créer"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;