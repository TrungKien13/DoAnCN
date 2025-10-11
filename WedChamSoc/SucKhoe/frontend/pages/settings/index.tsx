import React, { useState, useEffect } from "react";
import { withAuth } from "@/lib/auth";
import Layout from "@/components/Layout/Layout";
import { userApi, twoFactorApi } from "@/lib/api";
import {
  Cog6ToothIcon,
  BellIcon,
  EyeIcon,
  ShieldCheckIcon,
  LanguageIcon,
  CheckIcon,
  KeyIcon,
  QrCodeIcon,
  ExclamationTriangleIcon,
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
  
  // 2FA states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState({
    isSettingUp: false,
    qrCodeUrl: '',
    secret: '',
    backupCodes: [] as string[],
    verificationCode: '',
    showBackupCodes: false,
    liveCode: '',
    liveCountdown: 30,
  });

  useEffect(() => {
    loadSettings();
    load2FAStatus();
  }, []);

  // Refresh QR and live TOTP code every 30s during setup
  useEffect(() => {
    if (!twoFactorSetup.isSettingUp || !twoFactorSetup.secret) return;

    // Minimal TOTP (HMAC-SHA1) generator using Web Crypto
    const base32ToBytes = (base32: string): ArrayBuffer => {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      const cleaned = base32.replace(/=+$/,'').replace(/\s+/g,'').toUpperCase();
      let bits = '';
      for (const c of cleaned) {
        const val = alphabet.indexOf(c);
        if (val < 0) continue;
        bits += val.toString(2).padStart(5,'0');
      }
      const bytes: number[] = [];
      for (let i=0; i+8<=bits.length; i+=8) {
        bytes.push(parseInt(bits.substring(i,i+8),2));
      }
      return new Uint8Array(bytes).buffer;
    };

    const hmacSha1 = async (key: ArrayBuffer, msg: ArrayBuffer): Promise<ArrayBuffer> => {
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
      );
      return crypto.subtle.sign('HMAC', cryptoKey, msg);
    };

    const generateTotp = async (secret: string, step: number = 30, digits: number = 6): Promise<string> => {
      const counter = Math.floor(Date.now() / 1000 / step);
      const counterBuf = new ArrayBuffer(8);
      const view = new DataView(counterBuf);
      // big-endian 8-byte counter
      view.setUint32(4, counter);
      const key = base32ToBytes(secret);
      const hmacBuf = await hmacSha1(key, counterBuf);
      const hmac = new Uint8Array(hmacBuf);
      const offset = hmac[hmac.length - 1] & 0x0f;
      const bin = ((hmac[offset] & 0x7f) << 24) |
                  ((hmac[offset + 1] & 0xff) << 16) |
                  ((hmac[offset + 2] & 0xff) << 8) |
                  (hmac[offset + 3] & 0xff);
      const otp = (bin % 10 ** digits).toString().padStart(digits, '0');
      return otp;
    };

    const updateLiveCode = async () => {
      try {
        const step = 30;
        const code = await generateTotp(twoFactorSetup.secret, step, 6);
        const remaining = step - (Math.floor(Date.now() / 1000) % step);
        setTwoFactorSetup((prev) => ({ ...prev, liveCode: code, liveCountdown: remaining }));
      } catch {}
    };

    // initial update
    updateLiveCode();

    const codeInterval = setInterval(() => { updateLiveCode(); }, 1000);
    const qrInterval = setInterval(async () => {
      try {
        const qrUrl = await twoFactorApi.getQrObjectUrl();
        setTwoFactorSetup((prev) => ({ ...prev, qrCodeUrl: qrUrl }));
      } catch {}
    }, 30000);

    return () => {
      clearInterval(codeInterval);
      clearInterval(qrInterval);
    };
  }, [twoFactorSetup.isSettingUp, twoFactorSetup.secret]);

  const load2FAStatus = async () => {
    try {
      const data = await twoFactorApi.getStatus();
      setTwoFactorEnabled(data.two_factor_enabled);
    } catch (error) {
      console.error('Error loading 2FA status:', error);
    }
  };

  const start2FASetup = async () => {
    try {
      const data = await twoFactorApi.startSetup();
      const qrUrl = await twoFactorApi.getQrObjectUrl();
      setTwoFactorSetup(prev => ({
        ...prev,
        isSettingUp: true,
        secret: data.secret,
        qrCodeUrl: qrUrl,
        liveCode: '',
        liveCountdown: 30,
      }));
    } catch (error) {
      console.error('Error starting 2FA setup:', error);
      setError('Không thể bắt đầu thiết lập 2FA');
    }
  };

  const enable2FA = async () => {
    try {
      const data = await twoFactorApi.enable(twoFactorSetup.verificationCode);
      setTwoFactorSetup(prev => ({
        ...prev,
        backupCodes: data.backup_codes,
        showBackupCodes: true,
      }));
      setTwoFactorEnabled(true);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (error: any) {
      setError(error?.message || 'Mã xác thực không đúng');
    }
  };

  const disable2FA = async () => {
    try {
      await twoFactorApi.disable(twoFactorSetup.verificationCode);
      setTwoFactorEnabled(false);
        setTwoFactorSetup({
          isSettingUp: false,
          qrCodeUrl: '',
          secret: '',
          backupCodes: [],
          verificationCode: '',
          showBackupCodes: false,
          liveCode: '',
          liveCountdown: 30,
        });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      setError(error?.message || 'Mã xác thực không đúng');
    }
  };

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

              {/* 2FA Section */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-elderly-text flex items-center">
                      <KeyIcon className="h-5 w-5 mr-2 text-primary-600" />
                      Xác thực 2 bước (2FA)
                    </h3>
                    <p className="text-elderly-text-light text-sm">
                      Bảo mật tài khoản với mã xác thực từ ứng dụng
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${twoFactorEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                      {twoFactorEnabled ? 'Đã bật' : 'Chưa bật'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={twoFactorEnabled}
                        onChange={(e) => {
                          if (e.target.checked) {
                            start2FASetup();
                          } else {
                            setTwoFactorSetup(prev => ({ ...prev, verificationCode: '' }));
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                {/* 2FA Setup */}
                {twoFactorSetup.isSettingUp && !twoFactorEnabled && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-3">Thiết lập 2FA</h4>
                    
                    {/* QR Code */}
                    {twoFactorSetup.qrCodeUrl && (
                      <div className="text-center mb-4">
                        <p className="text-sm text-blue-700 mb-2">
                          Quét mã QR bằng ứng dụng xác thực:
                        </p>
                        <img 
                          src={twoFactorSetup.qrCodeUrl} 
                          alt="2FA QR Code" 
                          className="mx-auto border rounded-lg"
                          style={{ width: '200px', height: '200px' }}
                        />
                    <p className="text-xs text-blue-700 mt-2">
                      Mã QR sẽ làm mới sau {twoFactorSetup.liveCountdown % 30}s
                    </p>
                      </div>
                    )}

                    {/* Manual Secret */}
                    <div className="mb-4">
                      <p className="text-sm text-blue-700 mb-2">
                        Hoặc nhập mã thủ công:
                      </p>
                      <div className="bg-white p-3 rounded border font-mono text-sm break-all">
                        {twoFactorSetup.secret}
                      </div>
                    </div>

                    {/* Verification Code Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-blue-800 mb-2">
                        Nhập mã 6 số để xác thực:
                      </label>
                      <input
                        type="text"
                        value={twoFactorSetup.verificationCode}
                        onChange={(e) => setTwoFactorSetup(prev => ({
                          ...prev,
                          verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6)
                        }))}
                        className="form-input w-full text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                      {twoFactorSetup.secret && (
                        <div className="mt-2 text-center">
                          <p className="text-sm text-blue-700">
                            Mã hiện tại: <span className="font-mono text-lg">{twoFactorSetup.liveCode || '------'}</span>
                          </p>
                          <p className="text-xs text-blue-500">Tự động đổi sau {twoFactorSetup.liveCountdown}s</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={enable2FA}
                        disabled={twoFactorSetup.verificationCode.length !== 6}
                        className="btn btn-primary flex-1"
                      >
                        Bật 2FA
                      </button>
                      <button
                        onClick={() => setTwoFactorSetup(prev => ({ ...prev, isSettingUp: false }))}
                        className="btn btn-secondary"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                {/* Backup Codes */}
                {twoFactorSetup.showBackupCodes && twoFactorSetup.backupCodes.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-yellow-800 mb-2">
                          Mã dự phòng (Backup Codes)
                        </h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Lưu các mã này ở nơi an toàn. Chúng có thể được sử dụng để đăng nhập khi không có ứng dụng xác thực.
                        </p>
                        <div className="bg-white p-3 rounded border">
                          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                            {twoFactorSetup.backupCodes.map((code, index) => (
                              <div key={index} className="p-2 bg-gray-50 rounded text-center">
                                {code}
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => setTwoFactorSetup(prev => ({ ...prev, showBackupCodes: false }))}
                          className="mt-3 btn btn-secondary"
                        >
                          Đã lưu
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disable 2FA */}
                {twoFactorEnabled && !twoFactorSetup.isSettingUp && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <h4 className="font-medium text-red-800 mb-3">Tắt 2FA</h4>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-red-800 mb-2">
                        Nhập mã xác thực để tắt 2FA:
                      </label>
                      <input
                        type="text"
                        value={twoFactorSetup.verificationCode}
                        onChange={(e) => setTwoFactorSetup(prev => ({
                          ...prev,
                          verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6)
                        }))}
                        className="form-input w-full text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>
                    <button
                      onClick={disable2FA}
                      disabled={twoFactorSetup.verificationCode.length !== 6}
                      className="btn btn-danger"
                    >
                      Tắt 2FA
                    </button>
                  </div>
                )}
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
