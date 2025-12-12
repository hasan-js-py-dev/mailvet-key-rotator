import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Code2, 
  Users, 
  Building, 
  Heart, 
  GraduationCap,
  Building2,
  Shield,
  Home,
  Plane,
  Calendar,
  Megaphone,
  Database,
  TrendingUp,
  Smartphone,
  CreditCard,
  MessageSquare,
  Newspaper,
  Share2,
  Gamepad2,
  Truck,
  Factory,
  Briefcase,
  Gift
} from "lucide-react";

const useCaseItems = [
  { slug: "ecommerce-retail", title: "E-commerce & Retail", icon: ShoppingCart, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", hoverBg: "hover:bg-amber-400/15" },
  { slug: "saas-tech", title: "SaaS & Tech", icon: Code2, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", hoverBg: "hover:bg-violet-400/15" },
  { slug: "recruitment-hr", title: "Recruitment & HR", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", hoverBg: "hover:bg-blue-400/15" },
  { slug: "finance-banking", title: "Finance & Banking", icon: Building, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", hoverBg: "hover:bg-emerald-400/15" },
  { slug: "healthcare-telemedicine", title: "Healthcare", icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", hoverBg: "hover:bg-rose-400/15" },
  { slug: "education-elearning", title: "Education", icon: GraduationCap, color: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20", hoverBg: "hover:bg-indigo-400/15" },
  { slug: "nonprofits-fundraising", title: "Non-profits", icon: Gift, color: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20", hoverBg: "hover:bg-pink-400/15" },
  { slug: "government-public-sector", title: "Government", icon: Building2, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20", hoverBg: "hover:bg-slate-400/15" },
  { slug: "insurance-risk", title: "Insurance", icon: Shield, color: "text-teal-400", bg: "bg-teal-400/10", border: "border-teal-400/20", hoverBg: "hover:bg-teal-400/15" },
  { slug: "real-estate", title: "Real Estate", icon: Home, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", hoverBg: "hover:bg-orange-400/15" },
  { slug: "travel-hospitality", title: "Travel & Hospitality", icon: Plane, color: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20", hoverBg: "hover:bg-sky-400/15" },
  { slug: "events-webinars", title: "Events & Webinars", icon: Calendar, color: "text-fuchsia-400", bg: "bg-fuchsia-400/10", border: "border-fuchsia-400/20", hoverBg: "hover:bg-fuchsia-400/15" },
  { slug: "marketing-agencies", title: "Marketing Agencies", icon: Megaphone, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", hoverBg: "hover:bg-red-400/15" },
  { slug: "crm-data-hygiene", title: "CRM & Data Hygiene", icon: Database, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20", hoverBg: "hover:bg-cyan-400/15" },
  { slug: "b2b-sales-lead-gen", title: "B2B Sales", icon: TrendingUp, color: "text-lime-400", bg: "bg-lime-400/10", border: "border-lime-400/20", hoverBg: "hover:bg-lime-400/15" },
  { slug: "app-product-onboarding", title: "App Onboarding", icon: Smartphone, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", hoverBg: "hover:bg-purple-400/15" },
  { slug: "subscription-membership", title: "Subscriptions", icon: CreditCard, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", hoverBg: "hover:bg-yellow-400/15" },
  { slug: "customer-support", title: "Customer Support", icon: MessageSquare, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", hoverBg: "hover:bg-green-400/15" },
  { slug: "media-publishing", title: "Media & Publishing", icon: Newspaper, color: "text-stone-400", bg: "bg-stone-400/10", border: "border-stone-400/20", hoverBg: "hover:bg-stone-400/15" },
  { slug: "social-networks", title: "Social Networks", icon: Share2, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", hoverBg: "hover:bg-blue-500/15" },
  { slug: "gaming-entertainment", title: "Gaming", icon: Gamepad2, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20", hoverBg: "hover:bg-violet-500/15" },
  { slug: "logistics-shipping", title: "Logistics", icon: Truck, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", hoverBg: "hover:bg-amber-500/15" },
  { slug: "manufacturing", title: "Manufacturing", icon: Factory, color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20", hoverBg: "hover:bg-zinc-400/15" },
  { slug: "professional-services", title: "Professional Services", icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", hoverBg: "hover:bg-indigo-500/15" },
];

interface UseCasesMenuProps {
  onItemClick?: () => void;
}

export const UseCasesMenu = ({ onItemClick }: UseCasesMenuProps) => {
  // Split into 3 columns
  const columns = [
    useCaseItems.slice(0, 8),
    useCaseItems.slice(8, 16),
    useCaseItems.slice(16, 24),
  ];

  return (
    <div className="grid grid-cols-3 gap-2 p-4 min-w-[600px] bg-card border border-border rounded-xl shadow-xl">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-1">
          {column.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.slug}
                to={`/use-cases/${item.slug}`}
                onClick={onItemClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${item.hoverBg} transition-all duration-200 group`}
              >
                <div className={`w-8 h-8 rounded-lg ${item.bg} border ${item.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className={`text-sm font-medium text-foreground group-hover:${item.color} transition-colors`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};
