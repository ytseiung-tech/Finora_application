import React from 'react';

interface AppBackgroundProps {
  children: React.ReactNode;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({ children }) => {
  // 暫時簡化，直接返回子組件
  // TODO: 未來實現背景主題功能時，需要創建 BackgroundTheme 模型
  return <>{children}</>;
};
