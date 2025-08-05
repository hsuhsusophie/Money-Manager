// 簡單的Toast工具函數
export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  // 創建toast元素
  const toast = document.createElement('div')
  toast.className = `toast-notification ${type}`
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">
        ${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}
      </span>
      <span class="toast-message">${message}</span>
      <button class="toast-close">×</button>
    </div>
  `

  // 添加樣式
  const style = document.createElement('style')
  style.textContent = `
    .toast-notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid;
      min-width: 300px;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    }
    
    .toast-notification.success {
      border-left-color: #51cf66;
    }
    
    .toast-notification.error {
      border-left-color: #ff6b6b;
    }
    
    .toast-notification.warning {
      border-left-color: #ffd43b;
    }
    
    .toast-notification.info {
      border-left-color: #339af0;
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
    }
    
    .toast-icon {
      margin-right: 12px;
      font-size: 16px;
      font-weight: bold;
    }
    
    .toast-notification.success .toast-icon {
      color: #51cf66;
    }
    
    .toast-notification.error .toast-icon {
      color: #ff6b6b;
    }
    
    .toast-notification.warning .toast-icon {
      color: #ffd43b;
    }
    
    .toast-notification.info .toast-icon {
      color: #339af0;
    }
    
    .toast-message {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
    
    .toast-close {
      margin-left: 12px;
      background: none;
      border: none;
      font-size: 18px;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .toast-close:hover {
      background-color: #f0f0f0;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
    
    .toast-notification.removing {
      animation: slideOut 0.3s ease;
    }
    
    @media (max-width: 480px) {
      .toast-notification {
        top: 10px;
        right: 10px;
        left: 10px;
        min-width: auto;
        max-width: none;
      }
    }
  `

  // 添加到頁面
  document.head.appendChild(style)
  document.body.appendChild(toast)

  // 關閉按鈕事件
  const closeBtn = toast.querySelector('.toast-close') as HTMLButtonElement
  closeBtn.addEventListener('click', () => {
    removeToast(toast)
  })

  // 自動移除
  setTimeout(() => {
    removeToast(toast)
  }, 3000)

  return toast
}

const removeToast = (toast: HTMLElement) => {
  toast.classList.add('removing')
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 300)
}

// 便捷函數
export const showSuccess = (message: string) => showToast(message, 'success')
export const showError = (message: string) => showToast(message, 'error')
export const showWarning = (message: string) => showToast(message, 'warning')
export const showInfo = (message: string) => showToast(message, 'info') 