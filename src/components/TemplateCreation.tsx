/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Info, 
  Type, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  MessageSquare, 
  ExternalLink, 
  PhoneCall,
  Save,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import { metaWabaService } from '../services/metaWabaService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TemplateCreationProps {
  isDark: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TemplateCreation({ isDark, onClose, onSuccess }: TemplateCreationProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('MARKETING');
  const [language, setLanguage] = useState('en');
  const [headerType, setHeaderType] = useState<'NONE' | 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('NONE');
  const [headerText, setHeaderText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [buttons, setButtons] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'MARKETING', label: 'Marketing', desc: 'Promotions, announcements, etc.' },
    { id: 'UTILITY', label: 'Utility', desc: 'Account updates, order alerts, etc.' },
    { id: 'AUTHENTICATION', label: 'Authentication', desc: 'One-time passwords, etc.' }
  ];

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'Hindi' },
    { id: 'es', label: 'Spanish' },
    { id: 'pt_BR', label: 'Portuguese (BR)' }
  ];

  const addButton = () => {
    if (buttons.length >= 3) return;
    setButtons([...buttons, { type: 'QUICK_REPLY', text: '' }]);
  };

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const updateButton = (index: number, field: string, value: string) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setButtons(newButtons);
  };

  const handleSubmit = async () => {
    if (!name || !bodyText) {
      alert('Please fill in the required fields (Name and Body).');
      return;
    }

    setIsSubmitting(true);

    const components: any[] = [];

    if (headerType !== 'NONE') {
      const header: any = { type: 'HEADER', format: headerType };
      if (headerType === 'TEXT') {
        header.text = headerText;
      }
      components.push(header);
    }

    components.push({
      type: 'BODY',
      text: bodyText
    });

    if (footerText) {
      components.push({
        type: 'FOOTER',
        text: footerText
      });
    }

    if (buttons.length > 0) {
      components.push({
        type: 'BUTTONS',
        buttons: buttons.map(b => {
          if (b.type === 'QUICK_REPLY') {
            return { type: 'QUICK_REPLY', text: b.text };
          } else if (b.type === 'URL') {
            return { type: 'URL', text: b.text, url: b.url };
          } else if (b.type === 'PHONE_NUMBER') {
            return { type: 'PHONE_NUMBER', text: b.text, phone_number: b.phone_number };
          }
          return b;
        })
      });
    }

    const templateData = {
      name: name.toLowerCase().replace(/\s+/g, '_'),
      category,
      language,
      components
    };

    try {
      const result = await metaWabaService.createTemplate(templateData);
      if (result && (result.id || result.success !== false)) {
        alert('Template submitted successfully for approval!');
        onSuccess();
      } else {
        alert('Failed to submit template: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={cn(
          "w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border",
          isDark ? "bg-[#111827] border-gray-800" : "bg-white border-gray-200"
        )}
      >
        {/* Header */}
        <div className={cn("p-6 border-b flex justify-between items-center", isDark ? "border-gray-800" : "border-gray-200")}>
          <div>
            <h2 className="text-2xl font-bold">Create Message Template</h2>
            <p className="text-sm text-gray-400">Design your WhatsApp message and submit for Meta approval</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Editor */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Basic Info */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Basic Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Template Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="e.g. welcome_offer_2024" 
                    className={cn("w-full p-4 rounded-2xl outline-none border focus:border-green-500 transition-all", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")} 
                  />
                  <p className="text-[10px] text-gray-500">Lowercase letters, numbers, and underscores only.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400">Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={cn("w-full p-4 rounded-2xl outline-none border focus:border-green-500 transition-all", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")}
                  >
                    {languages.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Category</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all",
                        category === cat.id 
                          ? "border-green-500 bg-green-500/5 ring-1 ring-green-500" 
                          : (isDark ? "border-gray-700 bg-gray-800/50 hover:border-gray-600" : "border-gray-200 bg-gray-50 hover:border-gray-300")
                      )}
                    >
                      <p className={cn("font-bold text-sm", category === cat.id ? "text-green-500" : "")}>{cat.label}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Content Editor */}
            <section className="space-y-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Message Content</h3>
              
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400">Header (Optional)</label>
                  <div className="flex gap-2">
                    {(['NONE', 'TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setHeaderType(type)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                          headerType === type 
                            ? "bg-green-500 text-white" 
                            : (isDark ? "bg-gray-800 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200")
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {headerType === 'TEXT' && (
                  <input 
                    type="text" 
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="Enter header text..." 
                    maxLength={60}
                    className={cn("w-full p-4 rounded-2xl outline-none border focus:border-green-500 transition-all", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")} 
                  />
                )}
                {headerType !== 'NONE' && headerType !== 'TEXT' && (
                  <div className={cn("p-4 rounded-2xl border border-dashed text-center", isDark ? "border-gray-700 bg-gray-800/20" : "border-gray-200 bg-gray-50")}>
                    <p className="text-xs text-gray-500">Media will be uploaded during broadcast launch.</p>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400">Body Text (Required)</label>
                  <span className="text-[10px] text-gray-500">{bodyText.length}/1024</span>
                </div>
                <textarea 
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Enter your message here. Use {{1}}, {{2}} for variables." 
                  rows={6}
                  maxLength={1024}
                  className={cn("w-full p-4 rounded-2xl outline-none border focus:border-green-500 transition-all resize-none", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")} 
                />
                <div className="flex gap-2">
                  <button 
                    onClick={() => setBodyText(prev => prev + ` {{${(prev.match(/\{\{\d+\}\}/g) || []).length + 1}}}`)}
                    className="text-[10px] font-bold text-green-500 hover:underline"
                  >
                    + Add Variable
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Footer (Optional)</label>
                <input 
                  type="text" 
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="Enter footer text..." 
                  maxLength={60}
                  className={cn("w-full p-4 rounded-2xl outline-none border focus:border-green-500 transition-all", isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200")} 
                />
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400">Interactive Buttons (Optional)</label>
                  {buttons.length < 3 && (
                    <button 
                      onClick={addButton}
                      className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Button
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {buttons.map((btn, idx) => (
                    <div key={idx} className={cn("p-4 rounded-2xl border flex flex-col gap-4", isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200")}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          {(['QUICK_REPLY', 'URL', 'PHONE_NUMBER'] as const).map(type => (
                            <button
                              key={type}
                              onClick={() => updateButton(idx, 'type', type)}
                              className={cn(
                                "px-2 py-1 rounded-md text-[9px] font-bold transition-all",
                                btn.type === type 
                                  ? "bg-blue-500 text-white" 
                                  : (isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500")
                              )}
                            >
                              {type.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => removeButton(idx)} className="text-red-500 hover:bg-red-500/10 p-1 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          value={btn.text}
                          onChange={(e) => updateButton(idx, 'text', e.target.value)}
                          placeholder="Button Label" 
                          className={cn("p-3 rounded-xl outline-none border text-xs", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200")}
                        />
                        {btn.type === 'URL' && (
                          <input 
                            type="text" 
                            value={btn.url || ''}
                            onChange={(e) => updateButton(idx, 'url', e.target.value)}
                            placeholder="https://example.com" 
                            className={cn("p-3 rounded-xl outline-none border text-xs", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200")}
                          />
                        )}
                        {btn.type === 'PHONE_NUMBER' && (
                          <input 
                            type="text" 
                            value={btn.phone_number || ''}
                            onChange={(e) => updateButton(idx, 'phone_number', e.target.value)}
                            placeholder="+1234567890" 
                            className={cn("p-3 rounded-xl outline-none border text-xs", isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200")}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Preview */}
          <div className={cn("w-full lg:w-96 p-8 border-l flex flex-col items-center justify-center bg-opacity-50", isDark ? "bg-black/20 border-gray-800" : "bg-gray-50 border-gray-200")}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-8">Live Preview</h3>
            
            <div className="w-full max-w-[280px] bg-[#e5ddd5] rounded-[32px] p-2 shadow-xl relative overflow-hidden aspect-[9/16] border-[8px] border-gray-800">
              <div className="absolute top-0 left-0 right-0 h-12 bg-[#075e54] flex items-center px-4 gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300" />
                <div className="flex-1">
                  <div className="w-20 h-2 bg-white/40 rounded-full" />
                  <div className="w-12 h-1.5 bg-white/20 rounded-full mt-1" />
                </div>
              </div>

              <div className="mt-14 px-2 space-y-2">
                <div className="bg-white rounded-lg rounded-tl-none p-2 shadow-sm max-w-[90%] animate-in fade-in slide-in-from-left-2 duration-500">
                  {headerType === 'TEXT' && headerText && (
                    <p className="font-bold text-[11px] mb-1 text-gray-900 border-b pb-1 border-gray-100">{headerText}</p>
                  )}
                  {(headerType === 'IMAGE' || headerType === 'VIDEO' || headerType === 'DOCUMENT') && (
                    <div className="aspect-video bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400">
                      {headerType === 'IMAGE' && <ImageIcon size={24} />}
                      {headerType === 'VIDEO' && <Video size={24} />}
                      {headerType === 'DOCUMENT' && <FileText size={24} />}
                    </div>
                  )}
                  <p className="text-[11px] text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {bodyText || "Your message body will appear here..."}
                  </p>
                  {footerText && (
                    <p className="text-[9px] text-gray-400 mt-1 border-t pt-1 border-gray-50">{footerText}</p>
                  )}
                  <div className="flex justify-end mt-1">
                    <span className="text-[8px] text-gray-400 uppercase">12:00 PM</span>
                  </div>
                </div>

                {buttons.map((btn, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 shadow-sm text-center text-blue-500 text-[10px] font-bold flex items-center justify-center gap-2">
                    {btn.type === 'URL' && <ExternalLink size={10} />}
                    {btn.type === 'PHONE_NUMBER' && <PhoneCall size={10} />}
                    {btn.text || "Button Label"}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 w-full space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-400 leading-relaxed">
                  Meta usually takes 2-24 hours to approve templates. Once approved, they will be available in the broadcast section.
                </p>
              </div>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !name || !bodyText}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2",
                  isSubmitting || !name || !bodyText 
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                    : "bg-green-500 text-white shadow-green-500/20 hover:scale-[1.02] active:scale-95"
                )}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    Submit for Approval
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
