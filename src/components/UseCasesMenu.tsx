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
  { slug: "ecommerce-retail", title: "E-commerce & Retail", icon: ShoppingCart },
  { slug: "saas-tech", title: "SaaS & Tech", icon: Code2 },
  { slug: "recruitment-hr", title: "Recruitment & HR", icon: Users },
  { slug: "finance-banking", title: "Finance & Banking", icon: Building },
  { slug: "healthcare-telemedicine", title: "Healthcare", icon: Heart },
  { slug: "education-elearning", title: "Education", icon: GraduationCap },
  { slug: "nonprofits-fundraising", title: "Non-profits", icon: Gift },
  { slug: "government-public-sector", title: "Government", icon: Building2 },
  { slug: "insurance-risk", title: "Insurance", icon: Shield },
  { slug: "real-estate", title: "Real Estate", icon: Home },
  { slug: "travel-hospitality", title: "Travel & Hospitality", icon: Plane },
  { slug: "events-webinars", title: "Events & Webinars", icon: Calendar },
  { slug: "marketing-agencies", title: "Marketing Agencies", icon: Megaphone },
  { slug: "crm-data-hygiene", title: "CRM & Data Hygiene", icon: Database },
  { slug: "b2b-sales-lead-gen", title: "B2B Sales", icon: TrendingUp },
  { slug: "app-product-onboarding", title: "App Onboarding", icon: Smartphone },
  { slug: "subscription-membership", title: "Subscriptions", icon: CreditCard },
  { slug: "customer-support", title: "Customer Support", icon: MessageSquare },
  { slug: "media-publishing", title: "Media & Publishing", icon: Newspaper },
  { slug: "social-networks", title: "Social Networks", icon: Share2 },
  { slug: "gaming-entertainment", title: "Gaming", icon: Gamepad2 },
  { slug: "logistics-shipping", title: "Logistics", icon: Truck },
  { slug: "manufacturing", title: "Manufacturing", icon: Factory },
  { slug: "professional-services", title: "Professional Services", icon: Briefcase },
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
    <div className="grid grid-cols-3 gap-2 p-4 min-w-[600px]">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-1">
          {column.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.slug}
                to={`/use-cases/${item.slug}`}
                onClick={onItemClick}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <IconComponent className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
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
