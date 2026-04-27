import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Phone, Plus, Trash2 } from 'lucide-react';

const ContactsTab = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await api.get('/emergency/contacts');
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (contacts.length >= 2) {
      setError('Maximum 2 contacts allowed.');
      return;
    }
    try {
      await api.post('/emergency/contacts', newContact);
      setNewContact({ name: '', relation: '', phone: '' });
      setShowAdd(false);
      fetchContacts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add contact');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/emergency/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl shadow-gray-200/40 dark:shadow-none border border-white dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Emergency Contacts</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Add up to 2 people to be contacted in an emergency.</p>
        </div>
        {contacts.length < 2 && !showAdd && (
          <button 
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Contact
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">{error}</div>}

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-gray-50/50 dark:bg-slate-700/30 p-6 rounded-2xl border border-gray-200 dark:border-slate-600 mb-8 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                required
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Relation</label>
              <input
                required
                type="text"
                placeholder="e.g. Spouse, Parent"
                value={newContact.relation}
                onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                required
                type="tel"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {contacts.map((contact) => (
          <div key={contact._id} className="border border-gray-200 dark:border-slate-600 bg-gray-50/30 dark:bg-slate-700/30 rounded-2xl p-6 flex justify-between items-start hover:shadow-md transition-shadow">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">{contact.name}</h4>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">{contact.relation}</p>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium">
                <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                {contact.phone}
              </div>
            </div>
            <button
              onClick={() => handleDelete(contact._id)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
        {contacts.length === 0 && !showAdd && (
          <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-slate-700/30 rounded-2xl border border-dashed border-gray-200 dark:border-slate-600">
            No emergency contacts added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsTab;
