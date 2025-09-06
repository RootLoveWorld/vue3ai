import React, { createContext, useContext, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  login: {
    title: 'Login',
    username: 'Username',
    password: 'Password',
    submit: 'Login',
    forgotPassword: 'Forgot Password?',
    register: 'Register',
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome to the Dashboard',
  },
  documents: {
    title: 'Documents',
    preview: 'Preview',
    upload: 'Upload Document',
  },
  users: {
    title: 'Users',
    addUser: 'Add User',
    editUser: 'Edit User',
    deleteUser: 'Delete User',
  },
  organizations: {
    title: 'Organizations',
    addOrg: 'Add Organization',
    editOrg: 'Edit Organization',
    deleteOrg: 'Delete Organization',
  },
  settings: {
    title: 'Settings',
    theme: 'Theme',
    language: 'Language',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
  },
};

// Chinese translations
const zhTranslations = {
  login: {
    title: '登录',
    username: '用户名',
    password: '密码',
    submit: '登录',
    forgotPassword: '忘记密码？',
    register: '注册',
  },
  dashboard: {
    title: '仪表板',
    welcome: '欢迎来到仪表板',
  },
  documents: {
    title: '文档',
    preview: '预览',
    upload: '上传文档',
  },
  users: {
    title: '用户',
    addUser: '添加用户',
    editUser: '编辑用户',
    deleteUser: '删除用户',
  },
  organizations: {
    title: '组织',
    addOrg: '添加组织',
    editOrg: '编辑组织',
    deleteOrg: '删除组织',
  },
  settings: {
    title: '设置',
    theme: '主题',
    language: '语言',
  },
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    search: '搜索',
  },
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    zh: { translation: zhTranslations },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

interface I18nContextType {
  language: string;
  changeLanguage: (lng: string) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = React.useState<string>('en');

  React.useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    i18n.changeLanguage(savedLanguage);
  }, []);

  const changeLanguage = (lng: string) => {
    setLanguage(lng);
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <I18nContext.Provider value={{ language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nextProvider');
  }
  return context;
};

export default i18n;