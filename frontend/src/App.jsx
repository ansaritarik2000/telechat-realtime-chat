import React, { useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import { Suspense, lazy } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Login Auth
import LoginAuth from "./pages/Auth/Login.jsx";

// Components
import Layout from "./Layout.jsx";
import HomeIndex from "./pages/Home/HomeIndex.jsx";
import PhonebookIndex from "./pages/Phonebook/Index.jsx";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { Toaster } from "react-hot-toast";
import IPInfo from "ip-info-react";
import { ToastProvider as HeroUIToast } from "@heroui/toast";
import { NuqsAdapter } from "nuqs/adapters/react";

// Lazy-loaded Components
const SMSDash = lazy(() => import("./pages/SMS/Dashboard/SMSDash.jsx"));
const SendSMSPage = lazy(() => import("./pages/SMS/SendSMS/Page.jsx"));
const SMSReportsPage = lazy(() => import("./pages/SMS/Reports/Page.jsx"));
const SMSDetailedReport = lazy(() =>
    import("./pages/SMS/Reports/DetailedReport/ReportIndex.jsx")
);

// RCS
const RCSDashPage = lazy(() => import("./pages/RCS/Dashboard/Page.jsx"));
const SendRCSPage = lazy(() => import("./pages/RCS/SendRCS/Page.jsx"));
const RCSReportsPage = lazy(() => import("./pages/RCS/Reports/Page.jsx"));
const RCSDetailedReport = lazy(() =>
    import("./pages/RCS/Reports/DetailedReport/ReportIndex.jsx")
);

// WhatsApp
const WhatsAppDashPage = lazy(() => import("./pages/WhatsApp/Page.jsx"));
const SendWhatsAppIndex = lazy(() =>
    import("./pages/WhatsApp/SendWhatsApp/Index.jsx")
);
const WhatsAppReportsPage = lazy(() =>
    import("./pages/WhatsApp/Reports/Page.jsx")
);

const WhatsAppDetailedReport = lazy(() =>
    import("./pages/WhatsApp/Reports/DetailedReport/ReportIndex.jsx")
);

const LaunchCampaignIndex = lazy(() =>
    import("./pages/WhatsApp/SendWhatsApp/PageBody/Campaign/LaunchIndex.jsx")
);

const TeleApps = lazy(() => import("./pages/TeleApps/Page.jsx"));
// Flow
const FlowIndex = lazy(() => import("./pages/TeleApps/FlowBuilder/Index.jsx"));
const ChatFlowIndex = lazy(() =>
    import("./pages/TeleApps/ChatFlow/ChatMeetIndex.jsx")
);
const FlowCardsIndex = lazy(() =>
    import("./pages/TeleApps/FlowBuilder/FlowCards/Index.jsx")
);

const FlowAnalytics = lazy(() =>
    import("./pages/TeleApps/FlowBuilder/FlowCards/Analytics.jsx")
);

// Email
const EmailBuilder = lazy(() => import("./pages/Email/Builder/Index.jsx"));
const EmailDashPage = lazy(() => import("./pages/Email/Page.jsx"));
const EmailTemplateIndex = lazy(() =>
    import("./pages/Email/CreateTemplate/Index.jsx")
);
const EmailReportsPage = lazy(() => import("./pages/Email/Reports/Page.jsx"));
const EmailDetailedReport = lazy(() =>
    import("./pages/Email/Reports/DetailedReport/ReportIndex.jsx")
);

const TemplatePage = lazy(() => import("./pages/TemplateApproval/Page.jsx"));

// Support
const SupportPage = lazy(() => import("./pages/SupportTicket/Page.jsx"));

// TeleCredits
const TeleCreditsPage = lazy(() => import("./pages/TeleCredits/Page.jsx"));

// Profile Menu
const ProfilePage = lazy(() => import("./pages/Profile/Page.jsx"));
const SubAccountsPage = lazy(() => import("./pages/SubAccounts/Page.jsx"));

const JitsiMeetComponent = lazy(() =>
    import("./pages/TeleApps/ChatFlow/Meeting/JitsiMeet.jsx")
);

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    const navigate = useNavigate();

    return (
        <HeroUIProvider
            navigate={navigate}
            className={`text-foreground bg-background`}
            locale="en-US"
        >
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <NuqsAdapter>
                    <IPInfo>
                        <Toaster position="top-center" reverseOrder={false} />
                        <HeroUIToast placement="top-right" />
                        <Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <PrivateRoute>
                                            <Layout />
                                        </PrivateRoute>
                                    }
                                >
                                    <Route path="" element={<HomeIndex />} />
                                    {/* SMS Routes */}
                                    <Route
                                        path="/smsdash"
                                        element={<SMSDash />}
                                    />
                                    <Route
                                        path="/sendsms"
                                        element={<SendSMSPage />}
                                    />
                                    <Route
                                        path="/smsreports"
                                        element={<SMSReportsPage />}
                                    />
                                    <Route
                                        path="/smsdetailedreport"
                                        element={<SMSDetailedReport />}
                                    />

                                    {/* RCS Routes */}
                                    <Route
                                        path="/rcsdash"
                                        element={<RCSDashPage />}
                                    />
                                    <Route
                                        path="/sendrcs"
                                        element={<SendRCSPage />}
                                    />
                                    <Route
                                        path="/rcsreports"
                                        element={<RCSReportsPage />}
                                    />
                                    <Route
                                        path="/rcsdetailedreport"
                                        element={<RCSDetailedReport />}
                                    />

                                    {/* WhatsApp */}
                                    <Route
                                        path="/whatsappdash"
                                        element={<WhatsAppDashPage />}
                                    />
                                    <Route
                                        path="/sendwhatsapp"
                                        element={<SendWhatsAppIndex />}
                                    />
                                    <Route
                                        path="/launchwacampaign"
                                        element={<LaunchCampaignIndex />}
                                    />
                                    <Route
                                        path="/wareports"
                                        element={<WhatsAppReportsPage />}
                                    />
                                    <Route
                                        path="/wadetailedreport"
                                        element={<WhatsAppDetailedReport />}
                                    />

                                    {/* TeleApps */}
                                    <Route
                                        path="/teleapps"
                                        element={<TeleApps />}
                                    />
                                    <Route
                                        path="/telechatnmeet"
                                        element={<ChatFlowIndex />}
                                    />

                                    {/* Flow */}
                                    <Route
                                        path="/flowbuilder"
                                        element={<FlowIndex />}
                                    />
                                    <Route
                                        path="/flowcards"
                                        element={<FlowCardsIndex />}
                                    />
                                    <Route
                                        path="/flowanalytics"
                                        element={<FlowAnalytics />}
                                    />

                                    {/* Phonebook */}
                                    <Route
                                        path="/phonebook"
                                        element={<PhonebookIndex />}
                                    />

                                    {/* Email */}
                                    <Route
                                        path="/emaildash"
                                        element={<EmailDashPage />}
                                    />
                                    <Route
                                        path="/sendemail"
                                        element={<EmailTemplateIndex />}
                                    />
                                    <Route
                                        path="/emailreports"
                                        element={<EmailReportsPage />}
                                    />
                                    <Route
                                        path="/emaildetailedreports"
                                        element={<EmailDetailedReport />}
                                    />

                                    {/* Template App */}
                                    <Route
                                        path="/tempapproval"
                                        element={<TemplatePage />}
                                    />

                                    {/* Sidebar Footer */}
                                    <Route
                                        path="/telecredits"
                                        element={<TeleCreditsPage />}
                                    />
                                    <Route
                                        path="/support"
                                        element={<SupportPage />}
                                    />

                                    {/* Nav DropDown */}
                                    <Route
                                        path="/profile"
                                        element={<ProfilePage />}
                                    />
                                    <Route
                                        path="/subaccounts"
                                        element={<SubAccountsPage />}
                                    />

                                    {/* Edit Route */}
                                    {/* <Route path="/edit" element={<EditPage />} /> */}
                                </Route>

                                {/* Email Editor */}

                                <Route
                                    path="/golive"
                                    element={<JitsiMeetComponent />}
                                />
                                <Route
                                    path="/emailbuilder"
                                    element={<EmailBuilder />}
                                />

                                {/* Login Auth */}
                                <Route path="/login" element={<LoginAuth />} />
                            </Routes>
                        </Suspense>
                    </IPInfo>
                </NuqsAdapter>
            </QueryClientProvider>
        </HeroUIProvider>
    );
}

export default App;
