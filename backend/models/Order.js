const supabase = require('../config/supabase');

// Maps a Postgres row to the shape the API/frontend expects (previously Mongoose docs).
// When the user is joined (includeUser), userId becomes an object like
// the old .populate('userId', 'email') result.
const mapOrder = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    userId: row.users
      ? { _id: row.user_id, email: row.users.email }
      : row.user_id,
    pizzas: row.pizzas,
    totalAmount: Number(row.total_amount),
    paymentStatus: row.payment_status,
    stripePaymentId: row.stripe_payment_id,
    stripeSessionId: row.stripe_session_id,
    createdAt: row.created_at
  };
};

const Order = {
  async create({ userId, pizzas, totalAmount, paymentStatus = 'pending', createdAt }) {
    const row = {
      user_id: userId,
      pizzas,
      total_amount: totalAmount,
      payment_status: paymentStatus
    };
    if (createdAt) {
      row.created_at = createdAt;
    }

    const { data, error } = await supabase
      .from('orders')
      .insert(row)
      .select()
      .single();

    if (error) throw error;
    return mapOrder(data);
  },

  async findById(id, { includeUser = false } = {}) {
    const { data, error } = await supabase
      .from('orders')
      .select(includeUser ? '*, users(email)' : '*')
      .eq('id', id)
      .maybeSingle();

    // 22P02 = invalid uuid format -> treat as "not found" instead of a 500
    if (error && error.code === '22P02') return null;
    if (error) throw error;
    return mapOrder(data);
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapOrder);
  },

  async findAll({ includeUser = false } = {}) {
    const { data, error } = await supabase
      .from('orders')
      .select(includeUser ? '*, users(email)' : '*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapOrder);
  },

  async findWithPayment() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, users(email)')
      .not('stripe_payment_id', 'is', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapOrder);
  },

  async findPaid() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'paid');

    if (error) throw error;
    return data.map(mapOrder);
  },

  async update(id, fields) {
    // Accepts API-style field names, translates to column names
    const updates = {};
    if (fields.paymentStatus !== undefined) updates.payment_status = fields.paymentStatus;
    if (fields.stripePaymentId !== undefined) updates.stripe_payment_id = fields.stripePaymentId;
    if (fields.stripeSessionId !== undefined) updates.stripe_session_id = fields.stripeSessionId;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapOrder(data);
  },

  async count() {
    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count;
  }
};

module.exports = Order;
