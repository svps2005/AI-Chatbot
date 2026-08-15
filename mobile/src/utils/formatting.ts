/**
 * Format timestamps for display
 */
export const formatTime = (date: Date | string): string => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'now';
  }

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return messageDate.toLocaleDateString();
};

/**
 * Format conversation title
 */
export const formatConversationTitle = (title: string, maxLength = 50): string => {
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength) + '...';
};

/**
 * Truncate long text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

/**
 * Format message content for display (handle line breaks, etc.)
 */
export const formatMessageContent = (content: string): string => {
  return content.trim();
};

/**
 * Get date display string
 */
export const getDateDisplay = (date: Date | string): string => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDay = messageDate.toLocaleDateString();
  const todayString = today.toLocaleDateString();
  const yesterdayString = yesterday.toLocaleDateString();

  if (messageDay === todayString) {
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (messageDay === yesterdayString) {
    return 'Yesterday';
  }

  return messageDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
};
