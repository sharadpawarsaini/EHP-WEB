import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useProfileContext } from '../../context/ProfileContext';
import { UserPlus, UserCircle, Trash2, CheckCircle2 } from 'lucide-react';

const FamilyTab = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const { managedMemberId, setManagedMember } = useProfileContext();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await api.get('/family');
      setMembers(data);
    } catch (err) {
      console.error('Failed to fetch family members');
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/family', { name, relation });
      setMembers([...members, data]);
      setName('');
      setRelation('');
      setShowAdd(false);
    } catch (err) {
      alert('Failed to add family member');
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure? This will delete all medical data for this member.')) return;
    try {
      await api.delete(`/family/${id}`);
      setMembers(members.filter(m => m._id !== id));
      if (managedMemberId === id) setManagedMember(null);
    } catch (err) {
      alert('Failed to delete member');
    }
  };

  if (loading) return <div className="text-gray-500">Loading family...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Family Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage health passports for your family members.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" /> Add Member
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Me Profile */}
        <div className={`p-6 rounded-[2rem] border-2 transition-all ${!managedMemberId ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}`}>
          <div className="flex justify-between items-start mb-4">
            <UserCircle className="h-10 w-10 text-blue-600" />
            {!managedMemberId && <CheckCircle2 className="h-6 w-6 text-blue-600 fill-blue-600 text-white" />}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Me (Primary)</h3>
          <p className="text-sm text-gray-500 mb-6">Your main account profile</p>
          <button 
            disabled={!managedMemberId}
            onClick={() => setManagedMember(null)}
            className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${!managedMemberId ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
          >
            {!managedMemberId ? 'Currently Managing' : 'Switch to Me'}
          </button>
        </div>

        {/* Family Members */}
        {members.map(member => (
          <div key={member._id} className={`p-6 rounded-[2rem] border-2 transition-all ${managedMemberId === member._id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700'}`}>
            <div className="flex justify-between items-start mb-4">
              <UserCircle className="h-10 w-10 text-indigo-600" />
              <div className="flex gap-2">
                <button onClick={() => deleteMember(member._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
                {managedMemberId === member._id && <CheckCircle2 className="h-6 w-6 text-indigo-600 fill-indigo-600 text-white" />}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
            <p className="text-sm text-gray-500 mb-6 uppercase font-bold tracking-wider text-[10px] bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-md inline-block">
              {member.relation}
            </p>
            <button 
              disabled={managedMemberId === member._id}
              onClick={() => setManagedMember(member._id, member.name)}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${managedMemberId === member._id ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              {managedMemberId === member._id ? 'Currently Managing' : 'Manage Profile'}
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add Family Member</h3>
            <form onSubmit={addMember} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Relation</label>
                <select value={relation} onChange={e => setRelation(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                  <option value="">Select Relation</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTab;
