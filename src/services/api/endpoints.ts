export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        VERIFY_EMAIL: '/auth/verify-email',
        RESEND_VERIFICATION: '/auth/resend-verification',
        LOGIN: '/auth/login',
        VERIFY_OTP: '/auth/verify-otp',
        RESEND_OTP: '/auth/resend-otp',
        REFRESH: '/auth/refresh',
        SESSIONS: '/auth/sessions',
        DELETE_SESSION: (sessionId: string) => `/auth/sessions/${sessionId}`,
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },
    INVITE_USER: {
        SEND_INVITE: '/user/invites',
        ACCEPT_INVITE: '/user/invites/accept',
        RESEND_INVITE: (inviteId: string) => `/user/invites/${inviteId}/resend`,
        REVOKE_INVITE: (inviteId: string) => `/user/invites/${inviteId}`,
    },
    TEAM: {
        STATS: '/user/team/stats',
        MEMBERS: '/user/team/members',
        UPDATE_MEMBER: (userId: string) => `/user/team/members/${userId}`,
        DEACTIVATE_MEMBER: (userId: string) => `/user/team/members/${userId}/deactivate`,
        ACTIVATE_MEMBER: (userId: string) => `/user/team/members/${userId}/activate`,
    },
    DASHBOARD: {
        STATS: '/dashboard/stats',
    },
    PROJECTS: {
        CREATE_PROJECT: '/projects',
        GET_PROJECTS: '/projects',
        GET_SINGLE_PROJECT: (projectId: string) => `/projects/${projectId}`,
        UPDATE_PROJECT: (projectId: string) => `/projects/${projectId}`,
        DELETE_PROJECT: (projectId: string) => `/projects/${projectId}`,

        DRAWINGS: {
            UPLOAD_DRAWING: (projectId: string) => `/projects/${projectId}/drawings`,
            GET_DRAWINGS: (projectId: string) => `/projects/${projectId}/drawings`,
            GET_SINGLE_DRAWING: (projectId: string, drawingId: string) =>
                `/projects/${projectId}/drawings/${drawingId}`,
            DELETE_DRAWING: (projectId: string, drawingId: string) =>
                `/projects/${projectId}/drawings/${drawingId}`,
        },
        ANALYSIS: {
            START: (projectId: string) => `/projects/${projectId}/analysis/start`,
            CANCEL: (projectId: string, jobId: string) => `/projects/${projectId}/analysis/jobs/${jobId}/cancel`,
            RETRY: (projectId: string, jobId: string) => `/projects/${projectId}/analysis/jobs/${jobId}/retry`,
            RESULT: (projectId: string) => `/projects/${projectId}/analysis/result`,
            COMPLIANCE: (projectId: string) => `/projects/${projectId}/analysis/compliance-checklist`,
            COMPLIANCE_REGENERATE: (projectId: string) => `/projects/${projectId}/analysis/compliance-checklist/regenerate`,
            NARRATIVE: (projectId: string) => `/projects/${projectId}/analysis/design-narrative`,
            NARRATIVE_REGENERATE: (projectId: string) => `/projects/${projectId}/analysis/design-narrative/regenerate`,
        },
        BOM: {
            GET: (projectId: string) => `/projects/${projectId}/bom`,
        },

        EXPORTS: {
            PREVIEW: (projectId: string) => `/projects/${projectId}/exports/preview`,
            CREATE: (projectId: string) => `/projects/${projectId}/exports`,
            LIST: (projectId: string) => `/projects/${projectId}/exports`,
        },

        REVIEW: {
            GET: (projectId: string) => `/projects/${projectId}/review`,
            ACTIVITY: (projectId: string) => `/projects/${projectId}/review/activity`,
            SUBMIT_DECISION: (projectId: string) => `/projects/${projectId}/review`,
            UPDATE_NOTES: (projectId: string) => `/projects/${projectId}/review/notes`,
            UPDATE_PERMIT_CHECKLIST: (projectId: string) => `/projects/${projectId}/review/permit-checklist`,
            MARK_PERMIT_READY: (projectId: string) => `/projects/${projectId}/review/permit-ready`,
        },


    },
    SUPPORT: {
        TICKETS: {
            CREATE: () => `/support/tickets`,
            LIST: () => `/support/tickets`,
            GET: (ticketId: string) => `/support/tickets/${ticketId}`,
            ADD_COMMENT: (ticketId: string) =>
                `/support/tickets/${ticketId}/comments`,
        },
    },

    ADMIN: {
        DASHBOARD_STATS: '/admin/dashboard/stats',
        COMPANIES: '/admin/companies',
        UPDATE_COMPANY_STATUS: (companyId: string) => `/admin/companies/${companyId}/status`,
        USERS: '/admin/users',
        ACTIVITY: '/admin/activity',

        SUPPORT: {
            ARTICLES: '/admin/support/articles',
            ARTICLE_DETAIL: (articleId: string) => `/admin/support/articles/${articleId}`,
            STATS: () => `/admin/support/stats`,
            TICKETS: {
                LIST: () => `/admin/support/tickets`,
                GET: (ticketId: string) => `/admin/support/tickets/${ticketId}`,
                UPDATE: (ticketId: string) =>
                    `/admin/support/tickets/${ticketId}`,
                ADD_COMMENT: (ticketId: string) =>
                    `/admin/support/tickets/${ticketId}/comments`,
            },
        },
    },
    BILLING: {
        PLANS: '/billing/plans',
        SUBSCRIPTION: '/billing/subscription',
        CHECKOUT: '/billing/checkout',
        PORTAL: '/billing/portal',
    },
    PROFILE: {
        UPDATE: '/auth/me',
        UPLOAD_AVATAR: '/auth/me/avatar',
        REQUEST_EMAIL_CHANGE: '/auth/me/email-change',
        VERIFY_EMAIL_CHANGE: '/auth/verify-email-change',
        CHANGE_PASSWORD: '/auth/change-password',
    },

    NOTIFICATIONS: {
        LIST: '/notifications',
        MARK_READ: '/notifications/read',
        MARK_ALL_READ: '/notifications/read-all',
    },

    ADMIN_SUBSCRIPTIONS: {
        STATS: '/admin/subscriptions/stats',
        LIST: '/admin/subscriptions',
        INVOICES: '/admin/subscriptions/invoices',
        INVOICE_PDF: (invoiceId: string) =>
            `/admin/subscriptions/invoices/${invoiceId}/pdf`,
    },
    USER_INVOICE: {
        INVOICES_USER: '/billing/invoices',
        INVOICE_PDF: (invoiceId: string) =>
            `/billing/invoices/${invoiceId}/pdf`,
    }
} as const;