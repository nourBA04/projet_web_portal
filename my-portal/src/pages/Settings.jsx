import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Switch from "@/components/ui/switch";
import { Bell, Mail, Shield, Globe, UserCog, Database } from "lucide-react";
import api from "@/services/api"; // Importez votre fichier api.js
import { toast } from "react-toastify"; // Pour afficher des notifications

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    twoFactorAuth: true,
    dataRetention: true,
    apiAccess: false,
    language: "en",
    timezone: "UTC",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupérer les paramètres au montage du composant
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await api.getSettings();
        if (response.success) {
          setSettings(response.data);
        } else {
          setError(response.message || "Failed to fetch settings");
          toast.error("Failed to fetch settings");
        }
      } catch (err) {
        console.error("Settings Error:", err);
        setError("An error occurred while fetching settings.");
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Mettre à jour un paramètre
  const handleToggle = async (setting, value) => {
    const updatedSettings = { ...settings, [setting]: value };
    setSettings(updatedSettings);

    try {
      const response = await api.updateSettings(updatedSettings);
      if (response.success) {
        toast.success("Settings updated successfully!");
      } else {
        setError(response.message || "Failed to update settings");
        toast.error("Failed to update settings");
      }
    } catch (err) {
      console.error("Settings Error:", err);
      setError("An error occurred while saving settings.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {loading && <p className="text-blue-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Notifications Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-400" />
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleToggle("emailNotifications", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">Get browser notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(value) => handleToggle("pushNotifications", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                </div>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(value) => handleToggle("weeklyReports", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-400" />
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Additional security layer</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(value) => handleToggle("twoFactorAuth", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Retention</p>
                  <p className="text-sm text-gray-500">Store customer data securely</p>
                </div>
                <Switch
                  checked={settings.dataRetention}
                  onCheckedChange={(value) => handleToggle("dataRetention", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">API Access</p>
                  <p className="text-sm text-gray-500">Enable API endpoints</p>
                </div>
                <Switch
                  checked={settings.apiAccess}
                  onCheckedChange={(value) => handleToggle("apiAccess", value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* User Preferences */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <UserCog className="h-5 w-5 text-gray-400" />
              <CardTitle>User Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleToggle("language", e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleToggle("timezone", e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Database className="h-5 w-5 text-gray-400" />
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Version</span>
                  <span className="text-sm text-gray-900">2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Last Updated</span>
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Storage Used</span>
                  <span className="text-sm text-gray-900">1.2 GB / 10 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;