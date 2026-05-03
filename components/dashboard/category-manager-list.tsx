'use client';

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Edit, 
  Trash2, 
  Package, 
  Check, 
  X, 
  Loader2,
  AlertCircle,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { renameCategory, deleteCategory } from '@/actions/products';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategoryWithCount {
  name: string;
  productCount: number;
}

interface CategoryManagerListProps {
  initialCategories: CategoryWithCount[];
  lang: string;
}

export function CategoryManagerList({ initialCategories, lang }: CategoryManagerListProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isAr = lang === 'ar';

  const handleRename = async (oldName: string) => {
    if (!newName || newName === oldName) {
      setEditingCategory(null);
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await renameCategory(oldName, newName);
      
      if (result.success) {
        setCategories(prev => prev.map(c => 
          c.name === oldName ? { ...c, name: newName } : c
        ));
        toast({
          title: isAr ? 'تم التعديل بنجاح' : 'Renamed Successfully',
          description: isAr ? `تم تغيير ${oldName} إلى ${newName}` : `Changed ${oldName} to ${newName}`,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: isAr ? 'فشل التعديل' : 'Rename Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
      setEditingCategory(null);
    }
  };

  const handleDelete = async (categoryName: string) => {
    try {
      setIsSubmitting(true);
      const result = await deleteCategory(categoryName);
      
      if (result.success) {
        setCategories(prev => prev.filter(c => c.name !== categoryName));
        toast({
          title: isAr ? 'تم الحذف' : 'Category Deleted',
          description: isAr 
            ? 'تم نقل المنتجات إلى "Uncategorized"' 
            : 'Products moved to "Uncategorized"',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: isAr ? 'فشل الحذف' : 'Delete Failed',
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2.5rem] border bg-card/50 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 hover:shadow-primary/5">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-2">
            <TableHead className="py-6 px-8 font-black uppercase text-[10px] tracking-widest text-muted-foreground">
              {isAr ? 'التصنيف' : 'Category Name'}
            </TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">
              {isAr ? 'عدد المنتجات' : 'Products Count'}
            </TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest text-muted-foreground text-right px-8">
              {isAr ? 'إجراءات' : 'Actions'}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.name} className="group hover:bg-primary/[0.02] transition-all duration-300">
              <TableCell className="py-4 px-8">
                {editingCategory === category.name ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-9 w-64 rounded-xl border-2 border-primary/20 focus:border-primary transition-all"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(category.name);
                        if (e.key === 'Escape') setEditingCategory(null);
                      }}
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleRename(category.name)}
                      disabled={isSubmitting}
                      className="h-9 w-9 rounded-xl text-green-600 hover:bg-green-50"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => setEditingCategory(null)}
                      disabled={isSubmitting}
                      className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/5"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-black text-foreground group-hover:text-primary transition-colors text-lg">
                      {category.name}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground opacity-50" />
                  <span className="font-bold text-muted-foreground">
                    {category.productCount} {isAr ? 'منتج' : 'products'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right px-8">
                <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      setEditingCategory(category.name);
                      setNewName(category.name);
                    }}
                    className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2.5rem]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-black text-2xl flex items-center gap-2">
                          <AlertCircle className="text-destructive h-6 w-6" />
                          {isAr ? 'هل أنت متأكد؟' : 'Are you absolutely sure?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="font-medium">
                          {isAr 
                            ? `سيتم نقل جميع المنتجات (${category.productCount}) في تصنيف "${category.name}" إلى "Uncategorized".`
                            : `All ${category.productCount} products in "${category.name}" will be moved to "Uncategorized".`}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-2xl border-2">{isAr ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(category.name)}
                          className="rounded-2xl bg-destructive hover:bg-destructive/90"
                        >
                          {isAr ? 'تأكيد الحذف' : 'Confirm Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="h-64 text-center">
                <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-50 italic">
                  <Layers className="h-12 w-12" />
                  <p>{isAr ? 'لا توجد تصنيفات نشطة' : 'No active categories'}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
