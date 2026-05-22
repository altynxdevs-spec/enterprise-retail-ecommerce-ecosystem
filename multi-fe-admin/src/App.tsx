import { useMemo, useState, type ComponentType, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Edit3,
  Eye,
  EyeOff,
  Factory,
  FileText,
  Globe2,
  KeyRound,
  Layers3,
  LayoutDashboard,
  LayoutGrid,
  Lock,
  LogOut,
  Mail,
  Menu,
  MoreVertical,
  Package,
  Phone,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import adminLoginHero from "./assets/images/auth/admin-login-hero.png";
import selectedFabricImage from "./assets/images/orders/selected-fabric-summer-lawn.png";
import selectedTemplateImage from "./assets/images/orders/selected-template-long-shirt.png";
import lawnPremiumImage from "./assets/images/fabrics/lawn_premium.png";
import cottonCambricImage from "./assets/images/fabrics/cotton_cambric.png";
import linenSlubImage from "./assets/images/fabrics/linen_slub.png";
import khaddarEmbroideredImage from "./assets/images/fabrics/khaddar_embroidered.png";
import silkSatinImage from "./assets/images/fabrics/silk_satin.png";
import chiffonPrintedImage from "./assets/images/fabrics/chiffon_printed.png";
import velvetPlainImage from "./assets/images/fabrics/velvet_plain.png";
import cambricPrintedImage from "./assets/images/fabrics/cambric_printed.png";
import roundNeckTemplateImage from "./assets/images/templates/round_neck.png";
import vNeckTemplateImage from "./assets/images/templates/v_neck.png";
import boatNeckTemplateImage from "./assets/images/templates/boat_neck.png";
import fullSleevesTemplateImage from "./assets/images/templates/full_sleeves.png";
import halfSleevesTemplateImage from "./assets/images/templates/half_sleeves.png";
import ankleLengthTemplateImage from "./assets/images/templates/ankle_length.png";
import aboveKneeTemplateImage from "./assets/images/templates/above_knee.png";
import flaredHemTemplateImage from "./assets/images/templates/flared_hem.png";
import qrCode01 from "./assets/images/qr/qr_code_01.png";
import qrCode02 from "./assets/images/qr/qr_code_02.png";
import qrCode03 from "./assets/images/qr/qr_code_03.png";
import qrCode04 from "./assets/images/qr/qr_code_04.png";
import qrCode05 from "./assets/images/qr/qr_code_05.png";
import qrCode06 from "./assets/images/qr/qr_code_06.png";

type IconType = ComponentType<{ className?: string }>;

type AuthView = "login" | "forgot" | "verify" | "reset" | "success";
type RecoveryMethod = "email" | "phone";

type NavKey =
  | "Dashboard"
  | "Orders"
  | "Users"
  | "Roles"
  | "Shops"
  | "QR Codes"
  | "Fabrics"
  | "Templates"
  | "Style Options"
  | "Reports"
  | "Settings";

type UserRole =
  | "Owner"
  | "Super Admin"
  | "Admin"
  | "Catalog Manager"
  | "Store Manager"
  | "Production User"
  | "QC User"
  | "Fulfillment User"
  | "Sales Associate"
  | "Viewer";

type UserStatus = "Active" | "Inactive" | "Pending";

type ShopName =
  | "All Shops"
  | "New York Flagship"
  | "Los Angeles Studio"
  | "Chicago Studio"
  | "Dallas Boutique"
  | "Miami Boutique"
  | "Seattle Studio";

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedShop: ShopName;
  status: UserStatus;
  lastLogin: string;
};


type ShopSyncStatus = "Synced" | "Pending" | "Error";

type ShopRecord = {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
  status: ShopSyncStatus;
  managerName: string;
  managerEmail: string;
  qrCodes: number;
  activeQrCodes: number;
  lastSync: string;
};

const prototypeCode = "246810";

const roles: UserRole[] = [
  "Super Admin",
  "Admin",
  "Catalog Manager",
  "Store Manager",
  "Production User",
  "QC User",
  "Fulfillment User",
  "Sales Associate",
  "Viewer",
];

const shopOptions: ShopName[] = [
  "All Shops",
  "New York Flagship",
  "Los Angeles Studio",
  "Chicago Studio",
  "Dallas Boutique",
  "Miami Boutique",
  "Seattle Studio",
];

const navItems: { label: NavKey; icon: IconType }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingBag },
  { label: "Users", icon: Users },
  { label: "Roles", icon: ShieldCheck },
  { label: "Shops", icon: Store },
  { label: "QR Codes", icon: QrCode },
  { label: "Fabrics", icon: Layers3 },
  { label: "Style Options", icon: Sparkles },
  { label: "Reports", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const initialUsers: StaffUser[] = [
  {
    id: "USR-001",
    name: "Admin User",
    email: "admin@multife.com",
    role: "Super Admin",
    assignedShop: "All Shops",
    status: "Active",
    lastLogin: "May 7, 2025 10:24 AM",
  },
  {
    id: "USR-002",
    name: "Emily Carter",
    email: "emily.carter@multife.com",
    role: "Admin",
    assignedShop: "New York Flagship",
    status: "Active",
    lastLogin: "May 7, 2025 09:58 AM",
  },
  {
    id: "USR-003",
    name: "Michael Brooks",
    email: "michael.brooks@multife.com",
    role: "Catalog Manager",
    assignedShop: "Los Angeles Studio",
    status: "Active",
    lastLogin: "May 6, 2025 06:15 PM",
  },
  {
    id: "USR-004",
    name: "Jessica Miller",
    email: "jessica.miller@multife.com",
    role: "Store Manager",
    assignedShop: "Chicago Studio",
    status: "Active",
    lastLogin: "May 6, 2025 03:40 PM",
  },
  {
    id: "USR-005",
    name: "Olivia Parker",
    email: "olivia.parker@multife.com",
    role: "Sales Associate",
    assignedShop: "Dallas Boutique",
    status: "Active",
    lastLogin: "May 6, 2025 11:22 AM",
  },
  {
    id: "USR-006",
    name: "Rachel Adams",
    email: "rachel.adams@multife.com",
    role: "Production User",
    assignedShop: "Miami Boutique",
    status: "Inactive",
    lastLogin: "May 5, 2025 04:18 PM",
  },
  {
    id: "USR-007",
    name: "Daniel Reed",
    email: "daniel.reed@multife.com",
    role: "QC User",
    assignedShop: "New York Flagship",
    status: "Active",
    lastLogin: "May 7, 2025 09:07 AM",
  },
  {
    id: "USR-008",
    name: "Sophia Bennett",
    email: "sophia.bennett@multife.com",
    role: "Viewer",
    assignedShop: "Los Angeles Studio",
    status: "Active",
    lastLogin: "May 4, 2025 02:33 PM",
  },
];

const initialShops: ShopRecord[] = [
  {
    id: "SHP-001",
    name: "New York Flagship",
    slug: "new-york-flagship",
    city: "New York",
    province: "New York",
    status: "Synced",
    managerName: "Emma Johnson",
    managerEmail: "emma.johnson@multife.com",
    qrCodes: 152,
    activeQrCodes: 152,
    lastSync: "May 7, 2025 10:24 AM",
  },
  {
    id: "SHP-002",
    name: "Los Angeles Studio",
    slug: "los-angeles-studio",
    city: "Los Angeles",
    province: "California",
    status: "Synced",
    managerName: "Ava Williams",
    managerEmail: "ava.williams@multife.com",
    qrCodes: 98,
    activeQrCodes: 98,
    lastSync: "May 7, 2025 09:58 AM",
  },
  {
    id: "SHP-003",
    name: "Chicago Studio",
    slug: "chicago-studio",
    city: "Chicago",
    province: "Illinois",
    status: "Synced",
    managerName: "Noah Davis",
    managerEmail: "noah.davis@multife.com",
    qrCodes: 87,
    activeQrCodes: 87,
    lastSync: "May 6, 2025 06:30 PM",
  },
  {
    id: "SHP-004",
    name: "Dallas Boutique",
    slug: "dallas-boutique",
    city: "Dallas",
    province: "Texas",
    status: "Pending",
    managerName: "Mia Thompson",
    managerEmail: "mia.thompson@multife.com",
    qrCodes: 63,
    activeQrCodes: 63,
    lastSync: "May 6, 2025 03:12 PM",
  },
  {
    id: "SHP-005",
    name: "Miami Boutique",
    slug: "miami-boutique",
    city: "Miami",
    province: "Florida",
    status: "Synced",
    managerName: "Ethan Wilson",
    managerEmail: "ethan.wilson@multife.com",
    qrCodes: 71,
    activeQrCodes: 71,
    lastSync: "May 6, 2025 11:45 AM",
  },
  {
    id: "SHP-006",
    name: "Seattle Studio",
    slug: "seattle-studio",
    city: "Seattle",
    province: "Washington",
    status: "Error",
    managerName: "Lucas Brown",
    managerEmail: "lucas.brown@multife.com",
    qrCodes: 0,
    activeQrCodes: 0,
    lastSync: "May 5, 2025 08:15 AM",
  },
];


const permissionColumns: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "Orders", label: "Orders", icon: ShoppingBag },
  { key: "Users", label: "Users", icon: Users },
  { key: "Shops", label: "Shops", icon: Store },
  { key: "QR Codes", label: "QR Codes", icon: QrCode },
  { key: "Fabrics", label: "Fabrics", icon: Layers3 },
  { key: "Templates", label: "Templates", icon: ClipboardList },
  { key: "Reports", label: "Reports", icon: BarChart3 },
  { key: "Settings", label: "Settings", icon: Settings },
];

const permissionRows = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Full access to all features and settings",
    icon: ShieldCheck,
    permissions: {
      Orders: true,
      Users: true,
      Shops: true,
      "QR Codes": true,
      Fabrics: true,
      Templates: true,
      Reports: true,
      Settings: true,
    },
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manage operations and users",
    icon: UserRound,
    permissions: {
      Orders: true,
      Users: true,
      Shops: true,
      "QR Codes": true,
      Fabrics: true,
      Templates: true,
      Reports: true,
      Settings: true,
    },
  },
  {
    id: "catalog-manager",
    name: "Catalog Manager",
    description: "Manage catalogs, fabrics and templates",
    icon: LayoutGrid,
    permissions: {
      Orders: true,
      Users: false,
      Shops: true,
      "QR Codes": true,
      Fabrics: true,
      Templates: true,
      Reports: true,
      Settings: false,
    },
  },
  {
    id: "shopkeeper",
    name: "Store Manager",
    description: "Manage shop orders and customer data",
    icon: Store,
    permissions: {
      Orders: true,
      Users: false,
      Shops: true,
      "QR Codes": true,
      Fabrics: false,
      Templates: false,
      Reports: true,
      Settings: false,
    },
  },
  {
    id: "production-user",
    name: "Production User",
    description: "View production and updates",
    icon: Factory,
    permissions: {
      Orders: true,
      Users: false,
      Shops: true,
      "QR Codes": true,
      Fabrics: false,
      Templates: false,
      Reports: false,
      Settings: false,
    },
  },
  {
    id: "qc-user",
    name: "QC User",
    description: "Quality check and approval access",
    icon: ClipboardCheck,
    permissions: {
      Orders: true,
      Users: false,
      Shops: true,
      "QR Codes": true,
      Fabrics: false,
      Templates: false,
      Reports: true,
      Settings: false,
    },
  },
  {
    id: "dispatch-user",
    name: "Fulfillment User",
    description: "Manage dispatch and shipping updates",
    icon: Package,
    permissions: {
      Orders: true,
      Users: false,
      Shops: false,
      "QR Codes": false,
      Fabrics: false,
      Templates: false,
      Reports: true,
      Settings: false,
    },
  },
];

const metricCards = [
  {
    title: "Total Orders",
    value: "1,248",
    growth: "+12.5%",
    note: "vs Apr 24 – Apr 30",
    icon: ClipboardList,
  },
  {
    title: "Pending Approval",
    value: "178",
    growth: "+8.2%",
    note: "vs Apr 24 – Apr 30",
    icon: RefreshCw,
  },
  {
    title: "Active Shops",
    value: "5",
    growth: "+100%",
    note: "US shop network",
    icon: Store,
  },
  {
    title: "Active Users",
    value: "342",
    growth: "+9.4%",
    note: "vs Apr 24 – Apr 30",
    icon: Users,
  },
  {
    title: "Templates",
    value: "54",
    growth: "+3.8%",
    note: "Desi cuts and styles",
    icon: ClipboardList,
  },
  {
    title: "Fabrics",
    value: "162",
    growth: "+5.6%",
    note: "Cotton, linen, chiffon",
    icon: Layers3,
  },
];

const orderTrend = [
  { day: "May 1", orders: 82 },
  { day: "May 2", orders: 118 },
  { day: "May 3", orders: 162 },
  { day: "May 4", orders: 130 },
  { day: "May 5", orders: 205 },
  { day: "May 6", orders: 335 },
  { day: "May 7", orders: 270 },
];

const orderStatus = [
  { name: "Delivered", value: 542, color: "#18a058" },
  { name: "In Production", value: 342, color: "#f7b519" },
  { name: "Pending Approval", value: 178, color: "#3b82f6" },
  { name: "Cancelled", value: 98, color: "#ef4444" },
  { name: "Returned", value: 88, color: "#64748b" },
];

const topShops = [
  ["1", "New York Flagship", "287", "23.0%"],
  ["2", "Los Angeles Studio", "221", "17.7%"],
  ["3", "Chicago Studio", "189", "15.1%"],
  ["4", "Dallas Boutique", "142", "11.4%"],
  ["5", "Miami Boutique", "121", "9.7%"],
];

const recentOrders = [
  ["#ORD-250507-0042", "New York Flagship", "Madison Clark", "$84.90", "Pending Approval"],
  ["#ORD-250507-0038", "Los Angeles Studio", "Grace Martin", "$124.50", "In Production"],
  ["#ORD-250506-0091", "Chicago Studio", "Lily Anderson", "$62.50", "Delivered"],
  ["#ORD-250506-0064", "Dallas Boutique", "Chloe Walker", "$51.50", "Delivered"],
  ["#ORD-250505-0088", "Miami Boutique", "Hannah Moore", "$47.80", "Returned"],
];

const measurementRows = [
  ["Garment Length", "42"],
  ["Shoulder", "14.5"],
  ["Chest", "20"],
  ["Waist", "19"],
  ["Hip", "21"],
  ["Sleeve Length", "22"],
  ["Armhole", "9.5"],
  ["Wrist", "6"],
  ["Neck Width", "7"],
  ["Neck Depth", "8"],
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return <AdminDashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  return <AuthPrototype onLogin={() => setIsLoggedIn(true)} />;
}

function AuthPrototype({ onLogin }: { onLogin: () => void }) {
  const [view, setView] = useState<AuthView>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("Super Admin");
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>("email");
  const [recoveryTarget, setRecoveryTarget] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const resetMessages = () => {
    setNotice("");
    setError("");
  };

  const goToLogin = () => {
    resetMessages();
    setView("login");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin();
  };

  const handleSendCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (!recoveryTarget.trim()) {
      setError(
        recoveryMethod === "email"
          ? "Please enter your email address."
          : "Please enter your phone number."
      );
      return;
    }

    setNotice(
      `Verification code sent to your ${
        recoveryMethod === "email" ? "email address" : "phone number"
      }. Prototype code: ${prototypeCode}`
    );
    setView("verify");
  };

  const handleVerifyCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (code.replace(/\s/g, "") !== prototypeCode) {
      setError("Invalid code. Use prototype code 246810.");
      return;
    }

    setView("reset");
  };

  const handleResetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMessages();

    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setView("success");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f7f8fb_0%,#ffffff_50%,#f3f5f9_100%)] px-4 py-4 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-32px)] w-full max-w-7xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid w-full overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_26px_80px_rgba(7,22,51,0.12)] lg:grid-cols-[1.02fr_0.98fr]"
        >
          <aside className="hidden min-h-[760px] flex-col overflow-hidden bg-[#fbfcfe] lg:flex">
            <div className="flex h-[430px] shrink-0 flex-col px-[58px] pt-[42px]">
              <BrandLogo />

              <div className="mt-10">
                <span className="inline-flex rounded-full border border-[#f7b519]/40 bg-[#f7b519]/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#a87300]">
                  Admin Control Center
                </span>
              </div>

              <div className="mt-12 w-full max-w-[460px]">
                <h2 className="text-[2rem] font-semibold leading-[1.18] tracking-[-0.03em] text-[#071633]">
                  <span className="block">Custom Clothing,</span>
                  <span className="block">Seamlessly Managed.</span>
                </h2>

                <div className="mt-5 h-1 w-16 rounded-full bg-[#f7b519]" />

                <p className="mt-5 max-w-[350px] text-[15px] leading-7 text-[#51617a]">
                  Powerful tools to manage your shops, teams, orders and
                  production — all in one place.
                </p>
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <img
                src={adminLoginHero}
                alt="MultiFe admin workspace"
                className="h-full w-full object-cover object-[50%_20%]"
              />
            </div>
          </aside>

          <section className="relative flex min-h-[760px] items-center justify-center bg-white px-5 py-8 sm:px-8 md:px-10 lg:px-14">
            <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-[#e4e9f1] bg-white px-4 py-2.5 text-sm font-semibold text-[#071633] shadow-sm">
              <Globe2 className="h-4 w-4" />
              <span>EN</span>
            </div>

            <div className="w-full max-w-[470px]">
              <div className="mb-8 lg:hidden">
                <BrandLogo />

                <span className="mt-8 inline-flex rounded-full border border-[#f7b519]/40 bg-[#f7b519]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a87300]">
                  Admin Control Center
                </span>

                <div className="mt-6">
                  <h2 className="text-[1.9rem] font-semibold leading-[1.15] tracking-[-0.04em] text-[#071633]">
                    <span className="block">Custom Clothing,</span>
                    <span className="block">Seamlessly Managed.</span>
                  </h2>

                  <div className="mt-4 h-1 w-14 rounded-full bg-[#f7b519]" />

                  <p className="mt-4 max-w-[340px] text-[15px] leading-7 text-[#51617a]">
                    Powerful tools to manage your shops, teams, orders and
                    production — all in one place.
                  </p>
                </div>

                <div className="mt-6 overflow-hidden rounded-[28px] border border-[#edf1f6] bg-[#f8fafc] shadow-sm">
                  <div className="h-[250px]">
                    <img
                      src={adminLoginHero}
                      alt="MultiFe admin workspace"
                      className="h-full w-full object-cover object-[50%_20%]"
                    />
                  </div>
                </div>
              </div>

              {view === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <AuthHeader
                    icon={ShieldCheck}
                    eyebrow="MultiFe Admin"
                    title="Welcome back"
                    description="Sign in to access your admin dashboard and control center."
                  />

                  <form onSubmit={handleLogin} className="space-y-5">
                    <FormField label="Email Address" icon={Mail}>
                      <input
                        type="email"
                        defaultValue="admin@multife.com"
                        className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-[#071633] outline-none placeholder:text-[#a7b2c2]"
                        placeholder="admin@multife.com"
                      />
                    </FormField>

                    <FormField label="Password" icon={Lock}>
                      <input
                        type={showPassword ? "text" : "password"}
                        defaultValue="multife123"
                        className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-[#071633] outline-none placeholder:text-[#a7b2c2]"
                        placeholder="Enter password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="rounded-xl p-2 text-[#7f8ca1] transition hover:bg-[#f3f6fb] hover:text-[#071633]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </FormField>

                    <FormField label="Role" icon={UserRound}>
                      <select
                        value={role}
                        onChange={(event) => setRole(event.target.value as UserRole)}
                        className="h-full w-full cursor-pointer border-0 bg-transparent px-3 text-sm font-semibold text-[#071633] outline-none"
                      >
                        {roles.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </FormField>

                    <div className="flex flex-col gap-3 pt-1 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex cursor-pointer items-center gap-3 font-semibold text-[#6f7d95]">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 accent-[#071633]"
                        />
                        Remember me
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          resetMessages();
                          setView("forgot");
                        }}
                        className="text-left font-semibold text-[#071633] underline decoration-[#f7b519] decoration-2 underline-offset-4 transition hover:text-[#b98100]"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <PrimaryButton label="Sign In" />
                  </form>

                  <SecureFooter />
                </motion.div>
              )}

              {view === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <AuthBackButton onClick={goToLogin} />

                  <AuthHeader
                    icon={KeyRound}
                    eyebrow="Account Recovery"
                    title="Forgot password?"
                    description="Choose where you want to receive your verification code."
                  />

                  <form onSubmit={handleSendCode} className="space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                      <RecoveryButton
                        active={recoveryMethod === "email"}
                        icon={Mail}
                        label="Email"
                        onClick={() => {
                          resetMessages();
                          setRecoveryMethod("email");
                          setRecoveryTarget("");
                        }}
                      />

                      <RecoveryButton
                        active={recoveryMethod === "phone"}
                        icon={Phone}
                        label="Phone"
                        onClick={() => {
                          resetMessages();
                          setRecoveryMethod("phone");
                          setRecoveryTarget("");
                        }}
                      />
                    </div>

                    <FormField
                      label={
                        recoveryMethod === "email"
                          ? "Email Address"
                          : "Phone Number"
                      }
                      icon={recoveryMethod === "email" ? Mail : Phone}
                    >
                      <input
                        type={recoveryMethod === "email" ? "email" : "tel"}
                        value={recoveryTarget}
                        onChange={(event) =>
                          setRecoveryTarget(event.target.value)
                        }
                        className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-[#071633] outline-none placeholder:text-[#a7b2c2]"
                        placeholder={
                          recoveryMethod === "email"
                            ? "admin@multife.com"
                            : "+1 (212) 555-0100"
                        }
                      />
                    </FormField>

                    <StatusMessage notice={notice} error={error} />
                    <PrimaryButton label="Send Verification Code" />
                  </form>

                  <SecureFooter />
                </motion.div>
              )}

              {view === "verify" && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <AuthBackButton
                    onClick={() => {
                      resetMessages();
                      setView("forgot");
                    }}
                  />

                  <AuthHeader
                    icon={ShieldCheck}
                    eyebrow="Verify Code"
                    title="Check your inbox"
                    description={`Enter the 6-digit code sent to ${
                      recoveryTarget || "your account"
                    }.`}
                  />

                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setCode("");
                      setNotice(`New verification code sent. Prototype code: ${prototypeCode}`);
                    }}
                    className="mb-4"
                  >
                    <button
                      type="submit"
                      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-[#d9e1eb] bg-white text-sm font-bold text-[#071633] transition hover:border-[#f7b519]/60 hover:bg-[#f7b519]/5"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Resend Code
                    </button>
                  </form>

                  <form onSubmit={handleVerifyCode} className="space-y-5">
                    <FormField label="Verification Code" icon={KeyRound}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={code}
                        onChange={(event) =>
                          setCode(event.target.value.replace(/\D/g, ""))
                        }
                        className="h-full w-full border-0 bg-transparent px-3 text-center text-2xl font-bold tracking-[0.45em] text-[#071633] outline-none placeholder:text-[#a7b2c2]"
                        placeholder="000000"
                      />
                    </FormField>

                    <StatusMessage notice={notice} error={error} />
                    <PrimaryButton label="Verify Code" />
                  </form>

                  <SecureFooter />
                </motion.div>
              )}

              {view === "reset" && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <AuthBackButton
                    onClick={() => {
                      resetMessages();
                      setView("verify");
                    }}
                  />

                  <AuthHeader
                    icon={Lock}
                    eyebrow="Create New Password"
                    title="Reset password"
                    description="Add a new secure password for your MultiFe admin account."
                  />

                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <FormField label="New Password" icon={Lock}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-[#071633] outline-none placeholder:text-[#a7b2c2]"
                        placeholder="Enter new password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="rounded-xl p-2 text-[#7f8ca1] transition hover:bg-[#f3f6fb] hover:text-[#071633]"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </FormField>

                    <FormField label="Confirm Password" icon={ShieldCheck}>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold text-[#071633] outline-none placeholder:text-[#a7b2c2]"
                        placeholder="Confirm new password"
                      />
                    </FormField>

                    <StatusMessage notice={notice} error={error} />
                    <PrimaryButton label="Update Password" />
                  </form>

                  <SecureFooter />
                </motion.div>
              )}

              {view === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-center lg:text-left"
                >
                  <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#071633] shadow-[0_14px_30px_rgba(7,22,51,0.18)] lg:mx-0">
                    <CheckCircle2 className="h-10 w-10 text-[#f7b519]" />
                  </div>

                  <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#f7b519]">
                    Password Updated
                  </p>

                  <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#071633] sm:text-5xl">
                    You are all set
                  </h2>

                  <p className="mt-4 text-base leading-8 text-[#6f7d95]">
                    Your password has been reset successfully. You can now sign
                    in with your new password.
                  </p>

                  <button
                    type="button"
                    onClick={goToLogin}
                    className="group mt-8 flex h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-[#071633] text-base font-semibold text-white shadow-[0_14px_28px_rgba(7,22,51,0.20)] transition hover:bg-[#0a2048]"
                  >
                    Back to Sign In
                    <ArrowRight className="h-5 w-5 text-[#f7b519] transition group-hover:translate-x-1" />
                  </button>

                  <SecureFooter />
                </motion.div>
              )}
            </div>
          </section>
        </motion.div>
      </section>
    </main>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activePage, setActivePage] = useState<NavKey>("Dashboard");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [shops, setShops] = useState<ShopRecord[]>(initialShops);
  const [qrRecords, setQrRecords] = useState<QrRecord[]>(() =>
    initialQrRecords.slice(0, 1)
  );

  const openPage = (page: NavKey) => {
    setActivePage(page);
    setMobileSidebar(false);
  };

  const createQrForShop = (shop: ShopRecord) => {
    if (!shop.name.trim()) return;

    setQrRecords((prev) => {
      const alreadyExists = prev.some(
        (item) =>
          item.outletName.toLowerCase() === shop.name.toLowerCase() ||
          item.slug.toLowerCase() === shop.slug.toLowerCase()
      );

      if (alreadyExists) return prev;

      const nextNumber = prev.length + 1;
      const nextImage = qrImagePool[(nextNumber - 1) % qrImagePool.length];

      return [
        ...prev,
        {
          id: `qr-row-${Date.now()}`,
          codeId: `QR-${String(nextNumber).padStart(4, "0")}`,
          outletName: shop.name,
          slug: shop.slug,
          linkedShop: shop.name as ShopName,
          city: shop.city,
          scanCount: 0,
          lastScanned: "Never",
          status: "Active",
          createdAt: "Created: Just now",
          image: nextImage,
        },
      ];
    });
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#071633]">
      <div className="flex min-h-screen">
        <DashboardSidebar
          activePage={activePage}
          onNavigate={openPage}
          onLogout={onLogout}
          mobileOpen={mobileSidebar}
          onClose={() => setMobileSidebar(false)}
        />

        <section className="min-w-0 flex-1 lg:pl-[250px]">
          <DashboardTopbar
            activePage={activePage}
            onMenu={() => setMobileSidebar(true)}
            onLogout={onLogout}
            onNavigate={openPage}
          />

          <div className="px-4 py-5 sm:px-6 lg:px-7">
            {activePage === "Dashboard" && <DashboardHome />}
            {activePage === "Orders" && <OrdersPage />}
            {activePage === "Users" && <UsersManagementPage />}
            {activePage === "Roles" && <RolesManagementPage />}
            {activePage === "Shops" && (
              <ShopManagementPage
                shops={shops}
                setShops={setShops}
                onShopCreated={createQrForShop}
              />
            )}
            {activePage === "QR Codes" && (
              <QRCodeManagementPage
                shops={shops}
                records={qrRecords}
                setRecords={setQrRecords}
              />
            )}
            {activePage === "Fabrics" && <FabricManagementPage shops={shops} />}
            {activePage === "Style Options" && <TemplateManagementPage shops={shops} />}
            {activePage === "Reports" && <ReportingPage />}
            {activePage === "Settings" && <SettingsPage shops={shops} onLogout={onLogout} />}
            {![
              "Dashboard",
              "Orders",
              "Users",
              "Roles",
              "Shops",
              "QR Codes",
              "Fabrics",
              "Style Options",
              "Reports",
              "Settings",
            ].includes(activePage) && <ModulePage page={activePage} />}
          </div>
        </section>
      </div>
    </main>
  );
}
function DashboardSidebar({
  activePage,
  onNavigate,
  onLogout,
  mobileOpen,
  onClose,
}: {
  activePage: NavKey;
  onNavigate: (page: NavKey) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const SidebarContent = (
    <aside className="flex h-full w-[250px] flex-col border-r border-[#e7edf5] bg-white">
      <div className="flex h-[78px] items-center justify-between border-b border-[#eef2f7] px-6">
        <div>
          <h1 className="text-[1.55rem] font-semibold leading-none tracking-[0.08em] text-[#071633]">
            MultiFe
          </h1>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#718096]">
            Custom Apparel
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-[#718096] hover:bg-[#f5f7fb] lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(item.label)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-[#071633] text-white shadow-[0_10px_22px_rgba(7,22,51,0.14)]"
                  : "text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  active ? "text-[#f7b519]" : "text-[#7d8ba1]"
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-[#eef2f7] p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#51617a] transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {SidebarContent}
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#071633]/45 lg:hidden"
              onClick={onClose}
            />

            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function DashboardTopbar({
  activePage,
  onMenu,
  onLogout,
  onNavigate,
}: {
  activePage: NavKey;
  onMenu: () => void;
  onLogout: () => void;
  onNavigate: (page: NavKey) => void;
}) {
  const [adminOpen, setAdminOpen] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-[#e7edf5] bg-white/95 backdrop-blur-xl">
      <div className="flex h-[78px] items-center gap-4 px-4 sm:px-6 lg:px-7">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-xl border border-[#e7edf5] bg-white p-3 text-[#071633] shadow-sm lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-xl p-2 text-[#718096] hover:bg-[#f5f7fb]">
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex h-11 w-[390px] items-center rounded-lg border border-[#dfe7f1] bg-white px-4 shadow-sm">
            <Search className="h-4 w-4 text-[#7d8ba1]" />
            <input
              className="h-full w-full border-0 bg-transparent px-3 text-sm font-medium outline-none placeholder:text-[#9aa7ba]"
              placeholder="Search Orders, Customers, Styles..."
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:hidden">
          <p className="truncate text-lg font-bold text-[#071633]">
            {activePage}
          </p>
        </div>

        {profileNotice && (
          <div className="hidden rounded-xl border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-sm font-bold text-[#8a6200] xl:block">
            {profileNotice}
          </div>
        )}

        <div className="ml-auto flex items-center gap-3">
          <button className="relative rounded-xl border border-[#dfe7f1] bg-white p-3 text-[#51617a] shadow-sm transition hover:border-[#f7b519]/50 hover:text-[#071633]">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f7b519]" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setAdminOpen((value) => !value)}
              className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2 shadow-sm transition ${
                adminOpen
                  ? "border-[#f7b519] ring-4 ring-[#f7b519]/10"
                  : "border-[#dfe7f1] hover:border-[#f7b519]/60"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2f7] text-xs font-bold text-[#071633]">
                AD
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-sm font-bold leading-none text-[#071633]">
                  Admin
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#718096]">
                  Super Admin
                </p>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-[#718096] transition ${
                  adminOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {adminOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[58px] z-50 w-[270px] overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_20px_55px_rgba(7,22,51,0.14)]"
                >
                  <div className="border-b border-[#eef2f7] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071633] text-sm font-bold text-[#f7b519]">
                        AD
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#071633]">
                          Admin
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#718096]">
                          admin@multife.com
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-[#f8fafc] px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#718096]">
                        Current Role
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#071633]">
                        Super Admin
                      </p>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileNotice("Admin profile preview opened.");
                        setAdminOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#51617a] transition hover:bg-[#f8fafc] hover:text-[#071633]"
                    >
                      <UserRound className="h-5 w-5 text-[#7d8ba1]" />
                      My Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileNotice("");
                        setAdminOpen(false);
                        onNavigate("Settings");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#51617a] transition hover:bg-[#f8fafc] hover:text-[#071633]"
                    >
                      <Settings className="h-5 w-5 text-[#7d8ba1]" />
                      Account Settings
                    </button>

                    <button
                      type="button"
                      onClick={onLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#071633] sm:text-3xl">
            Welcome back, Admin 👋
          </h2>
          <p className="mt-1 text-sm font-medium text-[#718096]">
            Here's what's happening across MultiFe's US shops today.
          </p>
        </div>

        <button className="flex h-11 w-fit items-center gap-2 rounded-xl border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#51617a] shadow-sm">
          <CalendarDays className="h-4 w-4" />
          May 1 – May 7, 2025
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((card) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_12px_30px_rgba(7,22,51,0.04)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#718096]">
                    {card.title}
                  </p>
                  <h3 className="mt-3 text-3xl font-bold text-[#071633]">
                    {card.value}
                  </h3>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f7fb] text-[#071633]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm font-bold text-emerald-600">
                {card.growth}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#8a97aa]">
                {card.note}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_12px_30px_rgba(7,22,51,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#071633]">Order Trend</h3>
              <p className="text-sm font-medium text-[#718096]">
                Daily orders overview
              </p>
            </div>

            <button className="rounded-xl border border-[#dfe7f1] px-3 py-2 text-xs font-bold text-[#51617a]">
              Last 7 Days
            </button>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrend}>
                <defs>
                  <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#071633" stopOpacity={0.18} />
                    <stop offset="90%" stopColor="#071633" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#718096", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#718096", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e7edf5",
                    boxShadow: "0 12px 30px rgba(7,22,51,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#071633"
                  strokeWidth={3}
                  fill="url(#ordersFill)"
                  dot={{ r: 4, fill: "#f7b519", stroke: "#071633" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_12px_30px_rgba(7,22,51,0.04)]">
          <h3 className="text-lg font-bold text-[#071633]">Orders by Status</h3>
          <p className="text-sm font-medium text-[#718096]">
            Current week breakdown
          </p>

          <div className="mt-4 grid items-center gap-4 sm:grid-cols-[220px_1fr] xl:grid-cols-1 2xl:grid-cols-[220px_1fr]">
            <div className="relative h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatus}
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {orderStatus.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-[#071633]">1,248</p>
                <p className="text-xs font-bold text-[#718096]">
                  Total Orders
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {orderStatus.map((status) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: status.color }}
                    />
                    <span className="font-semibold text-[#51617a]">
                      {status.name}
                    </span>
                  </div>
                  <span className="font-bold text-[#071633]">
                    {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardTable
          title="Top Shops"
          action="View All"
          headers={["#", "Shop Name", "Orders", "% of Total"]}
          rows={topShops}
        />

        <RecentOrdersTable />
      </div>
    </div>
  );
}

function OrdersPage() {
  const [approvalStatus, setApprovalStatus] = useState<"Pending Approval" | "Approved">(
    "Pending Approval"
  );
  const [reviewer, setReviewer] = useState("Jennifer Lee (Reviewer)");
  const [note, setNote] = useState("");

  const statusStyle =
    approvalStatus === "Approved"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-[#f7b519]/35 bg-[#f7b519]/15 text-[#8a6200]";

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div>
        <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
          Order Review & Approval
        </h2>
        <p className="mt-1 text-sm font-medium text-[#718096]">
          Review order details, verify selections, and approve the order.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.05fr_1fr]">
        <div className="space-y-5">
          <CompactPanel
            title="Order Summary"
            action={
              <span className={`rounded-lg border px-3 py-1 text-[12px] font-bold ${statusStyle}`}>
                {approvalStatus}
              </span>
            }
          >
            <InfoGrid
              items={[
                ["Order ID", "#ORD-250507-0042"],
                ["Order Date", "May 7, 2025 10:24 AM"],
                ["Customer", "Madison Clark"],
                ["Shop", "New York Flagship"],
                ["Shop Source", "POS"],
                ["Order Total", "$84.90"],
                ["Payment Status", "Paid"],
                ["Delivery Method", "Standard Delivery"],
              ]}
            />
          </CompactPanel>

          <CompactPanel
            title="Customer Details"
            action={
              <button className="rounded-lg border border-[#dfe7f1] bg-white px-3 py-1.5 text-xs font-bold text-[#071633] hover:border-[#f7b519]">
                Edit
              </button>
            }
          >
            <InfoGrid
              items={[
                ["Name", "Madison Clark"],
                ["Email", "madison.clark@example.com"],
                ["Phone", "+1 (212) 555-0142"],
                ["Address", "128 W 34th St, New York, NY 10001, USA"],
                ["Customer Since", "Apr 12, 2025"],
                ["Total Orders", "5"],
              ]}
            />
          </CompactPanel>
        </div>

        <div className="space-y-5">
          <CompactPanel title="Order Details">
            <div className="space-y-4">
              <SelectionCard
                label="Selected Fabric"
                image={selectedFabricImage}
                title="Floral Cotton Poplin"
                lineOne="Premium Cotton Collection"
                lineTwo="Light Floral"
                badge="Cotton"
              />

              <SelectionCard
                label="Selected Template"
                image={selectedTemplateImage}
                title="Long Top"
                lineOne="Straight Cut"
                lineTwo="Full Sleeves"
                badge="Template #LS-101"
              />
            </div>
          </CompactPanel>

          <CompactPanel
            title="Measurements (Inches)"
            action={
              <button className="rounded-lg border border-[#dfe7f1] bg-white px-3 py-1.5 text-xs font-bold text-[#071633] hover:border-[#f7b519]">
                Edit
              </button>
            }
          >
            <div className="space-y-3">
              {measurementRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-[#718096]">{label}</span>
                  <span className="font-bold text-[#071633]">{value}</span>
                </div>
              ))}
            </div>
          </CompactPanel>
        </div>

        <div className="space-y-5">
          <CompactPanel title="Order Status">
            <span className={`inline-flex rounded-lg border px-4 py-2 text-sm font-bold ${statusStyle}`}>
              {approvalStatus}
            </span>
            <p className="mt-3 text-sm font-semibold text-[#718096]">
              {approvalStatus === "Approved"
                ? "Order approved. Production assignment can move forward."
                : "Awaiting admin review."}
            </p>
          </CompactPanel>

          <CompactPanel title="Assignment">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#071633]">
                Assign To
              </span>
              <select
                value={reviewer}
                onChange={(event) => setReviewer(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#d9e1eb] bg-white px-4 text-sm font-semibold text-[#071633] outline-none focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
              >
                <option>Jennifer Lee (Reviewer)</option>
                <option>Daniel Reed (QC User)</option>
                <option>Rachel Adams (Production User)</option>
                <option>Emily Carter (Admin)</option>
              </select>
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-[#071633]">
                Add Note (Optional)
              </span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value.slice(0, 250))}
                placeholder="Enter note for this order..."
                className="h-[96px] w-full resize-none rounded-lg border border-[#d9e1eb] bg-white p-4 text-sm font-semibold text-[#071633] outline-none placeholder:text-[#9aa7ba] focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
              />
              <p className="mt-2 text-right text-xs font-bold text-[#8a97aa]">
                {note.length} / 250
              </p>
            </label>

            <button
              type="button"
              onClick={() => setApprovalStatus("Approved")}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-lg bg-[#071633] text-sm font-bold text-white shadow-[0_10px_22px_rgba(7,22,51,0.14)] hover:bg-[#0a2048]"
            >
              Approve Order
            </button>
          </CompactPanel>

          <CompactPanel title="Order Timeline">
            <div className="space-y-4">
              {[
                ["Order Placed", "May 7, 2025 10:24 AM", true],
                ["Payment Received", "May 7, 2025 10:26 AM", true],
                [approvalStatus, "May 7, 2025 10:27 AM", approvalStatus === "Approved"],
              ].map(([title, time, done], index) => (
                <div key={`${title}-${index}`} className="flex gap-3">
                  <div className="pt-1">
                    <span
                      className={`block h-2.5 w-2.5 rounded-full ${
                        done ? "bg-emerald-600" : "bg-[#071633]"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#071633]">{String(title)}</p>
                    <p className="mt-1 text-xs font-semibold text-[#718096]">
                      {String(time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CompactPanel>
        </div>
      </div>
    </div>
  );
}

function SelectionCard({
  label,
  image,
  title,
  lineOne,
  lineTwo,
  badge,
}: {
  label: string;
  image: string;
  title: string;
  lineOne: string;
  lineTwo: string;
  badge: string;
}) {
  return (
    <div className="rounded-xl border border-[#eef2f7] bg-white p-4">
      <p className="mb-3 text-sm font-bold text-[#071633]">{label}</p>
      <div className="flex gap-4">
        <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg border border-[#e7edf5] bg-[#f8fafc]">
          <img src={image} alt={label} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0">
          <h4 className="text-base font-bold text-[#071633]">{title}</h4>
          <p className="mt-1 text-sm font-semibold text-[#718096]">{lineOne}</p>
          <p className="mt-1 text-sm font-semibold text-[#718096]">{lineTwo}</p>
          <span className="mt-3 inline-flex rounded-md bg-[#f5f7fb] px-3 py-1 text-xs font-bold text-[#51617a]">
            {badge}
          </span>
        </div>
      </div>
    </div>
  );
}

function UsersManagementPage() {
  const [users, setUsers] = useState<StaffUser[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All Roles">("All Roles");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All Status">("All Status");
  const [shopFilter, setShopFilter] = useState<ShopName>("All Shops");
  const [editorUser, setEditorUser] = useState<StaffUser | null>(null);
  const [menuUserId, setMenuUserId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesQuery =
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase());

      const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;
      const matchesShop =
        shopFilter === "All Shops" ||
        user.assignedShop === shopFilter ||
        user.assignedShop === "All Shops";

      return matchesQuery && matchesRole && matchesStatus && matchesShop;
    });
  }, [query, roleFilter, shopFilter, statusFilter, users]);

  const saveUser = (user: StaffUser) => {
    setUsers((prev) => {
      const exists = prev.some((item) => item.id === user.id);
      if (exists) return prev.map((item) => (item.id === user.id ? user : item));
      return [user, ...prev];
    });
    setEditorUser(null);
    setNotice(`${user.name} saved successfully.`);
  };

  const addUser = () => {
    const nextId = `USR-${String(users.length + 1).padStart(3, "0")}`;
    setEditorUser({
      id: nextId,
      name: "",
      email: "",
      role: "Sales Associate",
      assignedShop: "New York Flagship",
      status: "Pending",
      lastLogin: "Never",
    });
  };

  const duplicateUser = (user: StaffUser) => {
    const nextId = `USR-${String(users.length + 1).padStart(3, "0")}`;
    setUsers((prev) => [
      {
        ...user,
        id: nextId,
        name: `${user.name} Copy`,
        email: user.email.replace("@", `.copy${prev.length + 1}@`),
        status: "Pending",
        lastLogin: "Never",
      },
      ...prev,
    ]);
    setMenuUserId(null);
    setNotice(`${user.name} duplicated.`);
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((item) => item.id !== userId));
    setMenuUserId(null);
    setNotice("User removed from this prototype.");
  };

  const importUsers = (rawText: string) => {
    const lines = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const imported = lines.map((line, index) => {
      const [name = "New User", email = `imported${index + 1}@multife.com`] =
        line.split(",").map((item) => item.trim());

      return {
        id: `IMP-${Date.now()}-${index}`,
        name,
        email,
        role: "Sales Associate" as UserRole,
        assignedShop: "New York Flagship" as ShopName,
        status: "Pending" as UserStatus,
        lastLogin: "Never",
      };
    });

    setUsers((prev) => [...imported, ...prev]);
    setNotice(`${imported.length} user(s) imported.`);
    setImportOpen(false);
  };

  const exportUsers = () => {
    const csv = [
      "Name,Email,Role,Assigned Shop,Status,Last Login",
      ...filteredUsers.map((user) =>
        [
          user.name,
          user.email,
          user.role,
          user.assignedShop,
          user.status,
          user.lastLogin,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "multife-users.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Filtered users exported as CSV.");
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div>
        <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
          User Management
        </h2>
        <p className="mt-1 text-sm font-medium text-[#718096]">
          Manage users, roles and access levels across MultiFe's US shops.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e7edf5] bg-white p-4 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as UserRole | "All Roles")
            }
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            <option>All Roles</option>
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as UserStatus | "All Status")
            }
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>

          <select
            value={shopFilter}
            onChange={(event) => setShopFilter(event.target.value as ShopName)}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            {shopOptions.map((shop) => (
              <option key={shop}>{shop}</option>
            ))}
          </select>

          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-[#dfe7f1] bg-white px-3">
            <Search className="h-4 w-4 text-[#718096]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users by name, email..."
              className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-[#9aa7ba]"
            />
          </div>

          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>

          <button
            type="button"
            onClick={exportUsers}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
          >
            <FileText className="h-4 w-4" />
            Export
          </button>

          <button
            type="button"
            onClick={addUser}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white hover:bg-[#0a2048]"
          >
            <Plus className="h-4 w-4 text-[#f7b519]" />
            Add User
          </button>
        </div>

        {notice && (
          <div className="mt-3 rounded-lg border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-sm font-bold text-[#8a6200]">
            {notice}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead>
              <tr className="border-b border-[#eef2f7] bg-white">
                {["User Name", "Role", "Assigned Shop", "Status", "Last Login", "Actions"].map(
                  (item) => (
                    <th
                      key={item}
                      className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                    >
                      {item}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-[#eef2f7] last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2f7] text-xs font-bold text-[#071633]">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#071633]">
                          {user.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#718096]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <RolePill role={user.role} />
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#51617a]">
                    {user.assignedShop}
                  </td>

                  <td className="px-5 py-4">
                    <StatusPill status={user.status} />
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#51617a]">
                    {user.lastLogin}
                  </td>

                  <td className="relative px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditorUser(user)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setMenuUserId(menuUserId === user.id ? null : user.id)
                        }
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {menuUserId === user.id && (
                      <div className="absolute right-5 top-12 z-20 w-44 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_35px_rgba(7,22,51,0.12)]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditorUser(user);
                            setMenuUserId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Edit user
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateUser(user)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteUser(user.id)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#eef2f7] px-5 py-4 text-sm font-semibold text-[#718096] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredUsers.length} of {users.length} users
          </span>
          <span>US shop network: New York, Los Angeles, Chicago, Dallas, Miami, Seattle</span>
        </div>
      </div>

      {editorUser && (
        <UserEditorModal
          user={editorUser}
          onClose={() => setEditorUser(null)}
          onSave={saveUser}
        />
      )}

      {importOpen && (
        <ImportUsersModal
          onClose={() => setImportOpen(false)}
          onImport={importUsers}
        />
      )}
    </div>
  );
}

function RolesManagementPage() {
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>(
    () =>
      permissionRows.reduce<Record<string, Record<string, boolean>>>((acc, role) => {
        acc[role.id] = { ...role.permissions };
        return acc;
      }, {})
  );

  const [notice, setNotice] = useState(
    "Permissions are set for MultiFe's US shops: New York, Los Angeles, Chicago, Dallas and Miami."
  );

  const togglePermission = (roleId: string, moduleKey: NavKey) => {
    const role = permissionRows.find((item) => item.id === roleId);

    setPermissions((prev) => {
      const nextValue = !prev[roleId]?.[moduleKey];

      setNotice(
        `${role?.name || "Role"} ${
          nextValue ? "can now access" : "can no longer access"
        } ${moduleKey}.`
      );

      return {
        ...prev,
        [roleId]: {
          ...prev[roleId],
          [moduleKey]: nextValue,
        },
      };
    });
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-4">
      <section className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
          Roles & Permissions
        </h2>
        <p className="mt-1 text-sm font-medium text-[#718096]">
          Manage user roles and control access to features across the platform.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[1020px]">
            <div className="grid grid-cols-[245px_repeat(8,minmax(92px,1fr))] border-b border-[#e9edf4] bg-white">
              <div className="flex h-[70px] items-center px-5 text-sm font-bold text-[#071633]">
                Role
              </div>

              {permissionColumns.map((column) => {
                const Icon = column.icon;

                return (
                  <div
                    key={column.key}
                    className="flex h-[70px] flex-col items-center justify-center gap-2 border-l border-[#e9edf4] text-center"
                  >
                    <Icon className="h-4 w-4 text-[#7d8ba1]" />
                    <span className="text-[12px] font-bold text-[#51617a]">
                      {column.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {permissionRows.map((role) => {
              const RoleIcon = role.icon;

              return (
                <div
                  key={role.id}
                  className="grid grid-cols-[245px_repeat(8,minmax(92px,1fr))] border-b border-[#eef2f7] last:border-b-0"
                >
                  <div className="flex min-h-[88px] items-center gap-3 px-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f8fafc] text-[#071633]">
                      <RoleIcon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#071633]">
                        {role.name}
                      </p>
                      <p className="mt-1 max-w-[150px] text-[11px] font-semibold leading-4 text-[#718096]">
                        {role.description}
                      </p>
                    </div>
                  </div>

                  {permissionColumns.map((column) => {
                    const enabled = Boolean(permissions[role.id]?.[column.key]);

                    return (
                      <div
                        key={`${role.id}-${column.key}`}
                        className="flex min-h-[88px] items-center justify-center border-l border-[#eef2f7]"
                      >
                        <button
                          type="button"
                          onClick={() => togglePermission(role.id, column.key)}
                          aria-label={`${role.name} ${column.label} permission`}
                          className={`relative h-[22px] w-[38px] rounded-full transition ${
                            enabled ? "bg-[#071633]" : "bg-[#d8dee8]"
                          }`}
                        >
                          <span
                            className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition ${
                              enabled ? "left-[19px]" : "left-[3px]"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#eef2f7] bg-[#fbfcfe] px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] font-semibold text-[#718096]">
              Toggle permissions to update access instantly for each role.
            </p>
            <p className="rounded-full border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-[12px] font-bold text-[#8a6200]">
              {notice}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function UserEditorModal({
  user,
  onClose,
  onSave,
}: {
  user: StaffUser;
  onClose: () => void;
  onSave: (user: StaffUser) => void;
}) {
  const [draft, setDraft] = useState<StaffUser>(user);

  return (
    <ModalShell title={user.name ? "Edit User" : "Add User"} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
        className="space-y-4"
      >
        <SimpleInput
          label="Name"
          value={draft.name}
          onChange={(value) => setDraft({ ...draft, name: value })}
          placeholder="Enter user name"
        />

        <SimpleInput
          label="Email"
          value={draft.email}
          onChange={(value) => setDraft({ ...draft, email: value })}
          placeholder="Enter user email"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SimpleSelect
            label="Role"
            value={draft.role}
            options={roles}
            onChange={(value) => setDraft({ ...draft, role: value as UserRole })}
          />

          <SimpleSelect
            label="Status"
            value={draft.status}
            options={["Active", "Inactive", "Pending"]}
            onChange={(value) =>
              setDraft({ ...draft, status: value as UserStatus })
            }
          />
        </div>

        <SimpleSelect
          label="Assigned Shop"
          value={draft.assignedShop}
          options={shopOptions}
          onChange={(value) =>
            setDraft({ ...draft, assignedShop: value as ShopName })
          }
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Save User
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ImportUsersModal({
  onClose,
  onImport,
}: {
  onClose: () => void;
  onImport: (rawText: string) => void;
}) {
  const [rawText, setRawText] = useState("John Miller, john.miller@multife.com\nEmma Wilson, emma.wilson@multife.com");

  return (
    <ModalShell title="Import Users" onClose={onClose}>
      <p className="mb-4 text-sm font-semibold leading-6 text-[#718096]">
        Paste CSV rows in this format: Name, Email. The prototype will add them
        as pending Sales Associate users assigned to New York Flagship.
      </p>

      <textarea
        value={rawText}
        onChange={(event) => setRawText(event.target.value)}
        className="h-[180px] w-full resize-none rounded-xl border border-[#d9e1eb] bg-white p-4 text-sm font-semibold text-[#071633] outline-none focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
      />

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onImport(rawText)}
          className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
        >
          Import Users
        </button>
      </div>
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#071633]/40 px-4">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[560px] rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_24px_80px_rgba(7,22,51,0.20)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#071633]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#718096] hover:bg-[#f5f7fb]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {children}
      </motion.div>
    </div>
  );
}

function SimpleInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#071633]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-[#d9e1eb] bg-white px-4 text-sm font-semibold text-[#071633] outline-none focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
      />
    </label>
  );
}

function SimpleSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#071633]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-[#d9e1eb] bg-white px-4 text-sm font-semibold text-[#071633] outline-none focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function CompactPanel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-[#071633]">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function InfoGrid({ items }: { items: string[][] }) {
  return (
    <div className="space-y-4">
      {items.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[135px_1fr] gap-4 text-sm">
          <p className="font-semibold text-[#718096]">{label}</p>
          <p className="text-right font-bold leading-6 text-[#071633]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function DashboardTable({
  title,
  action,
  headers,
  rows,
}: {
  title: string;
  action: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_12px_30px_rgba(7,22,51,0.04)]">
      <div className="flex items-center justify-between border-b border-[#eef2f7] px-5 py-4">
        <h3 className="text-lg font-bold text-[#071633]">{title}</h3>
        <button className="text-sm font-bold text-[#071633] underline decoration-[#f7b519] decoration-2 underline-offset-4">
          {action}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="bg-[#f8fafc]">
              {headers.map((item) => (
                <th
                  key={item}
                  className="px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")} className="border-t border-[#eef2f7]">
                {row.map((cell) => (
                  <td
                    key={cell}
                    className="px-5 py-3 text-sm font-semibold text-[#51617a]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-[#eef2f7] px-5 py-3 text-xs font-semibold text-[#8a97aa]">
        Showing top 5 shops
      </p>
    </div>
  );
}

function RecentOrdersTable() {
  const badgeClass = (status: string) => {
    if (status === "Delivered") return "bg-emerald-50 text-emerald-700";
    if (status === "In Production") return "bg-[#f7b519]/15 text-[#9a6800]";
    if (status === "Pending Approval") return "bg-[#f7b519]/15 text-[#8a6200]";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_12px_30px_rgba(7,22,51,0.04)]">
      <div className="flex items-center justify-between border-b border-[#eef2f7] px-5 py-4">
        <h3 className="text-lg font-bold text-[#071633]">Recent Orders</h3>
        <button className="text-sm font-bold text-[#071633] underline decoration-[#f7b519] decoration-2 underline-offset-4">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="bg-[#f8fafc]">
              {["Order ID", "Shop", "Customer", "Amount", "Status"].map(
                (item) => (
                  <th
                    key={item}
                    className="px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                  >
                    {item}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {recentOrders.map((row) => (
              <tr key={row[0]} className="border-t border-[#eef2f7]">
                {row.slice(0, 4).map((cell) => (
                  <td
                    key={cell}
                    className="px-5 py-3 text-sm font-semibold text-[#51617a]"
                  >
                    {cell}
                  </td>
                ))}
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${badgeClass(
                      row[4]
                    )}`}
                  >
                    {row[4]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ModulePage({ page }: { page: NavKey }) {
  const moduleInfo: Record<NavKey, { icon: IconType; title: string; desc: string }> = {
    Dashboard: {
      icon: LayoutDashboard,
      title: "Dashboard",
      desc: "Your admin overview is ready.",
    },
    Orders: {
      icon: ShoppingBag,
      title: "Orders Management",
      desc: "Track new orders, production stages, approvals, payments and deliveries.",
    },
    Users: {
      icon: Users,
      title: "Users Management",
      desc: "Manage customers, admins, staff accounts and platform access.",
    },
    Roles: {
      icon: ShieldCheck,
      title: "Roles & Permissions",
      desc: "Control user role permissions and module access.",
    },
    Shops: {
      icon: Store,
      title: "Shop Management",
      desc: "Create shops, manage branches, assign teams and monitor shop activity.",
    },
    "QR Codes": {
      icon: QrCode,
      title: "QR Code Center",
      desc: "Generate and manage QR codes for shops, catalogs, templates and orders.",
    },
    Fabrics: {
      icon: Layers3,
      title: "Fabric Library",
      desc: "Manage cotton poplin, linen, chiffon, embroidered gauze and silk fabric details.",
    },
    Templates: {
      icon: ClipboardList,
      title: "Templates",
      desc: "Legacy template module.",
    },
    "Style Options": {
      icon: Sparkles,
      title: "Style Options",
      desc: "Manage necklines, sleeves, slit, hem and stitching add-ons.",
    },
    Reports: {
      icon: BarChart3,
      title: "Reports",
      desc: "View sales, orders, shop performance, user activity and export reports.",
    },
    Settings: {
      icon: Settings,
      title: "Settings",
      desc: "Configure platform settings, security, roles, notifications and preferences.",
    },
  };

  const item = moduleInfo[page];
  const Icon = item.icon;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e7edf5] bg-white p-6 shadow-[0_12px_30px_rgba(7,22,51,0.04)] sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#071633]">
            <Icon className="h-7 w-7 text-[#f7b519]" />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f7b519]">
              MultiFe Admin
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#071633]">
              {item.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-[#718096]">
              {item.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071633] shadow-[0_12px_28px_rgba(7,22,51,0.18)]">
        <Sparkles className="h-6 w-6 text-[#f7b519]" />
      </div>

      <div>
        <h1 className="text-[2.2rem] font-semibold leading-none tracking-[0.14em] text-[#071633]">
          MultiFe
        </h1>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#7b8aa3]">
          Custom Apparel
        </p>
      </div>
    </div>
  );
}

function AuthHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: IconType;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 text-center lg:text-left">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[24px] bg-[#071633] shadow-[0_14px_30px_rgba(7,22,51,0.18)] lg:mx-0">
        <Icon className="h-8 w-8 text-[#f7b519]" />
      </div>

      <p className="text-sm font-semibold uppercase tracking-[0.34em] text-[#f7b519]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#071633] sm:text-5xl md:text-[4rem] lg:text-[4.1rem]">
        {title}
      </h2>

      <p className="mt-4 text-base leading-8 text-[#6f7d95]">{description}</p>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: IconType;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-sm font-semibold text-[#071633]">
        {label}
      </span>

      <div className="flex h-[60px] items-center rounded-2xl border border-[#d9e1eb] bg-white px-4 shadow-[0_4px_12px_rgba(7,22,51,0.04)] transition focus-within:border-[#f7b519] focus-within:ring-4 focus-within:ring-[#f7b519]/12">
        <Icon className="h-5 w-5 text-[#7f8ca1]" />
        {children}
      </div>
    </label>
  );
}

function PrimaryButton({ label }: { label: string }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      type="submit"
      className="group mt-1 flex h-[60px] w-full items-center justify-center gap-3 rounded-2xl bg-[#071633] text-base font-semibold text-white shadow-[0_14px_28px_rgba(7,22,51,0.20)] transition hover:bg-[#0a2048]"
    >
      {label}
      <ArrowRight className="h-5 w-5 text-[#f7b519] transition group-hover:translate-x-1" />
    </motion.button>
  );
}

function RecoveryButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: IconType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[58px] items-center justify-center gap-2 rounded-2xl border text-sm font-bold transition ${
        active
          ? "border-[#f7b519] bg-[#f7b519]/10 text-[#071633] shadow-[0_8px_18px_rgba(247,181,25,0.12)]"
          : "border-[#d9e1eb] bg-white text-[#6f7d95] hover:border-[#f7b519]/60"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function AuthBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e4e9f1] bg-white px-4 py-2.5 text-sm font-bold text-[#071633] shadow-sm transition hover:border-[#f7b519]/60 hover:bg-[#f7b519]/5"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
}

function StatusMessage({
  notice,
  error,
}: {
  notice: string;
  error: string;
}) {
  if (!notice && !error) return null;

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold leading-6 ${
        error
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-[#f7b519]/30 bg-[#f7b519]/10 text-[#8a6200]"
      }`}
    >
      {error || notice}
    </div>
  );
}

function SecureFooter() {
  return (
    <>
      <div className="mt-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-[#e5ebf3]" />
        <span className="text-sm font-semibold text-[#7d889b]">
          Secure admin access only
        </span>
        <div className="h-px flex-1 bg-[#e5ebf3]" />
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3f6fb]">
          <ShieldCheck className="h-6 w-6 text-[#071633]" />
        </div>
      </div>
    </>
  );
}

function RolePill({ role }: { role: UserRole }) {
  const style: Record<string, string> = {
    "Owner": "bg-[#071633] text-white",
    "Super Admin": "bg-purple-50 text-purple-700",
    Admin: "bg-blue-50 text-blue-700",
    "Catalog Manager": "bg-[#f7b519]/15 text-[#8a6200]",
    "Store Manager": "bg-emerald-50 text-emerald-700",
    "Production User": "bg-indigo-50 text-indigo-700",
    "QC User": "bg-cyan-50 text-cyan-700",
    "Fulfillment User": "bg-slate-100 text-slate-700",
    "Sales Associate": "bg-teal-50 text-teal-700",
    Viewer: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${style[role]}`}>
      {role}
    </span>
  );
}

function StatusPill({ status }: { status: UserStatus }) {
  const style: Record<UserStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700",
    Inactive: "bg-red-50 text-red-700",
    Pending: "bg-[#f7b519]/15 text-[#8a6200]",
  };

  return (
    <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold ${style[status]}`}>
      {status}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
}



function ShopManagementPage({
  shops,
  setShops,
  onShopCreated,
}: {
  shops: ShopRecord[];
  setShops: Dispatch<SetStateAction<ShopRecord[]>>;
  onShopCreated: (shop: ShopRecord) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<ShopSyncStatus | "All Status">("All Status");
  const [cityFilter, setCityFilter] = useState<string>("All Cities");
  const [query, setQuery] = useState("");
  const [editorShop, setEditorShop] = useState<ShopRecord | null>(null);
  const [menuShopId, setMenuShopId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const cityOptions = useMemo(
    () => ["All Cities", ...Array.from(new Set(shops.map((shop) => shop.city)))],
    [shops]
  );

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      const matchesStatus = statusFilter === "All Status" || shop.status === statusFilter;
      const matchesCity = cityFilter === "All Cities" || shop.city === cityFilter;
      const search = query.toLowerCase();
      const matchesQuery =
        shop.name.toLowerCase().includes(search) ||
        shop.city.toLowerCase().includes(search) ||
        shop.slug.toLowerCase().includes(search) ||
        shop.managerName.toLowerCase().includes(search) ||
        shop.managerEmail.toLowerCase().includes(search);

      return matchesStatus && matchesCity && matchesQuery;
    });
  }, [cityFilter, query, shops, statusFilter]);

  const addShop = () => {
    const nextNumber = shops.length + 1;

    setEditorShop({
      id: `SHP-${String(nextNumber).padStart(3, "0")}`,
      name: "",
      slug: "",
      city: "New York",
      province: "New York",
      status: "Pending",
      managerName: "",
      managerEmail: "",
      qrCodes: 1,
      activeQrCodes: 1,
      lastSync: "QR will be created automatically",
    });
  };

  const saveShop = (shop: ShopRecord) => {
    const normalizedShop: ShopRecord = {
      ...shop,
      slug:
        shop.slug.trim() ||
        shop.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      qrCodes: Math.max(1, shop.qrCodes || 1),
      activeQrCodes: Math.max(1, shop.activeQrCodes || 1),
    };

    let isNewShop = false;

    setShops((prev) => {
      const exists = prev.some((item) => item.id === normalizedShop.id);
      isNewShop = !exists;

      if (exists) {
        return prev.map((item) => (item.id === normalizedShop.id ? normalizedShop : item));
      }

      return [normalizedShop, ...prev];
    });

    if (isNewShop) {
      onShopCreated(normalizedShop);
      setNotice(`${normalizedShop.name} added. System automatically created a unique QR code for this shop.`);
    } else {
      setNotice(`${normalizedShop.name} updated successfully.`);
    }

    setEditorShop(null);
  };

  const syncShop = (shopId: string) => {
    setShops((prev) =>
      prev.map((shop) =>
        shop.id === shopId
          ? {
              ...shop,
              status: "Synced",
              lastSync: "Just now",
            }
          : shop
      )
    );

    const shop = shops.find((item) => item.id === shopId);
    setMenuShopId(null);
    setNotice(`${shop?.name || "Shop"} synced successfully.`);
  };

  const duplicateShop = (shop: ShopRecord) => {
    const nextNumber = shops.length + 1;
    const duplicatedShop: ShopRecord = {
      ...shop,
      id: `SHP-${String(nextNumber).padStart(3, "0")}`,
      name: `${shop.name} Copy`,
      slug: `${shop.slug}-copy`,
      status: "Pending",
      qrCodes: 1,
      activeQrCodes: 1,
      lastSync: "QR will be created automatically",
    };

    setShops((prev) => [duplicatedShop, ...prev]);
    onShopCreated(duplicatedShop);
    setMenuShopId(null);
    setNotice(`${duplicatedShop.name} duplicated with a new system QR.`);
  };

  const deleteShop = (shopId: string) => {
    setShops((prev) => prev.filter((shop) => shop.id !== shopId));
    setMenuShopId(null);
    setNotice("Shop removed. Delete or re-sync its QR code from QR Code Management if needed.");
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div>
        <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
          Shop Management
        </h2>
        <p className="mt-1 text-sm font-medium text-[#718096]">
          Manage shop locations, assigned managers and sync status. QR codes are created automatically when a new shop is added.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e7edf5] bg-white p-4 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ShopSyncStatus | "All Status")
            }
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            <option>All Status</option>
            <option>Synced</option>
            <option>Pending</option>
            <option>Error</option>
          </select>

          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            {cityOptions.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>

          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-[#dfe7f1] bg-white px-3">
            <Search className="h-4 w-4 text-[#718096]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shop by name, city..."
              className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-[#9aa7ba]"
            />
          </div>

          <button
            type="button"
            onClick={addShop}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white hover:bg-[#0a2048]"
          >
            <Plus className="h-4 w-4 text-[#f7b519]" />
            Add Shop
          </button>
        </div>

        {notice && (
          <div className="mt-3 rounded-lg border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-sm font-bold text-[#8a6200]">
            {notice}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1060px] text-left">
            <thead>
              <tr className="border-b border-[#eef2f7] bg-white">
                {[
                  "Shop Name",
                  "Location",
                  "Status",
                  "Assigned Manager",
                  "QR Codes",
                  "Last Sync",
                  "Actions",
                ].map((item) => (
                  <th
                    key={item}
                    className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredShops.map((shop) => (
                <tr key={shop.id} className="border-b border-[#eef2f7] last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e7edf5] bg-[#f8fafc]">
                        <Store className="h-5 w-5 text-[#51617a]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#071633]">
                          {shop.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#718096]">
                          {shop.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[#071633]">{shop.city}</p>
                    <p className="mt-1 text-xs font-semibold text-[#718096]">{shop.province}</p>
                  </td>

                  <td className="px-5 py-4">
                    <ShopSyncPill status={shop.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2f7] text-xs font-bold text-[#071633]">
                        {getInitials(shop.managerName || "New Manager")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#071633]">{shop.managerName || "Not assigned"}</p>
                        <p className="mt-1 text-xs font-semibold text-[#718096]">{shop.managerEmail || "—"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-lg font-bold text-[#071633]">{shop.qrCodes}</p>
                    <p className="text-xs font-semibold text-[#718096]">{shop.activeQrCodes} Active</p>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#51617a]">
                    {shop.lastSync}
                  </td>

                  <td className="relative px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditorShop(shop)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setMenuShopId(menuShopId === shop.id ? null : shop.id)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {menuShopId === shop.id && (
                      <div className="absolute right-5 top-12 z-20 w-44 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_35px_rgba(7,22,51,0.12)]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditorShop(shop);
                            setMenuShopId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Edit shop
                        </button>
                        <button
                          type="button"
                          onClick={() => syncShop(shop.id)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Sync now
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateShop(shop)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteShop(shop.id)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#eef2f7] px-5 py-4 text-sm font-semibold text-[#718096] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredShops.length} of {shops.length} shops
          </span>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-lg text-[#718096]">
              ‹
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-sm font-bold text-[#071633]">
              1
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-lg text-[#718096]">
              ›
            </button>
          </div>
        </div>
      </div>

      {editorShop && (
        <ShopEditorModal
          shop={editorShop}
          onClose={() => setEditorShop(null)}
          onSave={saveShop}
        />
      )}
    </div>
  );
}

function ShopEditorModal({
  shop,
  onClose,
  onSave,
}: {
  shop: ShopRecord;
  onClose: () => void;
  onSave: (shop: ShopRecord) => void;
}) {
  const [draft, setDraft] = useState<ShopRecord>(shop);

  return (
    <ModalShell title={shop.name ? "Edit Shop" : "Add Shop"} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
        className="space-y-4"
      >
        <SimpleInput
          label="Shop Name"
          value={draft.name}
          onChange={(value) => setDraft({ ...draft, name: value })}
          placeholder="New York Flagship"
        />

        <SimpleInput
          label="Slug"
          value={draft.slug}
          onChange={(value) => setDraft({ ...draft, slug: value })}
          placeholder="new-york-flagship"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SimpleInput
            label="City"
            value={draft.city}
            onChange={(value) => setDraft({ ...draft, city: value })}
            placeholder="New York"
          />

          <SimpleInput
            label="State"
            value={draft.province}
            onChange={(value) => setDraft({ ...draft, province: value })}
            placeholder="New York"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SimpleInput
            label="Manager Name"
            value={draft.managerName}
            onChange={(value) => setDraft({ ...draft, managerName: value })}
            placeholder="Emma Johnson"
          />

          <SimpleInput
            label="Manager Email"
            value={draft.managerEmail}
            onChange={(value) => setDraft({ ...draft, managerEmail: value })}
            placeholder="manager@multife.com"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SimpleSelect
            label="Sync Status"
            value={draft.status}
            options={["Synced", "Pending", "Error"]}
            onChange={(value) =>
              setDraft({ ...draft, status: value as ShopSyncStatus })
            }
          />

          <SimpleInput
            label="QR Codes"
            value={String(draft.qrCodes)}
            onChange={(value) =>
              setDraft({ ...draft, qrCodes: Number(value.replace(/\D/g, "")) || 0 })
            }
            placeholder="152"
          />

          <SimpleInput
            label="Active QR"
            value={String(draft.activeQrCodes)}
            onChange={(value) =>
              setDraft({
                ...draft,
                activeQrCodes: Number(value.replace(/\D/g, "")) || 0,
              })
            }
            placeholder="152"
          />
        </div>

        <SimpleInput
          label="Last Sync"
          value={draft.lastSync}
          onChange={(value) => setDraft({ ...draft, lastSync: value })}
          placeholder="May 7, 2025 10:24 AM"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Save Shop
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ShopSyncPill({ status }: { status: ShopSyncStatus }) {
  const style: Record<ShopSyncStatus, string> = {
    Synced: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-[#f7b519]/15 text-[#8a6200] border-[#f7b519]/30",
    Error: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`rounded-md border px-2.5 py-1 text-[11px] font-bold ${style[status]}`}>
      {status}
    </span>
  );
}


type QrRecordStatus = "Active" | "Unassigned";

type QrRecord = {
  id: string;
  codeId: string;
  outletName: string;
  slug: string;
  linkedShop: ShopName;
  city: string;
  scanCount: number;
  lastScanned: string;
  status: QrRecordStatus;
  createdAt: string;
  image: string;
};

const qrImagePool = [qrCode01, qrCode02, qrCode03, qrCode04, qrCode05, qrCode06];

const initialQrRecords: QrRecord[] = [
  {
    id: "qr-row-1",
    codeId: "QR-0001",
    outletName: "New York Flagship",
    slug: "new-york-flagship",
    linkedShop: "New York Flagship",
    city: "New York",
    scanCount: 342,
    lastScanned: "May 7, 2025 09:58 AM",
    status: "Active",
    createdAt: "Created: May 7, 2025 10:24 AM",
    image: qrCode01,
  },
  {
    id: "qr-row-2",
    codeId: "QR-0002",
    outletName: "Los Angeles Studio",
    slug: "los-angeles-studio",
    linkedShop: "Los Angeles Studio",
    city: "Los Angeles",
    scanCount: 287,
    lastScanned: "May 7, 2025 09:12 AM",
    status: "Active",
    createdAt: "Created: May 7, 2025 09:58 AM",
    image: qrCode02,
  },
  {
    id: "qr-row-3",
    codeId: "QR-0003",
    outletName: "Chicago Studio",
    slug: "chicago-studio",
    linkedShop: "Chicago Studio",
    city: "Chicago",
    scanCount: 198,
    lastScanned: "May 6, 2025 05:43 PM",
    status: "Active",
    createdAt: "Created: May 6, 2025 06:30 PM",
    image: qrCode03,
  },
  {
    id: "qr-row-4",
    codeId: "QR-0004",
    outletName: "Dallas Boutique",
    slug: "dallas-boutique",
    linkedShop: "Dallas Boutique",
    city: "Dallas",
    scanCount: 156,
    lastScanned: "May 6, 2025 02:47 PM",
    status: "Active",
    createdAt: "Created: May 6, 2025 03:12 PM",
    image: qrCode04,
  },
  {
    id: "qr-row-5",
    codeId: "QR-0005",
    outletName: "Miami Boutique",
    slug: "miami-boutique",
    linkedShop: "Miami Boutique",
    city: "Miami",
    scanCount: 89,
    lastScanned: "May 5, 2025 11:20 AM",
    status: "Active",
    createdAt: "Created: May 5, 2025 11:45 AM",
    image: qrCode05,
  },
  {
    id: "qr-row-6",
    codeId: "QR-0006",
    outletName: "MultiFe Studio",
    slug: "multife-studio",
    linkedShop: "All Shops",
    city: "Unassigned",
    scanCount: 0,
    lastScanned: "Never",
    status: "Unassigned",
    createdAt: "Created: May 4, 2025 04:15 PM",
    image: qrCode06,
  },
];

function QRCodeManagementPage({
  shops,
  records,
  setRecords,
}: {
  shops: ShopRecord[];
  records: QrRecord[];
  setRecords: Dispatch<SetStateAction<QrRecord[]>>;
}) {
  const [shopFilter, setShopFilter] = useState<ShopName | string>("All Shops");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [editQr, setEditQr] = useState<QrRecord | null>(null);
  const [syncOpen, setSyncOpen] = useState(false);
  const [syncTargetId, setSyncTargetId] = useState<string>("");

  const missingQrShops = useMemo(() => {
    return shops.filter(
      (shop) =>
        !records.some(
          (record) =>
            record.status === "Active" &&
            (record.outletName.toLowerCase() === shop.name.toLowerCase() ||
              record.slug.toLowerCase() === shop.slug.toLowerCase())
        )
    );
  }, [records, shops]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesShop =
        shopFilter === "All Shops" ||
        record.linkedShop === shopFilter ||
        record.outletName === shopFilter;

      const q = query.toLowerCase();
      const matchesQuery =
        record.codeId.toLowerCase().includes(q) ||
        record.outletName.toLowerCase().includes(q) ||
        record.slug.toLowerCase().includes(q) ||
        record.city.toLowerCase().includes(q);

      return matchesShop && matchesQuery;
    });
  }, [records, shopFilter, query]);

  const openSyncModal = (recordId?: string) => {
    setSyncTargetId(recordId || filteredRecords[0]?.id || records[0]?.id || "");
    setSyncOpen(true);
    setMenuId(null);
  };

  const downloadSingleQr = (record: QrRecord) => {
    const anchor = document.createElement("a");
    anchor.href = record.image;
    anchor.download = `${record.codeId.toLowerCase()}.png`;
    anchor.click();
    setNotice(`${record.codeId} downloaded.`);
  };

  const downloadVisibleQr = () => {
    if (!filteredRecords.length) {
      setNotice("No QR code available to download.");
      return;
    }

    downloadSingleQr(filteredRecords[0]);
  };

  const saveQr = (draft: QrRecord) => {
    setRecords((prev) =>
      prev.map((item) =>
        item.id === draft.id
          ? {
              ...item,
              status: draft.status,
            }
          : item
      )
    );

    setEditQr(null);
    setNotice(`${draft.codeId} status updated.`);
  };

  const syncQrToShop = (recordId: string, shopId: string) => {
    const selectedShop = shops.find((shop) => shop.id === shopId);
    if (!selectedShop) return;

    setRecords((prev) =>
      prev.map((item) =>
        item.id === recordId
          ? {
              ...item,
              outletName: selectedShop.name,
              slug: selectedShop.slug,
              linkedShop: selectedShop.name as ShopName,
              city: selectedShop.city,
              status: "Active",
              lastScanned: "Just synced",
            }
          : item
      )
    );

    const target = records.find((item) => item.id === recordId);
    setNotice(`${target?.codeId || "QR code"} synced to ${selectedShop.name}.`);
    setSyncOpen(false);
  };

  const duplicateQr = (record: QrRecord) => {
    const nextNumber = records.length + 1;
    const nextImage = qrImagePool[(nextNumber - 1) % qrImagePool.length];

    setRecords((prev) => [
      {
        ...record,
        id: `qr-row-${Date.now()}`,
        codeId: `QR-${String(nextNumber).padStart(4, "0")}`,
        createdAt: "Created: Just now",
        lastScanned: "Never",
        scanCount: 0,
        image: nextImage,
      },
      ...prev,
    ]);

    setMenuId(null);
    setNotice(`${record.codeId} duplicated.`);
  };

  const deleteQr = (recordId: string) => {
    setRecords((prev) => prev.filter((item) => item.id !== recordId));
    setMenuId(null);
    setNotice("QR code removed. Solve missing QR issues before the shop can work properly.");
  };

  const createMissingQrCodes = () => {
    if (missingQrShops.length === 0) {
      setNotice("All shops already have active QR codes.");
      return;
    }

    setRecords((prev) => {
      const existingKeys = new Set(
        prev.map((record) => `${record.outletName.toLowerCase()}__${record.slug.toLowerCase()}`)
      );

      const newRecords = missingQrShops
        .filter(
          (shop) =>
            !existingKeys.has(`${shop.name.toLowerCase()}__${shop.slug.toLowerCase()}`)
        )
        .map((shop, index) => {
          const nextNumber = prev.length + index + 1;
          const nextImage = qrImagePool[(nextNumber - 1) % qrImagePool.length];

          return {
            id: `qr-row-${Date.now()}-${index}`,
            codeId: `QR-${String(nextNumber).padStart(4, "0")}`,
            outletName: shop.name,
            slug: shop.slug,
            linkedShop: shop.name as ShopName,
            city: shop.city,
            scanCount: 0,
            lastScanned: "Never",
            status: "Active" as QrRecordStatus,
            createdAt: "Created: Issue fixed now",
            image: nextImage,
          };
        });

      return [...prev, ...newRecords];
    });

    setNotice(`${missingQrShops.length} missing shop QR code(s) created and linked successfully.`);
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div>
        <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
          QR Code & Shop Sync Management
        </h2>
        <p className="mt-1 text-sm font-medium text-[#718096]">
          Manage shop QR codes. The system creates QR codes automatically when a new shop is added.
        </p>
      </div>

      {missingQrShops.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p>
                Solve this issue: {missingQrShops.length} shop(s) do not have an active QR code.
                Without QR sync, that shop portal will not work properly.
              </p>
              <span className="mt-1 block text-xs font-semibold text-red-600">
                Missing QR: {missingQrShops.map((shop) => shop.name).join(", ")}
              </span>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-xs font-semibold leading-5 text-red-600">
                <li>Click “Create Missing QR Codes”.</li>
                <li>The system will create one unique QR for every missing shop.</li>
                <li>Use “Sync to Shop” only when an existing QR needs to be re-linked to another shop.</li>
              </ol>
            </div>

            <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              <button
                type="button"
                onClick={createMissingQrCodes}
                className="flex h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-red-700"
              >
                <Plus className="h-4 w-4" />
                Create Missing QR Codes
              </button>

              <button
                type="button"
                onClick={() => openSyncModal()}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-bold text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4" />
                Sync Existing QR
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[#e7edf5] bg-white p-4 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <select
            value={shopFilter}
            onChange={(event) => setShopFilter(event.target.value)}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            <option>All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id}>{shop.name}</option>
            ))}
          </select>

          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-[#dfe7f1] bg-white px-3">
            <Search className="h-4 w-4 text-[#718096]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search shop or QR code..."
              className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-[#9aa7ba]"
            />
          </div>

          <button
            type="button"
            onClick={downloadVisibleQr}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
          >
            <FileText className="h-4 w-4" />
            Download QR
          </button>

          <button
            type="button"
            onClick={() => openSyncModal()}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white hover:bg-[#0a2048]"
          >
            <RefreshCw className="h-4 w-4 text-[#f7b519]" />
            Sync to Shop
          </button>
        </div>

        {notice && (
          <div className="mt-3 rounded-lg border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-sm font-bold text-[#8a6200]">
            {notice}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left">
            <thead>
              <tr className="border-b border-[#eef2f7] bg-white">
                {[
                  "QR Preview",
                  "QR Code ID",
                  "Shop / Outlet",
                  "Linked Shop",
                  "Scan Count",
                  "Last Scanned",
                  "Status",
                  "Actions",
                ].map((item) => (
                  <th
                    key={item}
                    className="px-4 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-[#eef2f7] last:border-b-0">
                  <td className="px-4 py-4">
                    <div className="h-[56px] w-[56px] overflow-hidden rounded-md border border-[#e7edf5] bg-white p-1">
                      <img
                        src={record.image}
                        alt={record.codeId}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-[#071633]">{record.codeId}</p>
                    <p className="mt-1 text-xs font-semibold text-[#718096]">{record.createdAt}</p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-[#071633]">{record.outletName}</p>
                    <p className="mt-1 text-xs font-semibold text-[#718096]">{record.slug}</p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-bold text-[#071633]">
                      {record.linkedShop === "All Shops" ? "—" : record.linkedShop}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#718096]">
                      {record.linkedShop === "All Shops" ? "Unassigned" : record.city}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm font-bold text-[#071633]">
                    {record.scanCount}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-[#51617a]">
                    {record.lastScanned}
                  </td>

                  <td className="px-4 py-4">
                    <QrStatusPill status={record.status} />
                  </td>

                  <td className="relative px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditQr(record)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                        title="Edit QR status"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadSingleQr(record)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                        title="Download QR"
                      >
                        <FileText className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setMenuId(menuId === record.id ? null : record.id)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                        title="More actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {menuId === record.id && (
                      <div className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_35px_rgba(7,22,51,0.12)]">
                        <button
                          type="button"
                          onClick={() => {
                            setEditQr(record);
                            setMenuId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Edit status
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateQr(record)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteQr(record.id)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#eef2f7] px-5 py-4 text-sm font-semibold text-[#718096] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-[#dfe7f1] text-[11px] font-bold text-[#718096]">
              i
            </div>
            <div>
              <p>QR codes are created by the system when a shop is added.</p>
              <p>Use Sync to Shop when you need to re-link a QR to a different shop.</p>
            </div>
          </div>
          <span>
            Showing {filteredRecords.length} of {records.length} QR codes
          </span>
        </div>
      </div>

      {editQr && (
        <QrEditorModal
          record={editQr}
          onClose={() => setEditQr(null)}
          onSave={saveQr}
        />
      )}

      {syncOpen && (
        <QrSyncModal
          recordId={syncTargetId}
          records={records}
          shops={shops}
          onClose={() => setSyncOpen(false)}
          onSync={syncQrToShop}
        />
      )}
    </div>
  );
}

function QrEditorModal({
  record,
  onClose,
  onSave,
}: {
  record: QrRecord;
  onClose: () => void;
  onSave: (record: QrRecord) => void;
}) {
  const [draft, setDraft] = useState<QrRecord>(record);

  return (
    <ModalShell title="Edit QR Code Status" onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
        className="space-y-4"
      >
        <div className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#718096]">
            QR Code ID
          </p>
          <p className="mt-2 text-sm font-bold text-[#071633]">{record.codeId}</p>
        </div>

        <div className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#718096]">
            Shop / Outlet
          </p>
          <p className="mt-2 text-sm font-bold text-[#071633]">{record.outletName}</p>
          <p className="mt-1 text-xs font-semibold text-[#718096]">{record.city}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#718096]">
              Scan Count
            </p>
            <p className="mt-2 text-sm font-bold text-[#071633]">{record.scanCount}</p>
          </div>

          <div className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#718096]">
              Last Scanned
            </p>
            <p className="mt-2 text-sm font-bold text-[#071633]">{record.lastScanned}</p>
          </div>
        </div>

        <SimpleSelect
          label="Status"
          value={draft.status}
          options={["Active", "Unassigned"]}
          onChange={(value) => setDraft({ ...draft, status: value as QrRecordStatus })}
        />

        <div className="rounded-xl border border-[#f7b519]/30 bg-[#f7b519]/10 p-4 text-sm font-bold text-[#8a6200]">
          QR number, shop/outlet, city and scan count are system-controlled. To change shop mapping, use the Sync to Shop button.
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Save Status
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function QrSyncModal({
  recordId,
  records,
  shops,
  onClose,
  onSync,
}: {
  recordId: string;
  records: QrRecord[];
  shops: ShopRecord[];
  onClose: () => void;
  onSync: (recordId: string, shopId: string) => void;
}) {
  const defaultRecord = records.find((item) => item.id === recordId) || records[0];
  const [selectedRecordId, setSelectedRecordId] = useState(defaultRecord?.id || "");
  const [selectedShopId, setSelectedShopId] = useState(
    shops.find((shop) => shop.name === defaultRecord?.outletName)?.id || shops[0]?.id || ""
  );

  const selectedRecord = records.find((item) => item.id === selectedRecordId);
  const selectedShop = shops.find((shop) => shop.id === selectedShopId);

  return (
    <ModalShell title="Sync QR to Shop" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm font-semibold leading-6 text-[#718096]">
          Select one QR code and one shop. Every shop keeps a separate QR so the
          portal opens the right shop data and does not mix orders.
        </p>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#071633]">QR Code</span>
          <select
            value={selectedRecordId}
            onChange={(event) => setSelectedRecordId(event.target.value)}
            className="h-12 w-full rounded-lg border border-[#d9e1eb] bg-white px-4 text-sm font-semibold text-[#071633] outline-none focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
          >
            {records.map((item) => (
              <option key={item.id} value={item.id}>
                {item.codeId} — {item.outletName}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
          <p className="text-sm font-bold text-[#071633]">
            {selectedRecord?.codeId || "No QR selected"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#718096]">
            Current outlet: {selectedRecord?.outletName || "—"}
          </p>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#071633]">Target Shop</span>
          <select
            value={selectedShopId}
            onChange={(event) => setSelectedShopId(event.target.value)}
            className="h-12 w-full rounded-lg border border-[#d9e1eb] bg-white px-4 text-sm font-semibold text-[#071633] outline-none focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
          >
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name} — {shop.city}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-xl border border-[#e7edf5] bg-white p-4">
          <p className="text-sm font-bold text-[#071633]">
            {selectedShop?.name || "No shop selected"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#718096]">
            {selectedShop ? `${selectedShop.city}, ${selectedShop.province}` : "—"}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSync(selectedRecordId, selectedShopId)}
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Sync Now
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
function QrStatusPill({ status }: { status: QrRecordStatus }) {
  const style: Record<QrRecordStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Unassigned: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span className={`rounded-md border px-2.5 py-1 text-[11px] font-bold ${style[status]}`}>
      {status}
    </span>
  );
}



type TemplateCategory = "Neckline" | "Sleeves" | "Fit & Length" | "Add-ons";

type TemplateStatus = "Active" | "Inactive";

type TemplateRecord = {
  id: string;
  name: string;
  category: TemplateCategory;
  supportedStyles: string[];
  status: TemplateStatus;
  assignedShops: ShopName[];
  description: string;
  imageFile: string;
};

const templateImageMap: Record<string, string> = {
  "round_neck.png": roundNeckTemplateImage,
  "v_neck.png": vNeckTemplateImage,
  "boat_neck.png": boatNeckTemplateImage,
  "full_sleeves.png": fullSleevesTemplateImage,
  "half_sleeves.png": halfSleevesTemplateImage,
  "ankle_length.png": ankleLengthTemplateImage,
  "above_knee.png": aboveKneeTemplateImage,
  "flared_hem.png": flaredHemTemplateImage,
};

const initialTemplates: TemplateRecord[] = [
  {
    id: "TMP-001",
    name: "Round Neck",
    category: "Neckline",
    supportedStyles: ["Dress", "Blouse", "Top"],
    status: "Active",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Dallas Boutique", "Miami Boutique"],
    description: "Classic round neckline for everyday United Statesi custom womenswear.",
    imageFile: "round_neck.png",
  },
  {
    id: "TMP-002",
    name: "V-Neck",
    category: "Neckline",
    supportedStyles: ["Dress", "Blouse", "Top"],
    status: "Active",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Dallas Boutique", "Miami Boutique"],
    description: "Clean V-neck option for straight tops and blouses.",
    imageFile: "v_neck.png",
  },
  {
    id: "TMP-003",
    name: "Boat Neck",
    category: "Neckline",
    supportedStyles: ["Dress", "Blouse"],
    status: "Active",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Dallas Boutique"],
    description: "Wide boat neckline for elegant formal and semi-formal tops.",
    imageFile: "boat_neck.png",
  },
  {
    id: "TMP-004",
    name: "Full Sleeves",
    category: "Sleeves",
    supportedStyles: ["Dress", "Blouse", "Top"],
    status: "Active",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Dallas Boutique", "Miami Boutique", "Seattle Studio"],
    description: "Full sleeve template with relaxed stitching allowance.",
    imageFile: "full_sleeves.png",
  },
  {
    id: "TMP-005",
    name: "Half Sleeves",
    category: "Sleeves",
    supportedStyles: ["Dress", "Blouse"],
    status: "Active",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Dallas Boutique", "Miami Boutique", "Seattle Studio"],
    description: "Half sleeve option for summer cotton and cotton outfits.",
    imageFile: "half_sleeves.png",
  },
  {
    id: "TMP-006",
    name: "Ankle Length",
    category: "Fit & Length",
    supportedStyles: ["Dress", "Blouse"],
    status: "Active",
    assignedShops: ["New York Flagship", "Chicago Studio", "Dallas Boutique", "Miami Boutique"],
    description: "Long ankle-length silhouette for formal custom womenswear.",
    imageFile: "ankle_length.png",
  },
  {
    id: "TMP-007",
    name: "Above Knee",
    category: "Fit & Length",
    supportedStyles: ["Blouse", "Top"],
    status: "Active",
    assignedShops: ["Los Angeles Studio", "Chicago Studio", "Miami Boutique"],
    description: "Above-knee cut for modern short blouses and casual tops.",
    imageFile: "above_knee.png",
  },
  {
    id: "TMP-008",
    name: "Flared Hem",
    category: "Add-ons",
    supportedStyles: ["Dress", "Blouse"],
    status: "Active",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Dallas Boutique"],
    description: "Flared hem add-on for softer flow and movement.",
    imageFile: "flared_hem.png",
  },
];

function TemplateManagementPage({ shops }: { shops: ShopRecord[] }) {
  const [templates, setTemplates] = useState<TemplateRecord[]>(initialTemplates);
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | "All Categories">("All Categories");
  const [query, setQuery] = useState("");
  const [editorTemplate, setEditorTemplate] = useState<TemplateRecord | null>(null);
  const [viewTemplate, setViewTemplate] = useState<TemplateRecord | null>(null);
  const [syncTemplate, setSyncTemplate] = useState<TemplateRecord | null>(null);
  const [menuTemplateId, setMenuTemplateId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory =
        categoryFilter === "All Categories" || template.category === categoryFilter;
      const search = query.toLowerCase();
      const matchesQuery =
        template.name.toLowerCase().includes(search) ||
        template.category.toLowerCase().includes(search) ||
        template.supportedStyles.join(" ").toLowerCase().includes(search);

      return matchesCategory && matchesQuery;
    });
  }, [categoryFilter, query, templates]);

  const addTemplate = () => {
    const nextNumber = templates.length + 1;
    setEditorTemplate({
      id: `TMP-${String(nextNumber).padStart(3, "0")}`,
      name: "",
      category: "Neckline",
      supportedStyles: ["Dress", "Blouse"],
      status: "Active",
      assignedShops: [],
      description: "New style option for MultiFe catalog.",
      imageFile: "round_neck.png",
    });
  };

  const saveTemplate = (template: TemplateRecord) => {
    setTemplates((prev) => {
      const exists = prev.some((item) => item.id === template.id);
      if (exists) return prev.map((item) => (item.id === template.id ? template : item));
      return [template, ...prev];
    });
    setEditorTemplate(null);
    setNotice(`${template.name || "Style option"} saved successfully.`);
  };

  const syncTemplateToShops = (templateId: string, selectedShops: ShopName[]) => {
    setTemplates((prev) =>
      prev.map((template) =>
        template.id === templateId
          ? { ...template, assignedShops: selectedShops }
          : template
      )
    );

    const template = templates.find((item) => item.id === templateId);
    setSyncTemplate(null);
    setNotice(`${template?.name || "Style option"} synced to ${selectedShops.length} shop(s).`);
  };

  const toggleTemplateStatus = (template: TemplateRecord) => {
    const nextStatus: TemplateStatus = template.status === "Active" ? "Inactive" : "Active";
    saveTemplate({ ...template, status: nextStatus });
    setMenuTemplateId(null);
  };

  const duplicateTemplate = (template: TemplateRecord) => {
    const nextNumber = templates.length + 1;
    setTemplates((prev) => [
      {
        ...template,
        id: `TMP-${String(nextNumber).padStart(3, "0")}`,
        name: `${template.name} Copy`,
      },
      ...prev,
    ]);
    setMenuTemplateId(null);
    setNotice(`${template.name} duplicated.`);
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== templateId));
    setMenuTemplateId(null);
    setNotice("Style option removed from this prototype.");
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
            Style Options Management
          </h2>
          <p className="mt-1 text-sm font-medium text-[#718096]">
            Create, organize and manage style options for neckline, sleeves, fit & length and more.
          </p>
        </div>

        <button
          type="button"
          onClick={addTemplate}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white hover:bg-[#0a2048]"
        >
          <Plus className="h-4 w-4 text-[#f7b519]" />
          Add Style Option
        </button>
      </div>

      <div className="rounded-2xl border border-[#e7edf5] bg-white p-4 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value as TemplateCategory | "All Categories")
            }
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            <option>All Categories</option>
            <option>Neckline</option>
            <option>Sleeves</option>
            <option>Fit & Length</option>
            <option>Add-ons</option>
          </select>

          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-[#dfe7f1] bg-white px-3">
            <Search className="h-4 w-4 text-[#718096]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search style options..."
              className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-[#9aa7ba]"
            />
          </div>

          <button
            type="button"
            onClick={() => setNotice("Select a row menu to sync an individual style option to shops.")}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
          >
            <RefreshCw className="h-4 w-4" />
            Sync to Shops
          </button>
        </div>

        {notice && (
          <div className="mt-3 rounded-lg border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-sm font-bold text-[#8a6200]">
            {notice}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className="border-b border-[#eef2f7] bg-white">
                {["Style Option Name", "Category", "Supported Styles", "Active Status", "Assigned Shops", "Actions"].map(
                  (item) => (
                    <th
                      key={item}
                      className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                    >
                      {item}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="border-b border-[#eef2f7] last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <TemplateImagePreview imageFile={template.imageFile} compact />
                      <button
                        type="button"
                        onClick={() => setViewTemplate(template)}
                        className="text-left"
                      >
                        <p className="text-sm font-bold text-[#071633] hover:text-[#a87300]">
                          {template.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#718096]">
                          {template.category}
                        </p>
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#51617a]">
                    {template.category}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#51617a]">
                    {template.supportedStyles.join(", ")}
                  </td>

                  <td className="px-5 py-4">
                    <TemplateStatusPill status={template.status} />
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[#071633]">
                    {template.assignedShops.length} Shops
                  </td>

                  <td className="relative px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewTemplate(template)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                        title="View style option"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditorTemplate(template)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                        title="Edit style option"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setMenuTemplateId(menuTemplateId === template.id ? null : template.id)
                        }
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                        title="More actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {menuTemplateId === template.id && (
                      <div className="absolute right-5 top-12 z-20 w-52 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_35px_rgba(7,22,51,0.12)]">
                        <button
                          type="button"
                          onClick={() => {
                            setViewTemplate(template);
                            setMenuTemplateId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSyncTemplate(template);
                            setMenuTemplateId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Sync to shops
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleTemplateStatus(template)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Toggle status
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateTemplate(template)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTemplate(template.id)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#eef2f7] px-5 py-4 text-sm font-semibold text-[#718096] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing 1 to {filteredTemplates.length} of {templates.length} style options
          </span>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-lg text-[#718096]">
              ‹
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-sm font-bold text-[#071633]">
              1
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-lg text-[#718096]">
              ›
            </button>
          </div>
        </div>
      </div>

      {editorTemplate && (
        <TemplateEditorModal
          template={editorTemplate}
          onClose={() => setEditorTemplate(null)}
          onSave={saveTemplate}
        />
      )}

      {viewTemplate && (
        <TemplateDetailModal
          template={viewTemplate}
          onClose={() => setViewTemplate(null)}
          onEdit={() => {
            setEditorTemplate(viewTemplate);
            setViewTemplate(null);
          }}
          onSync={() => {
            setSyncTemplate(viewTemplate);
            setViewTemplate(null);
          }}
        />
      )}

      {syncTemplate && (
        <TemplateSyncModal
          template={syncTemplate}
          shops={shops}
          onClose={() => setSyncTemplate(null)}
          onSync={syncTemplateToShops}
        />
      )}
    </div>
  );
}

function TemplateImagePreview({
  imageFile,
  compact = false,
  large = false,
}: {
  imageFile: string;
  compact?: boolean;
  large?: boolean;
}) {
  const imageSrc = templateImageMap[imageFile];
  const sizeClass = large ? "h-[280px] w-full" : compact ? "h-12 w-12" : "h-24 w-24";

  return (
    <div className={`${sizeClass} shrink-0 overflow-hidden rounded-lg border border-[#e7edf5] bg-[#f8fafc]`}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageFile.replace(/_/g, " ").replace(".png", "")}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <ClipboardList className={`${large ? "h-9 w-9" : "h-5 w-5"} text-[#9aa7ba]`} />
          <span className={`${large ? "mt-3 text-sm" : "mt-1 text-[9px]"} max-w-full break-all px-1 font-bold text-[#718096]`}>
            {imageFile}
          </span>
        </div>
      )}
    </div>
  );
}

function TemplateStatusPill({ status }: { status: TemplateStatus }) {
  const style: Record<TemplateStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactive: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`rounded-md border px-2.5 py-1 text-[11px] font-bold ${style[status]}`}>
      {status}
    </span>
  );
}

function DetailList({ items }: { items: string[][] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4"
        >
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#718096]">
            {label}
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-[#071633]">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

function TemplateEditorModal({
  template,
  onClose,
  onSave,
}: {
  template: TemplateRecord;
  onClose: () => void;
  onSave: (template: TemplateRecord) => void;
}) {
  const [draft, setDraft] = useState<TemplateRecord>(template);

  const styleOptions = ["Dress", "Blouse", "Top", "Scarf", "Trouser"];

  const toggleStyle = (style: string) => {
    setDraft((prev) => ({
      ...prev,
      supportedStyles: prev.supportedStyles.includes(style)
        ? prev.supportedStyles.filter((item) => item !== style)
        : [...prev.supportedStyles, style],
    }));
  };

  return (
    <ModalShell title={template.name ? "Edit Template" : "Add Style Option"} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
        className="space-y-4"
      >
        <SimpleInput
          label="Style Option Name"
          value={draft.name}
          onChange={(value) => setDraft({ ...draft, name: value })}
          placeholder="Round Neck"
        />

        <div className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
          <p className="mb-3 text-sm font-bold text-[#071633]">Style Option Image</p>
          <div className="flex items-center gap-4">
            <TemplateImagePreview imageFile={draft.imageFile} />
            <div className="flex-1">
              <SimpleInput
                label="Image File Name"
                value={draft.imageFile}
                onChange={(value) => setDraft({ ...draft, imageFile: value })}
                placeholder="round_neck.png"
              />
              <p className="mt-2 text-xs font-semibold text-[#718096]">
                Save image inside src/assets/images/templates with this exact name.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SimpleSelect
            label="Category"
            value={draft.category}
            options={["Neckline", "Sleeves", "Fit & Length", "Add-ons"]}
            onChange={(value) => setDraft({ ...draft, category: value as TemplateCategory })}
          />

          <SimpleSelect
            label="Status"
            value={draft.status}
            options={["Active", "Inactive"]}
            onChange={(value) => setDraft({ ...draft, status: value as TemplateStatus })}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-[#071633]">Supported Styles</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {styleOptions.map((style) => {
              const active = draft.supportedStyles.includes(style);

              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleStyle(style)}
                  className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    active
                      ? "border-[#071633] bg-[#071633] text-white"
                      : "border-[#dfe7f1] bg-white text-[#51617a] hover:border-[#f7b519]"
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#071633]">Description</span>
          <textarea
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            className="h-[110px] w-full resize-none rounded-lg border border-[#d9e1eb] bg-white p-4 text-sm font-semibold text-[#071633] outline-none focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Save Style Option
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function TemplateDetailModal({
  template,
  onClose,
  onEdit,
  onSync,
}: {
  template: TemplateRecord;
  onClose: () => void;
  onEdit: () => void;
  onSync: () => void;
}) {
  return (
    <ModalShell title="Style Option Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-4 rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
          <TemplateImagePreview imageFile={template.imageFile} compact />
          <div>
            <h3 className="text-xl font-bold text-[#071633]">{template.name}</h3>
            <p className="mt-1 text-sm font-semibold text-[#718096]">
              {template.category} • {template.id}
            </p>
          </div>
        </div>

        <TemplateImagePreview imageFile={template.imageFile} large />

        <DetailList
          items={[
            ["Status", template.status],
            ["Supported Styles", template.supportedStyles.join(", ")],
            ["Assigned Shops", `${template.assignedShops.length} Shops`],
            ["Usage", "24 active style options"],
          ]}
        />

        <div className="rounded-xl border border-[#e7edf5] bg-white p-4">
          <p className="text-sm font-bold text-[#071633]">Description</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#51617a]">
            {template.description}
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onEdit}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onSync}
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Sync to Shops
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function TemplateSyncModal({
  template,
  shops,
  onClose,
  onSync,
}: {
  template: TemplateRecord;
  shops: ShopRecord[];
  onClose: () => void;
  onSync: (templateId: string, selectedShops: ShopName[]) => void;
}) {
  const [selectedShops, setSelectedShops] = useState<ShopName[]>(template.assignedShops);

  const toggleShop = (shopName: ShopName) => {
    setSelectedShops((prev) =>
      prev.includes(shopName)
        ? prev.filter((item) => item !== shopName)
        : [...prev, shopName]
    );
  };

  const selectAll = () => {
    setSelectedShops(shops.map((shop) => shop.name as ShopName));
  };

  return (
    <ModalShell title="Sync Style Option to Shops" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm font-semibold leading-6 text-[#718096]">
          Select which shops should use <span className="font-bold text-[#071633]">{template.name}</span>. This controls template visibility across shop portals.
        </p>

        <button
          type="button"
          onClick={selectAll}
          className="h-10 rounded-lg border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
        >
          Select All Shops
        </button>

        <div className="grid gap-3 sm:grid-cols-2">
          {shops.map((shop) => {
            const checked = selectedShops.includes(shop.name as ShopName);

            return (
              <button
                key={shop.id}
                type="button"
                onClick={() => toggleShop(shop.name as ShopName)}
                className={`rounded-xl border p-4 text-left transition ${
                  checked
                    ? "border-[#071633] bg-[#071633] text-white"
                    : "border-[#e7edf5] bg-[#f8fafc] text-[#071633]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">{shop.name}</p>
                    <p className={`mt-1 text-xs font-semibold ${checked ? "text-white/70" : "text-[#718096]"}`}>
                      {shop.city}, {shop.province}
                    </p>
                  </div>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${checked ? "border-[#f7b519] bg-[#f7b519]" : "border-[#cbd5e1]"}`}>
                    {checked && <CheckCircle2 className="h-4 w-4 text-[#071633]" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSync(template.id, selectedShops)}
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Sync Template
          </button>
        </div>
      </div>
    </ModalShell>
  );
}


type FabricCategory =
  | "Cotton Poplin"
  | "Cotton"
  | "Linen"
  | "Gauze"
  | "Silk"
  | "Chiffon"
  | "Velvet";

type FabricAvailability = "In Stock" | "Low Stock" | "Out of Stock";

type FabricRecord = {
  id: string;
  name: string;
  variant: string;
  category: FabricCategory;
  colorName: string;
  colorHex: string;
  pricePerYard: number;
  stockYards: number;
  availability: FabricAvailability;
  assignedShops: ShopName[];
  imageFile: string;
  imagePreview?: string;
  dressesCount: number;
  relatedOrders: string[];
  description: string;
};

const fabricImageMap: Record<string, string> = {
  "floral_cotton_poplin.png": lawnPremiumImage,
  "sky_blue_cambric.png": cottonCambricImage,
  "natural_linen_slub.png": linenSlubImage,
  "maroon_embroidered_gauze.png": khaddarEmbroideredImage,
  "navy_silk_satin.png": silkSatinImage,
  "printed_chiffon.png": chiffonPrintedImage,
  "emerald_velvet.png": velvetPlainImage,
  "ivory_floral_cotton.png": cambricPrintedImage,

  // Backward-compatible aliases for existing files in your assets folder
  "lawn_premium.png": lawnPremiumImage,
  "cotton_cambric.png": cottonCambricImage,
  "linen_slub.png": linenSlubImage,
  "khaddar_embroidered.png": khaddarEmbroideredImage,
  "silk_satin.png": silkSatinImage,
  "chiffon_printed.png": chiffonPrintedImage,
  "velvet_plain.png": velvetPlainImage,
  "cambric_printed.png": cambricPrintedImage,
};

const initialFabrics: FabricRecord[] = [
  {
    id: "FAB-001",
    name: "Floral Cotton Poplin",
    variant: "Digital Print",
    category: "Cotton Poplin",
    colorName: "Multicolor",
    colorHex: "#f7c84b",
    pricePerYard: 18,
    stockYards: 245,
    availability: "In Stock",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Dallas Boutique", "Miami Boutique"],
    imageFile: "floral_cotton_poplin.png",
    dressesCount: 86,
    relatedOrders: ["#ORD-250507-0042", "#ORD-250506-0091", "#ORD-250505-0088"],
    description: "Premium United Statesi summer cotton with digital print for daily wear, blouses and two-piece sets.",
  },
  {
    id: "FAB-002",
    name: "Cotton Cambric",
    variant: "Dyed",
    category: "Cotton",
    colorName: "Sky Blue",
    colorHex: "#a9d5f4",
    pricePerYard: 14,
    stockYards: 180,
    availability: "In Stock",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Miami Boutique"],
    imageFile: "sky_blue_cambric.png",
    dressesCount: 64,
    relatedOrders: ["#ORD-250507-0038", "#ORD-250506-0064"],
    description: "Soft dyed cambric cotton suitable for casual tops, blouses and office wear.",
  },
  {
    id: "FAB-003",
    name: "Linen Slub",
    variant: "Plain",
    category: "Linen",
    colorName: "Beige",
    colorHex: "#c8b79f",
    pricePerYard: 22,
    stockYards: 95,
    availability: "In Stock",
    assignedShops: ["New York Flagship", "Chicago Studio", "Dallas Boutique"],
    imageFile: "natural_linen_slub.png",
    dressesCount: 38,
    relatedOrders: ["#ORD-250504-0029", "#ORD-250503-0018"],
    description: "Textured linen slub for premium custom apparel and minimal dress silhouettes.",
  },
  {
    id: "FAB-004",
    name: "Embroidered Gauze",
    variant: "Embroidered",
    category: "Gauze",
    colorName: "Maroon",
    colorHex: "#78182a",
    pricePerYard: 26,
    stockYards: 60,
    availability: "Low Stock",
    assignedShops: ["Los Angeles Studio", "Miami Boutique"],
    imageFile: "embroidered gauze_embroidered.png",
    dressesCount: 24,
    relatedOrders: ["#ORD-250502-0061"],
    description: "Embroidered cotton gauze with subtle texture, best for seasonal dresses and premium tops.",
  },
  {
    id: "FAB-005",
    name: "Silk Satin",
    variant: "Solid",
    category: "Silk",
    colorName: "Navy Blue",
    colorHex: "#071633",
    pricePerYard: 36,
    stockYards: 35,
    availability: "Low Stock",
    assignedShops: ["New York Flagship", "Los Angeles Studio"],
    imageFile: "navy_silk_satin.png",
    dressesCount: 17,
    relatedOrders: ["#ORD-250501-0044"],
    description: "Glossy silk satin for formal custom apparel, eveningwear and occasion tops.",
  },
  {
    id: "FAB-006",
    name: "Chiffon",
    variant: "Printed",
    category: "Chiffon",
    colorName: "Floral",
    colorHex: "#f4a7c8",
    pricePerYard: 16,
    stockYards: 210,
    availability: "In Stock",
    assignedShops: ["New York Flagship", "Los Angeles Studio", "Chicago Studio", "Dallas Boutique"],
    imageFile: "printed_chiffon.png",
    dressesCount: 73,
    relatedOrders: ["#ORD-250430-0078", "#ORD-250429-0049"],
    description: "Light printed chiffon for scarves, overlays and semi-formal dress details.",
  },
  {
    id: "FAB-007",
    name: "Velvet",
    variant: "Plain",
    category: "Velvet",
    colorName: "Dark Green",
    colorHex: "#06472f",
    pricePerYard: 34,
    stockYards: 28,
    availability: "Low Stock",
    assignedShops: ["New York Flagship"],
    imageFile: "emerald_velvet.png",
    dressesCount: 11,
    relatedOrders: ["#ORD-250428-0021"],
    description: "Rich plain velvet for formal winter pieces, waistcoats and premium detailing.",
  },
  {
    id: "FAB-008",
    name: "Cambric",
    variant: "Printed",
    category: "Cotton",
    colorName: "White Base",
    colorHex: "#f8fafc",
    pricePerYard: 15,
    stockYards: 150,
    availability: "In Stock",
    assignedShops: ["Los Angeles Studio", "Chicago Studio", "Miami Boutique"],
    imageFile: "ivory_floral_cotton.png",
    dressesCount: 52,
    relatedOrders: ["#ORD-250427-0030", "#ORD-250426-0090"],
    description: "Printed cambric with white base for everyday stitched suits and summer collections.",
  },
];

function FabricManagementPage({ shops }: { shops: ShopRecord[] }) {
  const [fabrics, setFabrics] = useState<FabricRecord[]>(initialFabrics);
  const [categoryFilter, setCategoryFilter] = useState<FabricCategory | "All Categories">("All Categories");
  const [colorFilter, setColorFilter] = useState<string>("All Colors");
  const [query, setQuery] = useState("");
  const [selectedFabricId, setSelectedFabricId] = useState<string | null>(null);
  const [editorFabric, setEditorFabric] = useState<FabricRecord | null>(null);
  const [syncFabric, setSyncFabric] = useState<FabricRecord | null>(null);
  const [menuFabricId, setMenuFabricId] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedFabric = fabrics.find((fabric) => fabric.id === selectedFabricId) || null;

  const colorOptions = useMemo(
    () => ["All Colors", ...Array.from(new Set(fabrics.map((fabric) => fabric.colorName)))],
    [fabrics]
  );

  const filteredFabrics = useMemo(() => {
    return fabrics.filter((fabric) => {
      const search = query.toLowerCase();
      const matchesQuery =
        fabric.name.toLowerCase().includes(search) ||
        fabric.variant.toLowerCase().includes(search) ||
        fabric.category.toLowerCase().includes(search) ||
        fabric.colorName.toLowerCase().includes(search) ||
        fabric.imageFile.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All Categories" || fabric.category === categoryFilter;

      const matchesColor =
        colorFilter === "All Colors" || fabric.colorName === colorFilter;

      return matchesQuery && matchesCategory && matchesColor;
    });
  }, [categoryFilter, colorFilter, fabrics, query]);

  const saveFabric = (fabric: FabricRecord) => {
    setFabrics((prev) => {
      const exists = prev.some((item) => item.id === fabric.id);
      if (exists) {
        return prev.map((item) => (item.id === fabric.id ? fabric : item));
      }
      return [fabric, ...prev];
    });

    setEditorFabric(null);
    setNotice(`${fabric.name} saved successfully.`);
  };

  const updateFabric = (fabric: FabricRecord) => {
    setFabrics((prev) => prev.map((item) => (item.id === fabric.id ? fabric : item)));
    setNotice(`${fabric.name} updated.`);
  };

  const addFabric = () => {
    const nextNumber = fabrics.length + 1;
    setEditorFabric({
      id: `FAB-${String(nextNumber).padStart(3, "0")}`,
      name: "",
      variant: "",
      category: "Cotton Poplin",
      colorName: "Multicolor",
      colorHex: "#f7c84b",
      pricePerYard: 1000,
      stockYards: 0,
      availability: "In Stock",
      assignedShops: [],
      imageFile: `fabric_${String(nextNumber).padStart(2, "0")}.png`,
      dressesCount: 0,
      relatedOrders: [],
      description: "New fabric added to MultiFe catalog.",
    });
  };

  const deleteFabric = (fabricId: string) => {
    setFabrics((prev) => prev.filter((fabric) => fabric.id !== fabricId));
    setMenuFabricId(null);
    setSelectedFabricId((prev) => (prev === fabricId ? null : prev));
    setNotice("Fabric removed from this prototype.");
  };

  const toggleAvailability = (fabric: FabricRecord) => {
    const nextStatus: FabricAvailability =
      fabric.availability === "Out of Stock"
        ? "In Stock"
        : fabric.availability === "Low Stock"
          ? "Out of Stock"
          : "Low Stock";

    updateFabric({ ...fabric, availability: nextStatus });
    setMenuFabricId(null);
  };

  const syncFabricToShops = (fabricId: string, selectedShops: ShopName[]) => {
    setFabrics((prev) =>
      prev.map((fabric) =>
        fabric.id === fabricId
          ? {
              ...fabric,
              assignedShops: selectedShops,
            }
          : fabric
      )
    );

    const fabric = fabrics.find((item) => item.id === fabricId);
    setSyncFabric(null);
    setNotice(
      `${fabric?.name || "Fabric"} synced to ${selectedShops.length} shop(s).`
    );
  };

  const syncAllVisibleToAllShops = () => {
    const activeShops = shops.map((shop) => shop.name as ShopName);
    setFabrics((prev) =>
      prev.map((fabric) =>
        filteredFabrics.some((item) => item.id === fabric.id)
          ? { ...fabric, assignedShops: activeShops }
          : fabric
      )
    );
    setBulkOpen(false);
    setNotice(`Visible fabrics synced to ${activeShops.length} shop(s).`);
  };

  const markLowStockVisible = () => {
    setFabrics((prev) =>
      prev.map((fabric) =>
        filteredFabrics.some((item) => item.id === fabric.id)
          ? { ...fabric, availability: "Low Stock" }
          : fabric
      )
    );
    setBulkOpen(false);
    setNotice("Visible fabrics marked as low stock.");
  };

  if (selectedFabric) {
    return (
      <FabricDetailPage
        fabric={selectedFabric}
        shops={shops}
        onBack={() => setSelectedFabricId(null)}
        onSave={updateFabric}
        onOpenSync={() => setSyncFabric(selectedFabric)}
        syncModal={
          syncFabric && (
            <FabricSyncModal
              fabric={syncFabric}
              shops={shops}
              onClose={() => setSyncFabric(null)}
              onSync={syncFabricToShops}
            />
          )
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
            Fabric Management
          </h2>
          <p className="mt-1 text-sm font-medium text-[#718096]">
            Manage your fabric catalog, inventory, pricing and shop assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={addFabric}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white hover:bg-[#0a2048]"
        >
          <Plus className="h-4 w-4 text-[#f7b519]" />
          Add Fabric
        </button>
      </div>

      <div className="rounded-2xl border border-[#e7edf5] bg-white p-4 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value as FabricCategory | "All Categories")
            }
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            <option>All Categories</option>
            <option>Cotton Poplin</option>
            <option>Cotton</option>
            <option>Linen</option>
            <option>Gauze</option>
            <option>Silk</option>
            <option>Chiffon</option>
            <option>Velvet</option>
          </select>

          <select
            value={colorFilter}
            onChange={(event) => setColorFilter(event.target.value)}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            {colorOptions.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>

          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-[#dfe7f1] bg-white px-3">
            <Search className="h-4 w-4 text-[#718096]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search fabric by name..."
              className="h-full w-full border-0 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-[#9aa7ba]"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setBulkOpen((prev) => !prev)}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
            >
              <FileText className="h-4 w-4" />
              Bulk Actions
              <ChevronDown className={`h-4 w-4 transition ${bulkOpen ? "rotate-180" : ""}`} />
            </button>

            {bulkOpen && (
              <div className="absolute right-0 top-12 z-30 w-56 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_35px_rgba(7,22,51,0.12)]">
                <button
                  type="button"
                  onClick={syncAllVisibleToAllShops}
                  className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                >
                  Sync visible to all shops
                </button>
                <button
                  type="button"
                  onClick={markLowStockVisible}
                  className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                >
                  Mark visible as low stock
                </button>
              </div>
            )}
          </div>
        </div>

        {notice && (
          <div className="mt-3 rounded-lg border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-sm font-bold text-[#8a6200]">
            {notice}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead>
              <tr className="border-b border-[#eef2f7] bg-white">
                {[
                  "Fabric",
                  "Category",
                  "Color",
                  "Price (USD)",
                  "Stock / Availability",
                  "Assigned Shops",
                  "Actions",
                ].map((item) => (
                  <th
                    key={item}
                    className="px-5 py-4 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredFabrics.map((fabric) => (
                <tr key={fabric.id} className="border-b border-[#eef2f7] last:border-b-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FabricImagePlaceholder imageFile={fabric.imageFile} imagePreview={fabric.imagePreview} compact />
                      <button
                        type="button"
                        onClick={() => setSelectedFabricId(fabric.id)}
                        className="text-left"
                      >
                        <p className="text-sm font-bold text-[#071633] hover:text-[#a87300]">
                          {fabric.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#718096]">
                          {fabric.variant}
                        </p>
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#51617a]">
                    {fabric.category}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-sm border border-[#dfe7f1]"
                        style={{ backgroundColor: fabric.colorHex }}
                      />
                      <span className="text-sm font-semibold text-[#51617a]">
                        {fabric.colorName}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[#071633]">
                    ${formatNumber(fabric.pricePerYard)} / yd
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-[#071633]">
                      {fabric.stockYards} yds
                    </p>
                    <FabricAvailabilityPill status={fabric.availability} />
                  </td>

                  <td className="px-5 py-4 text-sm font-bold text-[#071633]">
                    {fabric.assignedShops.length} Shops
                  </td>

                  <td className="relative px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditorFabric(fabric)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                        title="Edit fabric"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setMenuFabricId(menuFabricId === fabric.id ? null : fabric.id)}
                        className="rounded-lg p-2 text-[#51617a] hover:bg-[#f5f7fb] hover:text-[#071633]"
                        title="More actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {menuFabricId === fabric.id && (
                      <div className="absolute right-5 top-12 z-20 w-52 overflow-hidden rounded-xl border border-[#e7edf5] bg-white shadow-[0_16px_35px_rgba(7,22,51,0.12)]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFabricId(fabric.id);
                            setMenuFabricId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditorFabric(fabric);
                            setMenuFabricId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Edit fabric
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSyncFabric(fabric);
                            setMenuFabricId(null);
                          }}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Sync to shops
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAvailability(fabric)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-[#51617a] hover:bg-[#f8fafc]"
                        >
                          Change stock status
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFabric(fabric.id)}
                          className="block w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#eef2f7] px-5 py-4 text-sm font-semibold text-[#718096] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing 1 to {filteredFabrics.length} of {fabrics.length} fabrics
          </span>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-lg text-[#718096]">
              ‹
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-sm font-bold text-[#071633]">
              1
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe7f1] text-lg text-[#718096]">
              ›
            </button>
          </div>
        </div>
      </div>

      {editorFabric && (
        <FabricEditorModal
          fabric={editorFabric}
          onClose={() => setEditorFabric(null)}
          onSave={saveFabric}
        />
      )}

      {syncFabric && (
        <FabricSyncModal
          fabric={syncFabric}
          shops={shops}
          onClose={() => setSyncFabric(null)}
          onSync={syncFabricToShops}
        />
      )}
    </div>
  );
}

function FabricDetailPage({
  fabric,
  shops,
  onBack,
  onSave,
  onOpenSync,
  syncModal,
}: {
  fabric: FabricRecord;
  shops: ShopRecord[];
  onBack: () => void;
  onSave: (fabric: FabricRecord) => void;
  onOpenSync: () => void;
  syncModal: ReactNode;
}) {
  const [price, setPrice] = useState(String(fabric.pricePerYard));
  const [stock, setStock] = useState(String(fabric.stockYards));
  const [availability, setAvailability] = useState<FabricAvailability>(fabric.availability);
  const revenue = fabric.dressesCount * fabric.pricePerYard * 3;

  const saveControl = () => {
    onSave({
      ...fabric,
      pricePerYard: Number(price.replace(/\D/g, "")) || fabric.pricePerYard,
      stockYards: Number(stock.replace(/\D/g, "")) || fabric.stockYards,
      availability,
    });
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-[#dfe7f1] bg-white text-[#071633] hover:border-[#f7b519]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
              {fabric.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#718096]">
              {fabric.variant} • {fabric.category} • {fabric.imageFile}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSync}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white hover:bg-[#0a2048]"
        >
          <RefreshCw className="h-4 w-4 text-[#f7b519]" />
          Sync to Shops
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
          <FabricImagePlaceholder imageFile={fabric.imageFile} imagePreview={fabric.imagePreview} large />
          <div className="mt-5">
            <h3 className="text-lg font-bold text-[#071633]">Fabric Overview</h3>
            <p className="mt-2 text-sm font-semibold leading-7 text-[#51617a]">
              {fabric.description}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <FabricMetric label="Dresses Made" value={`${fabric.dressesCount}`} />
            <FabricMetric label="Related Orders" value={`${fabric.relatedOrders.length}`} />
            <FabricMetric label="Assigned Shops" value={`${fabric.assignedShops.length}`} />
            <FabricMetric label="Est. Fabric Revenue" value={`$${formatNumber(revenue)}`} />
          </div>
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
            <h3 className="text-lg font-bold text-[#071633]">Admin Price & Stock Control</h3>
            <p className="mt-1 text-sm font-semibold text-[#718096]">
              Update pricing, stock and availability for this fabric.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <SimpleInput
                label="Price per Yard (USD)"
                value={price}
                onChange={setPrice}
                placeholder="1250"
              />

              <SimpleInput
                label="Stock in Yards"
                value={stock}
                onChange={setStock}
                placeholder="245"
              />

              <SimpleSelect
                label="Availability"
                value={availability}
                options={["In Stock", "Low Stock", "Out of Stock"]}
                onChange={(value) => setAvailability(value as FabricAvailability)}
              />
            </div>

            <button
              type="button"
              onClick={saveControl}
              className="mt-5 h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white hover:bg-[#0a2048]"
            >
              Save Price & Stock
            </button>
          </section>

          <section className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#071633]">Assigned Shops</h3>
                <p className="mt-1 text-sm font-semibold text-[#718096]">
                  Shops where this fabric is available.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenSync}
                className="rounded-lg border border-[#dfe7f1] bg-white px-4 py-2 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
              >
                Sync
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {shops.map((shop) => {
                const assigned = fabric.assignedShops.includes(shop.name as ShopName);
                return (
                  <div
                    key={shop.id}
                    className={`rounded-xl border p-4 ${
                      assigned
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-[#e7edf5] bg-[#f8fafc]"
                    }`}
                  >
                    <p className="text-sm font-bold text-[#071633]">{shop.name}</p>
                    <p className="mt-1 text-xs font-semibold text-[#718096]">
                      {shop.city}, {shop.province}
                    </p>
                    <p className={`mt-2 text-xs font-bold ${assigned ? "text-emerald-700" : "text-[#8a97aa]"}`}>
                      {assigned ? "Assigned" : "Not assigned"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#e7edf5] bg-white shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
            <div className="border-b border-[#eef2f7] px-5 py-4">
              <h3 className="text-lg font-bold text-[#071633]">Related Orders & Dresses</h3>
              <p className="mt-1 text-sm font-semibold text-[#718096]">
                Orders and dresses created using this fabric.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    {["Order ID", "Dress Type", "Shop", "Yards", "Status"].map((head) => (
                      <th
                        key={head}
                        className="px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(fabric.relatedOrders.length ? fabric.relatedOrders : ["No orders yet"]).map((order, index) => (
                    <tr key={order} className="border-t border-[#eef2f7]">
                      <td className="px-5 py-3 text-sm font-bold text-[#071633]">{order}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-[#51617a]">
                        {index % 2 === 0 ? "Straight Blouse" : "Long Top"}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-[#51617a]">
                        {fabric.assignedShops[index % Math.max(fabric.assignedShops.length, 1)] || "Unassigned"}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-[#51617a]">
                        {index + 3}.5 yds
                      </td>
                      <td className="px-5 py-3">
                        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {syncModal}
    </div>
  );
}

function FabricEditorModal({
  fabric,
  onClose,
  onSave,
}: {
  fabric: FabricRecord;
  onClose: () => void;
  onSave: (fabric: FabricRecord) => void;
}) {
  const [draft, setDraft] = useState<FabricRecord>(fabric);

  const fabricColorOptions = [
    { name: "Multicolor", hex: "#f7c84b" },
    { name: "Sky Blue", hex: "#a9d5f4" },
    { name: "Beige", hex: "#c8b79f" },
    { name: "Maroon", hex: "#78182a" },
    { name: "Navy Blue", hex: "#071633" },
    { name: "Floral", hex: "#f4a7c8" },
    { name: "Dark Green", hex: "#06472f" },
    { name: "White Base", hex: "#f8fafc" },
  ];

  const handleImageUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDraft((prev) => ({
        ...prev,
        imageFile: file.name,
        imagePreview: typeof reader.result === "string" ? reader.result : prev.imagePreview,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <ModalShell title={fabric.name ? "Edit Fabric" : "Add Fabric"} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <SimpleInput
            label="Fabric Name"
            value={draft.name}
            onChange={(value) => setDraft({ ...draft, name: value })}
            placeholder="Floral Cotton Poplin"
          />

          <SimpleInput
            label="Variant"
            value={draft.variant}
            onChange={(value) => setDraft({ ...draft, variant: value })}
            placeholder="Digital Print"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SimpleSelect
            label="Category"
            value={draft.category}
            options={["Cotton Poplin", "Cotton", "Linen", "Gauze", "Silk", "Chiffon", "Velvet"]}
            onChange={(value) => setDraft({ ...draft, category: value as FabricCategory })}
          />

          <SimpleInput
            label="Color Name"
            value={draft.colorName}
            onChange={(value) => setDraft({ ...draft, colorName: value })}
            placeholder="Multicolor"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-[#071633]">Color Options</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {fabricColorOptions.map((color) => {
              const active = draft.colorName === color.name || draft.colorHex === color.hex;

              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      colorName: color.name,
                      colorHex: color.hex,
                    })
                  }
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                    active
                      ? "border-[#071633] bg-[#071633] text-white"
                      : "border-[#dfe7f1] bg-white text-[#51617a] hover:border-[#f7b519]"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-sm border border-white/40"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <SimpleInput
            label="Color Hex"
            value={draft.colorHex}
            onChange={(value) => setDraft({ ...draft, colorHex: value })}
            placeholder="#f7c84b"
          />

          <SimpleInput
            label="Price / Yard"
            value={String(draft.pricePerYard)}
            onChange={(value) =>
              setDraft({ ...draft, pricePerYard: Number(value.replace(/\D/g, "")) || 0 })
            }
            placeholder="1250"
          />

          <SimpleInput
            label="Stock Yards"
            value={String(draft.stockYards)}
            onChange={(value) =>
              setDraft({ ...draft, stockYards: Number(value.replace(/\D/g, "")) || 0 })
            }
            placeholder="245"
          />
        </div>

        <SimpleSelect
          label="Availability"
          value={draft.availability}
          options={["In Stock", "Low Stock", "Out of Stock"]}
          onChange={(value) =>
            setDraft({ ...draft, availability: value as FabricAvailability })
          }
        />

        <div className="rounded-xl border border-[#dfe7f1] bg-white p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <FabricImagePlaceholder
              imageFile={draft.imageFile}
              imagePreview={draft.imagePreview}
              compact
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#071633]">Upload Fabric Image</p>
              <p className="mt-1 text-xs font-semibold text-[#718096]">
                PNG/JPG image will preview instantly in this prototype.
              </p>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={(event) => handleImageUpload(event.target.files?.[0] || null)}
                className="mt-3 block w-full text-sm font-semibold text-[#51617a] file:mr-4 file:rounded-lg file:border-0 file:bg-[#071633] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-[#0a2048]"
              />
              <p className="mt-2 text-xs font-bold text-[#718096]">
                Selected: {draft.imageFile || "No image selected"}
              </p>
            </div>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-[#071633]">Description</span>
          <textarea
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            className="h-[96px] w-full resize-none rounded-lg border border-[#d9e1eb] bg-white p-4 text-sm font-semibold text-[#071633] outline-none focus:border-[#f7b519] focus:ring-4 focus:ring-[#f7b519]/10"
          />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Save Fabric
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function FabricSyncModal({
  fabric,
  shops,
  onClose,
  onSync,
}: {
  fabric: FabricRecord;
  shops: ShopRecord[];
  onClose: () => void;
  onSync: (fabricId: string, selectedShops: ShopName[]) => void;
}) {
  const [selectedShops, setSelectedShops] = useState<ShopName[]>(fabric.assignedShops);

  const toggleShop = (shopName: ShopName) => {
    setSelectedShops((prev) =>
      prev.includes(shopName)
        ? prev.filter((item) => item !== shopName)
        : [...prev, shopName]
    );
  };

  const selectAll = () => {
    setSelectedShops(shops.map((shop) => shop.name as ShopName));
  };

  return (
    <ModalShell title="Sync Fabric to Shops" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm font-semibold leading-6 text-[#718096]">
          Select which shops should carry <span className="font-bold text-[#071633]">{fabric.name}</span>. This controls fabric visibility and availability across shop portals.
        </p>

        <button
          type="button"
          onClick={selectAll}
          className="h-10 rounded-lg border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
        >
          Select All Shops
        </button>

        <div className="grid gap-3 sm:grid-cols-2">
          {shops.map((shop) => {
            const checked = selectedShops.includes(shop.name as ShopName);

            return (
              <button
                key={shop.id}
                type="button"
                onClick={() => toggleShop(shop.name as ShopName)}
                className={`rounded-xl border p-4 text-left transition ${
                  checked
                    ? "border-[#071633] bg-[#071633] text-white"
                    : "border-[#e7edf5] bg-[#f8fafc] text-[#071633]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">{shop.name}</p>
                    <p className={`mt-1 text-xs font-semibold ${checked ? "text-white/70" : "text-[#718096]"}`}>
                      {shop.city}, {shop.province}
                    </p>
                  </div>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${checked ? "border-[#f7b519] bg-[#f7b519]" : "border-[#cbd5e1]"}`}>
                    {checked && <CheckCircle2 className="h-4 w-4 text-[#071633]" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSync(fabric.id, selectedShops)}
            className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
          >
            Sync Fabric
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function FabricImagePlaceholder({
  imageFile,
  imagePreview,
  compact = false,
  large = false,
}: {
  imageFile: string;
  imagePreview?: string;
  compact?: boolean;
  large?: boolean;
}) {
  const imageSrc = imagePreview || fabricImageMap[imageFile];
  const sizeClass = large ? "h-[320px] w-full" : compact ? "h-14 w-14" : "h-24 w-24";

  return (
    <div
      className={`${sizeClass} shrink-0 overflow-hidden rounded-lg border border-[#e7edf5] bg-[#f8fafc]`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageFile.replace(/_/g, " ").replace(".png", "")}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-white/70 text-center">
          <Layers3 className={`${large ? "h-10 w-10" : "h-5 w-5"} text-[#9aa7ba]`} />
          <span className={`${large ? "mt-3 text-sm" : "mt-1 text-[9px]"} max-w-full break-all px-1 font-bold text-[#718096]`}>
            {imageFile}
          </span>
        </div>
      )}
    </div>
  );
}

function FabricAvailabilityPill({ status }: { status: FabricAvailability }) {
  const style: Record<FabricAvailability, string> = {
    "In Stock": "text-emerald-700",
    "Low Stock": "text-[#c17900]",
    "Out of Stock": "text-red-700",
  };

  return <p className={`mt-1 text-xs font-bold ${style[status]}`}>{status}</p>;
}

function FabricMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#718096]">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-[#071633]">{value}</p>
    </div>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}


const reportingMetricCards = [
  {
    title: "Total Orders",
    value: "1,248",
    subtitle: "All time",
    change: "+12.5%",
    icon: ShoppingBag,
    tone: "navy",
  },
  {
    title: "Pending Orders",
    value: "256",
    subtitle: "20.5% of total",
    change: "+4.2%",
    icon: ClipboardList,
    tone: "amber",
  },
  {
    title: "In Production",
    value: "623",
    subtitle: "49.9% of total",
    change: "+8.1%",
    icon: Factory,
    tone: "blue",
  },
  {
    title: "QC Pass Rate",
    value: "94.6%",
    subtitle: "This month",
    change: "+2.1%",
    icon: ShieldCheck,
    tone: "green",
  },
  {
    title: "Delivered Orders",
    value: "1,102",
    subtitle: "All time",
    change: "+10.4%",
    icon: Package,
    tone: "green",
  },
  {
    title: "Delayed Orders",
    value: "74",
    subtitle: "5.9% of total",
    change: "-1.6%",
    icon: Bell,
    tone: "red",
  },
  {
    title: "On-Time Delivery",
    value: "89.3%",
    subtitle: "This month",
    change: "+3.7%",
    icon: CheckCircle2,
    tone: "blue",
  },
  {
    title: "Total Revenue",
    value: "$12.8M",
    subtitle: "All time",
    change: "+18.6%",
    icon: BarChart3,
    tone: "navy",
  },
];

const reportingStatusBreakdown = [
  { name: "In Production", value: 623, percent: "49.9%", color: "#16a34a" },
  { name: "Pending", value: 256, percent: "20.5%", color: "#f7b519" },
  { name: "QC", value: 198, percent: "15.9%", color: "#8b5cf6" },
  { name: "Ready to Dispatch", value: 171, percent: "13.7%", color: "#3b82f6" },
];

const monthlyOrderTrend = [
  { day: "May 1", orders: 36, delivered: 22 },
  { day: "May 5", orders: 44, delivered: 31 },
  { day: "May 8", orders: 68, delivered: 46 },
  { day: "May 12", orders: 92, delivered: 62 },
  { day: "May 15", orders: 118, delivered: 78 },
  { day: "May 18", orders: 142, delivered: 101 },
  { day: "May 22", orders: 151, delivered: 118 },
  { day: "May 26", orders: 145, delivered: 112 },
  { day: "May 29", orders: 178, delivered: 139 },
];

const reportingTopShops = [
  ["Manhattan Flagship", "328"],
  ["Beverly Hills Studio", "276"],
  ["River North Studio", "214"],
  ["Uptown Dallas Boutique", "168"],
  ["South Beach Boutique", "142"],
];

const delayAnalysis = [
  ["Fabric Delay", 28, "37.8%", "#ef4444"],
  ["Sewing Delay", 24, "32.4%", "#f97316"],
  ["QC Delay", 12, "16.2%", "#f7b519"],
  ["Fulfillment Delay", 10, "13.6%", "#071633"],
];

const recentReportingAlerts = [
  {
    title: "74 orders are delayed",
    action: "View Delay Report",
    tone: "red",
  },
  {
    title: "18 orders pending fabric",
    action: "View Orders",
    tone: "amber",
  },
  {
    title: "QC pass rate dropped by 2.1%",
    action: "View QC Report",
    tone: "blue",
  },
];

function ReportingPage() {
  const [range, setRange] = useState("This Month");
  const [shop, setShop] = useState("All Shops");
  const [notice, setNotice] = useState("");

  const exportReport = () => {
    const rows = [
      ["Metric", "Value"],
      ...reportingMetricCards.map((item) => [item.title, item.value]),
      ["Selected Range", range],
      ["Selected Shop", shop],
    ];

    const csv = rows.map((row) => row.join(",")).join("\\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "multife-reporting-summary.csv";
    anchor.click();
    URL.revokeObjectURL(url);

    setNotice(`Reporting summary exported for ${shop} — ${range}.`);
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-[#dfe7f1] bg-white p-2 text-[#51617a] shadow-sm hover:border-[#f7b519]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
                Reporting
              </h2>
              <p className="mt-1 text-sm font-medium text-[#718096]">
                Track orders, production, QC, delivery performance and revenue across shops.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-xs font-bold text-[#8a6200]">
            <span className="h-2 w-2 rounded-full bg-[#f7b519]" />
            In Production
          </span>

          <select
            value={shop}
            onChange={(event) => setShop(event.target.value)}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            <option>All Shops</option>
            <option>New York Flagship</option>
            <option>Los Angeles Studio</option>
            <option>Chicago Studio</option>
            <option>Dallas Boutique</option>
            <option>Miami Boutique</option>
            <option>Seattle Studio</option>
          </select>

          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-3 text-sm font-semibold text-[#51617a] outline-none"
          >
            <option>This Month</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>All Time</option>
          </select>

          <button
            type="button"
            onClick={exportReport}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white shadow-[0_10px_22px_rgba(7,22,51,0.14)] hover:bg-[#0a2048]"
          >
            <FileText className="h-4 w-4 text-[#f7b519]" />
            Export Report
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-lg border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-sm font-bold text-[#8a6200]">
          {notice}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportingMetricCards.map((card) => (
          <ReportingMetricCard key={card.title} card={card} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr_0.9fr]">
        <ReportingPanel title="Orders by Status">
          <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr] xl:grid-cols-1 2xl:grid-cols-[180px_1fr]">
            <div className="relative h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportingStatusBreakdown}
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {reportingStatusBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-[#071633]">1,248</p>
                <p className="text-xs font-bold text-[#718096]">Total</p>
              </div>
            </div>

            <div className="space-y-3">
              {reportingStatusBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-bold text-[#51617a]">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#071633]">
                    {item.value} ({item.percent})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ReportingPanel>

        <ReportingPanel
          title="Orders Trend (This Month)"
          action={
            <button className="rounded-lg border border-[#dfe7f1] bg-white px-3 py-1.5 text-xs font-bold text-[#51617a]">
              {range}
            </button>
          }
        >
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyOrderTrend}>
                <defs>
                  <linearGradient id="reportOrdersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#071633" stopOpacity={0.16} />
                    <stop offset="90%" stopColor="#071633" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="reportDeliveredFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#16a34a" stopOpacity={0.16} />
                    <stop offset="90%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#718096", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#718096", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e7edf5",
                    boxShadow: "0 12px 30px rgba(7,22,51,0.08)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#071633"
                  strokeWidth={3}
                  fill="url(#reportOrdersFill)"
                  dot={{ r: 3, fill: "#071633", stroke: "#ffffff" }}
                />
                <Area
                  type="monotone"
                  dataKey="delivered"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fill="url(#reportDeliveredFill)"
                  dot={{ r: 3, fill: "#16a34a", stroke: "#ffffff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ReportingPanel>

        <ReportingPanel
          title="Top Shops by Orders"
          action={
            <button className="rounded-lg border border-[#dfe7f1] bg-white px-3 py-1.5 text-xs font-bold text-[#51617a]">
              All Time
            </button>
          }
        >
          <div className="space-y-4">
            {reportingTopShops.map(([name, value], index) => (
              <div key={name} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef2f7] text-xs font-bold text-[#071633]">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#071633]">{name}</p>
                    <p className="text-xs font-semibold text-[#718096]">Active shop</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#071633]">{value}</span>
              </div>
            ))}
          </div>
        </ReportingPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.05fr_1fr]">
        <ReportingPanel title="QC Results (This Month)">
          <div className="grid items-center gap-4 sm:grid-cols-[170px_1fr] xl:grid-cols-1 2xl:grid-cols-[170px_1fr]">
            <div className="relative h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Passed", value: 642, color: "#16a34a" },
                      { name: "Failed", value: 36, color: "#ef4444" },
                    ]}
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {[
                      { name: "Passed", value: 642, color: "#16a34a" },
                      { name: "Failed", value: 36, color: "#ef4444" },
                    ].map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-[#071633]">94.6%</p>
                <p className="text-xs font-bold text-[#718096]">Pass Rate</p>
              </div>
            </div>

            <div className="space-y-3">
              <ReportLegendDot color="#16a34a" label="Passed" value="642 (94.6%)" />
              <ReportLegendDot color="#ef4444" label="Failed" value="36 (5.4%)" />
            </div>
          </div>
        </ReportingPanel>

        <ReportingPanel title="Delay Analysis">
          <div className="space-y-4">
            {delayAnalysis.map(([label, count, percent, color]) => (
              <div key={String(label)}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#071633]">{label}</span>
                  <span className="text-xs font-bold text-[#718096]">
                    {count} ({percent})
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#eef2f7]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: percent as string, backgroundColor: color as string }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ReportingPanel>

        <ReportingPanel title="Recent Alerts">
          <div className="space-y-4">
            {recentReportingAlerts.map((alert) => (
              <button
                key={alert.title}
                type="button"
                onClick={() => setNotice(`${alert.action} opened.`)}
                className="flex w-full items-start gap-3 rounded-xl border border-[#eef2f7] bg-white p-3 text-left transition hover:border-[#f7b519]/50 hover:bg-[#f8fafc]"
              >
                <span
                  className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full ${
                    alert.tone === "red"
                      ? "bg-red-50 text-red-600"
                      : alert.tone === "amber"
                        ? "bg-[#f7b519]/15 text-[#8a6200]"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {alert.tone === "red" ? (
                    <Bell className="h-4 w-4" />
                  ) : alert.tone === "amber" ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                </span>

                <span>
                  <span className="block text-sm font-bold text-[#071633]">{alert.title}</span>
                  <span className="mt-1 block text-xs font-bold text-[#718096]">
                    {alert.action}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </ReportingPanel>
      </div>
    </div>
  );
}

function ReportingMetricCard({
  card,
}: {
  card: {
    title: string;
    value: string;
    subtitle: string;
    change: string;
    icon: IconType;
    tone: string;
  };
}) {
  const Icon = card.icon;
  const toneStyle =
    card.tone === "red"
      ? "bg-red-50 text-red-600"
      : card.tone === "amber"
        ? "bg-[#f7b519]/15 text-[#8a6200]"
        : card.tone === "green"
          ? "bg-emerald-50 text-emerald-700"
          : card.tone === "blue"
            ? "bg-blue-50 text-blue-700"
            : "bg-[#f5f7fb] text-[#071633]";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_12px_30px_rgba(7,22,51,0.04)]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneStyle}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-bold text-emerald-600">{card.change}</span>
      </div>

      <p className="text-sm font-bold text-[#718096]">{card.title}</p>
      <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[#071633]">
        {card.value}
      </h3>
      <p className="mt-2 text-xs font-semibold text-[#8a97aa]">{card.subtitle}</p>
    </motion.div>
  );
}

function ReportingPanel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_12px_30px_rgba(7,22,51,0.04)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-[#071633]">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function ReportLegendDot({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-bold text-[#51617a]">{label}</span>
      </div>
      <span className="text-xs font-bold text-[#071633]">{value}</span>
    </div>
  );
}


type SettingsTab =
  | "General"
  | "Security"
  | "Notifications"
  | "Shop Sync"
  | "Admin Profile"
  | "Audit Logs";

type SettingsToggleKey =
  | "maintenanceMode"
  | "autoSync"
  | "emailAlerts"
  | "smsAlerts"
  | "whatsappAlerts"
  | "lowStockAlerts"
  | "qcAlerts"
  | "twoFactor"
  | "auditLogs"
  | "autoBackup"
  | "publicCatalog";

type AuditLogRecord = {
  id: string;
  action: string;
  user: string;
  module: string;
  time: string;
  status: "Success" | "Warning";
};

const settingsTabs: { label: SettingsTab; icon: IconType }[] = [
  { label: "General", icon: Settings },
  { label: "Security", icon: ShieldCheck },
  { label: "Notifications", icon: Bell },
  { label: "Shop Sync", icon: Store },
  { label: "Admin Profile", icon: UserRound },
  { label: "Audit Logs", icon: ClipboardList },
];

const initialAuditLogs: AuditLogRecord[] = [
  {
    id: "LOG-001",
    action: "Fabric price updated",
    user: "Admin",
    module: "Fabrics",
    time: "May 7, 2025 10:42 AM",
    status: "Success",
  },
  {
    id: "LOG-002",
    action: "QR synced to Los Angeles Studio",
    user: "Admin",
    module: "QR Codes",
    time: "May 7, 2025 10:21 AM",
    status: "Success",
  },
  {
    id: "LOG-003",
    action: "Order approved for production",
    user: "Emily Carter",
    module: "Orders",
    time: "May 7, 2025 09:58 AM",
    status: "Success",
  },
  {
    id: "LOG-004",
    action: "Low stock alert triggered",
    user: "System",
    module: "Inventory",
    time: "May 6, 2025 06:15 PM",
    status: "Warning",
  },
  {
    id: "LOG-005",
    action: "New shop added",
    user: "Admin",
    module: "Shops",
    time: "May 6, 2025 03:42 PM",
    status: "Success",
  },
];

function SettingsPage({
  shops,
  onLogout,
}: {
  shops: ShopRecord[];
  onLogout: () => void;
}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("General");
  const [notice, setNotice] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);

  const [general, setGeneral] = useState({
    platformName: "MultiFe Admin",
    businessName: "MultiFe Custom Apparel",
    supportEmail: "support@multife.com",
    supportPhone: "+1 (212) 555-0142",
    currency: "USD",
    timezone: "America/New_York",
    language: "English",
    measurementUnit: "Inches",
    orderPrefix: "ORD",
  });

  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@multife.com",
    phone: "+1 (212) 555-0100",
    role: "Super Admin",
    password: "multife123",
  });

  const [security, setSecurity] = useState({
    sessionTimeout: "30 minutes",
    passwordExpiry: "90 days",
    loginAttempts: "5 attempts",
    allowedDomain: "multife.com",
    apiSecret: "mf_live_93K8-••••-8821",
  });

  const [toggles, setToggles] = useState<Record<SettingsToggleKey, boolean>>({
    maintenanceMode: false,
    autoSync: true,
    emailAlerts: true,
    smsAlerts: false,
    whatsappAlerts: true,
    lowStockAlerts: true,
    qcAlerts: true,
    twoFactor: true,
    auditLogs: true,
    autoBackup: true,
    publicCatalog: false,
  });

  const [shopSyncSettings, setShopSyncSettings] = useState(
    shops.map((shop) => ({
      id: shop.id,
      name: shop.name,
      city: shop.city,
      enabled: true,
      catalog: true,
      fabrics: true,
      styles: true,
      qr: true,
      lastSync: shop.lastSync || "Not synced yet",
    }))
  );

  const [logs, setLogs] = useState<AuditLogRecord[]>(initialAuditLogs);

  const toggleSetting = (key: SettingsToggleKey) => {
    setToggles((prev) => {
      const nextValue = !prev[key];
      setNotice(`${settingLabel(key)} ${nextValue ? "enabled" : "disabled"}.`);
      return { ...prev, [key]: nextValue };
    });
  };

  const saveGeneralSettings = () => {
    setNotice("General settings saved successfully.");
  };

  const saveSecuritySettings = () => {
    setNotice("Security settings saved successfully.");
  };

  const saveProfile = () => {
    setNotice("Admin profile updated successfully.");
  };

  const syncAllShops = () => {
    setShopSyncSettings((prev) =>
      prev.map((shop) => ({
        ...shop,
        enabled: true,
        catalog: true,
        fabrics: true,
        styles: true,
        qr: true,
        lastSync: "Just now",
      }))
    );

    setLogs((prev) => [
      {
        id: `LOG-${String(prev.length + 1).padStart(3, "0")}`,
        action: "All shops synced",
        user: "Admin",
        module: "Settings",
        time: "Just now",
        status: "Success",
      },
      ...prev,
    ]);

    setNotice("All shops synced successfully.");
  };

  const exportSettings = () => {
    const payload = {
      general,
      profile: {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
      },
      security,
      toggles,
      shopSyncSettings,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "multife-admin-settings.json";
    anchor.click();
    URL.revokeObjectURL(url);

    setNotice("Settings exported as JSON.");
  };

  const createBackup = () => {
    setBackupOpen(false);
    setNotice("Backup created successfully. Backup includes orders, shops, fabrics, QR codes and style options.");
  };

  const clearLogs = () => {
    setLogs([]);
    setNotice("Audit logs cleared in this prototype.");
  };

  const toggleShopModule = (
    shopId: string,
    key: "enabled" | "catalog" | "fabrics" | "styles" | "qr"
  ) => {
    setShopSyncSettings((prev) =>
      prev.map((shop) =>
        shop.id === shopId ? { ...shop, [key]: !shop[key] } : shop
      )
    );
  };

  return (
    <div className="mx-auto max-w-[1180px] space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[1.55rem] font-bold tracking-[-0.035em] text-[#071633]">
            Settings
          </h2>
          <p className="mt-1 text-sm font-medium text-[#718096]">
            Configure MultiFe admin controls, security, notifications, shop sync and account preferences.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={exportSettings}
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#dfe7f1] bg-white px-4 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
          >
            <FileText className="h-4 w-4" />
            Export Settings
          </button>

          <button
            type="button"
            onClick={() => setBackupOpen(true)}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white shadow-[0_10px_22px_rgba(7,22,51,0.14)] hover:bg-[#0a2048]"
          >
            <Upload className="h-4 w-4 text-[#f7b519]" />
            Create Backup
          </button>
        </div>
      </div>

      {notice && (
        <div className="rounded-lg border border-[#f7b519]/30 bg-[#f7b519]/10 px-4 py-2 text-sm font-bold text-[#8a6200]">
          {notice}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <section className="h-fit rounded-2xl border border-[#e7edf5] bg-white p-3 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.label;

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(tab.label)}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition last:mb-0 ${
                  active
                    ? "bg-[#071633] text-white shadow-[0_10px_22px_rgba(7,22,51,0.14)]"
                    : "text-[#51617a] hover:bg-[#f8fafc] hover:text-[#071633]"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-[#f7b519]" : "text-[#7d8ba1]"}`} />
                {tab.label}
              </button>
            );
          })}
        </section>

        <section className="space-y-5">
          {activeTab === "General" && (
            <SettingsCard
              title="General Settings"
              description="Basic business details and default admin preferences."
              action={
                <button
                  type="button"
                  onClick={saveGeneralSettings}
                  className="h-10 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white"
                >
                  Save Changes
                </button>
              }
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <SimpleInput
                  label="Platform Name"
                  value={general.platformName}
                  onChange={(value) => setGeneral({ ...general, platformName: value })}
                  placeholder="MultiFe Admin"
                />

                <SimpleInput
                  label="Business Name"
                  value={general.businessName}
                  onChange={(value) => setGeneral({ ...general, businessName: value })}
                  placeholder="MultiFe Custom Apparel"
                />

                <SimpleInput
                  label="Support Email"
                  value={general.supportEmail}
                  onChange={(value) => setGeneral({ ...general, supportEmail: value })}
                  placeholder="support@multife.com"
                />

                <SimpleInput
                  label="Support Phone"
                  value={general.supportPhone}
                  onChange={(value) => setGeneral({ ...general, supportPhone: value })}
                  placeholder="+1 (212) 555-0142"
                />

                <SimpleSelect
                  label="Currency"
                  value={general.currency}
                  options={["USD", "CAD", "EUR", "GBP"]}
                  onChange={(value) => setGeneral({ ...general, currency: value })}
                />

                <SimpleSelect
                  label="Timezone"
                  value={general.timezone}
                  options={["America/New_York", "America/Chicago", "America/Los_Angeles", "America/Denver", "UTC"]}
                  onChange={(value) => setGeneral({ ...general, timezone: value })}
                />

                <SimpleSelect
                  label="Language"
                  value={general.language}
                  options={["English", "Urdu", "English + Urdu"]}
                  onChange={(value) => setGeneral({ ...general, language: value })}
                />

                <SimpleSelect
                  label="Measurement Unit"
                  value={general.measurementUnit}
                  options={["Inches", "Centimeters"]}
                  onChange={(value) => setGeneral({ ...general, measurementUnit: value })}
                />

                <SimpleInput
                  label="Order Prefix"
                  value={general.orderPrefix}
                  onChange={(value) => setGeneral({ ...general, orderPrefix: value })}
                  placeholder="ORD"
                />
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <SettingsToggleRow
                  title="Maintenance Mode"
                  description="Temporarily disable customer-facing portal access while admins can continue working."
                  checked={toggles.maintenanceMode}
                  onToggle={() => toggleSetting("maintenanceMode")}
                />

                <SettingsToggleRow
                  title="Public Catalog"
                  description="Allow shops to share fabric and style catalog publicly through QR portal."
                  checked={toggles.publicCatalog}
                  onToggle={() => toggleSetting("publicCatalog")}
                />
              </div>
            </SettingsCard>
          )}

          {activeTab === "Security" && (
            <SettingsCard
              title="Security Controls"
              description="Manage admin access, 2FA, sessions, password policy and API secret."
              action={
                <button
                  type="button"
                  onClick={saveSecuritySettings}
                  className="h-10 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white"
                >
                  Save Security
                </button>
              }
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <SettingsToggleRow
                  title="Two-Factor Authentication"
                  description="Require a verification code when admins sign in."
                  checked={toggles.twoFactor}
                  onToggle={() => toggleSetting("twoFactor")}
                />

                <SettingsToggleRow
                  title="Audit Logs"
                  description="Track all important admin actions across orders, users, shops and QR codes."
                  checked={toggles.auditLogs}
                  onToggle={() => toggleSetting("auditLogs")}
                />

                <SimpleSelect
                  label="Session Timeout"
                  value={security.sessionTimeout}
                  options={["15 minutes", "30 minutes", "1 hour", "4 hours"]}
                  onChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                />

                <SimpleSelect
                  label="Password Expiry"
                  value={security.passwordExpiry}
                  options={["30 days", "60 days", "90 days", "Never"]}
                  onChange={(value) => setSecurity({ ...security, passwordExpiry: value })}
                />

                <SimpleSelect
                  label="Login Attempt Limit"
                  value={security.loginAttempts}
                  options={["3 attempts", "5 attempts", "10 attempts"]}
                  onChange={(value) => setSecurity({ ...security, loginAttempts: value })}
                />

                <SimpleInput
                  label="Allowed Email Domain"
                  value={security.allowedDomain}
                  onChange={(value) => setSecurity({ ...security, allowedDomain: value })}
                  placeholder="multife.com"
                />
              </div>

              <div className="mt-5 rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#071633]">API Secret</p>
                    <p className="mt-1 text-xs font-semibold text-[#718096]">
                      Used for shop portal sync, QR code portal and production integration.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSecret((value) => !value)}
                    className="rounded-lg border border-[#dfe7f1] bg-white px-3 py-2 text-xs font-bold text-[#071633]"
                  >
                    {showSecret ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-[#d9e1eb] bg-white px-4 py-3">
                  <KeyRound className="h-4 w-4 text-[#718096]" />
                  <span className="font-mono text-sm font-bold text-[#071633]">
                    {showSecret ? "mf_live_93K8-29LQ-8821" : security.apiSecret}
                  </span>
                </div>
              </div>
            </SettingsCard>
          )}

          {activeTab === "Notifications" && (
            <SettingsCard
              title="Notification Settings"
              description="Control which alerts admins, shop managers and production teams receive."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <SettingsToggleRow
                  title="Email Alerts"
                  description="Send order, payment and approval alerts through email."
                  checked={toggles.emailAlerts}
                  onToggle={() => toggleSetting("emailAlerts")}
                />

                <SettingsToggleRow
                  title="SMS Alerts"
                  description="Send urgent shop and delivery alerts by SMS."
                  checked={toggles.smsAlerts}
                  onToggle={() => toggleSetting("smsAlerts")}
                />

                <SettingsToggleRow
                  title="WhatsApp Alerts"
                  description="Send customer and shop status updates through WhatsApp."
                  checked={toggles.whatsappAlerts}
                  onToggle={() => toggleSetting("whatsappAlerts")}
                />

                <SettingsToggleRow
                  title="Low Stock Alerts"
                  description="Notify when fabric stock drops below selected threshold."
                  checked={toggles.lowStockAlerts}
                  onToggle={() => toggleSetting("lowStockAlerts")}
                />

                <SettingsToggleRow
                  title="QC Alerts"
                  description="Notify reviewers when QC pass rate changes or orders fail checks."
                  checked={toggles.qcAlerts}
                  onToggle={() => toggleSetting("qcAlerts")}
                />

                <SettingsToggleRow
                  title="Auto Backup Alerts"
                  description="Notify admin whenever scheduled backup is created."
                  checked={toggles.autoBackup}
                  onToggle={() => toggleSetting("autoBackup")}
                />
              </div>
            </SettingsCard>
          )}

          {activeTab === "Shop Sync" && (
            <SettingsCard
              title="Shop Sync Settings"
              description="Control which modules sync with each shop portal and QR application."
              action={
                <button
                  type="button"
                  onClick={syncAllShops}
                  className="h-10 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white"
                >
                  Sync All Shops
                </button>
              }
            >
              <SettingsToggleRow
                title="Automatic Sync"
                description="Automatically sync orders, QR codes, fabrics and style options after every change."
                checked={toggles.autoSync}
                onToggle={() => toggleSetting("autoSync")}
              />

              <div className="mt-5 overflow-hidden rounded-xl border border-[#e7edf5] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left">
                    <thead>
                      <tr className="border-b border-[#eef2f7] bg-[#f8fafc]">
                        {["Shop", "Catalog", "Fabrics", "Style Options", "QR", "Enabled", "Last Sync"].map((item) => (
                          <th
                            key={item}
                            className="px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                          >
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {shopSyncSettings.map((shop) => (
                        <tr key={shop.id} className="border-b border-[#eef2f7] last:border-b-0">
                          <td className="px-4 py-4">
                            <p className="text-sm font-bold text-[#071633]">{shop.name}</p>
                            <p className="mt-1 text-xs font-semibold text-[#718096]">{shop.city}</p>
                          </td>

                          {(["catalog", "fabrics", "styles", "qr", "enabled"] as const).map((key) => (
                            <td key={key} className="px-4 py-4">
                              <SettingsMiniToggle
                                checked={Boolean(shop[key])}
                                onToggle={() => toggleShopModule(shop.id, key)}
                              />
                            </td>
                          ))}

                          <td className="px-4 py-4 text-sm font-semibold text-[#51617a]">
                            {shop.lastSync}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </SettingsCard>
          )}

          {activeTab === "Admin Profile" && (
            <SettingsCard
              title="Admin Profile"
              description="Update current admin profile and account details."
              action={
                <button
                  type="button"
                  onClick={saveProfile}
                  className="h-10 rounded-lg bg-[#071633] px-4 text-sm font-bold text-white"
                >
                  Save Profile
                </button>
              }
            >
              <div className="mb-5 flex items-center gap-4 rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071633] text-lg font-bold text-[#f7b519]">
                  AD
                </div>
                <div>
                  <p className="text-lg font-bold text-[#071633]">{profile.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#718096]">{profile.role}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <SimpleInput
                  label="Full Name"
                  value={profile.name}
                  onChange={(value) => setProfile({ ...profile, name: value })}
                  placeholder="Admin"
                />

                <SimpleInput
                  label="Email"
                  value={profile.email}
                  onChange={(value) => setProfile({ ...profile, email: value })}
                  placeholder="admin@multife.com"
                />

                <SimpleInput
                  label="Phone"
                  value={profile.phone}
                  onChange={(value) => setProfile({ ...profile, phone: value })}
                  placeholder="+1 (212) 555-0100"
                />

                <SimpleSelect
                  label="Role"
                  value={profile.role}
                  options={["Owner", "Super Admin", "Admin", "Catalog Manager", "Store Manager", "Viewer"]}
                  onChange={(value) => setProfile({ ...profile, role: value })}
                />

                <SimpleInput
                  label="New Password"
                  value={profile.password}
                  onChange={(value) => setProfile({ ...profile, password: value })}
                  placeholder="Enter password"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setNotice("Password reset link sent to admin email.")}
                  className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633] hover:border-[#f7b519]"
                >
                  Send Reset Link
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="h-11 rounded-lg border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  Sign Out
                </button>
              </div>
            </SettingsCard>
          )}

          {activeTab === "Audit Logs" && (
            <SettingsCard
              title="Audit Logs"
              description="Review important admin actions and system changes."
              action={
                <button
                  type="button"
                  onClick={clearLogs}
                  className="h-10 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-600"
                >
                  Clear Logs
                </button>
              }
            >
              <div className="overflow-hidden rounded-xl border border-[#e7edf5] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead>
                      <tr className="border-b border-[#eef2f7] bg-[#f8fafc]">
                        {["Action", "User", "Module", "Time", "Status"].map((item) => (
                          <th
                            key={item}
                            className="px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#718096]"
                          >
                            {item}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {logs.length ? (
                        logs.map((log) => (
                          <tr key={log.id} className="border-b border-[#eef2f7] last:border-b-0">
                            <td className="px-4 py-4 text-sm font-bold text-[#071633]">{log.action}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-[#51617a]">{log.user}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-[#51617a]">{log.module}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-[#51617a]">{log.time}</td>
                            <td className="px-4 py-4">
                              <span
                                className={`rounded-md border px-2.5 py-1 text-[11px] font-bold ${
                                  log.status === "Success"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border-[#f7b519]/30 bg-[#f7b519]/10 text-[#8a6200]"
                                }`}
                              >
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-sm font-bold text-[#718096]">
                            No audit logs available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </SettingsCard>
          )}
        </section>
      </div>

      {backupOpen && (
        <ModalShell title="Create System Backup" onClose={() => setBackupOpen(false)}>
          <div className="space-y-4">
            <div className="rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
              <p className="text-sm font-bold text-[#071633]">Backup will include:</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {["Orders", "Users", "Shops", "QR Codes", "Fabrics", "Style Options", "Reports", "Settings"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#51617a]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBackupOpen(false)}
                className="h-11 rounded-lg border border-[#dfe7f1] bg-white px-5 text-sm font-bold text-[#071633]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createBackup}
                className="h-11 rounded-lg bg-[#071633] px-5 text-sm font-bold text-white"
              >
                Create Backup
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function SettingsCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#e7edf5] bg-white p-5 shadow-[0_10px_26px_rgba(7,22,51,0.04)]">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#071633]">{title}</h3>
          <p className="mt-1 text-sm font-semibold leading-6 text-[#718096]">
            {description}
          </p>
        </div>
        {action}
      </div>

      {children}
    </section>
  );
}

function SettingsToggleRow({
  title,
  description,
  checked,
  onToggle,
}: {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e7edf5] bg-[#f8fafc] p-4">
      <div>
        <p className="text-sm font-bold text-[#071633]">{title}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-[#718096]">
          {description}
        </p>
      </div>

      <SettingsMiniToggle checked={checked} onToggle={onToggle} />
    </div>
  );
}

function SettingsMiniToggle({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative h-[24px] w-[42px] shrink-0 rounded-full transition ${
        checked ? "bg-[#071633]" : "bg-[#d8dee8]"
      }`}
    >
      <span
        className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition ${
          checked ? "left-[21px]" : "left-[3px]"
        }`}
      />
    </button>
  );
}

function settingLabel(key: SettingsToggleKey) {
  const labels: Record<SettingsToggleKey, string> = {
    maintenanceMode: "Maintenance mode",
    autoSync: "Automatic sync",
    emailAlerts: "Email alerts",
    smsAlerts: "SMS alerts",
    whatsappAlerts: "WhatsApp alerts",
    lowStockAlerts: "Low stock alerts",
    qcAlerts: "QC alerts",
    twoFactor: "Two-factor authentication",
    auditLogs: "Audit logs",
    autoBackup: "Auto backup alerts",
    publicCatalog: "Public catalog",
  };

  return labels[key];
}
