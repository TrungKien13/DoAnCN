import React, { useState, useEffect } from "react";
import { withAuth } from "@/lib/auth";
import Layout from "@/components/Layout/Layout";
import { userApi } from "@/lib/api";
import {
  Cog6ToothIcon,
  BellIcon,
  EyeIcon,
  ShieldCheckIcon,
  LanguageIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface UserSettings {
  [key: string]: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    display: {
      fontSize: "large",
      theme: "light",
      language: "vi",
    },
    privacy: {
      shareData: false,
      analytics: true,
    },
    reminders: {
      advanceMinutes: 30,
      sound: true,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userSettings = await userApi.getSettings();

      // Convert array of settings to nested object
      const settingsMap: UserSettings = {};
      userSettings.forEach((setting: any) => {
        settingsMap[setting.setting_key] = setting.setting_value;
      });

      // Update state with loaded settings
      setSettings({
        notifications: {
          email: settingsMap["notifications.email"] === "true",
          push: settingsMap["notifications.push"] === "true",
          sms: settingsMap["notifications.sms"] === "true",
        },
        display: {
          fontSize: settingsMap["display.fontSize"] || "large",
          theme: settingsMap["display.theme"] || "light",
          language: settingsMap["display.language"] || "vi",
        },
        privacy: {
          shareData: settingsMap["privacy.shareData"] === "true",
          analytics: settingsMap["privacy.analytics"] === "true",
        },
        reminders: {
          advanceMinutes:
            parseInt(settingsMap["reminders.advanceMinutes"]) || 30,
          sound: settingsMap["reminders.sound"] === "true",
        },
      });
    } catch (err: any) {
      console.error("Error loading settings:", err);
      setError("Không thể tải cài đặt");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = async (
    category: string,
    key: string,
    value: any
  ) => {
    // Update local state immediately for better UX
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));

    // Save to backend
    try {
      const settingKey = `${category}.${key}`;
      const settingValue =
        typeof value === "boolean" ? value.toString() : value.toString();

      await userApi.updateSetting(settingKey, settingValue);
    } catch (err: any) {
      console.error("Error saving setting:", err);
      setError("Không thể lưu cài đặt");
      // Revert local state on error
      await loadSettings();
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSaveSuccess(false);

      // Flatten settings and save all
      const settingsToSave = [
        {
          key: "notifications.email",
          value: settings.notifications.email.toString(),
        },
        {
          key: "notifications.push",
          value: settings.notifications.push.toString(),
        },
        {
          key: "notifications.sms",
          value: settings.notifications.sms.toString(),
        },
        { key: "display.fontSize", value: settings.display.fontSize },
        { key: "display.theme", value: settings.display.theme },
        { key: "display.language", value: settings.display.language },
        {
          key: "privacy.shareData",
          value: settings.privacy.shareData.toString(),
        },
        {
          key: "privacy.analytics",
          value: settings.privacy.analytics.toString(),
        },
        {
          key: "reminders.advanceMinutes",
          value: settings.reminders.advanceMinutes.toString(),
        },
        { key: "reminders.sound", value: settings.reminders.sound.toString() },
      ];

      // Save all settings
      await Promise.all(
        settingsToSave.map((setting) =>
          userApi.updateSetting(setting.key, setting.value)
        )
      );

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving all settings:", err);
      setError("Không thể lưu tất cả cài đặt");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Cài đặt">
        <div className="p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Cài đặt">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-elderly-text mb-6">
          Cài đặt hệ thống
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={loadSettings}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800 text-sm">
                Đã lưu cài đặt thành công!
              </p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BellIcon className="h-5 w-5 mr-2 text-primary-600" />
              Thông báo
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-elderly-text">
                    Thông báo email
                  </h3>
                  <p className="text-elderly-text-light text-sm">
                    Nhận thông báo qua email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "email",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-elderly-text">
                    Thông báo push
                  </h3>
                  <p className="text-elderly-text-light text-sm">
                    Nhận thông báo trên trình duyệt
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "push",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-elderly-text">
                    Thông báo SMS
                  </h3>
                  <p className="text-elderly-text-light text-sm">
                    Nhận thông báo qua tin nhắn
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) =>
                      handleSettingChange(
                        "notifications",
                        "sms",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <EyeIcon className="h-5 w-5 mr-2 text-primary-600" />
              Hiển thị
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-elderly-text mb-2">
                  Kích thước chữ
                </label>
                <select
                  value={settings.display.fontSize}
                  onChange={(e) =>
                    handleSettingChange("display", "fontSize", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="small">Nhỏ</option>
                  <option value="medium">Vừa</option>
                  <option value="large">Lớn</option>
                  <option value="extra-large">Rất lớn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-elderly-text mb-2">
                  Giao diện
                </label>
                <select
                  value={settings.display.theme}
                  onChange={(e) =>
                    handleSettingChange("display", "theme", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="light">Sáng</option>
                  <option value="dark">Tối</option>
                  <option value="auto">Tự động</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-elderly-text mb-2">
                  Ngôn ngữ
                </label>
                <select
                  value={settings.display.language}
                  onChange={(e) =>
                    handleSettingChange("display", "language", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-2 text-primary-600" />
              Nhắc nhở
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-elderly-text mb-2">
                  Thời gian nhắc trước (phút)
                </label>
                <select
                  value={settings.reminders.advanceMinutes}
                  onChange={(e) =>
                    handleSettingChange(
                      "reminders",
                      "advanceMinutes",
                      parseInt(e.target.value)
                    )
                  }
                  className="form-select"
                >
                  <option value={15}>15 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={60}>1 giờ</option>
                  <option value={120}>2 giờ</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-elderly-text">
                    Âm thanh nhắc nhở
                  </h3>
                  <p className="text-elderly-text-light text-sm">
                    Phát âm thanh khi có nhắc nhở
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reminders.sound}
                    onChange={(e) =>
                      handleSettingChange(
                        "reminders",
                        "sound",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-primary-600" />
              Quyền riêng tư
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-elderly-text">
                    Chia sẻ dữ liệu
                  </h3>
                  <p className="text-elderly-text-light text-sm">
                    Cho phép chia sẻ dữ liệu để cải thiện dịch vụ
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.shareData}
                    onChange={(e) =>
                      handleSettingChange(
                        "privacy",
                        "shareData",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-elderly-text">
                    Phân tích sử dụng
                  </h3>
                  <p className="text-elderly-text-light text-sm">
                    Cho phép thu thập dữ liệu phân tích
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy.analytics}
                    onChange={(e) =>
                      handleSettingChange(
                        "privacy",
                        "analytics",
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={loadSettings}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Khôi phục
            </button>
            <button
              onClick={handleSaveAll}
              className="btn btn-primary flex items-center space-x-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-5 w-5" />
                  <span>Lưu tất cả cài đặt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(SettingsPage);
