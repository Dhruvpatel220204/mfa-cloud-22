import { SECTOR_OPTIONS } from '@/config/tenantTheme';
import { useTenantTheme } from '@/hooks/useTenantTheme';

/** Demo control for multi-sector / multi-client previews */
export default function SectorSwitcher() {
  const { sector, setSectorQuery } = useTenantTheme();

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px]">
      <span className="text-muted-foreground uppercase tracking-wider mr-1 font-mono">Sector</span>
      {SECTOR_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setSectorQuery(opt.id)}
          className={`px-2.5 py-1 rounded-full border transition-all font-mono ${
            sector === opt.id
              ? 'bg-primary/15 border-primary/30 text-primary'
              : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/20'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
