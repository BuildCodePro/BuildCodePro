import type { ComplianceResults } from "@/types/new-design";

export const MOCK_COMPLIANCE_RESULTS: ComplianceResults = {
  score: 91,
  reviewCount: 3,
  statusLabel: "Mostly Passing",
  sections: [
    {
      id: "device-placement",
      title: "Device Placement",
      items: [
        {
          id: "smoke-spacing",
          label:
            "Smoke detector coverage meets NFPA 72 spacing requirements",
          status: "pass",
        },
        {
          id: "pull-stations",
          label: "Manual pull stations within 5 ft of exits",
          status: "pass",
        },
        {
          id: "required-areas",
          label: "Smoke detectors installed in all required areas",
          status: "pass",
        },
        {
          id: "mechanical-rooms",
          label: "Detector placement in mechanical rooms reviewed",
          status: "review_needed",
        },
      ],
    },
    {
      id: "notification-coverage",
      title: "Notification Coverage",
      items: [
        {
          id: "horn-strobe-db",
          label: "Horn/strobe dB levels meet 15dB above ambient",
          status: "pass",
        },
        {
          id: "visual-candela",
          label: "Visual notification devices meet candela requirements",
          status: "pass",
        },
        {
          id: "speaker-coverage",
          label: "Speaker coverage in corridors adequate",
          status: "concern",
        },
      ],
    },
    {
      id: "control-panel",
      title: "Control Panel",
      items: [
        {
          id: "facp-location",
          label: "FACP location accessible to fire department",
          status: "pass",
        },
        {
          id: "backup-power",
          label: "Backup power 24-hour standby + 5-minute alarm",
          status: "pass",
        },
        {
          id: "annunciator",
          label: "Remote annunciator placement reviewed",
          status: "concern",
        },
      ],
    },
  ],
};

export const COMPLIANCE_DISCLAIMER = {
  title: "Important Disclaimer",
  description:
    "AI recommendations are for estimation and bidding support only. Final approval must be reviewed by a licensed professional engineer.",
};
