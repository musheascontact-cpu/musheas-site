import prisma from '@/lib/prisma';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Phone, Calendar, Clock, User, ArrowRight } from "lucide-react"
import { Locale } from '@/lib/i18n-config';
import { Button } from '@/components/ui/button';

export default async function DashboardInquiries({ params: { lang } }: { params: { lang: Locale } }) {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { created_at: 'desc' }
  });

  const isAr = lang === 'ar';

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-card to-muted/50 border-2 border-primary/10 shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-3xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {isAr ? 'طلبات التواصل و B2B' : 'B2B & Contact Inquiries'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2 font-medium">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
              {isAr
                ? `لديك ${inquiries?.filter(i => i.status === 'new').length ?? 0} طلبات جديدة لم تتم قراءتها`
                : `${inquiries?.filter(i => i.status === 'new').length ?? 0} new unread inquiries`}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Inquiries */}
      <div className="grid grid-cols-1 gap-6">
        {inquiries && inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <div key={inquiry.id} className="group relative rounded-[2rem] border-2 bg-card hover:bg-muted/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-20 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant={inquiry.status === 'new' ? 'default' : 'secondary'} className="rounded-full px-4 font-black uppercase text-[10px] tracking-widest">
                        {inquiry.status}
                      </Badge>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(inquiry.created_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                        {inquiry.name}
                      </h2>
                      <div className="flex flex-wrap gap-4 mt-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <Mail className="h-4 w-4 text-primary/60" />
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                            <Phone className="h-4 w-4 text-primary/60" />
                            {inquiry.phone}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-muted/50 border border-border/50">
                      <p className="text-foreground leading-relaxed font-medium">
                        {inquiry.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[140px]">
                    <Button variant="outline" className="w-full rounded-xl font-bold gap-2">
                      <Mail className="h-4 w-4" />
                      {isAr ? 'رد عبر البريد' : 'Reply by Email'}
                    </Button>
                    {inquiry.phone && (
                      <Button variant="secondary" className="w-full rounded-xl font-bold gap-2" asChild>
                        <a href={`tel:${inquiry.phone}`}>
                          <Phone className="h-4 w-4" />
                          {isAr ? 'اتصال مباشر' : 'Call Now'}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-96 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <div className="p-8 rounded-full bg-muted shadow-inner mb-4">
              <MessageSquare className="h-16 w-16 opacity-20" />
            </div>
            <p className="text-2xl font-black">{isAr ? 'لا توجد رسائل حالياً' : 'No inquiries found'}</p>
            <p className="font-medium mt-2">{isAr ? 'عندما يرسل الزبائن رسائل من صفحة اتصل بنا ستظهر هنا' : 'Messages from the contact page will appear here'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
