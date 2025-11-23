import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Search,
    BookOpen,
    CheckCircle,
    Bookmark,
    X,
    Trash2,
    Edit3,
    ExternalLink,
    Image as ImageIcon,
    Zap,
    Star,
    Filter,
    Play,
    Calendar,
    Link as LinkIcon
} from 'lucide-react';

// --- Sample Data ---

const SAMPLE_MANHWA = [
    {
        id: 'sl-001',
        title: 'Solo Leveling',
        coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', // Abstract purple energy
        status: 'COMPLETED',
        currentChapter: 179,
        totalChapters: 179,
        rating: 10,
        link: 'https://sololeveling.net/',
        lastUpdated: new Date().toISOString(),
        synopsis: 'In a world where hunters battling monsters are the norm, the lowest ranked hunter, Sung Jin-Woo, uncovers a secret to power...'
    },
    {
        id: 'orv-002',
        title: 'Omniscient Reader',
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop', // Starry apocalyptic
        status: 'READING',
        currentChapter: 188,
        totalChapters: 551,
        rating: 9.8,
        link: 'https://www.webtoons.com/en/action/omniscient-reader/list?title_no=2154',
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        synopsis: 'Kim Dokja is the only one who knows the ending of the novel "Three Ways to Survive in a Ruined World". Then the novel becomes reality.'
    },
    {
        id: 'tbate-003',
        title: 'The Beginning After the End',
        coverUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84965d?q=80&w=1000&auto=format&fit=crop', // Fantasy/Dragon vibe
        status: 'ON_HOLD',
        currentChapter: 175,
        totalChapters: null,
        rating: 9.5,
        link: '',
        lastUpdated: new Date(Date.now() - 172800000).toISOString(),
        synopsis: 'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind...'
    },
    {
        id: 'sss-004',
        title: 'SSS-Class Suicide Hunter',
        coverUrl: 'https://images.unsplash.com/photo-1542256844-d39b71e5b788?q=80&w=1000&auto=format&fit=crop', // Red/Dark vibe
        status: 'PLAN_TO_READ',
        currentChapter: 0,
        totalChapters: null,
        rating: 0,
        link: '',
        lastUpdated: new Date(Date.now() - 604800000).toISOString(),
        synopsis: 'I want to be like them. I want to be a hunter. I died. But wait, I have a skill?'
    }
];

// --- UI Components ---

const GlowButton = ({ children, onClick, variant = "primary", size = "md", className = "", ...props }) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-500/25 border border-violet-500/50",
        secondary: "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 backdrop-blur-sm",
        danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20",
        ghost: "text-slate-400 hover:text-white hover:bg-white/5",
        glass: "bg-slate-900/60 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
        icon: "p-2.5",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Badge = ({ children, color = "slate", className = "" }) => {
    const colors = {
        slate: "bg-slate-800/80 text-slate-300 border-slate-700",
        violet: "bg-violet-500/20 text-violet-200 border-violet-500/30",
        green: "bg-emerald-500/20 text-emerald-200 border-emerald-500/30",
        blue: "bg-sky-500/20 text-sky-200 border-sky-500/30",
        orange: "bg-orange-500/20 text-orange-200 border-orange-500/30",
        rose: "bg-rose-500/20 text-rose-200 border-rose-500/30",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border backdrop-blur-md shadow-sm ${colors[color]} ${className}`}>
            {children}
        </span>
    );
};

const Input = ({ label, error, ...props }) => (
    <div className="space-y-1.5 group">
        {label && <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider group-focus-within:text-violet-400 transition-colors">{label}</label>}
        <input
            className={`w-full bg-black/20 border ${error ? 'border-rose-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-black/40 transition-all`}
            {...props}
        />
    </div>
);

const Select = ({ label, options, ...props }) => (
    <div className="space-y-1.5 group">
        {label && <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider group-focus-within:text-violet-400 transition-colors">{label}</label>}
        <div className="relative">
            <select
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-black/40 transition-all appearance-none cursor-pointer"
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <Filter className="w-4 h-4" />
            </div>
        </div>
    </div>
);

// --- Main Application ---

export default function App() {
    // API Base URL - use environment variable or fallback to relative path for production
    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    // State
    const [manhwaList, setManhwaList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState({ type: null, data: null }); // type: 'VIEW' | 'EDIT' | null
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('updated');

    // Form State (only used when editing/adding)
    const [formData, setFormData] = useState({
        title: '',
        coverUrl: '',
        status: 'READING',
        currentChapter: 0,
        totalChapters: '',
        rating: 0,
        link: '',
        synopsis: ''
    });

    // Effects
    useEffect(() => {
        fetchManhwa();
    }, []);

    const fetchManhwa = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/manhwa`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setManhwaList(data);
        } catch (error) {
            console.error('Error fetching manhwa:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Logic
    const statusConfig = {
        READING: { label: 'Reading', color: 'violet', icon: BookOpen },
        COMPLETED: { label: 'Completed', color: 'green', icon: CheckCircle },
        PLAN_TO_READ: { label: 'Plan to Read', color: 'blue', icon: Bookmark },
        DROPPED: { label: 'Dropped', color: 'rose', icon: X },
        ON_HOLD: { label: 'On Hold', color: 'orange', icon: Zap }
    };

    const filteredList = useMemo(() => {
        let result = [...manhwaList];
        if (filterStatus !== 'ALL') result = result.filter(m => m.status === filterStatus);
        if (searchQuery) result = result.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

        if (sortBy === 'updated') {
            result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        } else if (sortBy === 'title') {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }
        return result;
    }, [manhwaList, filterStatus, searchQuery, sortBy]);

    const stats = useMemo(() => ({
        total: manhwaList.length,
        reading: manhwaList.filter(m => m.status === 'READING').length,
        chapters: manhwaList.reduce((acc, curr) => acc + (parseInt(curr.currentChapter) || 0), 0)
    }), [manhwaList]);

    // Handlers
    const openViewModal = (manhwa) => {
        setModalState({ type: 'VIEW', data: manhwa });
    };

    const openEditModal = (manhwa = null) => {
        setFormData(manhwa ? {
            title: manhwa.title,
            coverUrl: manhwa.coverUrl || '',
            status: manhwa.status,
            currentChapter: manhwa.currentChapter,
            totalChapters: manhwa.totalChapters || '',
            rating: manhwa.rating || 0,
            link: manhwa.link || '',
            synopsis: manhwa.synopsis || ''
        } : {
            title: '', coverUrl: '', status: 'READING', currentChapter: 0, totalChapters: '', rating: 0, link: '', synopsis: ''
        });
        setModalState({ type: 'EDIT', data: manhwa });
    };

    const closeModal = () => {
        setModalState({ type: null, data: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const editingId = modalState.data?.id;

        const newItem = {
            id: editingId || crypto.randomUUID(),
            ...formData,
            currentChapter: parseInt(formData.currentChapter) || 0,
            totalChapters: formData.totalChapters ? parseInt(formData.totalChapters) : null,
            lastUpdated: new Date().toISOString()
        };

        try {
            if (editingId) {
                await fetch(`${API_BASE_URL}/api/manhwa/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });
            } else {
                await fetch(`${API_BASE_URL}/api/manhwa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newItem)
                });
            }
            await fetchManhwa();
            closeModal();
        } catch (error) {
            console.error('Error saving manhwa:', error);
            alert('Failed to save. Check console.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this title?')) {
            try {
                await fetch(`${API_BASE_URL}/api/manhwa/${id}`, { method: 'DELETE' });
                await fetchManhwa();
                closeModal();
            } catch (error) {
                console.error('Error deleting manhwa:', error);
                alert('Failed to delete. Check console.');
            }
        }
    };

    const quickIncrement = async (e, id) => {
        if (e) e.stopPropagation();
        const item = manhwaList.find(m => m.id === id);
        if (!item) return;

        const updatedItem = {
            ...item,
            currentChapter: (item.currentChapter || 0) + 1,
            lastUpdated: new Date().toISOString()
        };

        try {
            await fetch(`${API_BASE_URL}/api/manhwa/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedItem)
            });

            // Optimistic update for list
            setManhwaList(prev => prev.map(m => m.id === id ? updatedItem : m));

            // Also update modal data if currently viewing this item
            if (modalState.data?.id === id) {
                setModalState(prev => ({
                    ...prev,
                    data: updatedItem
                }));
            }
        } catch (error) {
            console.error('Error incrementing chapter:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-slate-500">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-violet-900/50" />
                    <p>Loading Library...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-violet-500/30 pb-20">

            {/* Background Ambiance */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-violet-900/20 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[100px]" />
            </div>

            {/* Top Navigation */}
            <div className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 group cursor-default">
                            <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
                                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-white tracking-tight leading-none">NeoScrolls</span>
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">Manhwa Library</span>
                            </div>
                        </div>

                        {/* Desktop Stats */}
                        <div className="hidden md:flex items-center gap-6 px-6 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-400 uppercase">Titles</span>
                                <span className="text-sm font-bold text-white">{stats.total}</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-400 uppercase">Reading</span>
                                <span className="text-sm font-bold text-violet-400">{stats.reading}</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-400 uppercase">Chs. Read</span>
                                <span className="text-sm font-bold text-emerald-400">{stats.chapters.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Action */}
                        <GlowButton onClick={() => openEditModal()}>
                            <Plus className="w-5 h-5 md:mr-2" />
                            <span className="hidden md:inline">Add Title</span>
                        </GlowButton>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

                {/* Search & Filter Bar */}
                <div className="flex flex-col xl:flex-row gap-4 mb-10">
                    {/* Search */}
                    <div className="relative flex-1 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
                        <div className="relative flex items-center bg-[#121216] border border-white/10 rounded-2xl p-1 focus-within:border-violet-500/50 transition-colors">
                            <Search className="w-5 h-5 text-slate-500 ml-3" />
                            <input
                                type="text"
                                placeholder="Search library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none text-slate-200 placeholder-slate-500 focus:ring-0 px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar">
                        {['ALL', 'READING', 'PLAN_TO_READ', 'COMPLETED', 'DROPPED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 border ${filterStatus === status
                                    ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-105'
                                    : 'bg-[#121216] text-slate-400 border-white/5 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {status === 'ALL' ? 'ALL' : statusConfig[status].label}
                            </button>
                        ))}
                        <div className="w-px h-6 bg-white/10 mx-2" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#121216] text-xs font-medium text-slate-300 border border-white/10 rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500/50"
                        >
                            <option value="updated">Recently Updated</option>
                            <option value="title">A-Z</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div>
                </div>

                {/* Grid View */}
                {filteredList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
                            <BookOpen className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Your library is empty</h3>
                        <p className="text-slate-500 max-w-md mb-8">Track your reading journey. Add your first Manhwa to get started.</p>
                        <GlowButton onClick={() => openEditModal()}>Add Title Now</GlowButton>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredList.map(item => {
                            const StatusIcon = statusConfig[item.status].icon;
                            const progress = item.totalChapters ? Math.min((item.currentChapter / item.totalChapters) * 100, 100) : 0;

                            return (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col gap-3 cursor-pointer"
                                    onClick={() => openViewModal(item)}
                                >
                                    {/* Card Visual */}
                                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-slate-800 shadow-2xl border border-white/5 group-hover:border-violet-500/50 transition-all duration-500 group-hover:-translate-y-2">
                                        {/* Image */}
                                        {item.coverUrl ? (
                                            <img
                                                src={item.coverUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-[#1a1a20]">
                                                <ImageIcon className="w-12 h-12 mb-2 opacity-30" />
                                                <span className="text-[10px] uppercase tracking-widest opacity-50">No Cover</span>
                                            </div>
                                        )}

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />

                                        {/* Hover Action Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                                            <button
                                                onClick={(e) => quickIncrement(e, item.id)}
                                                className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                                title="Add Chapter"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>

                                            {item.link && (
                                                <a
                                                    href={item.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                                    title="Read Now"
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}

                                            <button
                                                onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                                                className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                                title="Edit"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Top Right Badge */}
                                        <div className="absolute top-3 right-3">
                                            <Badge color={statusConfig[item.status].color} className="shadow-lg">
                                                {statusConfig[item.status].label}
                                            </Badge>
                                        </div>

                                        {/* Bottom Progress Bar (Integrated) */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                            <div
                                                className={`h-full transition-all duration-500 ${item.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-violet-500'
                                                    }`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Card Info */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-slate-200 leading-snug line-clamp-1 group-hover:text-violet-400 transition-colors" title={item.title}>
                                                {item.title}
                                            </h3>
                                            {item.rating > 0 && (
                                                <div className="flex items-center gap-1 text-amber-400 shrink-0">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span className="text-xs font-bold">{item.rating}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <span className="text-slate-300 font-medium">Ch. {item.currentChapter}</span>
                                                {item.totalChapters && <span className="opacity-50">/ {item.totalChapters}</span>}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* --- COVER PAGE / DETAIL MODAL --- */}
            {modalState.type === 'VIEW' && modalState.data && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={closeModal} />
                    <div className="relative w-full max-w-4xl bg-[#0f0f12] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 flex flex-col md:flex-row">

                        {/* Close Button */}
                        <button onClick={closeModal} className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-black/80 transition-all">
                            <X className="w-6 h-6" />
                        </button>

                        {/* LEFT: Poster Image */}
                        <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-800">
                            {modalState.data.coverUrl ? (
                                <img src={modalState.data.coverUrl} alt={modalState.data.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                    <ImageIcon className="w-16 h-16 opacity-30" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f12] via-transparent to-transparent md:bg-gradient-to-r" />
                        </div>

                        {/* RIGHT: Content Details */}
                        <div className="flex-1 p-8 flex flex-col relative">

                            {/* Header Info */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge color={statusConfig[modalState.data.status].color} className="text-sm py-1 px-3">
                                        {statusConfig[modalState.data.status].label}
                                    </Badge>
                                    {modalState.data.rating > 0 && (
                                        <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm font-bold">{modalState.data.rating}</span>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{modalState.data.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Updated {new Date(modalState.data.lastUpdated).toLocaleDateString()}</span>
                                    {modalState.data.link && (
                                        <a href={modalState.data.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors">
                                            <LinkIcon className="w-4 h-4" /> Source
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Synopsis */}
                            <div className="flex-1 mb-8">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Synopsis</h4>
                                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                                    {modalState.data.synopsis || "No synopsis available for this title."}
                                </p>
                            </div>

                            {/* Progress Section */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6">
                                <div className="flex items-end justify-between mb-3">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Progress</p>
                                        <p className="text-2xl font-bold text-white">
                                            Chapter <span className="text-violet-400">{modalState.data.currentChapter}</span>
                                            <span className="text-slate-500 text-lg font-normal"> / {modalState.data.totalChapters || '?'}</span>
                                        </p>
                                    </div>
                                    <GlowButton size="sm" onClick={() => quickIncrement(null, modalState.data.id)}>
                                        <Plus className="w-4 h-4 mr-1" /> Add Chapter
                                    </GlowButton>
                                </div>
                                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full transition-all duration-500"
                                        style={{ width: `${modalState.data.totalChapters ? Math.min((modalState.data.currentChapter / modalState.data.totalChapters) * 100, 100) : 0}%` }}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-auto">
                                {modalState.data.link && (
                                    <a href={modalState.data.link} target="_blank" rel="noreferrer" className="flex-1">
                                        <GlowButton className="w-full" size="lg">
                                            <Play className="w-5 h-5 mr-2 fill-current" /> Continue Reading
                                        </GlowButton>
                                    </a>
                                )}
                                <GlowButton variant="secondary" size="lg" className={!modalState.data.link ? "flex-1" : ""} onClick={() => openEditModal(modalState.data)}>
                                    <Edit3 className="w-5 h-5 md:mr-2" /> <span className="hidden md:inline">Edit</span>
                                </GlowButton>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* --- EDIT/ADD MODAL --- */}
            {modalState.type === 'EDIT' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-[#0f0f12] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">{modalState.data ? 'Edit Details' : 'Add New Manhwa'}</h3>
                            <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                            {formData.coverUrl && (
                                <div className="flex gap-4 items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                    <img src={formData.coverUrl} alt="Preview" className="w-12 h-16 object-cover rounded-lg" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium text-slate-300 truncate">{formData.title || 'Untitled'}</p>
                                        <p className="text-xs text-slate-500">Cover Preview</p>
                                    </div>
                                </div>
                            )}

                            <Input
                                label="Title"
                                placeholder="Solo Leveling..."
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                                autoFocus
                            />

                            {/* Synopsis Input */}
                            <div className="space-y-1.5 group">
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider group-focus-within:text-violet-400 transition-colors">Synopsis</label>
                                <textarea
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-black/40 transition-all min-h-[80px] resize-y"
                                    placeholder="Brief description..."
                                    value={formData.synopsis}
                                    onChange={e => setFormData({ ...formData, synopsis: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Status"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    options={Object.entries(statusConfig).map(([k, v]) => ({ value: k, label: v.label }))}
                                />
                                <Input
                                    label="Rating (0-10)"
                                    type="number"
                                    min="0" max="10" step="0.1"
                                    value={formData.rating}
                                    onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Current Chapter"
                                    type="number"
                                    min="0"
                                    value={formData.currentChapter}
                                    onChange={e => setFormData({ ...formData, currentChapter: e.target.value })}
                                />
                                <Input
                                    label="Total Chapters"
                                    type="number"
                                    min="0"
                                    placeholder="?"
                                    value={formData.totalChapters}
                                    onChange={e => setFormData({ ...formData, totalChapters: e.target.value })}
                                />
                            </div>

                            <Input
                                label="Cover Image URL"
                                placeholder="https://..."
                                value={formData.coverUrl}
                                onChange={e => setFormData({ ...formData, coverUrl: e.target.value })}
                            />

                            <Input
                                label="Read Link"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                            />

                            <div className="pt-4 flex gap-3">
                                {modalState.data && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(modalState.data.id)}
                                        className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                                <GlowButton type="button" variant="secondary" className="flex-1" onClick={closeModal}>
                                    Cancel
                                </GlowButton>
                                <GlowButton type="submit" className="flex-[2]">
                                    {modalState.data ? 'Save Updates' : 'Add to Library'}
                                </GlowButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}