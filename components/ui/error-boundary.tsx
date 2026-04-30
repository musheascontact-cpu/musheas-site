'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-2 border-dashed border-destructive/20 bg-destructive/5 text-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="p-4 rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground">عذراً، حدث خطأ غير متوقع</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              واجه النظام مشكلة أثناء عرض هذا الجزء. يمكنك محاولة إعادة تحميل الصفحة أو المحاولة مرة أخرى.
            </p>
          </div>
          <Button 
            onClick={() => this.setState({ hasError: false })}
            className="rounded-2xl gap-2 font-bold px-8 py-6 h-auto"
          >
            <RefreshCcw className="h-5 w-5" />
            إعادة المحاولة
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 p-4 rounded-xl bg-black text-white text-xs text-left overflow-auto max-w-full">
              {this.state.error?.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
