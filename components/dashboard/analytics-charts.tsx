'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';

export function RevenueChart({ data, lang }: { data: any[], lang: string }) {
  const isAr = lang === 'ar';
  
  return (
    <Card className="rounded-[2.5rem] border-2 shadow-xl shadow-black/5 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-black uppercase tracking-widest opacity-60">
          {isAr ? 'اتجاه المبيعات (6 أشهر)' : 'Revenue Trend (6 Months)'}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 'bold' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 'bold' }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => [`${formatPrice(value, lang)} DZD`, isAr ? 'المبلغ' : 'Amount']}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="hsl(var(--primary))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorAmount)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function StatusPieChart({ data, lang }: { data: any[], lang: string }) {
  const isAr = lang === 'ar';
  
  return (
    <Card className="rounded-[2.5rem] border-2 shadow-xl shadow-black/5 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-black uppercase tracking-widest opacity-60 text-center">
          {isAr ? 'توزيع الطلبات' : 'Order Distribution'}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-2">
           {data.map((s) => (
             <div key={s.name} className="flex items-center gap-2 text-[10px] font-bold">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
               <span>{s.name}</span>
               <span className="opacity-50">({s.value})</span>
             </div>
           ))}
        </div>
      </CardContent>
    </Card>
  );
}
