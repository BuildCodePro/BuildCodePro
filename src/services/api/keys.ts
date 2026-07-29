export const QUERY_KEYS = {
    AUTH: {
        USER: ['auth', 'user'],
        PROFILE: ['auth', 'profile'],
        ME: ['auth', 'me'],
        SESSIONS: (params?: Record<string, unknown>) =>
            params ? ['auth', 'sessions', params] : ['auth', 'sessions'],
    },
    INVITE_USER: {
        SEND_INVITE: ['invite-user', 'send'],
        ACCEPT_INVITE: ['invite-user', 'accept'],
        RESEND_INVITE: ['invite-user', 'resend'],
        REVOKE_INVITE: ['invite-user', 'revoke'],
    },
    TEAM: {
        STATS: ['team', 'stats'],
        MEMBERS: (params?: Record<string, unknown>) => params ? ['team', 'members', params] : ['team', 'members'],
        GET_ENGINEERS: ['user', 'engineers']
    },
    DASHBOARD: {
        STATS: ["dashboard", "stats"] as const,
    },
    PROJECTS: {
        LIST: (params?: Record<string, unknown>) => params ? ['projects', 'list', params] : ['projects', 'list'],
        DETAIL: (projectId: string) => ['projects', 'detail', projectId],
        SEND_FOR_REVIEW: (projectId: string) => ['projects', projectId, 'send-for-review'] as const,


        DRAWINGS: {
            LIST: (projectId: string) => ['projects', projectId, 'drawings', 'list'] as const,
            DETAIL: (projectId: string, drawingId: string) =>
                ['projects', projectId, 'drawings', 'detail', drawingId] as const,
        },
        ANALYSIS: {
            START: (projectId: string) => ['projects', projectId, 'analysis', 'start'] as const,
            CANCEL: (projectId: string, jobId: string) => ['projects', projectId, jobId, 'analysis', 'cancel'] as const,
            RETRY: (projectId: string, jobId: string) => ['projects', projectId, jobId, 'analysis', 'retry'] as const,
            RESULT: (projectId: string) => ['projects', projectId, 'analysis', 'result'] as const,
            COMPLIANCE: (projectId: string) => ['projects', projectId, 'analysis', 'compliance'] as const,
            NARRATIVE: (projectId: string) => ['projects', projectId, 'analysis', 'narrative'] as const,
        },
        BOM: {
            GET: (projectId: string) => ["projects", projectId, "bom"] as const,
        },

        EXPORTS: {
            PREVIEW: (projectId: string) => ["projects", projectId, "exports", "preview"] as const,
            LIST: (projectId: string, params?: Record<string, unknown>) =>
                params
                    ? ["projects", projectId, "exports", "list", params] as const
                    : ["projects", projectId, "exports", "list"] as const,
            CREATE: (projectId: string) => ["projects", projectId, "exports", "create"] as const,
        },

        REVIEW: {
            GET: (projectId: string) => ["projects", projectId, "review"] as const,
            ACTIVITY: (projectId: string, params?: Record<string, unknown>) =>
                params
                    ? ["projects", projectId, "review", "activity", params] as const
                    : ["projects", projectId, "review", "activity"] as const,
            SUBMIT_DECISION: (projectId: string) => ["projects", projectId, "review", "decision"] as const,
            UPDATE_NOTES: (projectId: string) => ["projects", projectId, "review", "notes"] as const,
            UPDATE_PERMIT_CHECKLIST: (projectId: string) => ["projects", projectId, "review", "permit-checklist"] as const,
            MARK_PERMIT_READY: (projectId: string) => ["projects", projectId, "review", "permit-ready"] as const,
        },

    },
    SUPPORT: {
        TICKETS: {
            LIST: (params?: Record<string, unknown>) =>
                ["support", "tickets", "list", params] as const,
            DETAIL: (ticketId: string) =>
                ["support", "tickets", "detail", ticketId] as const,
        },
    },

    ADMIN: {
        DASHBOARD_STATS: ['admin', 'dashboard-stats'] as const,
        COMPANIES: (params?: Record<string, unknown>) =>
            ['admin', 'companies', params ?? {}] as const,
        USERS: (params?: Record<string, unknown>) =>
            ['admin', 'users', params ?? {}] as const,
        ACTIVITY: (params?: Record<string, unknown>) =>
            ['admin', 'activity', params ?? {}] as const,

        SUPPORT: {
            ARTICLES: (params?: {
                page?: number;
                page_size?: number;
                category?: string;
                is_published?: boolean;
                search?: string;
            }) => ['admin', 'support', 'articles', params ?? {}] as const,
            ARTICLE_DETAIL: (articleId: string) =>
                ['admin', 'support', 'articles', articleId] as const,
            STATS: () => ["admin", "support", "stats"] as const,
            TICKETS: {
                LIST: (params?: Record<string, unknown>) =>
                    ["admin", "support", "tickets", "list", params] as const,
                DETAIL: (ticketId: string) =>
                    ["admin", "support", "tickets", "detail", ticketId] as const,
            },
        },
    },
    BILLING: {
        PLANS: ['billing', 'plans'] as const,
        SUBSCRIPTION: ['billing', 'subscription'] as const,
    },
    PROFILE: {
        ME: ['profile', 'me'] as const,
    },

    NOTIFICATIONS: {
        LIST: (params?: { page?: number; page_size?: number }) =>
            ['notifications', params ?? {}] as const,
    },

    ADMIN_SUBSCRIPTIONS: {
        STATS: ['admin', 'subscriptions', 'stats'] as const,
        LIST: (params?: Record<string, unknown>) =>
            ['admin', 'subscriptions', params ?? {}] as const,
        INVOICES: (params?: { page?: number; page_size?: number }) =>
            ['admin', 'subscriptions', 'invoices', params ?? {}] as const,
    },
    USER_INVOICE: {
        INVOICES_USER: (params?: { page?: number; page_size?: number }) =>
            ['user', 'billing', 'invoices', params ?? {}] as const,
    }
} as const;