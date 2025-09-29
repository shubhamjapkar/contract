import axios, {type AxiosInstance, type AxiosResponse} from 'axios';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: 'https://backend.build.mugafi.com/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'Bt_DF-SZx88WGwDhGsJGN0GRwJTOsrSbiOwBQRaPNcA',
        'Cookie': 'csrftoken=Rea9cvRqud96DUTMnevkxkCU6Qi0KxBv; csrftoken=yDtm32BDwcojcTpsdLQXoRql02CEn1eU'
    }
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// API Response Structure
interface Investment {
    tier: string;
    quantity: number;
    tier_price: number;
    total_amount: number;
    nft_rarity: string;
    is_minted: boolean;
    investment_date: string;
}

interface ProjectInvestment {
    project_title: string;
    project_poster: string | null;
    investments: Investment[];
}

interface PortfolioSummary {
    total_projects: number;
    project_investments: Record<string, ProjectInvestment>;
}

export interface ApiResponse {
    status: number;
    message: string;
    data: {
        wallet_id: string;
        name: string;
        email: string;
        phone_number: string;
        address: string;
        invested_values: number;
        wallet_balance: number;
        total_portfolio_value: string | number;
        daily_accural: string | number;
        average_roi: string | number;
        investment_nft: string | number;
        maturing_soon: string | number;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        portfolio_summary: PortfolioSummary;
    };
}

// User Profile Response for component consumption
export interface UserProfileResponse {
    name?: string;
    wallet_id?: string;
    avatar?: string;
    total_portfolio_value?: number;
    daily_accrual?: number;
    average_roi?: number;
    total_nfts?: number;
    nft_breakdown?: {
        silver?: number;
        gold?: number;
        platinum?: number;
    };
    maturing_soon?: number;
    wallet_balance?: number;
}

// Dummy data fallback
const dummyProfileData = {
    "status": 0,
    "message": "Success",
    "data": {
        "wallet_id": "wallet_005_alice",
        "name": "Alice Smith",
        "email": "alice@example.com",
        "phone_number": "+1-555-987-6543",
        "address": "789 Pine Ave, Los Angeles, CA 90210",
        "invested_values": 1300.0,
        "wallet_balance": 13700.0,
        "total_portfolio_value": 15000.0,
        "daily_accural": 25.50,
        "average_roi": 12.5,
        "investment_nft": 5,
        "maturing_soon": 2,
        "is_active": true,
        "created_at": "2025-09-22T10:49:58.036372Z",
        "updated_at": "2025-09-22T11:16:51.777104Z",
        "portfolio_summary": {
            "total_projects": 1,
            "project_investments": {
                "PROJ_002_CYBER": {
                    "project_title": "Cyber Chronicles",
                    "project_poster": null,
                    "investments": [
                        {
                            "tier": "silver",
                            "quantity": 3,
                            "tier_price": 100.0,
                            "total_amount": 300.0,
                            "nft_rarity": "common",
                            "is_minted": false,
                            "investment_date": "2025-09-22T11:16:51.858402Z"
                        },
                        {
                            "tier": "gold",
                            "quantity": 2,
                            "tier_price": 500.0,
                            "total_amount": 1000.0,
                            "nft_rarity": "common",
                            "is_minted": false,
                            "investment_date": "2025-09-22T11:16:51.897816Z"
                        }
                    ]
                }
            }
        }
    }
};

// Helper function to calculate portfolio metrics from API data
const calculatePortfolioMetrics = (data: ApiResponse['data']) => {
    const {portfolio_summary} = data;
    let totalNFTs = 0;
    let silverCount = 0;
    let goldCount = 0;
    let platinumCount = 0;
    let totalPortfolioValue = 0;

    // Calculate from portfolio investments
    Object.values(portfolio_summary.project_investments).forEach(project => {
        project.investments.forEach(investment => {
            totalNFTs += investment.quantity;
            totalPortfolioValue += investment.total_amount;

            switch (investment.tier.toLowerCase()) {
                case 'silver':
                    silverCount += investment.quantity;
                    break;
                case 'gold':
                    goldCount += investment.quantity;
                    break;
                case 'platinum':
                    platinumCount += investment.quantity;
                    break;
            }
        });
    });

    return {
        totalNFTs,
        totalPortfolioValue,
        nftBreakdown: {
            silver: silverCount,
            gold: goldCount,
            platinum: platinumCount
        }
    };
};

export const apiHandler = {
    // Get user profile
    getUserProfile: async (walletId: string): Promise<UserProfileResponse> => {
        try {
            const response = await apiClient.get<ApiResponse>(
                `/launchpad/user-profile?wallet_id=${walletId}`
            );

            const apiData = response.data.data;
            const metrics = calculatePortfolioMetrics(apiData);

            return {
                name: apiData.name,
                wallet_id: apiData.wallet_id,
                avatar: "/api/placeholder/80/80",
                total_portfolio_value: metrics.totalPortfolioValue || Number(apiData.total_portfolio_value) || apiData.invested_values,
                daily_accrual: Number(apiData.daily_accural) || 0,
                average_roi: Number(apiData.average_roi) || 0,
                total_nfts: metrics.totalNFTs || Number(apiData.investment_nft) || 0,
                nft_breakdown: metrics.nftBreakdown,
                maturing_soon: Number(apiData.maturing_soon) || 0,
                wallet_balance: apiData.wallet_balance
            };
        } catch (error) {
            console.warn('API call failed, using dummy data:', error);
            // Return dummy data with mapped structure
            const metrics = calculatePortfolioMetrics(dummyProfileData.data as any);
            return {
                name: dummyProfileData.data.name,
                wallet_id: dummyProfileData.data.wallet_id,
                avatar: "/api/placeholder/80/80",
                total_portfolio_value: metrics.totalPortfolioValue,
                daily_accrual: dummyProfileData.data.daily_accural,
                average_roi: dummyProfileData.data.average_roi,
                total_nfts: metrics.totalNFTs,
                nft_breakdown: metrics.nftBreakdown,
                maturing_soon: dummyProfileData.data.maturing_soon,
                wallet_balance: dummyProfileData.data.wallet_balance
            };
        }
    },

    // Update user profile name
    updateUserName: async (walletId: string, name: string): Promise<UserProfileResponse> => {
        try {
            // First get current user data to preserve existing fields
            const currentData = await apiClient.get<ApiResponse>(
                `/launchpad/user-profile?wallet_id=${walletId}`
            );

            // Update with new name while preserving other fields
            const response = await apiClient.post<ApiResponse>(
                `/launchpad/edit-user-profile`,
                {
                    wallet_id: walletId,
                    name: name,
                    email: currentData.data.data.email,
                    phone_number: currentData.data.data.phone_number,
                    address: currentData.data.data.address
                }
            );

            const apiData = response.data.data;
            const metrics = calculatePortfolioMetrics(apiData);

            return {
                name: apiData.name,
                wallet_id: apiData.wallet_id,
                avatar: "/api/placeholder/80/80",
                total_portfolio_value: metrics.totalPortfolioValue || Number(apiData.total_portfolio_value) || apiData.invested_values,
                daily_accrual: Number(apiData.daily_accural) || 0,
                average_roi: Number(apiData.average_roi) || 0,
                total_nfts: metrics.totalNFTs || Number(apiData.investment_nft) || 0,
                nft_breakdown: metrics.nftBreakdown,
                maturing_soon: Number(apiData.maturing_soon) || 0,
                wallet_balance: apiData.wallet_balance
            };
        } catch (error) {
            console.warn('API call failed, using dummy data:', error);
            // Return updated dummy data
            const updatedDummy = { ...dummyProfileData };
            updatedDummy.data.name = name;
            const metrics = calculatePortfolioMetrics(updatedDummy.data as any);
            return {
                name: updatedDummy.data.name,
                wallet_id: updatedDummy.data.wallet_id,
                avatar: "/api/placeholder/80/80",
                total_portfolio_value: metrics.totalPortfolioValue,
                daily_accrual: updatedDummy.data.daily_accural,
                average_roi: updatedDummy.data.average_roi,
                total_nfts: metrics.totalNFTs,
                nft_breakdown: metrics.nftBreakdown,
                maturing_soon: updatedDummy.data.maturing_soon,
                wallet_balance: updatedDummy.data.wallet_balance
            };
        }
    },

    // Get NFT collections from portfolio data
    getNFTCollections: async (walletId: string) => {
        try {
            const response = await apiClient.get<ApiResponse>(
                `/launchpad/user-profile?wallet_id=${walletId}`
            );

            const portfolioSummary = response.data.data.portfolio_summary;
            const collections = Object.entries(portfolioSummary.project_investments).map(([projectId, project], index) => {
                let silver = 0, gold = 0, platinum = 0, totalInvested = 0;

                project.investments.forEach(investment => {
                    totalInvested += investment.total_amount;
                    switch (investment.tier.toLowerCase()) {
                        case 'silver':
                            silver += investment.quantity;
                            break;
                        case 'gold':
                            gold += investment.quantity;
                            break;
                        case 'platinum':
                            platinum += investment.quantity;
                            break;
                    }
                });

                const totalNFTs = silver + gold + platinum;
                const currentValue = totalInvested * 1.56; // Assume 56% growth
                const unrealisedGains = currentValue - totalInvested;
                const avgAPYRate = Math.floor((unrealisedGains / totalInvested) * 100);

                return {
                    id: projectId,
                    name: project.project_title,
                    category: "IP Film", // Default category
                    totalNFTs,
                    silver,
                    gold,
                    platinum,
                    nextMaturity: Math.floor(Math.random() * 100) + 30, // Random days 30-130
                    estimatedPayout: currentValue * 1.25, // 25% more than current value
                    totalInvested,
                    currentValue,
                    unrealisedGains,
                    avgAPYRate,
                    image: `../profile/tier${index}.png`
                };
            });

            return collections;
        } catch (error) {
            console.warn('API call failed, generating collections from dummy data:', error);

            // Generate from dummy data
            const portfolioSummary = dummyProfileData.data.portfolio_summary;
            return Object.entries(portfolioSummary.project_investments).map(([projectId, project], index) => {
                let silver = 0, gold = 0, platinum = 0, totalInvested = 0;

                project.investments.forEach(investment => {
                    totalInvested += investment.total_amount;
                    switch (investment.tier.toLowerCase()) {
                        case 'silver':
                            silver += investment.quantity;
                            break;
                        case 'gold':
                            gold += investment.quantity;
                            break;
                        case 'platinum':
                            platinum += investment.quantity;
                            break;
                    }
                });

                const totalNFTs = silver + gold + platinum;
                const currentValue = totalInvested * 1.56;
                const unrealisedGains = currentValue - totalInvested;
                const avgAPYRate = Math.floor((unrealisedGains / totalInvested) * 100);

                return {
                    id: projectId,
                    name: project.project_title,
                    category: "IP Film",
                    totalNFTs,
                    silver,
                    gold,
                    platinum,
                    nextMaturity: 89,
                    estimatedPayout: currentValue * 1.25,
                    totalInvested,
                    currentValue,
                    unrealisedGains,
                    avgAPYRate,
                    image: `../profile/tier${index}.png`
                };
            });
        }
    },

    // Get complete profile data (user profile + NFT collections) in single API call
    getCompleteProfileData: async (walletId: string) => {
        try {
            const response = await apiClient.get<ApiResponse>(
                `/launchpad/user-profile?wallet_id=${walletId}`
            );

            const apiData = response.data.data;
            const metrics = calculatePortfolioMetrics(apiData);

            // Generate user profile
            const userProfile = {
                name: apiData.name,
                wallet_id: apiData.wallet_id,
                avatar: "/api/placeholder/80/80",
                total_portfolio_value: metrics.totalPortfolioValue || Number(apiData.total_portfolio_value) || apiData.invested_values,
                daily_accrual: Number(apiData.daily_accural) || 0,
                average_roi: Number(apiData.average_roi) || 0,
                total_nfts: metrics.totalNFTs || Number(apiData.investment_nft) || 0,
                nft_breakdown: metrics.nftBreakdown,
                maturing_soon: Number(apiData.maturing_soon) || 0,
                wallet_balance: apiData.wallet_balance
            };

            // Generate NFT collections
            const portfolioSummary = apiData.portfolio_summary;
            const nftCollections = Object.entries(portfolioSummary.project_investments).map(([projectId, project], index) => {
                let silver = 0, gold = 0, platinum = 0, totalInvested = 0;

                project.investments.forEach(investment => {
                    totalInvested += investment.total_amount;
                    switch (investment.tier.toLowerCase()) {
                        case 'silver':
                            silver += investment.quantity;
                            break;
                        case 'gold':
                            gold += investment.quantity;
                            break;
                        case 'platinum':
                            platinum += investment.quantity;
                            break;
                    }
                });

                const totalNFTs = silver + gold + platinum;
                const currentValue = totalInvested * 1.56;
                const unrealisedGains = currentValue - totalInvested;
                const avgAPYRate = Math.floor((unrealisedGains / totalInvested) * 100);

                return {
                    id: projectId,
                    name: project.project_title,
                    category: "IP Film",
                    totalNFTs,
                    silver,
                    gold,
                    platinum,
                    nextMaturity: Math.floor(Math.random() * 100) + 30,
                    estimatedPayout: currentValue * 1.25,
                    totalInvested,
                    currentValue,
                    unrealisedGains,
                    avgAPYRate,
                    image: `../profile/tier${index}.png`
                };
            });

            return {
                userProfile,
                nftCollections
            };
        } catch (error) {
            console.warn('API call failed, using dummy data:', error);

            // Generate from dummy data
            const metrics = calculatePortfolioMetrics(dummyProfileData.data as any);

            const userProfile = {
                name: dummyProfileData.data.name,
                wallet_id: dummyProfileData.data.wallet_id,
                avatar: "/api/placeholder/80/80",
                total_portfolio_value: metrics.totalPortfolioValue,
                daily_accrual: dummyProfileData.data.daily_accural,
                average_roi: dummyProfileData.data.average_roi,
                total_nfts: metrics.totalNFTs,
                nft_breakdown: metrics.nftBreakdown,
                maturing_soon: dummyProfileData.data.maturing_soon,
                wallet_balance: dummyProfileData.data.wallet_balance
            };

            const portfolioSummary = dummyProfileData.data.portfolio_summary;
            const nftCollections = Object.entries(portfolioSummary.project_investments).map(([projectId, project], index) => {
                let silver = 0, gold = 0, platinum = 0, totalInvested = 0;

                project.investments.forEach(investment => {
                    totalInvested += investment.total_amount;
                    switch (investment.tier.toLowerCase()) {
                        case 'silver':
                            silver += investment.quantity;
                            break;
                        case 'gold':
                            gold += investment.quantity;
                            break;
                        case 'platinum':
                            platinum += investment.quantity;
                            break;
                    }
                });

                const totalNFTs = silver + gold + platinum;
                const currentValue = totalInvested * 1.56;
                const unrealisedGains = currentValue - totalInvested;
                const avgAPYRate = Math.floor((unrealisedGains / totalInvested) * 100);

                return {
                    id: projectId,
                    name: project.project_title,
                    category: "IP Film",
                    totalNFTs,
                    silver,
                    gold,
                    platinum,
                    nextMaturity: 89,
                    estimatedPayout: currentValue * 1.25,
                    totalInvested,
                    currentValue,
                    unrealisedGains,
                    avgAPYRate,
                    image: `../profile/tier${index}.png`
                };
            });

            return {
                userProfile,
                nftCollections
            };
        }
    },

    // Check if user exists in database
    checkUserExists: async (walletId: string): Promise<boolean> => {
        try {
            const response = await apiClient.get<ApiResponse>(
                `/launchpad/user-profile?wallet_id=${walletId}`
            );
            return response.status === 200;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return false; // User not found
            }
            console.error('Error checking user existence:', error);
            return false;
        }
    },

    // Create new user
    createUser: async (walletId: string, balanceSymbol?: string, displayBalance?: string): Promise<boolean> => {
        try {
            const response = await apiClient.post(
                `/launchpad/create-user`,
                {
                    wallet_id: walletId,
                    wallet_unit: balanceSymbol,
                    wallet_balance: displayBalance || '0'
                }
            );
            console.log('✅ User created successfully:', response.data);
            return true;
        } catch (error) {
            console.error('❌ Error creating user:', error);
            return false;
        }
    }
};

export default apiHandler;