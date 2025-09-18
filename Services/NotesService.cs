using ImMemmo.Models;

namespace ImMemmo.Services
{
    public class NotesService
    {
        private static List<Note> _notes = new List<Note>
        {
            new Note 
            { 
                Id = 1, 
                Title = "Welcome to ImMemmo", 
                Content = "Your digital note-taking companion. Create, organize, and manage your thoughts effortlessly.",
                Color = "#7A8B7A",
                IsPinned = true,
                CreatedAt = DateTime.Now.AddDays(-1)
            },
            new Note 
            { 
                Id = 2, 
                Title = "Meeting Notes", 
                Content = "Discuss project timeline, review requirements, and assign tasks to team members.",
                Color = "#D4B5B5",
                CreatedAt = DateTime.Now.AddHours(-3)
            },
            new Note 
            { 
                Id = 3, 
                Title = "Shopping List", 
                Content = "Milk, Bread, Eggs, Fruits, Vegetables, Chicken, Rice",
                Color = "#E8D5C4",
                CreatedAt = DateTime.Now.AddMinutes(-30)
            }
        };
        private static int _nextId = 4;

        public List<Note> GetAllNotes()
        {
            return _notes.Where(n => !n.IsDeleted)
                         .OrderByDescending(n => n.IsPinned)
                         .ThenByDescending(n => n.UpdatedAt)
                         .ToList();
        }

        public List<Note> GetDeletedNotes()
        {
            return _notes.Where(n => n.IsDeleted)
                         .OrderByDescending(n => n.DeletedAt)
                         .ToList();
        }

        public Note? GetNoteById(int id)
        {
            return _notes.FirstOrDefault(n => n.Id == id);
        }

        public void AddNote(Note note)
        {
            note.Id = _nextId++;
            note.CreatedAt = DateTime.Now;
            note.UpdatedAt = DateTime.Now;
            _notes.Add(note);
        }

        public void UpdateNote(Note note)
        {
            var existingNote = GetNoteById(note.Id);
            if (existingNote != null && !existingNote.IsDeleted)
            {
                existingNote.Title = note.Title;
                existingNote.Content = note.Content;
                existingNote.Color = note.Color;
                existingNote.IsPinned = note.IsPinned;
                existingNote.UpdatedAt = DateTime.Now;
            }
        }

        public void DeleteNote(int id)
        {
            var note = GetNoteById(id);
            if (note != null && !note.IsDeleted)
            {
                note.IsDeleted = true;
                note.DeletedAt = DateTime.Now;
                note.IsPinned = false; // Unpin deleted notes
            }
        }

        public void RestoreNote(int id)
        {
            var note = GetNoteById(id);
            if (note != null && note.IsDeleted)
            {
                note.IsDeleted = false;
                note.DeletedAt = null;
                note.UpdatedAt = DateTime.Now;
            }
        }

        public void PermanentlyDeleteNote(int id)
        {
            var note = GetNoteById(id);
            if (note != null)
            {
                _notes.Remove(note);
            }
        }

        public void EmptyTrash()
        {
            _notes.RemoveAll(n => n.IsDeleted);
        }

        public void TogglePin(int id)
        {
            var note = GetNoteById(id);
            if (note != null && !note.IsDeleted)
            {
                note.IsPinned = !note.IsPinned;
                note.UpdatedAt = DateTime.Now;
            }
        }

        public int GetTrashCount()
        {
            return _notes.Count(n => n.IsDeleted);
        }
    }
}