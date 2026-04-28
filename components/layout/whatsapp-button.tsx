'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const WhatsappButton = ({ dictionary }: { dictionary: any }) => {
  // Use a placeholder number. The user can replace this.
  const phoneNumber = '+213123456789'; // Example Algerian number
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            size="icon"
            className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 h-16 w-16 rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#128C7E] focus:scale-110 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#25D366] z-50 animate-fade-in-up"
            style={{ animationDelay: '1s', opacity: 0 }}
          >
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={dictionary.whatsapp_chat}>
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-8 w-8">
                <path d="M17.472 14.382c-.297-.149-.758-.372-1.03-.463-.272-.09-.47-.149-.669.149-.198.297-.741.925-.912 1.103-.17.179-.34.198-.63.05-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.17-.297-.018-.464.13-.611.13-.149.297-.372.445-.52.149-.149.198-.297.297-.495.1-.198.05-.372-.025-.52-.075-.149-.669-1.612-.912-2.207-.242-.595-.484-.52-.669-.52-.187 0-.396-.025-.615-.025-.22 0-.56.075-.859.372-.297.297-1.125 1.091-1.125 2.646s1.149 3.076 1.3 3.273c.15.198 2.223 3.406 5.415 4.792 3.192 1.386 3.192.925 3.756.876.565-.05 1.761-.716 2.007-1.413.247-.697.247-1.288.173-1.413-.074-.125-.272-.198-.568-.346z"/>
              </svg>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-card border-primary/20">
          <p>{dictionary.whatsapp_chat}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
