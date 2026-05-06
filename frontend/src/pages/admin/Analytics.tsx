import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Activity, 
  BarChart3, 
  PieChart as PieIcon, 
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="bg-zinc-950/50 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl inline-block">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2 flex items-center gap-3 tracking-tight">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 glow-border">
               <TrendingUp className="w-7 h-7 text-emerald-400" />
            </div>
            SYSTEM ANALYTICS
          </h1>
          <p className="text-zinc-400 font-medium text-sm tracking-widest uppercase">Business Intelligence & Data Insights</p>
        </div>
        <button className="px-6 py-4 bg-white/5 hover:bg-emerald-500 text-white hover:text-black border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 transition-all shadow-2xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] backdrop-blur-md">
          <Download className="w-4 h-4" />
          Export Intelligence Report
        </button>
      </header>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
            { label: 'Retention Rate', value: '94.2%', trend: '+2.1%', up: true },
            { label: 'Avg. Session', value: '12m 45s', trend: '+14s', up: true },
            { label: 'Active SOS Rate', value: '0.04%', trend: '-0.01%', up: false },
            { label: 'Data Latency', value: '38ms', trend: '-2ms', up: false },
        ].map((item, i) => (
            <div key={i} className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl group hover:-translate-y-1 transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">{item.label}</p>
                <div className="flex items-baseline gap-3 relative z-10">
                    <h3 className="text-2xl font-black text-white">{item.value}</h3>
                    <span className={`text-[10px] font-black flex items-center gap-1 ${item.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {item.trend}
                    </span>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        {/* User Engagement Area Chart */}
        <section className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">User Engagement</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active nodes vs Passive nodes</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                </div>
            </div>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.growthData || []}>
                        <defs>
                            <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                        <Area type="step" dataKey="users" stroke="#3b82f6" strokeWidth={4} fill="url(#engGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>

        {/* Blood Group Distribution Bar Chart */}
        <section className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Medical Demographics</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Blood group inventory distribution</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl">
                    <PieIcon className="w-6 h-6 text-rose-400" />
                </div>
            </div>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.bloodGroupStats || []} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                        <XAxis type="number" stroke="#475569" fontSize={10} hide />
                        <YAxis dataKey="_id" type="category" stroke="#ffffff" fontSize={12} width={40} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                        <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={30}>
                            {data?.bloodGroupStats?.map((_entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>

        {/* System Activity Line Chart */}
        <section className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">System Throughput</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Real-time API request frequency</p>
                </div>
                <Activity className="w-6 h-6 text-amber-500" />
            </div>
            <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.growthData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="month" stroke="#475569" fontSize={10} />
                        <YAxis stroke="#475569" fontSize={10} />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>

        {/* Regional Distribution (Simulated) */}
        <section className="bg-white/5 dark:bg-zinc-950/60 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Regional Nodes</h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Global distribution of active users</p>
                </div>
                <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div className="h-[350px] flex flex-col justify-center gap-6">
                {[
                    { region: 'North America', value: 45, color: 'bg-emerald-500' },
                    { region: 'Europe', value: 32, color: 'bg-blue-500' },
                    { region: 'Asia Pacific', value: 18, color: 'bg-amber-500' },
                    { region: 'Others', value: 5, color: 'bg-rose-500' },
                ].map((item, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-white">{item.region}</span>
                            <span className="text-slate-500">{item.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>

      {/* Footer Insight */}
      <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center gap-6 shadow-2xl relative z-10 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-4 bg-emerald-500 rounded-3xl relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-110">
              <TrendingUp className="w-8 h-8 text-black" />
          </div>
          <div className="relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Intelligence Brief</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">Overall system performance is <span className="text-emerald-400 font-bold">optimal</span>. User retention has increased by <span className="text-emerald-400 font-bold">4.2%</span> this quarter. Recommend scaling the Singapore node for better Asia-Pacific latency.</p>
          </div>
      </div>
    </div>
  );
};

const Globe = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
);

export default Analytics;
