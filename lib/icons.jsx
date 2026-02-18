'use client';

/**
 * Centralised icon mappings using react-icons.
 * Every component imports from here instead of using emojis.
 */

// Asset-type icons (Remix Line / Fill)
import {
  RiStockLine,
  RiBitCoinLine,
  RiBankLine,
  RiHome4Line,
  RiBriefcase4Line,
  RiSafeLine,
  RiVipDiamondLine,
  RiArchiveLine,
} from 'react-icons/ri';

// Bottom-nav icons (outlined + filled)
import {
  HiOutlineHome,
  HiHome,
  HiOutlineCurrencyDollar,
  HiCurrencyDollar,
  HiOutlineChartBar,
  HiChartBar,
  HiOutlineCog6Tooth,
  HiCog6Tooth,
} from 'react-icons/hi2';

// Action / UI icons
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineGlobeAlt,
  HiOutlineCircleStack,
  HiOutlineArrowTrendingUp,
  HiOutlineChartPie,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineFolderOpen,
  HiOutlineWallet,
} from 'react-icons/hi2';

/* ── Asset-type icon components ───────────────────────── */

export const ASSET_TYPE_ICONS = {
  stock:      RiStockLine,
  crypto:     RiBitCoinLine,
  bond:       RiBankLine,
  realestate: RiHome4Line,
  fund:       RiBriefcase4Line,
  savings:    RiSafeLine,
  commodity:  RiVipDiamondLine,
  other:      RiArchiveLine,
};

/** Render the icon component for a given asset type */
export function AssetTypeIcon({ type, size = 20, className = '', style = {} }) {
  const Icon = ASSET_TYPE_ICONS[type] || ASSET_TYPE_ICONS.other;
  return <Icon size={size} className={className} style={style} />;
}

/* ── Bottom-nav icons ─────────────────────────────────── */

export const NAV_ICONS = {
  dashboard:  { outline: HiOutlineHome, filled: HiHome },
  assets:     { outline: HiOutlineCurrencyDollar, filled: HiCurrencyDollar },
  analytics:  { outline: HiOutlineChartBar, filled: HiChartBar },
  settings:   { outline: HiOutlineCog6Tooth, filled: HiCog6Tooth },
};

/* ── Action icons (re-export for convenience) ─────────── */

export {
  HiOutlinePlus       as IconPlus,
  HiOutlinePencilSquare as IconEdit,
  HiOutlineTrash       as IconTrash,
  HiOutlineDocumentText as IconRecord,
  HiOutlineArrowDownTray as IconExport,
  HiOutlineArrowUpTray   as IconImport,
  HiOutlineGlobeAlt      as IconGlobe,
  HiOutlineCircleStack   as IconDatabase,
  HiOutlineArrowTrendingUp as IconTrendUp,
  HiOutlineChartPie      as IconPieChart,
  HiOutlineChartBar      as IconBarChart,
  HiOutlineCheckCircle   as IconCheckCircle,
  HiOutlineXCircle       as IconXCircle,
  HiOutlineInformationCircle as IconInfo,
  HiOutlineFolderOpen    as IconFolder,
  HiOutlineWallet        as IconWallet,
};
