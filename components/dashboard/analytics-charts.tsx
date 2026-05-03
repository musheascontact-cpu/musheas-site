'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

const CustomTooltipRevenue = ({ active, payload, label, isAr }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className="font-black text-lg">{payload[0].value.toLocaleString('en-US')} <span className="text-xs text-muted-foreground">DZD</span></p>
      </div>
    );
  }
  return null;
};

const CustomTooltipPie = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="font-black">{payload[0].name}</p>
        <p className="text-muted-foreground font-bold">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data, lang }: { data: any[], lang: string }) {
  const isAr = lang === 'ar';
  
  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm h-full">
      <div className="px-5 pt-5 pb-3 border-b">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {isAr ? 'اتجاه المبيعات (6 أشهر)' : 'Revenue Trend — Last 6 Months'}
        </p>
      </div>
      <div className="p-5 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltipRevenue isAr={isAr} />} />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2.5}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StatusPieChart({ data, lang }: { data: any[], lang: string }) {
  const isAr = lang === 'ar';
  const total = data.reduce((s, d) => s + d.value, 0);
  
  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm h-full">
      <div className="px-5 pt-5 pb-3 border-b">
        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          {isAr ? 'توزيع الطلبات' : 'Order Status'}
        </p>
      </div>
      <div className="p-5">
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="space-y-2 mt-2">
          {data.map((s) => (
            <div key={s.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs font-bold text-muted-foreground">{s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black">{s.value}</span>
                {total > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    ({((s.value / total) * 100).toFixed(0)}%)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
