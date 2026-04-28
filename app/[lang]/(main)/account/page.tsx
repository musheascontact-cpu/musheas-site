import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { getDictionary } from '@/lib/get-dictionary'
import { Locale } from '@/lib/i18n-config'
import { ProfileForm } from "@/components/account/profile-form";

const mockOrders = [
    { id: 'MUSH-1678886400', date: '2023-03-15', total: 15700, status: 'Delivered' },
    { id: 'MUSH-1679886400', date: '2023-03-27', total: 8200, status: 'Shipped' },
    { id: 'MUSH-1680886400', date: '2023-04-07', total: 26500, status: 'Processing' },
]

export default async function AccountPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const currency = lang === 'ar' ? 'د.ج' : 'DZD';

  return (
    <div className="container py-12 md:py-20">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">{dictionary.account_page_title}</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="profile">{dictionary.account_tab_profile}</TabsTrigger>
          <TabsTrigger value="orders">{dictionary.account_tab_orders}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{dictionary.account_profile_title}</CardTitle>
              <CardDescription>{dictionary.account_profile_description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <ProfileForm dictionary={dictionary} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
             <CardHeader>
              <CardTitle>{dictionary.account_orders_title}</CardTitle>
              <CardDescription>{dictionary.account_orders_description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{dictionary.account_orders_table_id}</TableHead>
                            <TableHead>{dictionary.account_orders_table_date}</TableHead>
                            <TableHead>{dictionary.account_orders_table_status}</TableHead>
                            <TableHead className="text-right">{dictionary.account_orders_table_total}</TableHead>
                            <TableHead><span className="sr-only">{dictionary.account_orders_table_actions}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockOrders.map(order => (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono">{order.id}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell className="text-right">{order.total.toFixed(2)} {currency}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/${lang}/order-confirmation/${order.id}`}>{dictionary.account_orders_table_view}</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
