export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount) => {
  return `$${Number(amount).toFixed(2)}`;
};

export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

export const isUser = (user) => {
  return user && user.role === 'user';
};
