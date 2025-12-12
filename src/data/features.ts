export interface Feature {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  iconColor: string;
  heroTitle: string;
  heroSubtitle: string;
  targetKeywords: string[];
  content: {
    introduction: string;
    howItWorks: {
      title: string;
      description: string;
    };
    benefits: {
      title: string;
      description: string;
    }[];
    technicalDetails: {
      title: string;
      items: string[];
    };
    useCases: string[];
    statistics: {
      stat: string;
      description: string;
    }[];
    cta: string;
  };
}

export const features: Feature[] = [
  {
    slug: "real-time-email-verification",
    title: "Real-Time Verification",
    metaTitle: "Real-Time Email Verification API | Instant Email Validation | MailVet",
    metaDescription: "Verify emails instantly with MailVet's real-time API. Get validation results in milliseconds. 99% accuracy, SMTP checks, syntax validation. Start free today.",
    icon: "Zap",
    iconColor: "amber",
    heroTitle: "Real-Time Email Verification That Never Slows You Down",
    heroSubtitle: "Validate email addresses instantly at the point of entry. Our lightning-fast API returns comprehensive verification results in under 500ms, ensuring your forms never keep users waiting.",
    targetKeywords: ["real-time email verification", "instant email validation", "email verification API", "live email checker", "MailVet real-time", "email validation speed"],
    content: {
      introduction: "In today's fast-paced digital environment, every millisecond counts. When users sign up for your service, subscribe to your newsletter, or create an account, they expect instant feedback. MailVet's real-time email verification API delivers comprehensive validation results in under 500 milliseconds, allowing you to verify emails at the exact moment they're entered without disrupting the user experience. Our distributed infrastructure handles millions of verifications daily while maintaining consistent sub-second response times.",
      howItWorks: {
        title: "How Real-Time Verification Works",
        description: "When an email is submitted, MailVet's API performs a multi-layer verification process in parallel. We validate syntax formatting, check DNS records for the domain, verify MX record configuration, perform SMTP handshake to confirm the mailbox exists, and run our proprietary algorithms to detect disposable addresses and spam traps—all in under 500ms. Results are returned in a structured JSON response with detailed status codes and risk assessments."
      },
      benefits: [
        {
          title: "Instant User Feedback",
          description: "Users receive immediate validation feedback, reducing form abandonment and improving conversion rates by up to 25%."
        },
        {
          title: "Prevent Invalid Data Entry",
          description: "Stop typos, fake emails, and invalid addresses before they enter your database, saving hours of cleanup later."
        },
        {
          title: "Seamless Integration",
          description: "RESTful API integrates with any platform in minutes. SDKs available for JavaScript, Python, PHP, Ruby, and more."
        },
        {
          title: "High Availability",
          description: "99.99% uptime SLA with global edge servers ensuring fast response times from anywhere in the world."
        }
      ],
      technicalDetails: {
        title: "Technical Specifications",
        items: [
          "Average response time: 200-500ms",
          "RESTful API with JSON responses",
          "HTTPS encryption for all requests",
          "Rate limits: 1-10 requests/second based on plan",
          "Webhook support for async verification",
          "Comprehensive error handling and status codes"
        ]
      },
      useCases: [
        "Registration and signup forms",
        "Newsletter subscription widgets",
        "Checkout email collection",
        "Lead generation forms",
        "Contact form validation"
      ],
      statistics: [
        { stat: "<500ms", description: "Average response time for real-time verification" },
        { stat: "99.99%", description: "API uptime guarantee with global redundancy" },
        { stat: "25%", description: "Increase in form conversion rates with instant validation" }
      ],
      cta: "Start validating emails in real-time today. Get 100 free credits and experience sub-second verification speeds."
    }
  },
  {
    slug: "bulk-email-verification",
    title: "Bulk List Verification",
    metaTitle: "Bulk Email Verification Service | Clean Email Lists Fast | MailVet",
    metaDescription: "Verify thousands of emails at once with MailVet's bulk verification. Upload CSV, get clean lists in minutes. 99% accuracy. Start your free trial.",
    icon: "FileSpreadsheet",
    iconColor: "violet",
    heroTitle: "Bulk Email Verification for Clean, Deliverable Lists",
    heroSubtitle: "Upload thousands of email addresses and receive a fully validated, segmented list within minutes. Our bulk verification service cleans your database efficiently while providing detailed reports on every address.",
    targetKeywords: ["bulk email verification", "email list cleaning", "mass email validation", "CSV email checker", "MailVet bulk", "email list verification service"],
    content: {
      introduction: "Marketing databases decay at a rate of 22-30% annually. Old addresses become invalid, people change jobs, and domains expire. Sending to these dead addresses damages your sender reputation and wastes marketing spend. MailVet's bulk email verification service processes lists of any size—from hundreds to millions of addresses—and delivers cleaned, segmented results that maximize your email deliverability. Upload once, download a pristine list ready for your next campaign.",
      howItWorks: {
        title: "How Bulk Verification Works",
        description: "Upload your email list via CSV, Excel, or direct integration. MailVet's distributed processing system validates each address through our comprehensive verification pipeline, checking syntax, domain validity, MX records, SMTP responses, and running advanced detection algorithms. Results are compiled into downloadable reports with emails categorized as valid, invalid, risky, or unknown. Processing speed scales with list size—expect 10,000 emails verified in under 5 minutes."
      },
      benefits: [
        {
          title: "Clean Lists Fast",
          description: "Process lists of any size with our scalable infrastructure. 100,000 emails verified in under an hour."
        },
        {
          title: "Detailed Segmentation",
          description: "Emails are categorized into valid, invalid, risky, catch-all, and role-based segments for targeted action."
        },
        {
          title: "Flexible Upload Options",
          description: "Upload CSV, Excel, TXT files or integrate directly via API for automated list processing."
        },
        {
          title: "Downloadable Reports",
          description: "Export clean lists and detailed verification reports in multiple formats for easy integration."
        }
      ],
      technicalDetails: {
        title: "Processing Capabilities",
        items: [
          "Supported formats: CSV, XLSX, XLS, TXT",
          "Maximum file size: 50MB (contact us for larger)",
          "Processing speed: ~10,000 emails per 5 minutes",
          "Column auto-detection for email fields",
          "Duplicate removal option included",
          "Export formats: CSV, Excel, JSON"
        ]
      },
      useCases: [
        "Cleaning legacy marketing databases",
        "Pre-campaign list validation",
        "CRM data hygiene maintenance",
        "Purchased list verification",
        "Annual database cleanup"
      ],
      statistics: [
        { stat: "30%", description: "Average invalid emails found in unverified lists" },
        { stat: "10K+", description: "Emails processed every 5 minutes" },
        { stat: "98%", description: "Reduction in bounce rates after bulk cleaning" }
      ],
      cta: "Clean your email list today. Upload your first list free and see how many invalid addresses are hiding in your database."
    }
  },
  {
    slug: "email-accuracy-verification",
    title: "99% Accuracy Guarantee",
    metaTitle: "99% Email Verification Accuracy | Multi-Layer Validation | MailVet",
    metaDescription: "MailVet delivers 99% verification accuracy with SMTP checks, MX validation, catch-all detection & more. Industry-leading precision. Try free.",
    icon: "Target",
    iconColor: "emerald",
    heroTitle: "99% Email Verification Accuracy You Can Trust",
    heroSubtitle: "Our multi-layer verification technology combines SMTP validation, MX record checks, disposable email detection, and proprietary algorithms to deliver the most accurate results in the industry.",
    targetKeywords: ["email verification accuracy", "accurate email validation", "SMTP email verification", "MX record validation", "MailVet accuracy", "reliable email checker"],
    content: {
      introduction: "Accuracy is everything in email verification. A false positive means a valid customer can't sign up. A false negative means invalid emails slip through and damage your sender reputation. MailVet's multi-layer verification engine combines six distinct validation methods to achieve 99% accuracy—the highest in the industry. We don't just check if an email looks valid; we verify that a real mailbox exists and can receive messages.",
      howItWorks: {
        title: "Multi-Layer Verification Process",
        description: "Every email passes through our comprehensive verification pipeline: 1) Syntax validation ensures proper email format, 2) DNS lookup confirms the domain exists and is active, 3) MX record verification checks mail server configuration, 4) SMTP handshake simulates email delivery to confirm mailbox existence, 5) Disposable email detection identifies temporary addresses, 6) Spam trap and honeypot detection protects your sender reputation. This multi-layer approach catches issues that single-check verifiers miss."
      },
      benefits: [
        {
          title: "SMTP-Level Verification",
          description: "We go beyond DNS checks to perform actual SMTP handshakes, confirming the mailbox exists and accepts mail."
        },
        {
          title: "Disposable Email Detection",
          description: "Our database of 100,000+ disposable email domains is updated daily to catch temporary addresses."
        },
        {
          title: "Catch-All Identification",
          description: "Domains configured to accept all emails are flagged, letting you make informed decisions about risky addresses."
        },
        {
          title: "Spam Trap Protection",
          description: "Proprietary algorithms identify known spam traps and honeypots that could blacklist your sending domain."
        }
      ],
      technicalDetails: {
        title: "Verification Layers",
        items: [
          "Layer 1: RFC 5322 syntax validation",
          "Layer 2: DNS A/AAAA record verification",
          "Layer 3: MX record lookup and priority check",
          "Layer 4: SMTP handshake and mailbox ping",
          "Layer 5: Disposable/temporary email detection",
          "Layer 6: Spam trap and role-based detection"
        ]
      },
      useCases: [
        "High-value lead validation",
        "Transaction email verification",
        "Account security verification",
        "B2B prospect validation",
        "Customer database maintenance"
      ],
      statistics: [
        { stat: "99%", description: "Verification accuracy rate across all email types" },
        { stat: "6", description: "Distinct verification layers for comprehensive checking" },
        { stat: "100K+", description: "Disposable email domains in our detection database" }
      ],
      cta: "Experience industry-leading accuracy. Verify your first 100 emails free and see the difference multi-layer verification makes."
    }
  },
  {
    slug: "disposable-email-detection",
    title: "Disposable Email Detection",
    metaTitle: "Disposable Email Detection API | Block Temp Emails | MailVet",
    metaDescription: "Block disposable and temporary emails with MailVet's detection API. 100K+ domains tracked. Prevent fake signups. Start free trial today.",
    icon: "ShieldAlert",
    iconColor: "rose",
    heroTitle: "Disposable Email Detection That Blocks Fake Signups",
    heroSubtitle: "Identify and block temporary email addresses used for trial abuse, spam signups, and fraud. Our continuously updated database tracks 100,000+ disposable email providers.",
    targetKeywords: ["disposable email detection", "temporary email blocker", "fake email detection", "burner email checker", "MailVet disposable", "temp mail detection"],
    content: {
      introduction: "Disposable email addresses are the bane of SaaS companies, e-commerce platforms, and any business offering free trials or accounts. Users create throwaway addresses from services like Guerrilla Mail, 10MinuteMail, and TempMail to abuse trials, claim multiple promotions, or hide their identity. MailVet's disposable email detection identifies these temporary addresses in real-time, protecting your business from abuse while ensuring legitimate users can sign up seamlessly.",
      howItWorks: {
        title: "How Disposable Detection Works",
        description: "MailVet maintains a continuously updated database of over 100,000 known disposable email domains and patterns. When an email is verified, we check against this database and use pattern-matching algorithms to identify new disposable services. Our system also detects alias patterns and subdomain tricks used to bypass simple blocklists. Detection is included in every verification—no separate API call needed."
      },
      benefits: [
        {
          title: "Prevent Trial Abuse",
          description: "Stop users from creating multiple free trials with disposable addresses. Protect your revenue and resources."
        },
        {
          title: "Block Promotion Fraud",
          description: "Prevent coupon and promotion abuse from users generating unlimited disposable emails."
        },
        {
          title: "Improve User Quality",
          description: "Users with real email addresses are more engaged, convert better, and have higher lifetime value."
        },
        {
          title: "Daily Database Updates",
          description: "Our database is updated daily with new disposable email providers as they emerge."
        }
      ],
      technicalDetails: {
        title: "Detection Capabilities",
        items: [
          "100,000+ known disposable domains",
          "Daily database updates",
          "Pattern matching for new services",
          "Subdomain and alias detection",
          "API-based providers detected",
          "Zero false positives on major providers"
        ]
      },
      useCases: [
        "SaaS free trial signups",
        "E-commerce account creation",
        "Contest and giveaway entries",
        "Forum and community registration",
        "Referral program protection"
      ],
      statistics: [
        { stat: "100K+", description: "Disposable email domains in our detection database" },
        { stat: "25%", description: "Of trial signups use disposable emails (industry average)" },
        { stat: "Daily", description: "Database updates to catch new disposable services" }
      ],
      cta: "Stop disposable email abuse today. Start your free trial and see how many temporary addresses are in your database."
    }
  },
  {
    slug: "developer-api",
    title: "Developer-Friendly API",
    metaTitle: "Email Verification API for Developers | REST API & SDKs | MailVet",
    metaDescription: "Integrate email verification in minutes with MailVet's RESTful API. SDKs for JavaScript, Python, PHP, Ruby. Comprehensive docs. Start building free.",
    icon: "Code",
    iconColor: "blue",
    heroTitle: "Developer-Friendly Email Verification API",
    heroSubtitle: "Integrate powerful email verification into your applications in minutes. RESTful API with comprehensive documentation, SDKs for popular languages, and webhook support for async workflows.",
    targetKeywords: ["email verification API", "email validation SDK", "developer email checker", "REST email API", "MailVet API", "email verification integration"],
    content: {
      introduction: "Building email verification into your application shouldn't require weeks of development. MailVet's RESTful API is designed by developers, for developers. Simple endpoints, predictable responses, comprehensive documentation, and SDKs for every major language mean you can go from signup to production in hours, not days. Whether you're building a simple contact form or a complex multi-tenant SaaS, our API scales with your needs.",
      howItWorks: {
        title: "Simple API, Powerful Results",
        description: "Make a single API call with an email address, receive a comprehensive JSON response with verification results, risk scores, and detailed status information. Authentication uses simple API keys with optional key rotation for enhanced security. Rate limits scale with your plan from 1 to 10 requests per second. Webhooks enable async verification for bulk operations without blocking your application."
      },
      benefits: [
        {
          title: "RESTful Design",
          description: "Standard HTTP methods, JSON responses, and predictable URL patterns make integration intuitive."
        },
        {
          title: "Official SDKs",
          description: "Native libraries for JavaScript/Node.js, Python, PHP, Ruby, Go, and Java with full TypeScript support."
        },
        {
          title: "Comprehensive Docs",
          description: "Interactive API reference, code examples, integration guides, and troubleshooting resources."
        },
        {
          title: "Webhook Support",
          description: "Receive verification results via webhook for async operations and bulk processing."
        }
      ],
      technicalDetails: {
        title: "API Specifications",
        items: [
          "Base URL: api.mailvet.com/v1",
          "Authentication: API key in header",
          "Response format: JSON",
          "Rate limits: 1-10 req/sec by plan",
          "Timeout: 30 seconds max",
          "SSL/TLS required for all requests"
        ]
      },
      useCases: [
        "Signup form integration",
        "CRM data enrichment",
        "Marketing automation workflows",
        "E-commerce checkout validation",
        "Lead scoring systems"
      ],
      statistics: [
        { stat: "5 min", description: "Average time to first successful API call" },
        { stat: "6+", description: "Official SDKs for major programming languages" },
        { stat: "99.99%", description: "API uptime SLA guarantee" }
      ],
      cta: "Start building with MailVet today. Get your API key and 100 free verification credits to test our endpoints."
    }
  },
  {
    slug: "gdpr-privacy-compliance",
    title: "GDPR & Privacy Compliance",
    metaTitle: "GDPR Compliant Email Verification | Data Privacy | MailVet",
    metaDescription: "MailVet is fully GDPR compliant. We never store email addresses. SOC 2 certified, data processed in-region. Verify emails with confidence.",
    icon: "Lock",
    iconColor: "cyan",
    heroTitle: "GDPR & Privacy Compliant Email Verification",
    heroSubtitle: "Verify emails with confidence knowing your data is protected. We never store email addresses, process data in compliance with global privacy regulations, and maintain SOC 2 Type II certification.",
    targetKeywords: ["GDPR email verification", "privacy compliant email checker", "secure email validation", "SOC 2 email verification", "MailVet privacy", "data protection email API"],
    content: {
      introduction: "In an era of increasing data privacy regulation, businesses need partners they can trust with sensitive customer information. MailVet is built with privacy at its core. We never store the email addresses you verify—data is processed in real-time and immediately discarded. Our infrastructure is SOC 2 Type II certified, GDPR compliant, and designed to meet the strictest data protection requirements of financial services, healthcare, and enterprise customers.",
      howItWorks: {
        title: "Privacy-First Architecture",
        description: "When you submit an email for verification, it's processed through our secure pipeline and the result is returned. The email address itself is never written to disk, logged in plain text, or retained after verification completes. Our distributed infrastructure processes requests in-region where possible, minimizing data transfer across jurisdictions. All API traffic is encrypted with TLS 1.3, and our key rotation service ensures your API credentials remain secure."
      },
      benefits: [
        {
          title: "Zero Data Retention",
          description: "Email addresses are never stored. Verification data is processed in memory and discarded immediately."
        },
        {
          title: "SOC 2 Type II Certified",
          description: "Our security controls are independently audited and certified to enterprise standards."
        },
        {
          title: "GDPR Compliant",
          description: "Full compliance with EU data protection regulations including data minimization and purpose limitation."
        },
        {
          title: "Regional Processing",
          description: "Data processed in-region where available, minimizing cross-border data transfers."
        }
      ],
      technicalDetails: {
        title: "Security & Compliance",
        items: [
          "SOC 2 Type II certified infrastructure",
          "GDPR and CCPA compliant",
          "TLS 1.3 encryption for all traffic",
          "No email address storage or logging",
          "API key rotation service available",
          "Regular third-party security audits"
        ]
      },
      useCases: [
        "Financial services compliance",
        "Healthcare HIPAA requirements",
        "Enterprise data governance",
        "EU customer verification",
        "Privacy-conscious businesses"
      ],
      statistics: [
        { stat: "0", description: "Email addresses stored after verification" },
        { stat: "SOC 2", description: "Type II certification for security controls" },
        { stat: "100%", description: "GDPR compliance for EU data processing" }
      ],
      cta: "Verify emails with confidence. MailVet's privacy-first architecture protects your data and your customers. Start your compliant verification today."
    }
  }
];
