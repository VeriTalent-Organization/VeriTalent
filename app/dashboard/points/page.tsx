"use client";

import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, ShoppingCart, History } from 'lucide-react';
import { Transaction, TokenPackage } from '@/types/dashboard';
import { tokensService } from '@/lib/services/tokensService';

const AIPointsPage = () => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balance, historyResponse] = await Promise.all([
          tokensService.getBalance(),
          tokensService.getHistory()
        ]);
        console.log('[AIPoints] Balance response:', balance);
        console.log('[AIPoints] History response:', historyResponse);
        // Extract balance from nested data structure
        const balanceAmount = balance?.data?.totalAvailable || balance?.data?.personal || balance?.balance || 0;
        setCurrentPoints(balanceAmount);
        // Extract transactions array from nested data.transactions
        const transactionsArray = historyResponse?.data?.transactions || historyResponse?.transactions || [];
        // Map history to Transaction format
        setTransactions(transactionsArray.map((item: any) => ({
          id: item._id || item.id,
          type: item.type as 'usage' | 'purchase' | 'bonus',
          description: item.description,
          amount: item.amount,
          date: new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          status: 'completed' as const // Backend doesn't provide status, default to completed
        })));
      } catch (error) {
        console.error('Failed to fetch token data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchase = async (bundleId: string, tokens: number) => {
    setPurchasing(bundleId);
    try {
      console.log('[AIPoints] Purchasing bundle:', bundleId, 'tokens:', tokens);
      // Backend expects the token amount (500, 1000, 5000) as the bundle value
      const result = await tokensService.purchase({ bundle: tokens });
      console.log('[AIPoints] Purchase result:', result);
      
      // Refresh balance after successful purchase
      const newBalance = await tokensService.getBalance();
      console.log('[AIPoints] New balance response:', newBalance);
      const balanceAmount = newBalance?.data?.totalAvailable || newBalance?.data?.personal || newBalance?.balance || 0;
      setCurrentPoints(balanceAmount);
      
      // Refresh transaction history
      const newHistoryResponse = await tokensService.getHistory();
      const transactionsArray = newHistoryResponse?.data?.transactions || newHistoryResponse?.transactions || [];
      setTransactions(transactionsArray.map((item: any) => ({
        id: item._id || item.id,
        type: item.type as 'usage' | 'purchase' | 'bonus',
        description: item.description,
        amount: item.amount,
        date: new Date(item.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        status: 'completed' as const
      })));
      
      // Notify sidebar and other components to refresh balance
      window.dispatchEvent(new Event('tokenBalanceUpdated'));
      
      alert(`Successfully purchased ${tokens.toLocaleString()} tokens!`);
    } catch (error: unknown) {
      console.error('[AIPoints] Purchase failed:', error);
      
      // Extract detailed error information
      let errorMessage = 'Failed to purchase tokens. Please try again.';
      
      if (error && typeof error === 'object') {
        // Check if it's an Axios error with response
        if ('response' in error) {
          const axiosError = error as { 
            response?: { 
              data?: { 
                message?: string | string[]; 
                error?: string;
                statusCode?: number;
              }; 
              status?: number 
            } 
          };
          
          console.log('[AIPoints] Error response:', axiosError.response);
          
          const backendMessage = axiosError.response?.data?.message;
          const backendError = axiosError.response?.data?.error;
          
          // Handle message as array or string
          if (Array.isArray(backendMessage)) {
            errorMessage = backendMessage.join(', ');
          } else if (backendMessage) {
            errorMessage = backendMessage;
          } else if (backendError) {
            errorMessage = backendError;
          }
        }
        
        // Check if error has a message property
        if ('message' in error && typeof error.message === 'string') {
          console.log('[AIPoints] Error message:', error.message);
        }
      }
      
      alert(errorMessage);
    } finally {
      setPurchasing(null);
    }
  };

  const purchaseOptions: TokenPackage[] = [
    {
      id: 'bundle1',
      name: 'Starter Bundle',
      tokens: 500,
      price: 40,
      originalPrice: 50,
      popular: false
    },
    {
      id: 'bundle2',
      name: 'Professional Bundle',
      tokens: 1000,
      price: 70,
      originalPrice: 100,
      popular: true
    },
    {
      id: 'bundle3',
      name: 'Enterprise Bundle',
      tokens: 5000,
      price: 300,
      originalPrice: 400,
      popular: false
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'usage':
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'purchase':
        return <ShoppingCart className="w-5 h-5 text-green-500" />;
      case 'bonus':
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      default:
        return <History className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">Loading points...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Points</h1>
          <p className="text-gray-600">Manage your AI screening tokens and view usage history</p>
        </div>

        {/* Current Balance Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Current Balance</h2>
              <p className="text-gray-600">Available AI tokens for screening</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-brand-primary mb-1">{currentPoints.toLocaleString()}</div>
              <p className="text-sm text-gray-500">tokens remaining</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction History */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
              <p className="text-gray-600">Recent token usage and purchases</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-semibold ${getAmountColor(transaction.amount)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-brand-primary hover:text-brand-primary/80 font-medium">
                View All Transactions
              </button>
            </div>
          </div>

          {/* Purchase Options */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Purchase Tokens</h2>
              <p className="text-gray-600">Buy more tokens to continue screening</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {purchaseOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`relative border rounded-lg p-4 transition-colors ${
                      option.popular
                        ? 'border-brand-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.popular && (
                      <div className="absolute -top-2 left-4 bg-brand-primary text-white text-xs px-2 py-1 rounded">
                        Most Popular
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{option.name}</h3>
                      <div className="text-right">
                        <div className="text-lg font-bold text-brand-primary">${option.price}</div>
                        <div className="text-sm text-gray-500 line-through">${option.originalPrice}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{option.tokens.toLocaleString()} tokens</p>
                    <button
                      onClick={() => handlePurchase(option.id, option.tokens)}
                      disabled={purchasing === option.id}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        option.popular
                          ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {purchasing === option.id ? 'Processing...' : 'Purchase Now'}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                All purchases are processed securely. Tokens are added instantly to your account.
              </p>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Token Usage</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• 4 tokens per applicant screening</li>
            <li>• Tokens are deducted only for completed screenings</li>
            <li>• Unused tokens don&apos;t expire</li>
            <li>• Enterprise plans include monthly token allocations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIPointsPage;
