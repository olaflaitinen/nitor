
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Download, Briefcase, GraduationCap, Code2, Save, X, Loader2 } from 'lucide-react';
import { useNitorStore } from '../../store/useNitorStore';
import { Experience, Education, Project } from '../../types';
import { generateCV } from '../../utils/cvGenerator';
import { AITextEnhancer } from './AITextEnhancer';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

// --- Mock Data Fallback ---
const MOCK_EXP: Experience[] = [
    { id: '1', company: 'CERN', role: 'Junior Researcher', location: 'Geneva', startDate: '2020-01-01', isCurrent: true, description: 'Analyzing large hadron collider data using Python and C++.' }
];
const MOCK_EDU: Education[] = [
    { id: '1', institution: 'MIT', degree: 'PhD', fieldOfStudy: 'Physics', startDate: '2018-09-01', endDate: '2022-05-01' }
];

export const CVManager: React.FC = () => {
  const { user, addToast } = useNitorStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [editMode, setEditMode] = useState<{ type: 'exp' | 'edu' | 'proj', id?: string } | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Load Data
  useEffect(() => {
    const loadData = async () => {
        if (!user) return;
        setIsLoading(true);
        if (isSupabaseConfigured()) {
            try {
                const { data: expData } = await supabase.from('experience').select('*').eq('user_id', user.id);
                const { data: eduData } = await supabase.from('education').select('*').eq('user_id', user.id);
                const { data: projData } = await supabase.from('projects').select('*').eq('user_id', user.id);
                
                setExperiences(expData || []);
                setEducation(eduData || []);
                setProjects(projData || []);
            } catch (e) {
                console.error(e);
            }
        } else {
            // Mock Fallback
            setExperiences(MOCK_EXP);
            setEducation(MOCK_EDU);
        }
        setIsLoading(false);
    };
    loadData();
  }, [user]);

  // --- Handlers ---

  const handleSave = async () => {
      if (!user || !editMode) return;
      
      const { type, id } = editMode;
      const isNew = !id;
      
      if (isSupabaseConfigured()) {
          try {
              let table = type === 'exp' ? 'experience' : type === 'edu' ? 'education' : 'projects';
              let payload = { ...formData, user_id: user.id };
              
              if (type === 'exp') {
                  payload = {
                      user_id: user.id,
                      company: formData.company,
                      role: formData.role,
                      start_date: formData.startDate,
                      end_date: formData.endDate || null,
                      is_current: formData.isCurrent || false,
                      description: formData.description,
                      location: formData.location
                  }
              } else if (type === 'edu') {
                  payload = {
                      user_id: user.id,
                      institution: formData.institution,
                      degree: formData.degree,
                      field_of_study: formData.fieldOfStudy,
                      start_date: formData.startDate,
                      end_date: formData.endDate || null,
                      grade: formData.grade
                  }
              } else {
                  payload = {
                      user_id: user.id,
                      title: formData.title,
                      link: formData.link,
                      description: formData.description,
                      technologies: typeof formData.technologies === 'string' ? formData.technologies.split(',').map((t:string) => t.trim()) : formData.technologies
                  }
              }

              if (isNew) {
                  const { data, error } = await supabase.from(table).insert(payload).select();
                  if (error) throw error;
                  if (type === 'exp') setExperiences([...experiences, data[0]]);
                  if (type === 'edu') setEducation([...education, data[0]]);
                  if (type === 'proj') setProjects([...projects, data[0]]);
              } else {
                  const { error } = await supabase.from(table).update(payload).eq('id', id);
                  if (error) throw error;
                  // Refetch implies simpler logic, but let's optimistically update for now or reload
                  window.location.reload(); // Lazy refresh for prototype
              }
              addToast('Entry saved.', 'success');
          } catch (e) {
              console.error(e);
              addToast('Failed to save.', 'error');
          }
      } else {
          // Mock Save
          const newItem = { ...formData, id: id || Date.now().toString() };
          if (type === 'exp') {
              setExperiences(prev => isNew ? [...prev, newItem] : prev.map(i => i.id === id ? newItem : i));
          } else if (type === 'edu') {
              setEducation(prev => isNew ? [...prev, newItem] : prev.map(i => i.id === id ? newItem : i));
          } else {
              // handle tech string split
              if (typeof newItem.technologies === 'string') newItem.technologies = newItem.technologies.split(',');
              setProjects(prev => isNew ? [...prev, newItem] : prev.map(i => i.id === id ? newItem : i));
          }
          addToast('Saved (Demo Mode)', 'success');
      }
      setEditMode(null);
      setFormData({});
  };

  const handleDelete = async (type: 'exp' | 'edu' | 'proj', id: string) => {
      if (!confirm('Are you sure?')) return;
      
      if (isSupabaseConfigured()) {
          const table = type === 'exp' ? 'experience' : type === 'edu' ? 'education' : 'projects';
          await supabase.from(table).delete().eq('id', id);
      }
      
      if (type === 'exp') setExperiences(prev => prev.filter(i => i.id !== id));
      if (type === 'edu') setEducation(prev => prev.filter(i => i.id !== id));
      if (type === 'proj') setProjects(prev => prev.filter(i => i.id !== id));
      addToast('Deleted.', 'success');
  };

  const openEdit = (type: 'exp' | 'edu' | 'proj', item?: any) => {
      setEditMode({ type, id: item?.id });
      setFormData(item || {});
  };

  const handleDownload = () => {
      if (user) {
          generateCV(user, experiences, education, projects);
          addToast('CV Generated!', 'success');
      }
  };

  // --- Render Forms ---
  const renderForm = () => {
      if (!editMode) return null;
      
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-full max-w-lg shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {editMode.id ? 'Edit' : 'Add'} {editMode.type === 'exp' ? 'Experience' : editMode.type === 'edu' ? 'Education' : 'Project'}
                      </h3>
                      <button onClick={() => setEditMode(null)}><X className="w-5 h-5 text-slate-500" /></button>
                  </div>
                  
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      {editMode.type === 'exp' && (
                          <>
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Company / Organization" value={formData.company || ''} onChange={e => setFormData({...formData, company: e.target.value})} />
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Role / Title" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} />
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} />
                              <div className="flex gap-2">
                                  <input type="date" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                  <input type="date" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} disabled={formData.isCurrent} />
                              </div>
                              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <input type="checkbox" checked={formData.isCurrent || false} onChange={e => setFormData({...formData, isCurrent: e.target.checked})} /> I currently work here
                              </label>
                              <div className="relative">
                                <textarea className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 h-24" placeholder="Description..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                                <div className="absolute bottom-2 right-2">
                                    <AITextEnhancer context="experience" value={formData.description || ''} onEnhance={(val) => setFormData({...formData, description: val})} />
                                </div>
                              </div>
                          </>
                      )}
                      {editMode.type === 'edu' && (
                          <>
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Institution" value={formData.institution || ''} onChange={e => setFormData({...formData, institution: e.target.value})} />
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Degree (e.g. PhD)" value={formData.degree || ''} onChange={e => setFormData({...formData, degree: e.target.value})} />
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Field of Study" value={formData.fieldOfStudy || ''} onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})} />
                              <div className="flex gap-2">
                                  <input type="date" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                  <input type="date" className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                              </div>
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Grade / GPA (Optional)" value={formData.grade || ''} onChange={e => setFormData({...formData, grade: e.target.value})} />
                          </>
                      )}
                      {editMode.type === 'proj' && (
                          <>
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Project Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Link (URL)" value={formData.link || ''} onChange={e => setFormData({...formData, link: e.target.value})} />
                              <input className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700" placeholder="Technologies (comma separated)" value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies || ''} onChange={e => setFormData({...formData, technologies: e.target.value})} />
                              <div className="relative">
                                <textarea className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700 h-24" placeholder="Description..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                                <div className="absolute bottom-2 right-2">
                                    <AITextEnhancer context="project" value={formData.description || ''} onEnhance={(val) => setFormData({...formData, description: val})} />
                                </div>
                              </div>
                          </>
                      )}
                  </div>

                  <div className="flex justify-end mt-6 gap-3">
                      <button onClick={() => setEditMode(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                      <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Save</button>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {renderForm()}
      
      <div className="flex justify-between items-center">
          <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Curriculum Vitae</h2>
              <p className="text-slate-500 text-sm">Manage your academic history and export as PDF.</p>
          </div>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-colors"
          >
              <Download className="w-4 h-4" /> Download PDF
          </button>
      </div>

      {/* Experience */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" /> Experience
              </h3>
              <button onClick={() => openEdit('exp')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-indigo-600"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
              {experiences.map(exp => (
                  <div key={exp.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-indigo-100 transition-colors relative group">
                      <div className="flex justify-between">
                          <div>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">{exp.role}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{exp.company} • {exp.location}</p>
                              <p className="text-xs text-slate-400 mt-1">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit('exp', exp)} className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('exp', exp.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                      </div>
                      {exp.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{exp.description}</p>}
                  </div>
              ))}
              {experiences.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No experience added yet.</p>}
          </div>
      </div>

      {/* Education */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" /> Education
              </h3>
              <button onClick={() => openEdit('edu')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-indigo-600"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
              {education.map(edu => (
                  <div key={edu.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-indigo-100 transition-colors relative group">
                      <div className="flex justify-between">
                          <div>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">{edu.institution}</h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{edu.degree} in {edu.fieldOfStudy}</p>
                              <p className="text-xs text-slate-400 mt-1">{edu.startDate} - {edu.endDate || 'Present'}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit('edu', edu)} className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('edu', edu.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                      </div>
                  </div>
              ))}
              {education.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No education added yet.</p>}
          </div>
      </div>

      {/* Projects */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-600" /> Projects
              </h3>
              <button onClick={() => openEdit('proj')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-indigo-600"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
              {projects.map(proj => (
                  <div key={proj.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-indigo-100 transition-colors relative group">
                      <div className="flex justify-between">
                          <div>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100">{proj.title}</h4>
                              <div className="flex gap-2 mt-1 flex-wrap">
                                  {proj.technologies?.map((t, i) => <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">{t}</span>)}
                              </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit('proj', proj)} className="text-slate-400 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('proj', proj.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                      </div>
                      {proj.description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{proj.description}</p>}
                  </div>
              ))}
              {projects.length === 0 && <p className="text-sm text-slate-400 italic text-center py-4">No projects added yet.</p>}
          </div>
      </div>

    </div>
  );
};
