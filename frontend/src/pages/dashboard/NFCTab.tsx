import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Rss, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const NFCTab = () => {
  const [linkData, setLinkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nfcStatus, setNfcStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [nfcMessage, setNfcMessage] = useState('');

  useEffect(() => {
    fetchLink();
  }, []);

  const fetchLink = async () => {
    try {
      const { data } = await api.get('/emergency/link');
      setLinkData(data);
    } catch (err) {
      console.log('No link found');
    } finally {
      setLoading(false);
    }
  };

  const writeToNFC = async () => {
    if (!('NDEFReader' in window)) {
      setNfcStatus('error');
      setNfcMessage('Web NFC is not supported on this browser. Please use Chrome on Android.');
      return;
    }

    if (!linkData || !linkData.link.publicSlug) {
      setNfcStatus('error');
      setNfcMessage('Please generate your Emergency SOS link first in the Emergency Tab.');
      return;
    }

    setNfcStatus('scanning');
    setNfcMessage('Bring an NFC tag close to the back of your device...');

    try {
      // @ts-ignore - NDEFReader is not in standard TS DOM lib yet
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [{
          recordType: "url",
          data: `${window.location.origin}/e/${linkData.link.publicSlug}`
        }]
      });
      setNfcStatus('success');
      setNfcMessage('Successfully programmed NFC tag!');
    } catch (error: any) {
      console.error(error);
      setNfcStatus('error');
      setNfcMessage(error.message || 'Failed to program tag. Please ensure NFC is enabled.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading NFC Protocol...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20">
            <Rss className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">NFC Bridge</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Program physical NFC tags for instant Tap-to-View access.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm text-center relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gray-200 dark:border-slate-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gray-200 dark:border-slate-700"></div>
        </div>

        <div className="relative z-10">
          <div className="w-32 h-32 mx-auto bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 shadow-inner relative border border-gray-200 dark:border-slate-700">
             <div className={`absolute inset-0 rounded-full ${nfcStatus === 'scanning' ? 'animate-ping bg-emerald-500/20 duration-[2000ms]' : ''}`}></div>
             <Rss className={`h-14 w-14 ${nfcStatus === 'scanning' ? 'text-emerald-500' : 'text-gray-400'}`} />
          </div>

          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Initialize NFC Tag</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
            Write your secure public Emergency URL directly to a compatible NFC sticker or card. First responders can simply tap their phone to view your life-saving medical details.
          </p>

          {nfcStatus !== 'idle' && (
            <div className={`p-5 rounded-[2rem] mb-8 flex items-center gap-4 max-w-lg mx-auto text-left border ${
              nfcStatus === 'scanning' ? 'bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-300' :
              nfcStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300' :
              'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-300'
            }`}>
              <div className="flex-shrink-0">
                {nfcStatus === 'scanning' && <AlertCircle className="h-6 w-6 animate-pulse" />}
                {nfcStatus === 'success' && <CheckCircle2 className="h-6 w-6" />}
                {nfcStatus === 'error' && <XCircle className="h-6 w-6" />}
              </div>
              <span className="font-bold text-sm">{nfcMessage}</span>
            </div>
          )}

          <button 
            onClick={writeToNFC}
            disabled={nfcStatus === 'scanning' || !linkData}
            className="px-12 py-5 bg-emerald-600 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-2xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {nfcStatus === 'scanning' ? 'Awaiting Tag Tap...' : 'Program NFC Tag'}
          </button>

          {!linkData && (
            <p className="text-rose-500 text-xs font-bold mt-6 bg-rose-50 dark:bg-rose-900/20 inline-block px-4 py-2 rounded-xl border border-rose-100 dark:border-rose-800">
              You must generate your SOS Link in the Emergency tab first!
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-8 bg-primary-50 dark:bg-primary-900/10 rounded-[2.5rem] border border-primary-100 dark:border-primary-900/30 flex items-start gap-5">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
            <AlertCircle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h4 className="font-black text-primary-900 dark:text-primary-100 uppercase tracking-widest text-[10px] mb-2">Write Compatibility</h4>
            <p className="text-xs text-primary-800 dark:text-primary-200 leading-relaxed font-medium">
              Writing to an NFC tag requires <strong>Google Chrome on an Android device</strong> due to Apple iOS restrictions on the Web NFC API.
            </p>
          </div>
        </div>

        <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-5">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-widest text-[10px] mb-2">Scan Compatibility</h4>
            <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed font-medium">
              Once programmed, <strong>scanning the tag works natively on ALL modern smartphones</strong> (both iOS and Android) without any app!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFCTab;
