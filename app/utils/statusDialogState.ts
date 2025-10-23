import { type ReactNode } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type StatusProps =
  | 'save'
  | 'delete'
  | 'error'
  | 'info'
  | 'success'
  | 'dev'
  | 'warning';

/**
 * AutoCompleteConfig 自動關閉 dialog 的設定
 * config props:
 * - millisecond: 自動關閉的時間
 * - onAutoComplete: 自動關閉時的 callback
 */
interface AutoCompleteConfig {
  millisecond: number;
  onAutoComplete?: () => void;
}

/**
 * config props:
 * - status: 預設為 'success'
 * - type: 預設為 'admin'
 * - isSingleButton: 當 status 為'error', 'dev', 'warning', 'success' 預設為 true
 * - autoComplete: 自動關閉 dialog 的設定
 */
export interface DialogConfig {
  title?: string | ReactNode;
  description?: string | ReactNode;
  cancelText?: string;
  onCancel?: () => void;
  confirmText?: string;
  onConfirm?: () => void | Promise<void>;
  disableActions?: boolean;
  isSingleButton?: boolean;
  status: StatusProps;
  type?: 'front' | 'admin'| 'full';
  autoComplete?: AutoCompleteConfig;
}

interface StatusDialogState {
  isOpen: boolean;
  /**
   * config props:
   * - status: 預設為 'success'
   * - type: 預設為 'admin'
   * - isSingleButton: 當 status 為'error', 'dev', 'warning', 'success' 預設為 true
   */
  dialog: DialogConfig;
  /**
   * config props:
   * - status: 預設為 'success'
   * - type: 預設為 'admin'
   * - isSingleButton: 當 status 為'error', 'dev', 'warning', 'success' 預設為 true
   */
  openStatusDialog: (config: DialogConfig) => void;
  closeStatusDialog: () => void;
}

export const useStatusDialogState = create<StatusDialogState>()(
  devtools((set) => {
    return {
      isOpen: false,
      dialog: { status: 'success', type: 'admin' },
      openStatusDialog: (config) => {
        set({ isOpen: true, dialog: config });
      },
      closeStatusDialog: () => {
        set({ isOpen: false, dialog: { status: 'success', type: 'admin' } });
      },
    };
  }),
);
