import { getSubscribers } from '@/actions/newsletter';
import { Locale } from '@/lib/i18n-config';
import { Mail, Calendar, UserCheck, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default async function SubscribersPage({ params: { lang } }: { params: { lang: Locale } }) {
  const subscribers = await getSubscribers();
  const isAr = lang === 'ar';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          {isAr ? 'المشتركون في النشرة البريدية' : 'Newsletter Subscribers'}
        </h1>
        <p className="text-muted-foreground mt-1 font-medium">
          {isAr 
            ? 'عرض وإدارة كافة الأشخاص الذين اشتركوا في القائمة البريدية' 
            : 'View and manage everyone who signed up for your newsletter'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-6 rounded-[2rem] border-2 border-primary/10 shadow-xl shadow-primary/5 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black">{subscribers.length}</p>
            <p className="text-xs uppercase font-black tracking-widest opacity-50">
              {isAr ? 'إجمالي المشتركين' : 'Total Subscribers'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-[2.5rem] border-2 shadow-2xl shadow-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b-2">
              <tr>
                <th className={cn("px-6 py-5 font-black uppercase tracking-widest text-[10px] text-muted-foreground", isAr ? "text-right" : "text-left")}>
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </th>
                <th className={cn("px-6 py-5 font-black uppercase tracking-widest text-[10px] text-muted-foreground", isAr ? "text-right" : "text-left")}>
                  {isAr ? 'تاريخ الاشتراك' : 'Subscription Date'}
                </th>
                <th className={cn("px-6 py-5 font-black uppercase tracking-widest text-[10px] text-muted-foreground", isAr ? "text-right" : "text-left")}>
                  {isAr ? 'الحالة' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscribers.length > 0 ? (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className={cn("flex items-center gap-3", isAr && "flex-row-reverse")}>
                        <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="font-bold">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-muted-foreground">
                      <div className={cn("flex items-center gap-2", isAr && "flex-row-reverse")}>
                        <Calendar className="h-3 w-3" />
                        {format(new Date(sub.created_at), 'PPP')}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-500/10 text-green-500">
                        {isAr ? 'نشط' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-20 text-center text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto opacity-10 mb-4" />
                    <p className="font-bold">
                      {isAr ? 'لا يوجد مشتركين حالياً' : 'No subscribers found yet'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
