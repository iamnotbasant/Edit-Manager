
import React, { useState } from 'react';
import { Icon } from './Icon';
import { TagDefinition, TagStyle, CategoryDefinition } from '../types';
import { TAG_STYLES } from '../constants';

interface SettingsViewProps {
    tags: TagDefinition[];
    onUpdateTags: (tags: TagDefinition[]) => void;
    categories?: CategoryDefinition[]; // Added prop
    onUpdateCategories?: (cats: CategoryDefinition[]) => void; // Added prop
}

const AVAILABLE_STYLES: { key: TagStyle; label: string; colorClass: string }[] = [
    { key: 'blue', label: 'Blue', colorClass: 'bg-blue-500' },
    { key: 'pink', label: 'Pink', colorClass: 'bg-pink-500' },
    { key: 'purple', label: 'Purple', colorClass: 'bg-purple-500' },
    { key: 'green', label: 'Green', colorClass: 'bg-green-500' },
    { key: 'cyan', label: 'Cyan', colorClass: 'bg-cyan-500' },
    { key: 'amber', label: 'Amber', colorClass: 'bg-amber-500' },
    { key: 'red', label: 'Red', colorClass: 'bg-red-500' },
    { key: 'gray', label: 'Gray', colorClass: 'bg-gray-500' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ tags, onUpdateTags, categories = [], onUpdateCategories }) => {
    const [newTagLabel, setNewTagLabel] = useState('');
    const [newTagStyle, setNewTagStyle] = useState<TagStyle>('blue');
    const [newCategoryLabel, setNewCategoryLabel] = useState('');

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagLabel.trim()) return;

        const newTag: TagDefinition = {
            id: `tag-${Date.now()}`,
            label: newTagLabel.toUpperCase(),
            style: newTagStyle
        };

        onUpdateTags([...tags, newTag]);
        setNewTagLabel('');
        setNewTagStyle('blue');
    };

    const handleDeleteTag = (id: string) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            onUpdateTags(tags.filter(t => t.id !== id));
        }
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryLabel.trim() || !onUpdateCategories) return;

        const newCat: CategoryDefinition = {
            id: `cat-${Date.now()}`,
            label: newCategoryLabel
        };

        onUpdateCategories([...categories, newCat]);
        setNewCategoryLabel('');
    };

    const handleDeleteCategory = (id: string) => {
        if (!onUpdateCategories) return;
        if (confirm('Are you sure you want to delete this category?')) {
            onUpdateCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden animate-in fade-in duration-300">
            <header className="bg-surface-light dark:bg-surface-dark px-8 py-6 border-b border-border-light dark:border-border-dark flex-shrink-0">
                <h1 className="text-2xl font-bold text-text-light dark:text-text-dark tracking-tight">App Settings</h1>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    Manage your workflow configuration and preferences.
                </p>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-10">
                    
                    {/* Categories Management Section */}
                    {onUpdateCategories && (
                        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                                <div>
                                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                                        <Icon name="category" className="text-primary" />
                                        Project Categories
                                    </h2>
                                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                        Manage project types (e.g., Reel, Vlog). The top 4 appear as quick buttons in the new project modal.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6">
                                <form onSubmit={handleAddCategory} className="flex gap-4 mb-6">
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Documentary" 
                                        className="flex-1 h-10 px-3 rounded-lg border border-border-light dark:border-gray-600 bg-white dark:bg-gray-700 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                        value={newCategoryLabel}
                                        onChange={(e) => setNewCategoryLabel(e.target.value)}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!newCategoryLabel.trim()}
                                        className="h-10 px-6 rounded-lg bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Icon name="add" className="text-lg" />
                                        Add Category
                                    </button>
                                </form>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {categories.map((cat, index) => (
                                        <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 group hover:border-primary/30 transition-colors relative">
                                            {index < 4 && (
                                                <span className="absolute -top-2 -left-2 w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full shadow-sm z-10" title="Top 4">
                                                    {index + 1}
                                                </span>
                                            )}
                                            <span className="text-sm font-medium text-text-light dark:text-text-dark truncate mr-2">
                                                {cat.label}
                                            </span>
                                            <button 
                                                onClick={() => handleDeleteCategory(cat.id)}
                                                className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Delete Category"
                                            >
                                                <Icon name="delete" className="text-lg" />
                                            </button>
                                        </div>
                                    ))}
                                    {categories.length === 0 && (
                                        <p className="text-sm text-gray-400 col-span-full italic">No categories defined.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Tags Management Section */}
                    <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                            <div>
                                <h2 className="text-lg font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                                    <Icon name="label" className="text-primary" />
                                    Project Tags
                                </h2>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                    Create and manage tags used to categorize your projects (e.g., Editing, VFX, Revision).
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Create New Tag */}
                            <form onSubmit={handleAddTag} className="flex flex-col sm:flex-row gap-4 mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-border-light dark:border-gray-700 items-end sm:items-center">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1.5 uppercase">Tag Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. REVIEW" 
                                        className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-gray-600 bg-white dark:bg-gray-700 text-text-light dark:text-text-dark text-sm focus:ring-2 focus:ring-primary focus:border-primary uppercase"
                                        value={newTagLabel}
                                        onChange={(e) => setNewTagLabel(e.target.value)}
                                        maxLength={15}
                                    />
                                </div>
                                <div className="w-full sm:w-auto">
                                    <label className="block text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1.5 uppercase">Color Style</label>
                                    <div className="flex gap-2 h-10 items-center">
                                        {AVAILABLE_STYLES.map(style => (
                                            <button
                                                key={style.key}
                                                type="button"
                                                onClick={() => setNewTagStyle(style.key)}
                                                className={`w-6 h-6 rounded-full ${style.colorClass} transition-all ring-offset-2 dark:ring-offset-gray-800 ${newTagStyle === style.key ? 'ring-2 ring-text-light dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                                                title={style.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!newTagLabel.trim()}
                                    className="h-10 px-6 rounded-lg bg-primary hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <Icon name="add" className="text-lg" />
                                    Add Tag
                                </button>
                            </form>

                            {/* Existing Tags List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {tags.map(tag => (
                                    <div key={tag.id} className="flex items-center justify-between p-3 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow group">
                                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wider ${TAG_STYLES[tag.style]}`}>
                                            {tag.label}
                                        </span>
                                        <button 
                                            onClick={() => handleDeleteTag(tag.id)}
                                            className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                                            title="Delete Tag"
                                        >
                                            <Icon name="delete" className="text-lg" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Placeholder for future settings */}
                    <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm opacity-60">
                        <div className="px-6 py-5 border-b border-border-light dark:border-border-dark">
                            <h2 className="text-lg font-bold text-text-light dark:text-text-dark flex items-center gap-2">
                                <Icon name="notifications" className="text-gray-400" />
                                Notifications (Coming Soon)
                            </h2>
                        </div>
                        <div className="p-6 text-center text-sm text-text-secondary-light">
                            Notification settings will be available in a future update.
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};
