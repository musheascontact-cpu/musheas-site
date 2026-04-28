'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

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
    hasError: false
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
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-card rounded-[2rem] border-2 border-dashed border-destructive/20 m-4">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-black mb-2">عفواً، حدث خطأ غير متوقع</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            نعتذر عن هذا الخلل. لقد تم تسجيل الخطأ وفريقنا يعمل على إصلاحه.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => this.setState({ hasError: false })}
              variant="outline"
              className="rounded-xl"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              إعادة المحاولة
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              className="rounded-xl"
            >
              تحديث الصفحة
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-muted rounded-xl text-xs text-left overflow-auto max-w-full">
              {this.state.error?.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
