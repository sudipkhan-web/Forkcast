import React, { Component, ErrorInfo, ReactNode } from 'react';
import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, showToast?: (msg: string, type: 'error'|'success') => void) {
  if (showToast) {
    showToast("Something went wrong saving your changes \u2014 please try again.", 'error');
  }
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email ?? undefined,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId ?? undefined,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || 'An unexpected error occurred.';
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed.error) {
          errorMessage = parsed.error;
        }
      } catch (e) {
        // Not JSON
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900 p-6">
          <div className="bg-stone-900 p-8 rounded-2xl shadow-sm border border-red-200 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-stone-400 mb-6">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 transition-all active:scale-95"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return (this.props as any).children;
  }
}
