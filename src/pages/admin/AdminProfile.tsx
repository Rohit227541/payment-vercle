import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, ShieldAlert, Lock, AlertCircle, Activity, Clock, ShieldCheck, Key } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { motion } from 'framer-motion';

export default function AdminProfile() {
  const { admin } = useAdmin();
  const [loading, setLoading] = useState(true);

  // Read from AdminContext or LocalStorage fallback
  const adminData = admin || {
    admin_id: localStorage.getItem('admin_id') || 'ADM-UNKNOWN',
    name: localStorage.getItem('admin_name') || 'Super Admin',
    email: localStorage.getItem('admin_email') || 'admin@trustgates.com',
    role: localStorage.getItem('admin_role') || 'ADMIN',
  };

  useEffect(() => {
    // Simulate loading context
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium text-ink-500">Loading profile data...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12 w-full"
    >
      <motion.div variants={itemVariants}>
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Admin Profile</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Manage your administrator account details and security settings.</p>
      </motion.div>

      {/* Hero Profile Card */}
      <motion.div variants={itemVariants} className="relative rounded-2xl overflow-hidden border border-ink-200/50 dark:border-ink-800/50 bg-white dark:bg-ink-950 shadow-xl shadow-purple-900/5">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-90" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-20 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative pt-16 px-8 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="shrink-0 relative group"
          >
            <div className="h-32 w-32 rounded-full bg-white dark:bg-ink-950 p-1.5 shadow-xl relative z-10">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center overflow-hidden border border-purple-100 dark:border-purple-800/30 group-hover:shadow-inner transition-all duration-300">
                <User className="h-14 w-14 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 400, damping: 15 }}
              className="absolute bottom-2 right-2 p-2 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full border-4 border-white dark:border-ink-950 shadow-lg z-20"
            >
              <ShieldCheck className="h-5 w-5" />
            </motion.div>
          </motion.div>
          
          <div className="flex-1 text-center md:text-left pb-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-display font-bold text-ink-900 dark:text-white tracking-tight">
                  {adminData.name}
                </h2>
                <p className="text-ink-600 dark:text-ink-400 mt-1 flex items-center justify-center md:justify-start gap-2 font-medium">
                  <Mail className="h-4 w-4 text-purple-500" /> {adminData.email}
                </p>
              </div>
              
              <div className="flex items-center justify-center md:justify-end gap-3">
                <div className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1">Role</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-bold text-ink-900 dark:text-white uppercase tracking-wide">{adminData.role}</span>
                  </div>
                </div>
                
                <div className="px-4 py-2 rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-ink-500 dark:text-ink-400 uppercase tracking-widest mb-1">Admin ID</span>
                  <span className="text-sm font-mono font-bold text-ink-900 dark:text-white">{adminData.admin_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column - Personal Info */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-ink-950 rounded-2xl border border-ink-200/60 dark:border-ink-800/60 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-ink-100 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/20 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink-900 dark:text-white text-lg">Personal Information</h3>
                <p className="text-xs text-ink-500">Your basic account details</p>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="group">
                <label className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-ink-400" />
                  </div>
                  <input 
                    type="text" 
                    value={adminData.name} 
                    readOnly 
                    className="w-full pl-11 pr-4 py-3 bg-ink-50/80 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium text-ink-900 dark:text-white cursor-not-allowed focus:outline-none transition-colors group-hover:border-ink-300 dark:group-hover:border-ink-700"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-ink-400" />
                  </div>
                  <input 
                    type="email" 
                    value={adminData.email} 
                    readOnly 
                    className="w-full pl-11 pr-4 py-3 bg-ink-50/80 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 rounded-xl text-sm font-medium text-ink-900 dark:text-white cursor-not-allowed focus:outline-none transition-colors group-hover:border-ink-300 dark:group-hover:border-ink-700"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10 flex items-start gap-3">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                      Session Active
                    </h4>
                    <p className="text-xs text-blue-700/80 dark:text-blue-400/80 leading-relaxed">
                      You are currently authenticated as an administrator. Your actions on this dashboard are logged and monitored for security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Security & Alerts */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white dark:bg-ink-950 rounded-2xl border border-ink-200/60 dark:border-ink-800/60 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-ink-100 dark:border-ink-800/60 bg-ink-50/50 dark:bg-ink-900/20 flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink-900 dark:text-white text-lg">Security Settings</h3>
                <p className="text-xs text-ink-500">Account protection</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-ink-100 dark:bg-ink-900 flex items-center justify-center shrink-0">
                  <Key className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-ink-900 dark:text-white">Password</h4>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 mb-3">Last changed 30 days ago</p>
                  <button disabled className="w-full py-2 px-4 rounded-xl border border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-900 text-sm font-medium text-ink-400 dark:text-ink-600 cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4" /> Update Password
                  </button>
                </div>
              </div>

              <div className="h-px w-full bg-ink-200 dark:bg-ink-800/60" />

              <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-5">
                <div className="absolute -right-4 -top-4">
                  <AlertCircle className="h-24 w-24 text-amber-500/10" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    <h4 className="font-semibold text-amber-900 dark:text-amber-400 text-sm">Updates Disabled</h4>
                  </div>
                  <p className="text-xs text-amber-800/80 dark:text-amber-500/80 leading-relaxed">
                    For security and compliance reasons, updating admin profile information and changing passwords directly via the web interface is restricted.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                    <Clock className="h-3.5 w-3.5" /> Contact DevOps to update
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
