const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

// Maps a Postgres row to the shape the API/frontend expects (previously Mongoose docs)
const mapUser = (row, { includePassword = false } = {}) => {
  if (!row) return null;
  const user = {
    _id: row.id,
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.created_at
  };
  if (includePassword) {
    user.password = row.password;
  }
  return user;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const User = {
  async findByEmail(email, { includePassword = false } = {}) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) throw error;
    return mapUser(data, { includePassword });
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    // 22P02 = invalid uuid format -> treat as "not found" instead of a 500
    if (error && error.code === '22P02') return null;
    if (error) throw error;
    return mapUser(data);
  },

  async create({ email, password, role = 'user' }) {
    const hashedPassword = await hashPassword(password);

    const { data, error } = await supabase
      .from('users')
      .insert({ email: email.toLowerCase(), password: hashedPassword, role })
      .select()
      .single();

    if (error) throw error;
    return mapUser(data);
  },

  async findAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(row => mapUser(row));
  },

  async updateRole(id, role) {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapUser(data);
  },

  async deleteById(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async count() {
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    return count;
  },

  async matchPassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }
};

module.exports = User;
