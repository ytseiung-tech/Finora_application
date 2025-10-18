import AsyncStorage from '@react-native-async-storage/async-storage';
import { Passbook, Transaction, RatioSetting } from '../models';

const STORAGE_KEYS = {
  PASSBOOKS: 'passbooks',
  TRANSACTIONS: 'transactions',
  RATIO_SETTINGS: 'ratio_settings',
};

export class DataService {
  // Passbook operations
  static async getPassbooks(): Promise<Passbook[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PASSBOOKS);
      if (!data) return this.getDefaultPassbooks();
      const passbooks = JSON.parse(data) as Passbook[];
      // Manually convert date strings to Date objects
      return passbooks.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting passbooks:', error);
      return this.getDefaultPassbooks();
    }
  }

  static async savePassbooks(passbooks: Passbook[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PASSBOOKS, JSON.stringify(passbooks));
    } catch (error) {
      console.error('Error saving passbooks:', error);
    }
  }

  static async createPassbook(name: string, color: string): Promise<Passbook> {
    try {
      const passbooks = await this.getPassbooks();
      const newPassbook: Passbook = {
        id: Date.now().toString(),
        name,
        color,
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      passbooks.push(newPassbook);
      await this.savePassbooks(passbooks);
      return newPassbook;
    } catch (error) {
      console.error('Error creating passbook:', error);
      throw error;
    }
  }

  static async updatePassbook(id: string, updates: { name?: string; color?: string; isActive?: boolean; ratio?: number; balance?: number }): Promise<void> {
    try {
      const passbooks = await this.getPassbooks();
      const index = passbooks.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Passbook not found');
      
      passbooks[index] = {
        ...passbooks[index],
        ...updates,
        updatedAt: new Date(),
      };
      await this.savePassbooks(passbooks);
    } catch (error) {
      console.error('Error updating passbook:', error);
      throw error;
    }
  }

  static async deletePassbook(id: string): Promise<void> {
    try {
      const passbooks = await this.getPassbooks();
      const filtered = passbooks.filter(p => p.id !== id);
      
      // Also need to handle transactions associated with this passbook
      const transactions = await this.getTransactions();
      const filteredTransactions = transactions.filter(t => t.passbookId !== id);
      
      await this.savePassbooks(filtered);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filteredTransactions));
    } catch (error) {
      console.error('Error deleting passbook:', error);
      throw error;
    }
  }

  // Transaction operations
  static async getTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!data) return [];
      const transactions = JSON.parse(data) as Transaction[];
      // Manually convert date strings to Date objects
      return transactions.map(t => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  static async saveTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      transactions.push(transaction);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }

  static async updateTransaction(transactionId: string, updates: { amount?: number; description?: string; passbookId?: string }): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const transactionIndex = transactions.findIndex(t => t.id === transactionId);
      
      if (transactionIndex === -1) {
        throw new Error('Transaction not found');
      }
      
      const oldTransaction = transactions[transactionIndex];
      const passbooks = await this.getPassbooks();
      
      // Handle passbook change or amount change
      const passbookChanged = updates.passbookId && updates.passbookId !== oldTransaction.passbookId;
      const amountChanged = updates.amount !== undefined && updates.amount !== oldTransaction.amount;
      
      if (passbookChanged || amountChanged) {
        // If passbook changed, revert from old passbook and apply to new
        if (passbookChanged) {
          // Revert old passbook
          const oldPassbook = passbooks.find(p => p.id === oldTransaction.passbookId);
          if (oldPassbook) {
            if (oldTransaction.isIncome) {
              oldPassbook.balance -= oldTransaction.amount;
            } else {
              oldPassbook.balance += oldTransaction.amount;
            }
            oldPassbook.updatedAt = new Date();
          }
          
          // Apply to new passbook
          const newPassbook = passbooks.find(p => p.id === updates.passbookId);
          if (newPassbook) {
            const newAmount = updates.amount ?? oldTransaction.amount;
            if (oldTransaction.isIncome) {
              newPassbook.balance += newAmount;
            } else {
              newPassbook.balance -= newAmount;
            }
            newPassbook.updatedAt = new Date();
          }
        } else if (amountChanged) {
          // Only amount changed, update same passbook
          const passbook = passbooks.find(p => p.id === oldTransaction.passbookId);
          if (passbook) {
            // Reverse old amount
            if (oldTransaction.isIncome) {
              passbook.balance -= oldTransaction.amount;
            } else {
              passbook.balance += oldTransaction.amount;
            }
            
            // Apply new amount
            if (oldTransaction.isIncome) {
              passbook.balance += updates.amount!;
            } else {
              passbook.balance -= updates.amount!;
            }
            
            passbook.updatedAt = new Date();
          }
        }
        
        await AsyncStorage.setItem(STORAGE_KEYS.PASSBOOKS, JSON.stringify(passbooks));
      }
      
      // Update transaction
      transactions[transactionIndex] = {
        ...oldTransaction,
        amount: updates.amount ?? oldTransaction.amount,
        description: updates.description ?? oldTransaction.description,
        passbookId: updates.passbookId ?? oldTransaction.passbookId,
        updatedAt: new Date(),
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  static async deleteTransaction(transactionId: string): Promise<void> {
    try {
      const transactions = await this.getTransactions();
      const transactionToDelete = transactions.find(t => t.id === transactionId);
      
      if (transactionToDelete) {
        // Update passbook balance
        const passbooks = await this.getPassbooks();
        const passbook = passbooks.find(p => p.id === transactionToDelete.passbookId);
        
        if (passbook) {
          // Reverse the transaction effect on balance
          if (transactionToDelete.isIncome) {
            passbook.balance -= transactionToDelete.amount;
          } else {
            passbook.balance += transactionToDelete.amount;
          }
          passbook.updatedAt = new Date();
          
          // Save updated passbooks
          await AsyncStorage.setItem(STORAGE_KEYS.PASSBOOKS, JSON.stringify(passbooks));
        }
      }
      
      // Delete the transaction
      const filtered = transactions.filter(t => t.id !== transactionId);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Ratio settings operations
  static async getRatioSettings(): Promise<RatioSetting> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RATIO_SETTINGS);
      if (!data) return this.getDefaultRatioSettings();
      const settings = JSON.parse(data) as RatioSetting;
      // Manually convert date strings to Date objects
      return {
        ...settings,
        createdAt: new Date(settings.createdAt),
        updatedAt: new Date(settings.updatedAt),
      };
    } catch (error) {
      console.error('Error getting ratio settings:', error);
      return this.getDefaultRatioSettings();
    }
  }

  static async saveRatioSettings(settings: RatioSetting): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RATIO_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving ratio settings:', error);
    }
  }

  // Default data
  private static getDefaultPassbooks(): Passbook[] {
    return [
      {
        id: '1',
        name: 'Needs',
        color: '#7B68EE',
        balance: 2500.00,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Wants',
        color: '#87A96B',
        balance: 1500.00,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Savings',
        color: '#E6D690',
        balance: 1000.00,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  private static getDefaultRatioSettings(): RatioSetting {
    return {
      id: 'default',
      needsRatio: 0.5,
      wantsRatio: 0.3,
      savingsRatio: 0.2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      // Clear transactions and ratio settings
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.RATIO_SETTINGS,
      ]);
      
      // Reset all passbook balances to 0
      const passbooks = await this.getPassbooks();
      const resetPassbooks = passbooks.map(pb => ({
        ...pb,
        balance: 0,
        updatedAt: new Date(),
      }));
      await this.savePassbooks(resetPassbooks);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}
