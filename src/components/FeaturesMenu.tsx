import { Link } from "react-router-dom";
import { 
  Zap, 
  FileSpreadsheet, 
  Target, 
  ShieldAlert, 
  Code, 
  Lock,
  LucideIcon
} from "lucide-react";

interface FeaturesMenuProps {
  onItemClick?: () => void;
}

interface FeatureMenuItem {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
}

const featureItems: FeatureMenuItem[] = [
  {
    slug: "real-time-email-verification",
    title: "Real-Time Verification",
    description: "Instant email validation in under 500ms",
    icon: Zap,
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    hoverBg: "group-hover:bg-amber-500/20"
  },
  {
    slug: "bulk-email-verification",
    title: "Bulk List Verification",
    description: "Clean thousands of emails at once",
    icon: FileSpreadsheet,
    iconColor: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    hoverBg: "group-hover:bg-violet-500/20"
  },
  {
    slug: "email-accuracy-verification",
    title: "99% Accuracy Guarantee",
    description: "Multi-layer SMTP verification",
    icon: Target,
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    hoverBg: "group-hover:bg-emerald-500/20"
  },
  {
    slug: "disposable-email-detection",
    title: "Disposable Email Detection",
    description: "Block temp and fake emails",
    icon: ShieldAlert,
    iconColor: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    hoverBg: "group-hover:bg-rose-500/20"
  },
  {
    slug: "developer-api",
    title: "Developer-Friendly API",
    description: "RESTful API with SDKs",
    icon: Code,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    hoverBg: "group-hover:bg-blue-500/20"
  },
  {
    slug: "gdpr-privacy-compliance",
    title: "GDPR & Privacy Compliance",
    description: "SOC 2 certified, zero data retention",
    icon: Lock,
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    hoverBg: "group-hover:bg-cyan-500/20"
  }
];

export const FeaturesMenu = ({ onItemClick }: FeaturesMenuProps) => {
  return (
    <div className="w-[420px] p-4 bg-marketing-dark-panel border border-marketing-violet/20 rounded-xl shadow-2xl">
      <div className="grid gap-2">
        {featureItems.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.slug}
              to={`/features/${feature.slug}`}
              onClick={onItemClick}
              className="group flex items-start gap-4 p-3 rounded-xl hover:bg-marketing-violet/10 transition-all duration-200"
            >
              <div className={`w-10 h-10 rounded-lg ${feature.bgColor} ${feature.borderColor} border flex items-center justify-center flex-shrink-0 ${feature.hoverBg} transition-colors`}>
                <Icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>
              <div>
                <h4 className="font-semibold text-white group-hover:text-marketing-violet transition-colors">
                  {feature.title}
                </h4>
                <p className="text-sm text-marketing-text-secondary">
                  {feature.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
