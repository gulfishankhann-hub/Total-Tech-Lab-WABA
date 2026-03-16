/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Send, 
  History, 
  Settings, 
  Moon, 
  Sun, 
  MessageSquare, 
  Users, 
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Plus,
  Inbox,
  Zap,
  Link as LinkIcon,
  UserCircle,
  FileUp,
  Filter,
  MoreHorizontal,
  Paperclip,
  Smile,
  ChevronRight,
  ShieldCheck,
  Globe,
  Info,
  Smartphone,
  Trash2,
  Edit3,
  RefreshCw,
  Database as DatabaseIcon,
  Activity,
  PieChart as PieChartIcon,
  Save,
  Phone,
  Tag,
  StickyNote,
  Code
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { metaWabaService } from '../services/metaWabaService';
import { MetaTemplate, BroadcastSession, Lead, MetaChannel } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Papa from 'papaparse';
import TemplateCreation from '../components/TemplateCreation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TabType = 'overview' | 'inbox' | 'broadcast' | 'contacts' | 'analytics' | 'explorer' | 'automations' | 'integrations' | 'settings' | 'profile' | 'phone-numbers';

export default function ConnectDashboard() {
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [templates, setTemplates] = useState<MetaTemplate[]>([]);
  const [broadcasts, setBroadcasts] = useState<BroadcastSession[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [channels, setChannels] = useState<MetaChannel[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [businessAccounts, setBusinessAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [accountInfo, setAccountInfo] = useState<any>(null);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [t, b, c, acc, ch, pns, bas] = await Promise.all([
        metaWabaService.getTemplates(),
        metaWabaService.getBroadcasts(),
        metaWabaService.getContacts(),
        metaWabaService.getAccountInfo(),
        metaWabaService.getChannels(),
        metaWabaService.getPhoneNumbers(),
        metaWabaService.getBusinessAccounts()
      ]);
      setTemplates(t);
      setBroadcasts(b);
      setContacts(c);
      setAccountInfo(acc);
      setChannels(ch);
      setPhoneNumbers(pns);
      setBusinessAccounts(bas);
      setLastUpdated(new Date().toLocaleTimeString());
      console.log('Meta Data Loaded:', { templates: t, broadcasts: b, contacts: c, account: acc, channels: ch, phoneNumbers: pns, businessAccounts: bas });
    } catch (error) {
      console.error('Error fetching Meta data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    if (!broadcasts.length) return { sent: 0, delivered: '0%', read: '0%', replied: '0%' };
    
    const total = broadcasts.reduce((acc, b) => ({
      sent: acc.sent + (b.sentCount || 0),
      delivered: acc.delivered + (b.deliveredCount || 0),
      read: acc.read + (b.readCount || 0),
      replied: acc.replied + (b.repliedCount || 0)
    }), { sent: 0, delivered: 0, read: 0, replied: 0 });

    return {
      sent: total.sent,
      delivered: total.sent > 0 ? ((total.delivered / total.sent) * 100).toFixed(1) + '%' : '0%',
      read: total.sent > 0 ? ((total.read / total.sent) * 100).toFixed(1) + '%' : '0%',
      replied: total.sent > 0 ? ((total.replied / total.sent) * 100).toFixed(1) + '%' : '0%'
    };
  }, [broadcasts]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 flex",
      isDark ? "bg-[#0a0f1e] text-white" : "bg-gray-50 text-gray-900"
    )}>
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 border-r transition-colors duration-300 z-50 flex flex-col",
        isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <MessageSquare className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Shivam's WABA Tool</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
            isDark={isDark}
          />
          <NavItem 
            icon={<Phone size={20} />} 
            label="Phone Numbers" 
            active={activeTab === 'phone-numbers'} 
            onClick={() => setActiveTab('phone-numbers')}
            isDark={isDark}
          />
          <NavItem 
            icon={<Inbox size={20} />} 
            label="Team Inbox" 
            active={activeTab === 'inbox'} 
            onClick={() => setActiveTab('inbox')}
            isDark={isDark}
          />
          <NavItem 
            icon={<Send size={20} />} 
            label="Broadcast" 
            active={activeTab === 'broadcast'} 
            onClick={() => setActiveTab('broadcast')}
            isDark={isDark}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Contacts" 
            active={activeTab === 'contacts'} 
            onClick={() => setActiveTab('contacts')}
            isDark={isDark}
          />
          <NavItem 
            icon={<BarChart3 size={20} />} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
            isDark={isDark}
          />
          <NavItem 
            icon={<Code size={20} />} 
            label="Developer Tools" 
            active={activeTab === 'explorer'} 
            onClick={() => setActiveTab('explorer')}
            isDark={isDark}
          />
          <NavItem 
            icon={<Zap size={20} />} 
            label="Automations" 
            active={activeTab === 'automations'} 
            onClick={() => setActiveTab('automations')}
            isDark={isDark}
          />
          <NavItem 
            icon={<LinkIcon size={20} />} 
            label="Integrations" 
            active={activeTab === 'integrations'} 
            onClick={() => setActiveTab('integrations')}
            isDark={isDark}
          />
          <NavItem 
            icon={<UserCircle size={20} />} 
            label="Business Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
            isDark={isDark}
          />
          <NavItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            isDark={isDark}
          />
        </nav>

        <div className="p-6 border-t border-gray-800/50">
          <button 
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-3 w-full p-3 rounded-xl transition-all",
              isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
            )}
          >
            {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen flex flex-col">
        <header className={cn(
          "h-20 px-8 flex justify-between items-center border-b sticky top-0 z-40 transition-colors duration-300",
          isDark ? "bg-[#0a0f1e]/80 border-gray-800 backdrop-blur-md" : "bg-white/80 border-gray-200 backdrop-blur-md"
        )}>
          <div>
            <h2 className="text-2xl font-bold capitalize">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'phone-numbers' && 'Phone Numbers'}
              {activeTab === 'inbox' && 'Team Inbox'}
              {activeTab === 'broadcast' && 'Broadcast Center'}
              {activeTab === 'contacts' && 'Contact Directory'}
              {activeTab === 'analytics' && 'Tracking & Analytics'}
              {activeTab === 'automations' && 'Workflow Automations'}
              {activeTab === 'integrations' && 'App Integrations'}
              {activeTab === 'profile' && 'Business Profile'}
              {activeTab === 'settings' && 'Platform Settings'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Sync Status</span>
              <span className="text-[10px] font-mono text-gray-400">Updated {lastUpdated}</span>
            </div>
            <button 
              onClick={fetchData}
              disabled={refreshing}
              className={cn(
                "p-2 rounded-xl transition-all",
                isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200",
                refreshing && "animate-spin"
              )}
              title="Sync All Data"
            >
              <RefreshCw size={20} className={cn(refreshing ? "text-green-500" : "text-gray-400")} />
            </button>
            <div className={cn(
              "px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium",
              isDark ? "bg-green-500/10 text-green-400" : "bg-green-100 text-green-700"
            )}>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              WABA: {accountInfo?.apiStatus || 'Connected'}
            </div>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold",
              isDark ? "bg-blue-600" : "bg-blue-100 text-blue-600"
            )}>
              SM
            </div>
          </div>
        </header>

        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewSection isDark={isDark} templates={templates} broadcasts={broadcasts} stats={stats} channels={channels} />}
            {activeTab === 'phone-numbers' && <PhoneNumbersSection isDark={isDark} phoneNumbers={phoneNumbers} businessAccounts={businessAccounts} />}
            {activeTab === 'inbox' && <InboxSection isDark={isDark} contacts={contacts} />}
            {activeTab === 'broadcast' && <BroadcastSection isDark={isDark} templates={templates} broadcasts={broadcasts} onRefresh={fetchData} />}
            {activeTab === 'contacts' && <ContactsSection isDark={isDark} contacts={contacts} />}
            {activeTab === 'analytics' && <AnalyticsSection isDark={isDark} broadcasts={broadcasts} />}
            {activeTab === 'explorer' && <ExplorerSection isDark={isDark} contacts={contacts} broadcasts={broadcasts} templates={templates} accountInfo={accountInfo} />}
            {activeTab === 'automations' && <AutomationsSection isDark={isDark} />}
            {activeTab === 'integrations' && <IntegrationsSection isDark={isDark} />}
            {activeTab === 'profile' && <ProfileSection isDark={isDark} />}
            {activeTab === 'settings' && <SettingsSection isDark={isDark} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Sub-sections ---

function OverviewSection({ isDark, templates, broadcasts, stats, channels }: { isDark: boolean, templates: any[], broadcasts: any[], stats: any, channels: MetaChannel[] }) {
  return (
    <motion.div 
      key="overview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Sent" value={stats.sent.toLocaleString()} icon={<Send className="text-blue-500" />} trend="+12%" isDark={isDark} />
        <StatCard label="Delivered" value={stats.delivered} icon={<CheckCircle2 className="text-green-500" />} trend="+0.5%" isDark={isDark} />
        <StatCard label="Read Rate" value={stats.read} icon={<BarChart3 className="text-purple-500" />} trend="+4.2%" isDark={isDark} />
        <StatCard label="Replied" value={stats.replied} icon={<MessageSquare className="text-orange-500" />} trend="+1.1%" isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {broadcasts.slice(0, 3).map((b, idx) => (
              <div key={b.id || `broadcast-${idx}`} className={cn("p-4 rounded-2xl flex items-center justify-between", isDark ? "bg-gray-800/50" : "bg-gray-50")}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><MessageSquare className="text-green-500" size={20} /></div>
                  <div>
                    <h4 className="font-bold text-sm">{b.name}</h4>
                    <p className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{b.sentCount} Sent</p>
                  <p className="text-xs text-green-500">{Math.round((b.readCount/b.sentCount)*100)}% Read</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <h3 className="text-xl font-bold mb-6">WABA Health</h3>
          <div className="space-y-6">
            <HealthItem label="Quality Rating" value="High" status="success" isDark={isDark} />
            <HealthItem label="Display Name" value="vCue Connect" status="success" isDark={isDark} />
            <HealthItem label="Messaging Limit" value="100K / day" status="info" isDark={isDark} />
            <HealthItem label="Account Status" value="Approved" status="success" isDark={isDark} />
          </div>
        </div>
      </div>

      <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Connected Channels</h3>
          <div className={cn("px-3 py-1 rounded-full text-xs font-bold", isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500")}>
            {channels.length} Active
          </div>
        </div>
        
        {channels.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No channels connected yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel, idx) => (
              <div key={channel.id || `channel-${idx}`} className={cn("p-4 rounded-2xl border flex items-center gap-4 transition-all hover:border-green-500", isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200")}>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="text-green-500" size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{channel.name}</h4>
                  <p className="text-xs text-gray-400 truncate">{channel.channel}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InboxSection({ isDark, contacts }: { isDark: boolean, contacts: any[] }) {
  const [selectedChatIdx, setSelectedChatIdx] = useState<number | null>(contacts.length > 0 ? 0 : null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [contactNotes, setContactNotes] = useState("");
  const [contactTags, setContactTags] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  
  const selectedContact = selectedChatIdx !== null ? contacts[selectedChatIdx] : null;

  useEffect(() => {
    if (selectedContact) {
      setContactNotes(selectedContact.notes || "");
      setContactTags(selectedContact.tags?.join(", ") || "");
    }
  }, [selectedContact]);

  const handleSaveContactInfo = async () => {
    if (!selectedContact) return;
    setSavingInfo(true);
    const number = selectedContact.whatsappNumber || selectedContact.phone;
    
    const customParams = [
      { name: 'notes', value: contactNotes },
      { name: 'tags', value: contactTags }
    ];
    
    const success = await metaWabaService.updateContactAttributes(number, customParams);
    if (success) {
      alert("Contact info saved successfully!");
      selectedContact.notes = contactNotes;
      selectedContact.tags = contactTags.split(',').map((t: string) => t.trim()).filter(Boolean);
    } else {
      alert("Failed to save contact info.");
    }
    setSavingInfo(false);
  };

  const fetchMessages = async () => {
    if (selectedContact) {
      setLoadingMessages(true);
      const number = selectedContact.whatsappNumber || selectedContact.phone;
      const msgs = await metaWabaService.getMessages(number);
      setChatMessages(msgs);
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedContact]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || sending) return;

    setSending(true);
    const number = selectedContact.whatsappNumber || selectedContact.phone;
    const success = await metaWabaService.sendTextMessage(number, newMessage);
    
    if (success) {
      setNewMessage("");
      // Refresh messages
      await fetchMessages();
    } else {
      alert("Failed to send message. Please check if the session is active.");
    }
    setSending(false);
  };

  return (
    <motion.div 
      key="inbox"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "h-[calc(100vh-12rem)] rounded-3xl border overflow-hidden flex",
        isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm"
      )}
    >
      {/* Chat List */}
      <div className={cn("w-80 border-r flex flex-col", isDark ? "border-gray-800" : "border-gray-200")}>
        <div className="p-4 border-b border-gray-800/50">
          <div className={cn("flex items-center gap-2 p-2 rounded-xl", isDark ? "bg-gray-800" : "bg-gray-100")}>
            <Search size={18} className="text-gray-500" />
            <input type="text" placeholder="Search chats..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">No contacts found</div>
          )}
          {contacts.map((contact: any, idx: number) => (
            <button 
              key={contact.id || idx}
              onClick={() => setSelectedChatIdx(idx)}
              className={cn(
                "w-full p-4 flex gap-3 transition-all text-left",
                selectedChatIdx === idx 
                  ? (isDark ? "bg-gray-800" : "bg-gray-100") 
                  : (isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50")
              )}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold text-lg">
                  {(contact.fullName || contact.name || '?')[0]}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111827] rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold truncate">{contact.fullName || contact.name || 'Unknown'}</h4>
                  <span className="text-[10px] text-gray-500 uppercase">
                    {contact.lastMessageTime ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-1">{contact.lastMessage || contact.whatsappNumber}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-900/20">
        {selectedContact ? (
          <>
            <div className={cn("p-4 border-b flex justify-between items-center", isDark ? "border-gray-800" : "border-gray-200")}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                  {(selectedContact.fullName || selectedContact.name || '?')[0]}
                </div>
                <div>
                  <h4 className="font-bold">{selectedContact.fullName || selectedContact.name}</h4>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <button className="hover:text-white"><Search size={20} /></button>
                <button className="hover:text-white"><MoreHorizontal size={20} /></button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  No messages found for this contact
                </div>
              ) : (
                chatMessages.sort((a: any, b: any) => new Date(a.created || a.createdOn || a.timestamp).getTime() - new Date(b.created || b.createdOn || b.timestamp).getTime()).map((msg: any, mIdx: number) => {
                  const isSentByUs = msg.owner === true || msg.type === 'sent' || msg.type === 'outbound' || msg.direction === 'outbound';
                  return (
                    <div key={mIdx} className={cn("flex", isSentByUs ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[70%] p-4 rounded-2xl",
                        isSentByUs 
                          ? "rounded-tr-none bg-green-600 text-white" 
                          : (isDark ? "rounded-tl-none bg-gray-800" : "rounded-tl-none bg-gray-100")
                      )}>
                        <p className="text-sm">{msg.text || msg.body || msg.message || 'Media/Unsupported Message'}</p>
                        <span className={cn("text-[10px] mt-2 block", isSentByUs ? "text-green-200" : "text-gray-500")}>
                          {new Date(msg.created || msg.createdOn || msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className={cn("p-4 border-t", isDark ? "border-gray-800" : "border-gray-200")}>
              <div className={cn("flex items-center gap-3 p-2 rounded-2xl", isDark ? "bg-gray-800" : "bg-gray-100")}>
                <button className="p-2 text-gray-400 hover:text-white"><Smile size={20} /></button>
                <button className="p-2 text-gray-400 hover:text-white"><Paperclip size={20} /></button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm" 
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className={cn(
                    "p-3 rounded-xl text-white shadow-lg transition-all",
                    sending || !newMessage.trim() ? "bg-gray-600 cursor-not-allowed" : "bg-green-500 shadow-green-500/20 hover:scale-105"
                  )}
                >
                  {sending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-center justify-center items-center text-gray-500 flex-col gap-4">
            <Inbox size={64} className="opacity-20" />
            <p className="font-medium">Select a contact to start messaging</p>
          </div>
        )}
      </div>

      {/* Contact Info */}
      {selectedContact && (
        <div className={cn("w-80 border-l flex flex-col", isDark ? "border-gray-800" : "border-gray-200")}>
          <div className={cn("p-6 border-b flex flex-col items-center", isDark ? "border-gray-800/50" : "border-gray-200")}>
            <div className="w-20 h-20 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-2xl mb-4">
              {(selectedContact.fullName || selectedContact.name || '?')[0]}
            </div>
            <h3 className="font-bold text-lg">{selectedContact.fullName || selectedContact.name}</h3>
            <p className="text-sm text-gray-500">{selectedContact.whatsappNumber || selectedContact.phone}</p>
          </div>
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <Tag size={14} /> Tags (comma separated)
              </label>
              <input 
                type="text" 
                value={contactTags}
                onChange={(e) => setContactTags(e.target.value)}
                placeholder="vip, lead, support" 
                className={cn("w-full p-3 rounded-xl outline-none border focus:border-green-500 transition-all text-sm", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <StickyNote size={14} /> Notes
              </label>
              <textarea 
                value={contactNotes}
                onChange={(e) => setContactNotes(e.target.value)}
                placeholder="Add notes about this contact..." 
                rows={4}
                className={cn("w-full p-3 rounded-xl outline-none border focus:border-green-500 transition-all text-sm resize-none", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")} 
              />
            </div>
            <button 
              onClick={handleSaveContactInfo}
              disabled={savingInfo}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              {savingInfo ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
              Save Info
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function BroadcastSection({ isDark, templates, broadcasts, onRefresh }: { isDark: boolean, templates: any[], broadcasts: any[], onRefresh: () => void }) {
  const [tab, setTab] = useState<'new' | 'history' | 'templates'>('new');
  const [broadcastType, setBroadcastType] = useState<'bulk' | 'single'>('bulk');
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  return (
    <motion.div 
      key="broadcast"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl space-y-8"
    >
      {showTemplateModal && (
        <TemplateCreation 
          isDark={isDark} 
          onClose={() => setShowTemplateModal(false)} 
          onSuccess={() => {
            setShowTemplateModal(false);
            onRefresh();
          }}
        />
      )}
      <div className="flex gap-4 p-1 bg-gray-800/50 rounded-2xl w-fit">
        <button 
          onClick={() => setTab('new')}
          className={cn("px-6 py-2 rounded-xl font-bold text-sm transition-all", tab === 'new' ? "bg-green-500 text-white" : "text-gray-400 hover:text-white")}
        >
          New Broadcast
        </button>
        <button 
          onClick={() => setTab('history')}
          className={cn("px-6 py-2 rounded-xl font-bold text-sm transition-all", tab === 'history' ? "bg-green-500 text-white" : "text-gray-400 hover:text-white")}
        >
          Past Campaigns
        </button>
        <button 
          onClick={() => setTab('templates')}
          className={cn("px-6 py-2 rounded-xl font-bold text-sm transition-all", tab === 'templates' ? "bg-green-500 text-white" : "text-gray-400 hover:text-white")}
        >
          Templates
        </button>
      </div>

      {tab === 'new' && (
        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setBroadcastType('bulk')}
              className={cn("px-4 py-2 rounded-xl font-bold text-sm transition-all border", broadcastType === 'bulk' ? (isDark ? "bg-gray-800 border-green-500 text-green-400" : "bg-green-50 border-green-500 text-green-600") : (isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"))}
            >
              Bulk Broadcast
            </button>
            <button 
              onClick={() => setBroadcastType('single')}
              className={cn("px-4 py-2 rounded-xl font-bold text-sm transition-all border", broadcastType === 'single' ? (isDark ? "bg-gray-800 border-green-500 text-green-400" : "bg-green-50 border-green-500 text-green-600") : (isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"))}
            >
              Single Contact
            </button>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Broadcast Name</label>
                <input type="text" placeholder="e.g. March Promotion" className={cn("w-full p-4 rounded-2xl outline-none border focus:border-green-500 transition-all", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Select Template</label>
                <select className={cn("w-full p-4 rounded-2xl outline-none border focus:border-green-500 transition-all", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}>
                  <option value="">Choose a Meta template</option>
                  {templates.filter(t => t.status === 'APPROVED').map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
            </div>

            {broadcastType === 'bulk' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Recipient List</label>
                <div className={cn("border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer hover:border-green-500", isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200")}>
                  <FileUp className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="font-bold text-lg">Upload CSV or Select Group</p>
                  <p className="text-sm text-gray-400 mt-2">Max 10,000 contacts per broadcast</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                <input type="text" placeholder="+91 98765 43210" className={cn("w-full p-4 rounded-2xl outline-none border focus:border-green-500 transition-all", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")} />
              </div>
            )}

            <div className="pt-6">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                <Send size={20} />
                Launch Broadcast
              </button>
            </div>
          </form>
        </div>
      )}

      {tab === 'history' && (
        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <h3 className="text-xl font-bold mb-6">Past Campaigns</h3>
          {broadcasts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No past campaigns found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={cn("border-b", isDark ? "border-gray-800" : "border-gray-200")}>
                    <th className="py-4 px-4 font-bold text-sm text-gray-400 uppercase">Campaign Name</th>
                    <th className="py-4 px-4 font-bold text-sm text-gray-400 uppercase">Template</th>
                    <th className="py-4 px-4 font-bold text-sm text-gray-400 uppercase">Status</th>
                    <th className="py-4 px-4 font-bold text-sm text-gray-400 uppercase">Sent</th>
                    <th className="py-4 px-4 font-bold text-sm text-gray-400 uppercase">Delivered</th>
                    <th className="py-4 px-4 font-bold text-sm text-gray-400 uppercase">Read</th>
                    <th className="py-4 px-4 font-bold text-sm text-gray-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {broadcasts.map((b, idx) => (
                    <tr key={b.id || `bc-${idx}`} className={cn("border-b last:border-0 transition-colors", isDark ? "border-gray-800 hover:bg-gray-800/30" : "border-gray-100 hover:bg-gray-50")}>
                      <td className="py-4 px-4 font-medium">{b.name}</td>
                      <td className="py-4 px-4 text-sm">{b.templateName}</td>
                      <td className="py-4 px-4">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold", 
                          b.status?.toLowerCase() === 'completed' ? "bg-green-500/10 text-green-500" : 
                          b.status?.toLowerCase() === 'processing' ? "bg-blue-500/10 text-blue-500" : 
                          "bg-gray-500/10 text-gray-500"
                        )}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm">{b.sentCount}</td>
                      <td className="py-4 px-4 text-sm">{b.deliveredCount}</td>
                      <td className="py-4 px-4 text-sm">{b.readCount}</td>
                      <td className="py-4 px-4 text-sm text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'templates' && (
        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Message Templates</h3>
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              Create New Template
            </button>
          </div>
          
          {templates.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No templates found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((t, idx) => (
                <div key={t.id || `tpl-${idx}`} className={cn("p-6 rounded-2xl border flex flex-col", isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200")}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg truncate pr-2">{t.name}</h4>
                    <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0", 
                      t.status === 'APPROVED' ? "bg-green-500/10 text-green-500" : 
                      t.status === 'REJECTED' ? "bg-red-500/10 text-red-500" : 
                      "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {t.status}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">{t.category} • {t.language}</p>
                    <div className={cn("p-3 rounded-xl text-sm mt-4", isDark ? "bg-gray-800" : "bg-white border")}>
                      {/* Preview body text if available, else placeholder */}
                      {t.components?.find((c: any) => c.type === 'BODY')?.text || "Template content preview not available."}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function ContactsSection({ isDark, contacts }: { isDark: boolean, contacts: any[] }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [customParams, setCustomParams] = useState<{name: string, value: string}[]>([]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          console.log('Parsed CSV:', results.data);
          // Logic to add to contacts
        },
        header: true
      });
    }
  };

  const handleAddContact = async () => {
    if (!newContactName || !newContactPhone) return;
    setIsAdding(true);
    try {
      const success = await metaWabaService.addContact(newContactPhone, newContactName, customParams);
      if (success) {
        alert('Contact added successfully! Please refresh the page to see the new contact.');
        setShowAddModal(false);
        setNewContactName('');
        setNewContactPhone('');
        setCustomParams([]);
      } else {
        alert('Failed to add contact. Please check the console for details.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the contact.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditContact = async () => {
    if (!selectedContact || !newContactPhone) return;
    setIsAdding(true);
    try {
      // Meta API doesn't have a direct update contact name endpoint, but we can update attributes
      // Or we can try to re-add the contact with the new name to update it.
      const success = await metaWabaService.updateContactAttributes(newContactPhone, customParams);
      if (success) {
        alert('Contact attributes updated successfully! Please refresh the page to see changes.');
        setShowEditModal(false);
        setSelectedContact(null);
      } else {
        alert('Failed to update contact attributes.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the contact.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteContact = async (phone: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    setIsDeleting(phone);
    try {
      const success = await metaWabaService.deleteContact(phone);
      if (success) {
        alert('Contact deleted successfully! Please refresh the page.');
      } else {
        alert('Failed to delete contact. The API might not support direct deletion.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the contact.');
    } finally {
      setIsDeleting(null);
    }
  };

  const openEditModal = (contact: any) => {
    setSelectedContact(contact);
    setNewContactName(contact.fullName || contact.name || '');
    setNewContactPhone(contact.whatsappNumber || contact.phone || '');
    
    // Extract custom parameters if available
    const params = [];
    if (contact.customParams) {
      for (const [key, value] of Object.entries(contact.customParams)) {
        params.push({ name: key, value: String(value) });
      }
    }
    setCustomParams(params);
    setShowEditModal(true);
  };

  const addCustomParam = () => {
    setCustomParams([...customParams, { name: '', value: '' }]);
  };

  const updateCustomParam = (index: number, field: 'name' | 'value', val: string) => {
    const newParams = [...customParams];
    newParams[index][field] = val;
    setCustomParams(newParams);
  };

  const removeCustomParam = (index: number) => {
    setCustomParams(customParams.filter((_, i) => i !== index));
  };

  const formatPhoneWithCountryCode = (phone: string) => {
    if (!phone) return '-';
    // Basic heuristic for common country codes if libphonenumber-js is not used
    // Assuming mostly Indian (+91) or US (+1) for this example, or just display raw if unknown
    // Let's try to extract if it starts with 91 or 1
    let countryCode = '';
    let rest = phone;
    
    if (phone.startsWith('+')) {
      phone = phone.substring(1);
    }

    if (phone.startsWith('91') && phone.length === 12) {
      countryCode = '91';
      rest = phone.substring(2);
    } else if (phone.startsWith('1') && phone.length === 11) {
      countryCode = '1';
      rest = phone.substring(1);
    } else if (phone.startsWith('44') && phone.length === 12) {
      countryCode = '44';
      rest = phone.substring(2);
    } else if (phone.startsWith('971') && phone.length === 12) {
      countryCode = '971';
      rest = phone.substring(3);
    } else {
      // Fallback: just show the first 2 digits as a guess if it's long enough
      if (phone.length > 10) {
        const diff = phone.length - 10;
        countryCode = phone.substring(0, diff);
        rest = phone.substring(diff);
      }
    }

    if (countryCode) {
      return <span className="font-mono"><span className="text-gray-500">(+{countryCode})</span> {rest}</span>;
    }
    return <span className="font-mono">{phone}</span>;
  };

  return (
    <motion.div 
      key="contacts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 relative"
    >
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={cn("w-full max-w-md p-6 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto", isDark ? "bg-[#111827] border border-gray-800" : "bg-white")}>
            <h3 className="text-xl font-bold mb-4">{showEditModal ? 'Edit Contact' : 'Add New Contact'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">Name</label>
                <input 
                  type="text" 
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  disabled={showEditModal} // Name might not be editable via API easily
                  className={cn("w-full p-3 rounded-xl border outline-none", isDark ? "bg-gray-800/50 border-gray-700 focus:border-green-500" : "bg-gray-50 border-gray-200 focus:border-green-500", showEditModal && "opacity-50 cursor-not-allowed")}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">WhatsApp Number</label>
                <input 
                  type="text" 
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  disabled={showEditModal} // Phone number is the identifier, shouldn't change
                  className={cn("w-full p-3 rounded-xl border outline-none", isDark ? "bg-gray-800/50 border-gray-700 focus:border-green-500" : "bg-gray-50 border-gray-200 focus:border-green-500", showEditModal && "opacity-50 cursor-not-allowed")}
                  placeholder="e.g. 1234567890"
                />
                <p className="text-xs text-gray-500 mt-1">Include country code without + (e.g. 15559172686)</p>
              </div>
              
              <div className="pt-4 border-t border-gray-800/50">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-400">Custom Attributes</label>
                  <button onClick={addCustomParam} className="text-xs text-blue-500 hover:text-blue-400 font-bold flex items-center gap-1">
                    <Plus size={12} /> Add Attribute
                  </button>
                </div>
                
                {customParams.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No custom attributes added.</p>
                ) : (
                  <div className="space-y-2">
                    {customParams.map((param, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={param.name}
                          onChange={(e) => updateCustomParam(idx, 'name', e.target.value)}
                          className={cn("w-1/3 p-2 text-sm rounded-lg border outline-none", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                          placeholder="Name"
                        />
                        <input 
                          type="text" 
                          value={param.value}
                          onChange={(e) => updateCustomParam(idx, 'value', e.target.value)}
                          className={cn("flex-1 p-2 text-sm rounded-lg border outline-none", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                          placeholder="Value"
                        />
                        <button onClick={() => removeCustomParam(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setCustomParams([]);
                  }}
                  className={cn("px-4 py-2 rounded-xl font-medium", isDark ? "hover:bg-gray-800" : "hover:bg-gray-100")}
                >
                  Cancel
                </button>
                <button 
                  onClick={showEditModal ? handleEditContact : handleAddContact}
                  disabled={isAdding || !newContactName || !newContactPhone}
                  className="px-4 py-2 rounded-xl bg-green-500 text-white font-bold disabled:opacity-50"
                >
                  {isAdding ? 'Saving...' : 'Save Contact'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className={cn("flex items-center gap-3 p-3 rounded-2xl w-96 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <Search size={20} className="text-gray-500" />
          <input type="text" placeholder="Search contacts..." className="bg-transparent border-none outline-none text-sm w-full" />
        </div>
        <div className="flex gap-4">
          <label className={cn("px-6 py-3 rounded-2xl font-bold text-sm cursor-pointer flex items-center gap-2 transition-all", isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200")}>
            <FileUp size={18} />
            Import CSV
            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
          </label>
          <button 
            onClick={() => {
              setNewContactName('');
              setNewContactPhone('');
              setCustomParams([]);
              setShowAddModal(true);
            }}
            className="px-6 py-3 rounded-2xl bg-green-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </div>
      </div>

      <div className={cn("rounded-3xl border overflow-hidden", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
        <table className="w-full text-left">
          <thead>
            <tr className={cn("text-xs font-bold uppercase tracking-wider", isDark ? "bg-gray-800/50 text-gray-500" : "bg-gray-50 text-gray-400")}>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Attributes</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {contacts.map((contact, idx) => {
              const phone = contact.whatsappNumber || contact.phone;
              return (
                <tr key={contact.id || idx} className={isDark ? "hover:bg-gray-800/30" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4 font-bold">{contact.fullName || contact.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatPhoneWithCountryCode(phone)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {contact.customParams && Object.entries(contact.customParams).map(([key, val]) => (
                        <span key={key} className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-bold">
                          {key}: {String(val)}
                        </span>
                      ))}
                      {(!contact.customParams || Object.keys(contact.customParams).length === 0) && (
                        <span className="text-xs text-gray-500 italic">None</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(contact)}
                        className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        title="Edit Contact"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteContact(phone)}
                        disabled={isDeleting === phone}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                        title="Delete Contact"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function AnalyticsSection({ isDark, broadcasts }: { isDark: boolean, broadcasts: any[] }) {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
  
  const pieData = useMemo(() => {
    const delivered = broadcasts.reduce((acc, b) => acc + (b.deliveredCount || 0), 0);
    const read = broadcasts.reduce((acc, b) => acc + (b.readCount || 0), 0);
    const failed = broadcasts.reduce((acc, b) => acc + (Math.max(0, (b.sentCount || 0) - (b.deliveredCount || 0))), 0);
    
    return [
      { name: 'Delivered', value: delivered },
      { name: 'Read', value: read },
      { name: 'Failed', value: failed }
    ];
  }, [broadcasts]);

  const barData = useMemo(() => {
    return broadcasts.slice(0, 5).map(b => ({
      name: b.name.substring(0, 10),
      sent: b.sentCount,
      delivered: b.deliveredCount,
      read: b.readCount
    }));
  }, [broadcasts]);

  return (
    <motion.div 
      key="analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Sent" value={broadcasts.reduce((a, b) => a + (b.sentCount || 0), 0).toLocaleString()} icon={<Send className="text-blue-500" />} isDark={isDark} />
        <StatCard label="Avg Delivery" value="98.2%" icon={<CheckCircle2 className="text-green-500" />} isDark={isDark} />
        <StatCard label="Avg Read Rate" value="64.5%" icon={<BarChart3 className="text-purple-500" />} isDark={isDark} />
        <StatCard label="System Health" value="Optimal" icon={<ShieldCheck className="text-emerald-500" />} isDark={isDark} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <h3 className="text-xl font-bold mb-8">Broadcast Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Bar dataKey="sent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="read" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <h3 className="text-xl font-bold mb-8">Delivery Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-xs text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ExplorerSection({ isDark, contacts, broadcasts, templates, accountInfo }: { isDark: boolean, contacts: any[], broadcasts: any[], templates: any[], accountInfo: any }) {
  return (
    <motion.div 
      key="explorer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Developer Tools</h3>
          <p className="text-gray-400">Raw system data for transparency and debugging</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("px-4 py-2 rounded-xl border font-mono text-xs", isDark ? "bg-gray-800 border-gray-700 text-green-400" : "bg-gray-100 border-gray-200 text-green-700")}>
            API STATUS: {accountInfo?.apiStatus || 'HEALTHY'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DataCard title="Contacts Raw Data" data={contacts} isDark={isDark} />
        <DataCard title="Broadcast Reports" data={broadcasts} isDark={isDark} />
        <DataCard title="Message Templates" data={templates} isDark={isDark} />
        <DataCard title="Account Metadata" data={accountInfo} isDark={isDark} />
      </div>
    </motion.div>
  );
}

function DataCard({ title, data, isDark }: { title: string, data: any, isDark: boolean }) {
  return (
    <div className={cn("rounded-3xl border overflow-hidden flex flex-col h-[400px]", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
      <div className="p-4 border-b border-gray-800/50 flex justify-between items-center bg-gray-800/20">
        <h4 className="font-bold text-sm">{title}</h4>
        <span className="text-[10px] font-mono text-gray-500">{Array.isArray(data) ? data.length : 1} items</span>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-[10px] text-gray-400 bg-black/20">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}

function AutomationsSection({ isDark }: { isDark: boolean }) {
  const automations = [
    { id: 1, name: 'Welcome Message', trigger: 'Keyword: Hello', status: 'Active' },
    { id: 2, name: 'Out of Office', trigger: 'Time: 6PM - 9AM', status: 'Active' },
    { id: 3, name: 'Lead Qualification', trigger: 'New Contact', status: 'Inactive' },
  ];

  return (
    <motion.div 
      key="automations"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <p className="text-gray-400">Build chat flows or keyword-based triggers</p>
        <button className="px-6 py-3 rounded-2xl bg-green-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all">
          <Plus size={18} />
          Create Automation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {automations.map(auto => (
          <div key={auto.id} className={cn("p-6 rounded-3xl border space-y-4", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Zap size={24} /></div>
              <span className={cn("px-2 py-1 rounded-lg text-[10px] font-bold uppercase", auto.status === 'Active' ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500")}>
                {auto.status}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-lg">{auto.name}</h4>
              <p className="text-sm text-gray-400 mt-1">{auto.trigger}</p>
            </div>
            <div className="pt-4 flex gap-2">
              <button className="flex-1 py-2 rounded-xl bg-gray-800 text-xs font-bold hover:bg-gray-700 transition-all">Edit Flow</button>
              <button className="p-2 rounded-xl bg-gray-800 text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function IntegrationsSection({ isDark }: { isDark: boolean }) {
  const integrations = [
    { name: 'Shopify', desc: 'Sync orders and send updates', icon: '🛍️' },
    { name: 'Google Sheets', desc: 'Export contacts automatically', icon: '📊' },
    { name: 'Zapier', desc: 'Connect with 5000+ apps', icon: '⚡' },
    { name: 'HubSpot', desc: 'CRM data synchronization', icon: '🎯' },
  ];

  return (
    <motion.div 
      key="integrations"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {integrations.map(app => (
        <div key={app.name} className={cn("p-6 rounded-3xl border space-y-4 hover:border-blue-500 transition-all cursor-pointer group", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className="text-4xl mb-4">{app.icon}</div>
          <h4 className="font-bold text-lg group-hover:text-blue-500 transition-colors">{app.name}</h4>
          <p className="text-sm text-gray-400">{app.desc}</p>
          <button className="w-full py-3 rounded-2xl bg-gray-800 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">Connect</button>
        </div>
      ))}
    </motion.div>
  );
}

function ProfileSection({ isDark }: { isDark: boolean }) {
  const [businessAccounts, setBusinessAccounts] = useState<any[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [phoneDetail, setPhoneDetail] = useState<any>(null);
  const [profileAbout, setProfileAbout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    address: '',
    description: '',
    email: '',
    vertical: '',
    websites: '',
    about: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use environment variables instead of hardcoded values
  const getEnv = (key: string) => {
    if (typeof window !== 'undefined' && (window as any).__ENV__ && (window as any).__ENV__[key]) {
      return (window as any).__ENV__[key];
    }
    return import.meta.env[key] || '';
  };

  const TARGET_WABA_ID = getEnv('VITE_META_WABA_ID');
  const TARGET_PHONE = getEnv('VITE_META_PHONE_NUMBER_ID');

  useEffect(() => {
    async function loadProfileData() {
      setLoading(true);
      try {
        const [accounts, phones, detail, about] = await Promise.all([
          metaWabaService.getBusinessAccounts(),
          metaWabaService.getPhoneNumbers(),
          metaWabaService.getPhoneNumberDetail(TARGET_WABA_ID, TARGET_PHONE),
          metaWabaService.getBusinessProfileAbout(TARGET_WABA_ID, TARGET_PHONE)
        ]);
        setBusinessAccounts(accounts);
        setPhoneNumbers(phones);
        setPhoneDetail(detail);
        setProfileAbout(about);
        
        if (detail) {
          setEditForm({
            address: detail.address || '',
            description: detail.description || '',
            email: detail.email || '',
            vertical: detail.vertical || '',
            websites: detail.websites ? detail.websites.join(', ') : '',
            about: about?.text || ''
          });
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsSaving(true);
      await metaWabaService.updateBusinessProfilePhoto(TARGET_WABA_ID, TARGET_PHONE, file);
      // Refresh profile data to get the new photo URL if returned, or just show success
      const detail = await metaWabaService.getPhoneNumberDetail(TARGET_WABA_ID, TARGET_PHONE);
      setPhoneDetail(detail);
      alert('Profile photo updated successfully!');
    } catch (error) {
      console.error('Failed to update photo', error);
      alert('Failed to update profile photo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      const profileData = {
        address: editForm.address,
        description: editForm.description,
        email: editForm.email,
        vertical: editForm.vertical,
        websites: editForm.websites.split(',').map(s => s.trim()).filter(Boolean)
      };

      await Promise.all([
        metaWabaService.updateBusinessProfile(TARGET_WABA_ID, TARGET_PHONE, profileData),
        metaWabaService.updateBusinessProfileAbout(TARGET_WABA_ID, TARGET_PHONE, editForm.about)
      ]);

      const [detail, about] = await Promise.all([
        metaWabaService.getPhoneNumberDetail(TARGET_WABA_ID, TARGET_PHONE),
        metaWabaService.getBusinessProfileAbout(TARGET_WABA_ID, TARGET_PHONE)
      ]);
      
      setPhoneDetail(detail);
      setProfileAbout(about);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const primaryAccount = businessAccounts.find(a => a.id === TARGET_WABA_ID) || businessAccounts[0];
  const primaryPhone = phoneDetail || phoneNumbers.find(p => p.displayPhoneNumber?.includes(TARGET_PHONE)) || phoneNumbers[0];

  return (
    <motion.div 
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl space-y-8"
    >
      <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
        <div className="flex items-center gap-8 mb-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-700 overflow-hidden flex items-center justify-center">
              {phoneDetail?.profilePictureUrl ? (
                <img src={phoneDetail.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src="https://picsum.photos/seed/vcue/200/200" alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png" 
              onChange={handlePhotoUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              className="absolute bottom-0 right-0 p-3 bg-blue-600 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
            >
              <Edit3 size={18} />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{primaryAccount?.name || primaryAccount?.businessName || "WhatsApp Business Account"}</h3>
                <p className="text-gray-400">{primaryPhone?.displayPhoneNumber || "+1 555-917-2686"}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {primaryAccount?.businessVerificationStatus === 'verified' && (
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">Business Verified</span>
                  )}
                  {primaryAccount?.accountReviewStatus === 'APPROVED' && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase">Account Approved</span>
                  )}
                  {primaryPhone?.qualityRating && (
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase", 
                      primaryPhone.qualityRating === 'GREEN' ? "bg-green-500/10 text-green-500" :
                      primaryPhone.qualityRating === 'YELLOW' ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    )}>
                      Quality: {primaryPhone.qualityRating}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  isEditing ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-bold mb-4 border-b pb-2 border-gray-800">Business Account Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Business Name</label>
                <div className={cn("w-full p-4 rounded-2xl border", isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200")}>
                  {primaryAccount?.businessName || 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">WABA ID</label>
                <div className={cn("w-full p-4 rounded-2xl border", isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200")}>
                  {primaryAccount?.id || TARGET_WABA_ID}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Currency / Country</label>
                <div className={cn("w-full p-4 rounded-2xl border", isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200")}>
                  {primaryAccount?.currency || 'N/A'} / {primaryAccount?.country || 'N/A'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Messaging Limit</label>
                <div className={cn("w-full p-4 rounded-2xl border", isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200")}>
                  {primaryAccount?.whatsappBusinessManagerMessagingLimit || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b pb-2 border-gray-800">Public Profile Details</h4>
            {isEditing ? (
              <div className={cn("p-6 rounded-2xl border space-y-6", isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <textarea 
                      value={editForm.description}
                      onChange={e => setEditForm({...editForm, description: e.target.value})}
                      className={cn("w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                      rows={3}
                      placeholder="Business description..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
                    <textarea 
                      value={editForm.address}
                      onChange={e => setEditForm({...editForm, address: e.target.value})}
                      className={cn("w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                      rows={3}
                      placeholder="Business address..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                    <input 
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm({...editForm, email: e.target.value})}
                      className={cn("w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Vertical (Industry)</label>
                    <input 
                      type="text"
                      value={editForm.vertical}
                      onChange={e => setEditForm({...editForm, vertical: e.target.value})}
                      className={cn("w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                      placeholder="e.g., Retail, Education"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Websites (Comma separated)</label>
                    <input 
                      type="text"
                      value={editForm.websites}
                      onChange={e => setEditForm({...editForm, websites: e.target.value})}
                      className={cn("w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                      placeholder="https://example.com, https://shop.example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">About (Status)</label>
                    <input 
                      type="text"
                      value={editForm.about}
                      onChange={e => setEditForm({...editForm, about: e.target.value})}
                      className={cn("w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                      placeholder="Available"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className={cn("p-6 rounded-2xl border", isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200")}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <div className="font-medium whitespace-pre-wrap">{phoneDetail?.description || 'No description provided.'}</div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
                    <div className="font-medium whitespace-pre-wrap">{phoneDetail?.address || 'No address provided.'}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                    <div className="font-medium">{phoneDetail?.email || 'N/A'}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Vertical</label>
                    <div className="font-medium">{phoneDetail?.vertical || 'N/A'}</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Websites</label>
                    <div className="font-medium">
                      {phoneDetail?.websites?.length ? (
                        <ul className="list-disc list-inside">
                          {phoneDetail.websites.map((w: string, i: number) => (
                            <li key={i}><a href={w} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{w}</a></li>
                          ))}
                        </ul>
                      ) : 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">About (Status)</label>
                    <div className="font-medium">{profileAbout?.text || 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 border-b pb-2 border-gray-800">Phone Number Details</h4>
            <div className="space-y-6">
              {/* Show the specifically requested phone detail first if available */}
              {phoneDetail && (
                <div className={cn("p-6 rounded-2xl border border-blue-500/30 relative overflow-hidden", isDark ? "bg-blue-900/10" : "bg-blue-50")}>
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Primary Number
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Display Phone Number</label>
                      <div className="font-medium">{phoneDetail.displayPhoneNumber || '+1 555-917-2686'}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Phone ID</label>
                      <div className="font-medium">{phoneDetail.phoneId || '984613174743851'}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Verified Name</label>
                      <div className="font-medium">{phoneDetail.verifiedName || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                      <div className="font-medium">{phoneDetail.status || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Messaging Limit Tier</label>
                      <div className="font-medium">{phoneDetail.messagingLimitTier || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Search Visibility</label>
                      <div className="font-medium">{phoneDetail.searchVisibility || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Show other phone numbers if any exist */}
              {phoneNumbers.filter(p => p.phoneId !== phoneDetail?.phoneId && p.phoneId !== '984613174743851').map((phone, idx) => (
                <div key={idx} className={cn("p-6 rounded-2xl border", isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200")}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Display Phone Number</label>
                      <div className="font-medium">{phone.displayPhoneNumber || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Phone ID</label>
                      <div className="font-medium">{phone.phoneId || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Verified Name</label>
                      <div className="font-medium">{phone.verifiedName || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                      <div className="font-medium">{phone.status || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsSection({ isDark }: { isDark: boolean }) {
  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-blue-500" />
            <h3 className="text-xl font-bold">WABA Account</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-800/50">
              <span className="text-sm text-gray-400">Connection Status</span>
              <span className="text-sm font-bold text-green-500">Active</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-800/50">
              <span className="text-sm text-gray-400">Quality Rating</span>
              <span className="text-sm font-bold text-green-500">High</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-800/50">
              <span className="text-sm text-gray-400">Account ID</span>
              <span className="text-sm font-mono text-gray-300">WABA-928374</span>
            </div>
          </div>
        </div>

        <div className={cn("rounded-3xl p-8 border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-purple-500" />
            <h3 className="text-xl font-bold">User Management</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">SM</div>
                <div>
                  <p className="text-sm font-bold">Shivam Madaan</p>
                  <p className="text-[10px] text-gray-500">Admin</p>
                </div>
              </div>
              <button className="text-xs text-blue-500 font-bold">Manage</button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">AM</div>
                <div>
                  <p className="text-sm font-bold">Ankur Mishra</p>
                  <p className="text-[10px] text-gray-500">Agent</p>
                </div>
              </div>
              <button className="text-xs text-blue-500 font-bold">Manage</button>
            </div>
            <button className="w-full py-3 mt-4 rounded-xl border border-dashed border-gray-700 text-xs font-bold text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all">
              + Add New User
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PhoneNumbersSection({ isDark, phoneNumbers, businessAccounts }: { isDark: boolean, phoneNumbers: any[], businessAccounts: any[] }) {
  return (
    <motion.div 
      key="phone-numbers"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">WhatsApp Phone Numbers</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {phoneNumbers.map((pn, idx) => {
          const waba = businessAccounts.find(ba => ba.id === pn.wabaId);
          return (
            <div key={pn.phoneId || idx} className={cn("p-6 rounded-3xl border", isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm")}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
                    <Phone className="text-green-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{pn.displayPhoneNumber}</h3>
                    <p className="text-sm text-gray-500">Phone ID: {pn.phoneId}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", 
                    pn.status === 'CONNECTED' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {pn.status || 'UNKNOWN'}
                  </span>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", 
                    pn.qualityRating === 'GREEN' ? "bg-green-500/10 text-green-500" : 
                    pn.qualityRating === 'YELLOW' ? "bg-yellow-500/10 text-yellow-500" : 
                    pn.qualityRating === 'RED' ? "bg-red-500/10 text-red-500" : "bg-gray-500/10 text-gray-500"
                  )}>
                    Quality: {pn.qualityRating || 'UNKNOWN'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Verified Name</p>
                    <p className="font-medium">{pn.verifiedName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Name Status</p>
                    <p className="font-medium">{pn.nameStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">New Name Status</p>
                    <p className="font-medium">{pn.newNameStatus || 'NONE'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Verification Status</p>
                    <p className="font-medium">{pn.codeVerificationStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Messaging Limit Tier</p>
                    <p className="font-medium">{pn.messagingLimitTier || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Quality Score</p>
                    <p className="font-medium">{pn.qualityScore || 'N/A'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">WABA ID</p>
                    <p className="font-medium font-mono text-sm">{pn.wabaId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">WABA Name</p>
                    <p className="font-medium">{waba?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Business Verification</p>
                    <p className="font-medium">{pn.businessVerificationStatus || waba?.accountReviewStatus || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {phoneNumbers.length === 0 && (
          <div className={cn("p-12 text-center rounded-3xl border", isDark ? "border-gray-800" : "border-gray-200")}>
            <Phone className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-xl font-bold mb-2">No Phone Numbers Found</h3>
            <p className="text-gray-500">Connect a WhatsApp Business Account to see phone numbers here.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// --- Helper Components ---

function NavItem({ icon, label, active, onClick, isDark }: { icon: React.ReactNode, label: string, active: boolean, onClick?: () => void, isDark: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 font-medium relative overflow-hidden group",
        active 
          ? (isDark ? "text-green-400 bg-green-500/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" : "text-green-700 bg-green-50 shadow-sm")
          : (isDark ? "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200" : "text-gray-500 hover:bg-gray-100/80 hover:text-gray-900")
      )}
    >
      {active && (
        <motion.div 
          layoutId="active-nav" 
          className="absolute left-0 top-0 w-1 h-full bg-green-500 rounded-r-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <div className={cn("transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110")}>
        {icon}
      </div>
      <span className="tracking-wide">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon, trend, isDark }: { label: string, value: string, icon: React.ReactNode, trend?: string, isDark: boolean }) {
  return (
    <div className={cn(
      "p-6 rounded-3xl border transition-all hover:scale-[1.02]",
      isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200 shadow-sm"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isDark ? "bg-gray-800" : "bg-gray-50")}>{icon}</div>
        {trend && <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">{trend}</span>}
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <h4 className="text-3xl font-bold mt-1">{value}</h4>
    </div>
  );
}

function HealthItem({ label, value, status, isDark }: { label: string, value: string, status: 'success' | 'info' | 'warning', isDark: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Info size={14} className="text-gray-500" />
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <span className={cn(
        "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
        status === 'success' ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
      )}>
        {value}
      </span>
    </div>
  );
}
