import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus, Edit, Trash2, Save, MessageSquare } from 'lucide-react';
import { evaluationNotesService, EvaluationNote, CreateNoteDto } from '@/lib/services/evaluationNotesService';

interface EvaluationNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId: string;
  applicantName: string;
  jobId: string;
}

const EvaluationNotesModal: React.FC<EvaluationNotesModalProps> = ({
  isOpen,
  onClose,
  applicantId,
  applicantName,
  jobId
}) => {
  const [notes, setNotes] = useState<EvaluationNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<EvaluationNote | null>(null);
  const [newNote, setNewNote] = useState({
    note: '',
    noteType: 'general' as 'evaluation' | 'interview' | 'general'
  });

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedNotes = await evaluationNotesService.getNotes(applicantId, jobId);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [applicantId, jobId]);

  useEffect(() => {
    if (isOpen && applicantId && jobId) {
      fetchNotes();
    }
  }, [isOpen, applicantId, jobId, fetchNotes]);

  const handleAddNote = async () => {
    if (!newNote.note.trim()) return;

    try {
      setSaving(true);
      const noteData: CreateNoteDto = {
        applicantId,
        jobId,
        note: newNote.note,
        noteType: newNote.noteType
      };

      const createdNote = await evaluationNotesService.createNote(noteData);
      setNotes(prev => [createdNote, ...prev]);
      setNewNote({ note: '', noteType: 'general' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add note:', err);
      setError('Failed to add note');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !editingNote.note.trim()) return;

    try {
      setSaving(true);
      const updatedNote = await evaluationNotesService.updateNote(
        applicantId,
        editingNote.id,
        { note: editingNote.note, noteType: editingNote.noteType }
      );

      setNotes(prev => prev.map(note =>
        note.id === editingNote.id ? updatedNote : note
      ));
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to update note:', err);
      setError('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await evaluationNotesService.deleteNote(applicantId, noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note');
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'evaluation': return 'bg-blue-100 text-blue-700';
      case 'interview': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90dvh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Evaluation Notes - {applicantName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Add and manage evaluation notes for this candidate
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
              <button
                onClick={() => setError(null)}
                className="float-right ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Add Note Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>

          {/* Add Note Form */}
          {showAddForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Add New Note</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note Type
                  </label>
                  <select
                    value={newNote.noteType}
                    onChange={(e) => setNewNote(prev => ({
                      ...prev,
                      noteType: e.target.value as 'evaluation' | 'interview' | 'general'
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="evaluation">Evaluation</option>
                    <option value="interview">Interview</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    value={newNote.note}
                    onChange={(e) => setNewNote(prev => ({ ...prev, note: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Enter your evaluation notes..."
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddNote}
                    disabled={saving || !newNote.note.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Note'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewNote({ note: '', noteType: 'general' });
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading notes...</div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <div className="text-gray-500">No notes yet</div>
              <div className="text-sm text-gray-400 mt-1">Add your first evaluation note above</div>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                  {editingNote?.id === note.id ? (
                    // Edit Form
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Note Type
                        </label>
                        <select
                          value={editingNote.noteType}
                          onChange={(e) => setEditingNote(prev => prev ? {
                            ...prev,
                            noteType: e.target.value as 'evaluation' | 'interview' | 'general'
                          } : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        >
                          <option value="general">General</option>
                          <option value="evaluation">Evaluation</option>
                          <option value="interview">Interview</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Note
                        </label>
                        <textarea
                          value={editingNote.note}
                          onChange={(e) => setEditingNote(prev => prev ? {
                            ...prev,
                            note: e.target.value
                          } : null)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateNote}
                          disabled={saving}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-4 h-4" />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => setEditingNote(null)}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Note
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getNoteTypeColor(note.noteType)}`}>
                            {note.noteType}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(note.createdAt)}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingNote(note)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit note"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {note.note}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationNotesModal;