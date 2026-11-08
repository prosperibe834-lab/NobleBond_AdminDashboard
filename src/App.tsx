import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./theme/ThemeContext";
import { AdminLayout } from "./layouts/AdminLayout";

// 14 Admin Pages
import { DashboardPage } from "./pages/DashboardPage";
import { UserManagementPage } from "./pages/UserManagementPage";
import { ProfileManagementPage } from "./pages/ProfileManagementPage";
import { LikesMatchesPage } from "./pages/LikesMatchesPage";
import { ChatManagementPage } from "./pages/ChatManagementPage";
import { LiveManagementPage } from "./pages/LiveManagementPage";
import { ReportsModerationPage } from "./pages/ReportsModerationPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SubscriptionManagementPage } from "./pages/SubscriptionManagementPage";
import { WalletManagementPage } from "./pages/WalletManagementPage";
import { ReferralManagementPage } from "./pages/ReferralManagementPage";
import { CustomerSupportPage } from "./pages/CustomerSupportPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { SystemSettingsPage } from "./pages/SystemSettingsPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            {/* 1. Dashboard */}
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />

            {/* 2. User Management */}
            <Route path="users" element={<UserManagementPage />} />

            {/* 3. Profile Management */}
            <Route path="profiles" element={<ProfileManagementPage />} />

            {/* 4. Likes & Matches */}
            <Route path="matches" element={<LikesMatchesPage />} />

            {/* 5. Chat Management */}
            <Route path="chats" element={<ChatManagementPage />} />

            {/* 6. Live Management */}
            <Route path="live" element={<LiveManagementPage />} />

            {/* 7. Reports & Moderation */}
            <Route path="moderation" element={<ReportsModerationPage />} />

            {/* 8. Notifications */}
            <Route path="notifications" element={<NotificationsPage />} />

            {/* 9. Subscription Management */}
            <Route path="subscriptions" element={<SubscriptionManagementPage />} />

            {/* 10. Wallet Management */}
            <Route path="wallet" element={<WalletManagementPage />} />

            {/* 11. Referral Management */}
            <Route path="referrals" element={<ReferralManagementPage />} />

            {/* 12. Customer Support */}
            <Route path="support" element={<CustomerSupportPage />} />

            {/* 13. Analytics */}
            <Route path="analytics" element={<AnalyticsPage />} />

            {/* 14. System Settings */}
            <Route path="settings" element={<SystemSettingsPage />} />

            {/* Catch-all fallback redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
