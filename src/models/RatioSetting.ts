export interface RatioSetting {
  id: string;
  needsRatio: number; // 0.5 for 50%
  wantsRatio: number; // 0.3 for 30%
  savingsRatio: number; // 0.2 for 20%
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRatioSettingRequest {
  needsRatio: number;
  wantsRatio: number;
  savingsRatio: number;
}

export interface UpdateRatioSettingRequest {
  id: string;
  needsRatio?: number;
  wantsRatio?: number;
  savingsRatio?: number;
  isActive?: boolean;
}

// Default 50/30/20 rule
export const DEFAULT_RATIOS: RatioSetting = {
  id: 'default',
  needsRatio: 0.5,
  wantsRatio: 0.3,
  savingsRatio: 0.2,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface DistributionResult {
  needs: {
    passbookId: string;
    passbookName: string;
    passbookColor: string;
    amount: number;
  };
  wants: {
    passbookId: string;
    passbookName: string;
    passbookColor: string;
    amount: number;
  };
  savings: {
    passbookId: string;
    passbookName: string;
    passbookColor: string;
    amount: number;
  };
}
