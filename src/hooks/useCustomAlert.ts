import { useState } from 'react';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertConfig {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

export const useCustomAlert = () => {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = (title: string, message?: string, buttons?: AlertButton[]) => {
    setConfig({
      title,
      message,
      buttons: buttons || [{ text: 'OK', style: 'default' }],
    });
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  return {
    visible,
    config,
    showAlert,
    hideAlert,
  };
};
